import SteamApi from 'steamapi'
import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()

// initialize steamapi
const steam = new SteamApi(process.env.STEAM_API_KEY)
const searchApi = 'https://steamcommunity.com/actions/SearchApps'
const currencyApi = 'https://api.steam-currency.ru/currency'

export const searchGame = async (name) => {
  try {
    const encodedName = new URLSearchParams({ name })
      .toString()
      .split('=')
      .pop()
    const result = await axios.get(`${searchApi}/${encodedName}`)

    if (!result?.data || !result.data.length) return null

    if (result.data.length === 1) return result.data[0]

    const game =
      result.data.find(
        (game) => game.name.toLowerCase() === name.toLowerCase()
      ) || null

    return game ?? result.data[0]
  } catch (error) {
    console.error(error)

    return null
  }
}

export const getSteamGamePriceOverview = async (id, currency = 'kz') => {
  const details = await steam.getGameDetails(id, { currency })

  return details?.price_overview || null
}

export const getSteamExchangeRateKZT = async (from = 'usd', to = 'kzt') => {
  const key = [from, to].join(':').toUpperCase()
  const result = await axios.get(currencyApi)
  const currency = result?.data?.data?.find(
    (currency) => currency.currency_pair === key
  )

  return currency?.close_price || null
}
