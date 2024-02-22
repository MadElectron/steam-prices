import express from 'express'
import { getPrice } from './app/functions.js'

const app = express()
const port = 3000

app.get('/', (req, res) => res.send("I'm up!"))

app.get('/price', async (req, res) => {
  const game = req.query.game
  try {
    const price = await getPrice(game)

    if (!price.ok) {
      return res.status(400).send({ error: price.error })
    }

    return res.status(200).json(price)
  } catch (error) {
    return res.status(500).send(error)
  }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
