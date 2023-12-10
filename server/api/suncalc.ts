import * as SunCalc from 'suncalc';

function getCurrentSunPosition(lat: number, lng: number): SunCalc.GetSunPositionResult {
  // pos.altitude: radians: from 0 (horizon) to PI / 2 (exactly above the head)
  // pos.azimuth: radians: from 0 (south) to PI / 2 (north). West positive, east negative
  const pos = SunCalc.getPosition(new Date(), lat, lng);

  // altitude: degrees
  // azimuth: 360 degrees, 0 on north, 90 on east
  const normalizedPosition: SunCalc.GetSunPositionResult = {
    altitude: (pos.altitude * 180 / Math.PI),
    azimuth: (pos.azimuth * 180 / Math.PI + 180) % 360
  }

  // Round the numbers for safety reasons
  const roundedPosition: SunCalc.GetSunPositionResult = {
    altitude: Math.round(normalizedPosition.altitude),
    azimuth: Math.round(normalizedPosition.azimuth),
  };

  return roundedPosition;
}

export { getCurrentSunPosition }