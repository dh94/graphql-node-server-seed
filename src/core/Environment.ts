import { Configuration } from 'config';
import config from '../config';

export class Environment {

	public static getName(): string {
		return process.env.NODE_ENV || 'development';
	}

	public static isTest(): boolean {
		return this.getName() === 'test';
	}

	public static isDevelopment(): boolean {
		return this.getName() === 'development';
	}

	public static isProduction(): boolean {
		return this.getName() === 'production';
	}

	public static getConfig(): Configuration {
		return config[this.getName()];
	}
}
