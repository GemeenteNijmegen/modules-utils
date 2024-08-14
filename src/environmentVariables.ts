/**
 * Check if all required environment variables are set
 *
 * Optionally, some values can be provided a default value. Usage:
 * If you need 'process.env.SOME_CONFIG_PARAM` to be set:
 *
 * ```const env = enviromnentVariables['SOME_CONFIG_PARAM']```
 *
 * Then use `env.SOME_CONFIG_PARAM`. Will throw if process.env.SOME_CONFIG_PARAM
 * is not set. If you want to set a default value, use as follows:
 *
 * ```const env = enviromnentVariables['SOME_CONFIG_PARAM, SOME_OPTIONAL_PARAM', { 'SOME_OPTIONAL_VALUE': 'someDefault' }]```
 *
 * @param keys the environment keys that need to be set
 * @param defaults default values can be provided for optional keys
 * @returns
 */
export function environmentVariables<T extends readonly string[]>(
  keys: T,
  defaults: Partial<Record<T[number], string>> = {}): {
    [K in T[number]]: string;
  } {
  const env = {} as {
    [K in T[number]]: string;
  };

  keys.forEach((key) => {
    // Type assertion to ensure TypeScript understands key is a valid key for defaults
    const typedKey = key as T[number];
    const value = process.env[typedKey] ?? defaults[typedKey] ?? '';

    if (!value) {
      throw new Error(`Environment variable ${typedKey} is missing`);
    }

    env[typedKey] = value;
  });

  return env;
}
