import {
  ConfigFunctions,
  ConfigType,
  IAppConfigOption,
  IAppConfigSchema,
} from './app-config.types';
import { APP_CONFIG } from './app-config.constants';

import { join } from 'path';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { Inject, Injectable } from '@nestjs/common';
import { readFileSync } from 'node:fs';

@Injectable()
export class AppConfigService<T extends IAppConfigSchema> {
  private configuration: T;
  private readonly envPath: string;

  constructor(@Inject(APP_CONFIG) { appConfig, envPath }: IAppConfigOption<T>) {
    this.envPath = envPath || join(process.cwd(), '.env');
    this.setupConfig(appConfig);
  }
  private setupConfig(appConfig: ConfigType<T>): void {
    const envs = this.getEnvsFromFile(this.envPath);
    this.configuration = this.validate(appConfig, envs);
  }

  private validate(config: ConfigType<T>, envs: Record<string, string>): T {
    const validatedConfig = plainToInstance(config, envs, {
      enableImplicitConversion: true,
    });

    const errors = validateSync(validatedConfig, {
      skipMissingProperties: false,
    });

    if (errors.length > 0) {
      const errorMessages = errors.map(error => {
        const constraints = Object.values(error.constraints || {}).join(', ');
        return `${error.property}: ${constraints}`;
      });
      throw new Error(`Validation failed: ${errorMessages.join('; ')}`);
    }

    return validatedConfig;
  }

  private getEnvsFromFile(path: string): Record<string, string> {
    const env: Record<string, string> = {};

    try {
      const envData = readFileSync(path, 'utf8').split('\n');
      for (const envLine of envData) {
        const [key, value] = envLine.split('=').map(str => str.trim());

        if (key && value) env[key] = value;
      }

      return env;
    } catch (error) {
      throw new Error(`Failed to load .env file from path: ${path}`);
    }
  }

  public get(): ConfigFunctions<T> {
    // перехватываем обращение к свойствам функции и переопределяем getter
    return new Proxy({} as ConfigFunctions<T>, {
      get: (_, prop: string | symbol) => {
        if (typeof prop !== 'string') {
          return undefined;
        }

        const configKey = prop.toUpperCase();

        // если prop symbol или не существует в конфиге
        if (this.isInvalidProp(this.configuration, configKey)) {
          return undefined;
        }

        // создаем геттер для возвращения значения их конфига
        return this.createValueGetter(this.configuration, configKey as keyof T);
      },
    });
  }

  private isInvalidProp(target: T, prop: string | symbol): boolean {
    return (
      typeof prop === 'symbol' ||
      !Object.prototype.hasOwnProperty.call(target, prop)
    );
  }

  private createValueGetter(target: T, prop: keyof T) {
    return () => {
      const value = target[prop];
      if (typeof value === 'undefined') {
        throw new TypeError(
          `Configuration key ${String(
            prop
          )} is not defined or has an undefined value.`
        );
      }
      return value;
    };
  }
}
