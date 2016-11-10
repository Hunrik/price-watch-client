/*import Queue from 'bull'*/
import Sitemapper from 'sitemapper'
import URL from 'url'
import _ from 'lodash'
import Site from '../models/site'
import Product from '../models/product'
import Promise from 'bluebird'
import AWS from 'aws-sdk'
import eachLimit from 'async/eachLimit'
const sqsUrl = 'https://sqs.eu-central-1.amazonaws.com/284590800778/Parser'
AWS.config.loadFromPath('./config.json')

const sqs = new AWS.SQS()
Promise.promisifyAll(Object.getPrototypeOf(sqs))
sqs.purgeQueue({QueueUrl: sqsUrl})

try {
  /*const URLqueue = Queue('urls', 6379, '127.0.0.1')
  const productQueue = Queue('products', 6379, '127.0.0.1')*/
} catch (e) {
  console.log('Could not connect to redis')
}

export async function listSites (req, res) {
  const sites = await Site.list()
  return res.send(sites)
}

export const parseSitemap = async function (req, res) {
    if (req.body.url === undefined) return res.status(422).send('Missing URL parameter')
    try {
      const site = await Site.findByDomain(req.body.url)
      const Google = new Sitemapper({
        url: site.sitemap,
        timeout: 15000 // 15 seconds 
      })
      const data = await Google.fetch()
      data.sites.map((url) => {
        /*URLqueue.add(url)*/
      })
      res.status(200)
      res.send(data.sites.length + ' site sent for processing!')
    } catch (e) {
      console.log(e)
      res.status(500)
      return res.send(e)
    }
}
export const enqueProducts = async function (req, res) {
    try {
      const sites = await URLmodel.getProductPages()
      let message = sites.map((site) => {
        let payload = {
          type: 'page',
          data: site
        }
        let site = {
          Id: i.toString(),
          MessageBody: JSON.stringify(payload),
          DelaySeconds: 0
        }
        return site
      })
      message = _.chunk(message, 10)
      console.log(message.length)
      eachLimit(message, 10, (chunk, callback) => {
        const messages = {
          Entries: chunk,
          QueueUrl: sqsUrl
        }
        sqs.sendMessageBatchAsync(messages)
          .then(callback)
          .catch(console.log)
      }, () => {
        return res.send({
          itemsAdded: sites.length
        })
      })
    } catch (e) {
      return res.status(500).send(e)
    }
}

export const createSite = async function ({body}, res) {
  const domain = URL.parse(body.domain).hostname
  if(!domain) res.status(400).send({status: 'Missing or invalid domain'})
  const site = {
    domain: domain,
    sitemap: body.sitemap,
    productPageSelector: body.productPageSelector,
    priceSelector: body.priceSelector,
    productNameSelector: body.productNameSelector,
    productIdSelector: body.productIdSelector
  }
  let mongo = new Site(site)
  console.log(URL.parse(body.domain))
  const resp = await mongo.save()
  res.send({status: 'saved'})
}

/**
 * Add site to parsing queue
 */
/*export const parseSite = async function (req, res) {
  const site = await Site.findById(req.params.id)
  const Mapper = new Sitemapper({
    url: site.sitemap,
    timeout: 15000 // 15 seconds 
  })
  const data = await Mapper.fetch()
  let sites = data.sites.map((url, i) => {
    let payload = {
      type: 'page',
      data: url
    }
    let site = {
      Id: i.toString(),
      MessageBody: JSON.stringify(payload),
      DelaySeconds: 0
    }
    return site
  })
  sites = _.chunk(sites, 10)
  console.log(sites.length)
  eachLimit(sites, 10, async function (chunk, callback) {
    try {
        const messages = {
        Entries: chunk,
        QueueUrl: sqsUrl
      }
      await sqs.sendMessageBatchAsync(messages)
      return callback()
    } catch (e) { console.log(e) }
  },() => {
    return res.status(200).send({status: data.sites.length + ' site added to the processing queue!'})
  })
  //await product.find({domain: site.domain}).remove().exec()
  
}*/
/**
 * Delete Site parsing queue
 */
export const deleteProductQueue = async function (req, res) {
  /*await productQueue.empty()*/
  return res.status(200).send({status: 'Price processing queue emptied'})
}
export const deleteSiteQueue = async function (req, res) {
 /* await URLqueue.empty()*/
  return res.status(200).send({status: 'Site processing queue emptied'})
}
export const status = async function (req, res) {
  /*const sitesInQueue = await URLqueue.count()
  const productsInQueue = await productQueue.count()

  const status = {
    sitesInQueue,
    productsInQueue
  }*/
  return res.send(status)
}

export default {
  listSites,
  parseSitemap,
  enqueProducts,
  createSite,
  parseSite,
  deleteProductQueue,
  deleteSiteQueue,
  status
}