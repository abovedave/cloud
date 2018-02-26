const path = require('path')
const url = require('url')

const Event = function (req, res, data, callback) {
  let filter = {}

  // article.json
  if (data.params.title) {
    filter = { slug: data.params.title }
  }

  // roadmap-category.json
  if (data.params.roadmapCategory) {
    filter = { "roadmap-category.slug": data.params.roadmapCategory }
  }

  // network.json
  if (data.page.key === 'network') {
    filter = { "roadmap-category.slug": "mainnet" }
  }

  // network.json
  if (data.page.key === 'knowledge') {
    filter = { "knowledge-category.slug": data.params.category }
  }

  callback(null, Object.assign({ "published": true }, filter))
}

module.exports = function (req, res, data, callback) {
  return new Event(req, res, data, callback)
}

module.exports.Event = Event