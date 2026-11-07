const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast?latitude=29.09&longitude=-110.96&current=temperature_2m,relative_humidity_2m,weather_code&timezone=America%2FHermosillo'

export async function getWeather(signal) {
  const response = await fetch(WEATHER_URL, { signal })
  if (!response.ok) throw new Error('No se pudo consultar el clima.')
  const data = await response.json()
  if (!data.current) throw new Error('El servicio de clima no devolvió datos actuales.')
  return data.current
}
