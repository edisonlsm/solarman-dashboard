import { getEnv } from "../utils/env";
import { fetchInverterData, fetchStationLiveData } from "./solarman/live_data";
import { fetchStationInfo } from "./solarman/station_info";
import { InverterData, StationData, StationInfo } from "./solarman/types";
import { getCurrentSunPosition } from "./suncalc";

export default defineEventHandler(async (event) => {
  const env = getEnv();

  var stationInfo: StationInfo | undefined;
  var stationData: StationData | undefined;
  var inverters: InverterData[] = [];

  const inverterPromises = env.INVERTERS.map((sn) => {
    return createPromise(async (resolve) => {
      const data = await fetchInverterData({ deviceSn: sn });
      console.log('resolved inverter ' + sn);
      inverters.push(data);
      resolve(data);
    });
  });

  await Promise.allSettled([
    createPromise(async (resolve) => {
      stationInfo = await fetchStationInfo();
      console.log('resolved stationInfo');
      resolve(stationInfo);
    }),
    createPromise(async (resolve) => {
      stationData = await fetchStationLiveData();
      console.log('resolved stationData');
      resolve(stationData);
    }),
    ...inverterPromises,
  ]);

  if (!stationInfo || !stationData || inverters.length == 0) {
    throw 'Error loading data';
  }

  const sunPosition = getCurrentSunPosition(stationInfo.locationLat, stationInfo.locationLng);

  return ({
    sun: sunPosition,
    plant: {
      installedCapacity: stationInfo.installedCapacity,
      generationPower: stationData.generationPower,
      lastUpdateDate: new Date(stationData.lastUpdateTime * 1000),
      startOperatingTime: stationInfo.startOperatingTime,
      operating: stationInfo.operating,
      totalRunningDayCount: stationInfo.totalRunningDayCount,
      generationTotal: stationData.generationTotal,
    },
    inverters,
  })
});

function createPromise(block: (resolve: (value: unknown | PromiseLike<unknown>) => void) => void) {
  return new Promise(async (resolve, reject) => {
    try {
      block(resolve);
    }
    catch (error) {
      reject(error);
    }
  });
}