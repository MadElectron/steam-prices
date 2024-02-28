import { getExchengeRateRub } from './cbrApi.js'
import {
  searchGame,
  getSteamExchangeRateKZT,
  getSteamGamePriceOverview
} from './steamApi.js'
import {
  STEAM_COMMISSION_PERCENT,
  TRANSLATIONS,
  VOLATILITY_PERCENT
} from './variables.js'
import { getPlatiResult } from './platiApi.js'

/**
 * Asynchronously fetches the price and related information for a game.
 *
 * @param {string} name - The name of the game to search for.
 * @param {string} [lang='ru'] - The language code for the translations (default: 'ru').
 * @return {Object} An object containing the information about the game price and related details.
 */
export const getPrice = async (name, lang = 'ru') => {
  const game = await searchGame(name)

  if (!game) return { ok: false, error: TRANSLATIONS.gameNotFound[lang] }

  const title = game.name
  const steamPriceOverview = await getSteamGamePriceOverview(game.appid)

  if (!steamPriceOverview)
    return { ok: false, error: TRANSLATIONS.noPriceOverview[lang] }

  const steamPriceKZT = steamPriceOverview.final / 100
  const steamPriceKZTCommissioned =
    steamPriceKZT * (1 + STEAM_COMMISSION_PERCENT / 100)
  const rubRate = await getExchengeRateRub()

  if (!rubRate) return { ok: false, error: TRANSLATIONS.noCBRRate[lang] }

  const steamKZTRate = await getSteamExchangeRateKZT()

  if (!steamKZTRate) return { ok: false, error: TRANSLATIONS.noSteamRate[lang] }

  const steamPriceUSD = steamPriceKZTCommissioned / steamKZTRate
  const steamPriceRUB = Math.ceil(steamPriceUSD * rubRate)
  const steamPriceRUBMax = Math.ceil(
    steamPriceRUB * (1 + VOLATILITY_PERCENT / 100)
  )

  const platiAvgPrice = await getPlatiResult(title)

  return {
    ok: true,
    title,
    id: game.appid,
    steamPriceKZT,
    steamPriceRUB,
    steamPriceRUBMax,
    platiAvgPrice
  }
}
