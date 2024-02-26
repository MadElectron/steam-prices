# steam-prices

A simple NodeJS project showing Steam game prices:
* on Steam KZ, calculated in RUB for Wallet replenishment via third-party services, roughly approximated
* on Plati.market

Price formulae for Steam KZ is
```ResultingPrice = (SteamPriceKZT * (1 + SteamCommission)) / SteamUSD2KZTExchangeRate * USD2RUBRate```
where
* ```SteamPriceZKT``` — Steam price in Kazakh store, Kazakh Tenge, fetched from Steam Search ([example](https://steamcommunity.com/actions/SearchApps/Robocop));
* ```SteamCommission``` - Steam commission, 11 %;
* ```SteamUSD2KZTExchangeRate``` — Steam internal exchange rate, Kazakh Tenge to US Dollar, fetched from [Steam Currency API](https://api.steam-currency.ru/currency/USD:KZT);
* ```USD2RUBRate``` – Central Bank of Russia exhange rate, US Dollar to Russian Ruble, fetched from [CBR API](https://www.cbr-xml-daily.ru/daily_json.js).

Plati.Market price fetched from [Plati.Market API](https://plati.market/api/).  
