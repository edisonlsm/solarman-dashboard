import { getEnv } from "~/server/utils/env";
import { StationInfo } from "./types";
import { getAccessToken } from "./auth";

async function fetchStationInfo(): Promise<StationInfo> {
  const env = getEnv();
  const accessToken = await getAccessToken();

  const stationInfoResponse = await fetch(
    `https://globalapi.solarmanpv.com/station/v1.0/base?language=en`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "stationId": env.PLANT_ID
      })
    }
  )

  const stationInfo = await stationInfoResponse.json() as StationInfo;
  return stationInfo;
}

export { fetchStationInfo }