import { ref } from 'vue'

export  function fetchPrices() {
  try {
    let res = fetch(
      `https://api.v4v.app/v1/cryptoprices/?use_cache=false`
    )
    const prices = res.json()
    const pricesLoaded = true
    console.log(prices)
    return prices, pricesLoaded
  } catch (err) {
    console.error(err)
    return {}, false
  }
}
