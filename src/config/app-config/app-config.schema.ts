import { IAppConfigSchema } from './app-config.types';
import { IsNumber, IsString } from 'class-validator';

export class AppConfigSchema implements IAppConfigSchema {
  @IsNumber()
  PORT: number;

  @IsString()
  URL: string;

  @IsString()
  VERSION: string;
}
