import { IAppConfigSchema } from './app-config.types';
import { IsString } from 'class-validator';

export class AppConfigSchema implements IAppConfigSchema {
  @IsString()
  VERSION: string;

  @IsString()
  BOT_TOKEN: string;
}
