const form = document.getElementById('form')
const result = document.getElementById('result')
const errorMsg = document.getElementById('errorMsg')
const spinner = document.getElementById('spinner')

const setResult = (data) => {
  spinner.classList.add('d-none')
  result.classList.remove('d-none')

  document.getElementById('title').textContent = data.title
  document.getElementById(
    'appId'
  ).innerHTML = `<a href="https://store.steampowered.com/app/${data.id}" target="blank">${data.id}</a>`
  document.getElementById('steamKz').textContent = data.steamPriceKZT
  document.getElementById(
    'steamRu'
  ).textContent = `${data.steamPriceRUB} — ${data.steamPriceRUBMax}`

  let platiContent = `<a href="${data.platiMinPriceItemURL}" target="blank">${data.platiMinPrice}</a>`

  if (data.platiAvgPrice) {
    platiContent += ` &bull; ${data.platiAvgPrice}`
  }

  if (data.platiMaxPrice) {
    platiContent += ` &bull; ${data.platiMaxPrice} `
  }

  document.getElementById('plati').innerHTML = platiContent
}
const setError = (data) => {
  spinner.classList.add('d-none')
  errorMsg.textContent = data
}
const unsetAll = () => {
  errorMsg.textContent = ''
  result.classList.add('d-none')
}

form.addEventListener('submit', (event) => {
  event.preventDefault()
  unsetAll()

  const game = document.getElementById('game').value

  if (game) {
    spinner.classList.remove('d-none')
    fetch('/price?game=' + game, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.ok) {
          console.error(data.error)
          setError(data.error)
        } else {
          setResult(data)
        }
      })
      .catch((error) => {
        console.error(error)
        setError(data.error)
      })
  }
})
