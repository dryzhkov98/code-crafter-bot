import { OpenAI, ClientOptions } from 'openai';

export interface IAssistConfig {
  temperature: number;
  maxTokens: number;
  stopPhrases: string[];
}

export interface IOpenAIConfig extends ClientOptions {
  apiKey: string;
  model: OpenAI.ChatModel;
  assistConfig: IAssistConfig;
}
