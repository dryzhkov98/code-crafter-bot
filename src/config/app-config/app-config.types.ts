export type ConfigType<T> = { new (): T };
export type ConfigFunctions<T> = {
  [K in keyof T]: () => T[K];
};

export interface IAppConfigSchema {
  PORT: number;

  URL: string;
}

export interface IAppConfigOption<T> {
  appConfig: ConfigType<T>;

  envPath?: string;
}
