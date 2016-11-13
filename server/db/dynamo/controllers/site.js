/*import Queue from 'bull'*/
import Sitemapper from 'sitemapper'
import URL from 'url'
import _ from 'lodash'
import * as Site from '../models/site'
import * as Product from '../models/product'
import Promise from 'bluebird'
import AWS from 'aws-sdk'
import eachLimit from 'async/eachLimit'
import axios from 'axios'
const sqsUrl = 'https://sqs.eu-central-1.amazonaws.com/284590800778/Parser'
AWS.config.loadFromPath('./config.json')

const sqs = new AWS.SQS()
Promise.promisifyAll(Object.getPrototypeOf(sqs))
sqs.purgeQueue({QueueUrl: sqsUrl})

export async function listSites (req, res) {
  const sites = await Site.list()
  return res.send(sites)
}
/**
 * Parse sitemap
 */
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
        let payload = {
          type: 'page',
          data: site
        }
        return {
          Id: i.toString(),
          MessageBody: JSON.stringify(payload),
          DelaySeconds: 0
        }
      })
      message = _.chunk(message, 10)
      eachLimit(message, 10, (chunk, callback) => {
        const messages = {
          Entries: chunk,
          QueueUrl: sqsUrl
        }
        sqs.sendMessageBatchAsync(messages)
          .then(callback)
          .catch(console.log)
      }, () => {
        axios.get('https://mjl05xiv1a.execute-api.eu-central-1.amazonaws.com/prod/shop-parser-production', {
          headers: {'x-api-key': '8XGbYeQwSqa5TwanMAJP6QMH1Ix0Yrj6ax5vQoW8'}
        })
        return res.send(data.sites.length + ' site sent for processing!')
      })
    } catch (e) {
      console.log(e)
      res.status(500)
      return res.send(e)
    }
}
/**
 * Add product to price checking queue
 */
export const enqueProducts = async function (req, res) {
    try {
      let i = 0
      var sites = await Product.default.scan().exec()
      var lastElem = sites.lastKey
      var resp = []
      do {
        resp = await Product.list(lastElem)
        lastElem = resp.lastKey
        sites.push(resp)
      } while (resp.lastKey)

      sites = await shuffle(sites)
      let message = sites.map((site, i) => {
        let payload = {
          type: 'product',
          data: site
        }
        return {
          Id: i.toString(),
          MessageBody: JSON.stringify(payload),
          DelaySeconds: 0
        }
      })
      message = _.chunk(message, 10)
      eachLimit(message, 50, (chunk, callback) => {
        const messages = {
          Entries: chunk,
          QueueUrl: sqsUrl
        }
        sqs.sendMessageBatchAsync(messages)
          .then(() => callback())
          .catch(console.log)
      }, (err) => {
        axios.get('https://mjl05xiv1a.execute-api.eu-central-1.amazonaws.com/prod/shop-parser-production', {
          headers: {'x-api-key': '8XGbYeQwSqa5TwanMAJP6QMH1Ix0Yrj6ax5vQoW8'}
        })
        .then(() => {
          return res.send({
            itemsAdded: sites.length
          })
        })
      })
    } catch (e) {
      console.log(e)
      return res.status(500).send(e)
    }
}
/**
 * Create site
 * POST /sites
 */
export const createSite = async function ({body}, res) {
  if(!body.domainName) res.status(400).send({status: 'Missing or invalid domain'})
  const siteKeys = {
    domainName: body.domainName,
    sitemap: body.sitemap,
    enabled: body.enabled
  }
  let site = {
    productPageSelector: body.productPageSelector,
    priceSelector: body.priceSelector,
    productNameSelector: body.productNameSelector,
    productIdSelector: body.productIdSelector
  }
  Object.keys(site).map(function(key, index) {
    if(typeof site[key] !== 'string') return
    site[key] = site[key].split(';')
  })
  const complete = Object.assign({}, site, siteKeys)
  const resp = await Site.default.create(complete)
  res.send({status: 'saved'})
}
/**
 * Edit existing site
 * PUT /sites
 */
export const updateSite = async function ({body}, res) {
  if(!body.domainName) return res.status(400).send({status: 'Missing or invalid domain'})
  let site = _.omit(body, 'domainName', 'sitemap', 'enabled')
  if(!site) return res.status(400).send({status: 'Empty parameters'})
  Object.keys(site).map(function(key, index) {
    if(typeof site[key] !== 'string') return
    site[key] = site[key].split(';')
  })
  site.enabled = body.enabled || false 
  const resp = await Site.default.update({domainName: body.domainName}, site)
  res.send({status: 'saved'})
}
/**
 * Add site to parsing queue
 */
export const parseSite = async function (req, res) {
  const site = await Site.findByDomain(req.params.id)
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
    return {
      Id: i.toString(),
      MessageBody: JSON.stringify(payload),
      DelaySeconds: 0
    }
  })
  sites = _.chunk(sites, 10)
  await Site.default.delete({domainName: site.domain})
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
  
}
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

export const getProducts = async function (req, res) {
  const page = req.params
  const products = await Product.list(100 * page, 100)
  return res.send(products)
}
export default {
  listSites,
  parseSitemap,
  enqueProducts,
  createSite,
  parseSite,
  deleteProductQueue,
  deleteSiteQueue,
  status,
  updateSite,
  getProducts
}

function shuffle(array) {
  return new Promise( (resolve, reject) => {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return resolve(array);
  })
}
