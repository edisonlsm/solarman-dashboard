export type StationHistoricDataResponse<T> = {
  total: number,
  stationDataItems: T[]
}

export type StationDailyData = {
  generationValue: number,
  fullPowerHours: number,
  year: number,
  month: number,
  day: number,
}

export type StationInfo = {
  locationLat: number,
  locationLng: number,
  locationAddress: string,
  installedCapacity: number,
  startOperatingTime: number,
  operating: boolean,
  totalRunningDayCount: number
}

export type StationData = {
  generationPower: number,
  lastUpdateTime: number,
  generationTotal: number,
}

export type InverterData = {
  device: string,
  state: number,
  collectionTime: Date,
  currentPower: string,
  dailyProduction: string,
  totalProduction: string,
  modules: PVModuleData[]
}

export type PVModuleData = {
  voltage: string,
  currency: string,
  power: string,
  totalProduction: string,
  dailyProduction: string,
}

export type InverterDataListItem = {
  key: string,
  value: string,
  unit: string,
  name: string
}