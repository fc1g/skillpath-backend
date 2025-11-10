import { HttpException, Injectable, Logger } from '@nestjs/common';
import { HttpService as AxiosHttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

@Injectable()
export class HttpService {
	private readonly logger: Logger = new Logger(HttpService.name);

	constructor(private readonly http: AxiosHttpService) {}

	async get<T>(url: string, config?: AxiosRequestConfig) {
		return this.request<T>({ method: 'GET', url, ...config });
	}

	async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
		return this.request<T>({ method: 'POST', url, data, ...config });
	}

	async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
		return this.request<T>({ method: 'PUT', url, data, ...config });
	}

	async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
		return this.request<T>({ method: 'PATCH', url, data, ...config });
	}

	async delete<T>(url: string, config?: AxiosRequestConfig) {
		return this.request<T>({ method: 'DELETE', url, ...config });
	}

	private async request<T>(config: AxiosRequestConfig): Promise<T> {
		try {
			const { data } = await firstValueFrom(this.http.request<T>(config));

			return data;
		} catch (error) {
			const err = error as AxiosError;
			const status = err.response?.status ?? 500;
			const upstream = err.response?.data as { response: AxiosResponse };
			let payload: object;

			if (upstream && typeof upstream === 'object') {
				payload = upstream.response ? upstream.response : upstream;
			} else {
				payload = { statusCode: status, message: err.message };
			}

			this.logger.error({
				url: config.url,
				method: config.method,
				status,
				payload,
				message: err.message,
			});

			throw new HttpException(payload, status);
		}
	}
}
