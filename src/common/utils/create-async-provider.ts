import {
  FactoryProvider,
  InjectionToken,
  OptionalFactoryDependency,
} from '@nestjs/common';

export const createAsyncProvider = <T>(
  provideToken: symbol,
  useFactory: (...args: unknown[]) => Promise<T> | T,
  inject?: Array<InjectionToken | OptionalFactoryDependency>
): FactoryProvider<T> => {
  return {
    provide: provideToken,
    useFactory,
    inject: inject || [],
  };
};
