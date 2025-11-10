import { Controller, Get } from '@nestjs/common';
import {
	HealthCheck,
	HealthCheckService,
	HttpHealthIndicator,
	TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
	constructor(
		private readonly health: HealthCheckService,
		private readonly http: HttpHealthIndicator,
		private readonly db: TypeOrmHealthIndicator,
	) {}

	@HealthCheck()
	@Get('live')
	liveness() {
		return this.health.check([]);
	}

	@HealthCheck()
	@Get('ready')
	readiness() {
		return this.health.check([() => this.db.pingCheck('database')]);
	}
}
