const form = document.getElementById('form')
const result = document.getElementById('result')
const errorMsg = document.getElementById('errorMsg')
const spinner = document.getElementById('spinner')

const setResult = (data) => {
  spinner.classList.add('d-none')
  result.classList.remove('d-none')

  document.getElementById('title').textContent = data.title
  document.getElementById('appId').textContent = data.id
  document.getElementById('steamKz').textContent = data.steamPriceKZT
  document.getElementById(
    'steamRu'
  ).textContent = `${data.steamPriceRUB} — ${data.steamPriceRUBMax}`
  document.getElementById('plati').textContent = data.platiAvgPrice
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
