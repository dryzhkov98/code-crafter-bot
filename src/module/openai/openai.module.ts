import {
  Module,
  DynamicModule,
  InjectionToken,
  OptionalFactoryDependency,
} from '@nestjs/common';
import { OPENAI_CONFIG_TOKEN } from './openai.constants';
import { IOpenAIConfig } from './openai.types';
import {
  createAsyncProvider,
  createOpenAIConfigProvider,
} from '../../common/utils';
import { OpenaiService } from './openai.service';

@Module({})
export class OpenAIModule {
  static forRoot(config: IOpenAIConfig): DynamicModule {
    const openAIConfigProvider = createOpenAIConfigProvider(
      OPENAI_CONFIG_TOKEN,
      config
    );

    return {
      module: OpenAIModule,
      providers: [OpenaiService, openAIConfigProvider],
      exports: [OpenaiService, openAIConfigProvider],
    };
  }

  static forRootAsync(
    useFactory: (...args: unknown[]) => Promise<IOpenAIConfig> | IOpenAIConfig,
    inject?: Array<InjectionToken | OptionalFactoryDependency>
  ): DynamicModule {
    const asyncOpenAIConfigProvider = createAsyncProvider(
      OPENAI_CONFIG_TOKEN,
      useFactory,
      inject
    );

    return {
      module: OpenAIModule,
      providers: [OpenaiService, asyncOpenAIConfigProvider],
      exports: [OpenaiService, asyncOpenAIConfigProvider],
    };
  }
}
