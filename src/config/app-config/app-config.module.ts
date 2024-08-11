import { DynamicModule, Global, Module } from '@nestjs/common';
import { IAppConfigOption, IAppConfigSchema } from './app-config.types';
import { APP_CONFIG } from './app-config.constants';
import { AppConfigService } from './app-config.service';

@Global()
@Module({})
export class AppConfigModule {
  static forRoot<T>(options: IAppConfigOption<T>): DynamicModule {
    return {
      module: AppConfigModule,
      providers: [
        {
          provide: APP_CONFIG,
          useValue: options,
        },
        AppConfigService,
      ],
      exports: [AppConfigService],
    };
  }

  static forRootAsync<T extends IAppConfigSchema>(
    options: IAppConfigOption<T>
  ): DynamicModule {
    const appConfigProvider = {
      provide: APP_CONFIG,
      useValue: options,
    };

    const appConfigServiceProvider = {
      provide: AppConfigService,
      useFactory: async () => {
        const service = new AppConfigService<T>(options);
        await service.initAsync(options.appConfig);
        return service;
      },
    };

    return {
      module: AppConfigModule,
      providers: [appConfigProvider, appConfigServiceProvider],
      exports: [AppConfigService],
    };
  }
}
