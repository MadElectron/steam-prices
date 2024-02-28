import SteamApi from 'steamapi'
import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()

// initialize steamapi
const steam = new SteamApi(process.env.STEAM_API_KEY)
const searchApi = 'https://steamcommunity.com/actions/SearchApps'
const currencyApi = 'https://api.steam-currency.ru/currency'

/**
 * Asynchronously searches for a game by name.
 *
 * @param {string} name - The name of the game to search for
 * @return {Promise<object|null>} The game object if found, or null if not found
 */
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

/**
 * Retrieves the price overview for a Steam game.
 *
 * @param {string} id - The ID of the Steam game
 * @param {string} [currency='kz'] - The currency for the price overview
 * @return {object | null} The price overview details, or null if not available
 */
export const getSteamGamePriceOverview = async (id, currency = 'kz') => {
  const details = await steam.getGameDetails(id, { currency })

  return details?.price_overview || null
}

/**
 * Asynchronously retrieves the exchange rate from one currency to another.
 *
 * @param {string} from - the currency to convert from (default: 'usd')
 * @param {string} to - the currency to convert to (default: 'kzt')
 * @return {number | null} the exchange rate from the source currency to the target currency
 */
export const getSteamExchangeRateKZT = async (from = 'usd', to = 'kzt') => {
  const key = [from, to].join(':').toUpperCase()
  const result = await axios.get(currencyApi)
  const currency = result?.data?.data?.find(
    (currency) => currency.currency_pair === key
  )

  return currency?.close_price || null
}
