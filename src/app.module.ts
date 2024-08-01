import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app-config/app-config.module';
import { AppConfigSchema } from './config/app-config/app-config.schema';

@Module({
  imports: [AppConfigModule.forRoot({ appConfig: AppConfigSchema })],
  controllers: [],
  providers: [],
})
export class AppModule {}
