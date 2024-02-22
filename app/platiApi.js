import axios from 'axios'

const searchApi = 'https://plati.io/api/search.ashx'

export const getPlatiResult = async (name) => {
  const searchUrl = new URL(searchApi)
  searchUrl.searchParams.set('query', name + ' steam')
  searchUrl.searchParams.set('visibleOnly', 1)
  searchUrl.searchParams.set('response', 'json')

  const result = await axios.get(searchUrl.toString())
  const total = result?.data?.Pagesize

  if (!total) return null

  const { items } = result.data
  const avgPrice = Math.ceil(
    items.reduce((acc, item) => acc + item.price_rur, 0) / total
  )

  return avgPrice
}
