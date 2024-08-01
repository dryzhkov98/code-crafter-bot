import { DynamicModule, Global, Module } from '@nestjs/common';
import { IAppConfigOption } from './app-config.types';
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
}
