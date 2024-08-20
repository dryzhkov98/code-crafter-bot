import {
  Inject,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { OpenAI } from 'openai';
import { OPENAI_CONFIG_TOKEN } from './openai.constants';
import { IOpenAIConfig } from './openai.types';

@Injectable()
export class OpenaiService implements OnModuleInit {
  private openAI: OpenAI;

  constructor(
    @Inject(OPENAI_CONFIG_TOKEN) private readonly config: IOpenAIConfig
  ) {}

  onModuleInit() {
    if (!this.config.apiKey) {
      throw new InternalServerErrorException('OpenAI API key is missing.');
    }

    this.openAI = new OpenAI(this.config);
  }
}
