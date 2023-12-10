import { Env, getEnv } from "~/server/utils/env";

export async function getAccessToken(): Promise<string> {
  const env = getEnv();

  const savedToken: AuthModel | null = await env.KV.get('auth', { type: 'json' });

  if (savedToken) {
    // If we have a saved token, check if it`s still valid
    const tomorrow = Date.now() + (24 * 60 * 60 * 1000)
    if (savedToken.expiresAt > tomorrow) {
      return savedToken.accessToken;
    }
  }

  const token = await authenticate();
  return token;
}

export async function authenticate(): Promise<string> {
  const env = getEnv();

  const authUri = new URL(`https://globalapi.solarmanpv.com/account/v1.0/token`);
  authUri.searchParams.append('appId', env.SOLARMAN_APP_ID)
  authUri.searchParams.append('language', 'en')

  const authResponse = await fetch(
    authUri.href,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "appSecret": env.SOLARMAN_APP_SECRET,
        "email": env.SOLARMAN_USER_EMAIL,
        "password": env.SOLARMAN_USER_PASSWORD,
        "countryCode": 55
      })
    }
  )

  const authJsonData: {
    access_token: string,
    expires_in: string,
  } = await authResponse.json()

  const expiresAt = Date.now() + (parseInt(authJsonData.expires_in) * 1000);

  await env.KV.put('auth', JSON.stringify({
    accessToken: authJsonData.access_token,
    expiresAt
  }))

  return authJsonData.access_token
}

type AuthModel = {
  accessToken: string,
  expiresAt: number,
}