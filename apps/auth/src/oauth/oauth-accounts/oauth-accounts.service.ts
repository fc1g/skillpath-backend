import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { OAuthAccountsRepository } from './oauth-accounts.repository';
import {
	CreateOAuthAccountDto,
	DEFAULT_TAKE,
	OAuthAccount,
	OAuthUser,
	POSTGRES_UNIQUE_VIOLATION,
	UpdateOAuthAccountDto,
	User,
} from '@app/common';
import { plainToClass } from 'class-transformer';

@Injectable()
export class OAuthAccountsService {
	private readonly logger: Logger = new Logger(OAuthAccountsService.name);

	constructor(
		private readonly oauthAccountsRepository: OAuthAccountsRepository,
	) {}

	async create(
		createOAuthAccountDto: CreateOAuthAccountDto,
	): Promise<OAuthAccount> {
		const oauthAccount = plainToClass(OAuthAccount, {
			...createOAuthAccountDto,
		});
		try {
			return await this.oauthAccountsRepository.create(oauthAccount);
		} catch (err) {
			this.logger.warn('Failed to create OAuthAccount', err);
			if ((err as { code: string }).code === POSTGRES_UNIQUE_VIOLATION) {
				throw new ConflictException(
					'OAuth account with this provider and provider id already exists',
				);
			}

			throw new InternalServerErrorException(
				'Unable to create OAuthAccount, please try again later',
			);
		}
	}

	async find(): Promise<OAuthAccount[]> {
		return this.oauthAccountsRepository.find(
			{},
			{
				take: DEFAULT_TAKE,
			},
		);
	}

	async findOne(id: string): Promise<OAuthAccount> {
		return this.oauthAccountsRepository.findOne({ id });
	}

	async update(
		id: string,
		updateOAuthAccountDto: UpdateOAuthAccountDto,
	): Promise<OAuthAccount> {
		return this.oauthAccountsRepository.update({ id }, updateOAuthAccountDto);
	}

	async remove(id: string): Promise<OAuthAccount> {
		return this.oauthAccountsRepository.remove({ id });
	}

	async preloadOAuthAccountByProvider(
		user: User,
		oauthUser: OAuthUser,
	): Promise<OAuthAccount> {
		try {
			const existingOAuthAccount = await this.oauthAccountsRepository.findOne({
				provider: oauthUser.provider,
				providerId: oauthUser.providerId,
			});
			if (existingOAuthAccount) {
				return existingOAuthAccount;
			}
		} catch (err) {
			if (err instanceof Error) {
				this.logger.warn(err.message);
			}
		}

		return this.create(
			plainToClass(OAuthAccount, {
				provider: oauthUser.provider,
				providerId: oauthUser.providerId,
				username: oauthUser.username,
				email: oauthUser.email,
				user,
			}),
		);
	}
}
