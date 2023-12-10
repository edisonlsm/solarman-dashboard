import { fetchStationDailyHistoricDataByMonth } from "./solarman/history";

export default defineEventHandler(async (event) => {
  const data = await fetchStationDailyHistoricDataByMonth({ year: 2023, month: 11 });
  return data;
});