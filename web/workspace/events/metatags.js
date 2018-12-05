const marked = require('marked')

const config = require('@dadi/web').Config
const publicUrl = config.get('global.publicUrl')
const dadicdn = config.get('global.cdn.publicUrl')

const Event = function (req, res, data, callback) {
  const meta = {}

  meta.canonical = `${publicUrl}${data.pathNoLang || ''}`
  meta.url = `${publicUrl}${req.url}`
  meta.image = `${publicUrl}/assets/products/dadi-og.jpg`

  // -------------------------
  // Root pages
  if (data.hasResults('pages')) {
    const page = data.pages.results[0]

    meta.title = page.metaTitle ? page.metaTitle.trim() : page.title.trim()
    meta.description = page.metaDescription ? page.metaDescription.trim() : page.excerpt.trim()
  }

  // -------------------------
  // Articles
  if (data.hasResults('articles') && data.page.key === 'article') {
    const article = data.articles.results[0]

    meta.title = article.metaTitle ? article.metaTitle.trim() : article.title.trim()
    meta.description = article.metaDescription ? article.metaDescription.trim() : article.excerpt.trim()
    if (article.author && article.author[0] && article.author[0].twitter) meta.authorTwitter = article.author[0].twitter

    // get first image
    if (article.body) {
      const images = article.body.match(/!\[(.*?)\]\((.*?)\)/)

      if (images && images[0]) {   
        let image = marked(images[0])
        image = image.match(/src="(.+?)"/)[1]

         // Is it a CDN image?
        if (image.startsWith('/media/')) {
          image = `${dadicdn}${image}?w=1200&h=675&q=70&resize=aspectfill&gravity=center`
        }

        // Is it a local image?
        if (!image.startsWith('http')) {
          image = `${publicUrl}${image}`
        }

        // Put in object
        meta.image = image
      }
    }

    // Has lead image
    if (article.leadImage) {
      // Override article image
      meta.image = `${dadicdn}${article.leadImage[0].path}?w=1200&h=675&q=70`
    }

    if (article.metaImage) {
      // Override article image
      meta.image = `${dadicdn}${article.metaImage[0].path}?w=1200&h=675&q=70`
    }
  }

  // -------------------------
  // Web services
  if (data.hasResults('web-service') && data.page.key === 'web-services') {
    const app = data['web-service'].results[0]

    meta.title = `DADI ${app.name}`
    meta.description = app.overview.trim()
    meta.image = `${publicUrl}/assets/products/dadi-${app.slug}-og.jpg`
  }

  // -------------------------
  // Team
  if (data.hasResults('team') && data.params.name) {
    const person = data.team.results[0]

    meta.title = person.name
    meta.description = person.body.trim()
    meta.image = `${dadicdn}${person.image[0].path}?w=1200&q=70`
    
    if (person.twitter) meta.authorTwitter = person.twitter
  }

  // Put in page
  data.page.meta = meta

  callback()
}

module.exports = function (req, res, data, callback) {
  return new Event(req, res, data, callback)
}
