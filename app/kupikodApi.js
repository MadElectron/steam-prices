import axios from 'axios'

const kupikodApi = 'https://steam.kupikod.com/backend/api/orders/calculate'

/**
 * Retrieves the Kupikod rate for a given quantity.
 *
 * @param {number} quantity - The quantity for which to retrieve the rate
 * @return {number} The rounded up Kupikod rate
 */
export const getKupikodRate = async (quantity) => {
  const result = await axios.get(kupikodApi, {
    params: {
      product_id: 4,
      quantity
    }
  })

  if (!result?.data?.data?.amount) return null

  return Math.ceil(result.data.data.amount)
}
