import { getAccessToken } from "./auth";
import { StationDailyData, StationHistoricDataResponse } from "./types";

async function fetchStationDailyHistoricDataByMonth(
  { year, month }: { year: number, month: number }
): Promise<StationDailyData[]> {
  const env = getEnv();

  const firstDayMonth = new Date(year, month - 1, 1);
  // In order to get the last day of the current month
  var lastDayMonth = new Date(year, month - 1, 1);
  // We add one month to this date
  lastDayMonth.setMonth(lastDayMonth.getMonth() + 1);
  // And subtract one day
  lastDayMonth.setDate(lastDayMonth.getDate() - 1);

  const accessToken = await getAccessToken();

  const startTime = firstDayMonth.toISOString().split('T')[0];
  const endTime = lastDayMonth.toISOString().split('T')[0];

  console.log(startTime);
  console.log(endTime);

  const stationHistoricData = await fetch(
    `https://globalapi.solarmanpv.com/station/v1.0/history?language=en`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "stationId": env.PLANT_ID,
        "startTime": startTime,
        "endTime": endTime,
        "timeType": 2
      })
    }
  )

  const stationData = await stationHistoricData.json() as StationHistoricDataResponse<StationDailyData>;

  const items = stationData.stationDataItems.map((i) => {
    return {
      year: i.year,
      month: i.month,
      day: i.day,
      fullPowerHours: i.fullPowerHours,
      generationValue: i.generationValue,
    } as StationDailyData
  });
  return items;
}

export { fetchStationDailyHistoricDataByMonth }