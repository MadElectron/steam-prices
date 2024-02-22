import axios from 'axios'

const source = 'https://www.cbr-xml-daily.ru/daily_json.js'

export const getExchengeRateRub = async (code = 'usd') => {
  const response = await axios.get(source)
  const value = response.data.Valute[code.toUpperCase()]?.Value

  return value || null
}
