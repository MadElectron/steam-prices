import axios from 'axios'

const searchApi = 'https://plati.io/api/search.ashx'

/**
 * Retrieves the Plati search result for the given name.
 *
 * @param {string} name - the name to search for
 * @return {object} an object containing average price, minimum price, maximum price, and URL of the item with the minimum price
 */
export const getPlatiResult = async (name) => {
  const searchUrl = new URL(searchApi)
  searchUrl.searchParams.set('query', name + ' steam')
  searchUrl.searchParams.set('visibleOnly', 1)
  searchUrl.searchParams.set('response', 'json')

  const result = await axios.get(searchUrl.toString())
  const total = result?.data?.Pagesize

  if (!total) return null

  const { items } = result.data

  if (items.length === 1)
    return { minPrice: items[0].price_rur, minPriceItemUrl: items[0].url }

  const minPrice = Math.min(...items.map((item) => item.price_rur))
  const maxPrice = Math.max(...items.map((item) => item.price_rur))
  const minPriceItemUrl = items.find((item) => item.price_rur === minPrice).url

  if (items.length === 2) return { minPrice, maxPrice, minPriceItemUrl }

  const avgPrice = Math.ceil(
    items.reduce((acc, item) => acc + item.price_rur, 0) / total
  )

  return { avgPrice, minPrice, maxPrice, minPriceItemUrl }
}
