import { Provider } from '@nestjs/common';

export const createOpenAIConfigProvider = <T>(
  provideToken: symbol,
  config: T
): Provider => {
  return {
    provide: provideToken,
    useValue: config,
  };
};
