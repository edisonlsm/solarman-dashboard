export type Env = {
  KV: KVNamespace;
  PLANT_ID: number;
  INVERTERS: string[];
  SOLARMAN_APP_ID: string;
  SOLARMAN_APP_SECRET: string;
  SOLARMAN_USER_EMAIL: string;
  SOLARMAN_USER_PASSWORD: string;
}

export function getEnv(): Env {
  // Extract the inverters value from the string array
  const invertersStr = process.env.INVERTERS as string;
  const regex = /\'(\d+)\'/g
  const matches = invertersStr.matchAll(regex);

  var inverters: string[] = [];
  for (const match of matches) {
    inverters.push(match[1]); // match[1] is the capture group
  }

  const bindings = {
    KV: process.env.KV as any as KVNamespace,
    PLANT_ID: process.env.PLANT_ID as unknown as number,
    INVERTERS: inverters,
    SOLARMAN_APP_ID: process.env.SOLARMAN_APP_ID as string,
    SOLARMAN_APP_SECRET: process.env.SOLARMAN_APP_SECRET as string,
    SOLARMAN_USER_EMAIL: process.env.SOLARMAN_USER_EMAIL as string,
    SOLARMAN_USER_PASSWORD: process.env.SOLARMAN_USER_PASSWORD as string,
  } as Env;

  return bindings;
}