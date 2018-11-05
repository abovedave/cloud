const dust = require('dustjs-linkedin')

// Localises a number e.g, 1000000 becomes 1,000,000

dust.filters.n = value => {
  return value.toLocaleString(undefined,
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: (value > 10000) ? 2 : 4
    }
  )
}