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
  searchUrl.searchParams.set('pagesize', 500) // Max page size available
  searchUrl.searchParams.set('visibleOnly', 1)
  searchUrl.searchParams.set('response', 'json')

  const result = await axios.get(searchUrl.toString())
  const { items } = result.data
  const filteredItems = items?.filter((item) =>
    item.name_eng.toLowerCase().includes('key')
  )

  const total = filteredItems?.length

  if (!total) return null

  if (filteredItems.length === 1)
    return {
      avgPrice: null,
      maxPrice: null,
      minPrice: filteredItems[0].price_rur,
      minPriceItemURL: filteredItems[0].url
    }

  const minPrice = Math.min(...filteredItems.map((item) => item.price_rur))
  const maxPrice = Math.max(...filteredItems.map((item) => item.price_rur))
  const minPriceItemURL = filteredItems.find(
    (item) => item.price_rur === minPrice
  ).url

  if (filteredItems.length === 2)
    return {
      avgPrice: null,
      minPrice,
      maxPrice,
      minPriceItemURL
    }

  const avgPrice = Math.ceil(
    filteredItems.reduce((acc, item) => acc + item.price_rur, 0) / total
  )

  return {
    avgPrice,
    minPrice,
    maxPrice,
    minPriceItemURL,
    total
  }
}
