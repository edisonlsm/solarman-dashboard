import { Env, getEnv } from "~/server/utils/env";
import { getAccessToken } from "./auth";
import { InverterData, InverterDataListItem, PVModuleData, StationData } from "./types";

async function fetchStationLiveData(): Promise<StationData> {
  const env = getEnv();

  const accessToken = await getAccessToken();

  const stationRealTimeData = await fetch(
    `https://globalapi.solarmanpv.com/station/v1.0/realTime?language=en`,
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

  const stationData = await stationRealTimeData.json() as StationData;
  return stationData;
}

async function fetchInverterData({
  deviceSn
}: {
  deviceSn: string,
}): Promise<InverterData> {
  const env = getEnv();

  const accessToken = await getAccessToken();

  const inverterDataResponse = await fetch(
    `https://globalapi.solarmanpv.com/device/v1.0/currentData?language=en`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "deviceSn": deviceSn
      })
    }
  )

  const DATALIST_KEYS = [
    new RegExp('^DV[0-4]{1}$'),
    new RegExp('^DC[0-4]{1}$'),
    new RegExp('^DP[0-4]{1}$'),
    new RegExp('^Et_ge[0-4]{1}$'),
    new RegExp('^Etdy_ge[0-4]{1}$'),
    new RegExp('^APo_t1$'),
    new RegExp('^MICROINV_port[0-4]{1}$'),
  ]

  const inverterDataJson: {
    deviceSn: string,
    deviceId: number,
    collectionTime: number,
    deviceState: number, // 1 - Online | 2 - Alerting | 3 - Offline
    dataList: InverterDataListItem[]
  } = await inverterDataResponse.json()

  inverterDataJson.dataList = inverterDataJson.dataList.filter((i) => DATALIST_KEYS.some(k => {
    const includes = k.test(i.key)
    return includes;
  }));

  const inverterData: InverterData = {
    device: deviceSn.slice(-3),
    state: inverterDataJson.deviceState,
    collectionTime: new Date(inverterDataJson.collectionTime * 1000),
    currentPower: valueFromInverterDataList(inverterDataJson.dataList, 'APo_t', 1),
    dailyProduction: valueFromInverterDataList(inverterDataJson.dataList, 'Etdy_ge', 0),
    totalProduction: valueFromInverterDataList(inverterDataJson.dataList, 'Et_ge', 0),
    modules: Array.from(Array(4).keys()).map(i => {
      return {
        module: valueFromInverterDataList(inverterDataJson.dataList, 'MICROINV_port', i + 1).slice(-5),
        voltage: valueFromInverterDataList(inverterDataJson.dataList, 'DV', i + 1),
        currency: valueFromInverterDataList(inverterDataJson.dataList, 'DC', i + 1),
        power: valueFromInverterDataList(inverterDataJson.dataList, 'DP', i + 1),
        totalProduction: valueFromInverterDataList(inverterDataJson.dataList, 'Et_ge', i + 1),
        dailyProduction: valueFromInverterDataList(inverterDataJson.dataList, 'Etdy_ge', i + 1),
      } as PVModuleData;
    })
  }

  return inverterData;
}

function valueFromInverterDataList(dataList: InverterDataListItem[], key: String, index: number): string {
  const item = dataList.filter(li => li.key === `${key}${index}`)[0]
  return item.value;
}

export { fetchStationLiveData, fetchInverterData }