import { getExchengeRateRub } from './cbrApi.js'
import {
  searchGame,
  getSteamExchangeRateKZT,
  getSteamGamePriceOverview
} from './steamApi.js'
import { STEAM_COMMISSION_PERCENT, VOLATILITY_PERCENT } from './variables.js'

export const getPrice = async (name) => {
  const game = await searchGame(name)

  if (!game) return { ok: false, error: 'Game not found' }

  const title = game.name
  const steamPriceOverview = await getSteamGamePriceOverview(game.appid)

  if (!steamPriceOverview)
    return { ok: false, error: 'Game does not have price overview' }

  const steamPriceKZT = steamPriceOverview.final / 100
  const steamPriceKZTCommissioned =
    steamPriceKZT * (1 + STEAM_COMMISSION_PERCENT / 100)
  const rubRate = await getExchengeRateRub()

  if (!rubRate)
    return { ok: false, error: 'Cannot get Tsentrobank exchange rate' }

  const steamKZTRate = await getSteamExchangeRateKZT()

  if (!steamKZTRate)
    return { ok: false, error: 'Cannot get Steam exchange rate' }

  const steamPriceUSD = steamPriceKZTCommissioned / steamKZTRate
  const steamPriceRUB = Math.ceil(steamPriceUSD * rubRate)
  const steamPriceRUBMax = Math.ceil(
    steamPriceRUB * (1 + VOLATILITY_PERCENT / 100)
  )

  return {
    ok: true,
    title,
    id: game.appid,
    steamPriceKZT,
    steamPriceRUB,
    steamPriceRUBMax
  }
}
