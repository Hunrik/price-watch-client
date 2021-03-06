/*import Queue from 'bull'*/
import Sitemapper from 'sitemapper'
import URL from 'url'
import _ from 'lodash'
import * as Site from '../models/site'
import * as Product from '../models/product'
import * as Diff from '../models/diff'
import { LAMBDA_KEY, ENQUE_KEY } from '../../../config/appConfig'
import Promise from 'bluebird'
import AWS from 'aws-sdk'
import eachLimit from 'async/eachLimit'
import axios from 'axios'
import crawlmap from 'crawlmap'
const sqsUrl = 'https://sqs.eu-central-1.amazonaws.com/284590800778/Parser'
AWS.config.loadFromPath('./config.json')

const sqs = new AWS.SQS()
Promise.promisifyAll(Object.getPrototypeOf(sqs))
sqs.purgeQueue({QueueUrl: sqsUrl})

export async function listSites (req, res) {
  console.log('Requesting')
  const sites = await Site.list()
  return res.send(sites || [])
}
/**
 * Parse sitemap
 */
export const parseSitemap = async function (req, res) {
    if (req.body.url === undefined) return res.status(422).send('Missing URL parameter')
    try {
      const site = await Site.findByDomain(req.body.url)
      const crawler = new crawlmap({
        sitemap: site.sitemap,
      })
      const data = await crawler.crawl()
      console.log('Crawled', data.length)
      data.map((url) => {
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
      message = _.chunk(message, 10)[0]
      eachLimit(message, 10, (chunk, callback) => {
        const messages = {
          Entries: chunk,
          QueueUrl: sqsUrl
        }
        sqs.sendMessageBatchAsync(messages)
          .then(callback)
          .catch(console.log)
      }, () => {
        invokeLambda()
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
    if( req.query.key !== ENQUE_KEY) return res.status(401).send('Invalid auth key')
    try {
      let resp = await Diff.getAllProducts()
      resp = await shuffle(resp)
      console.log('After shuffle', resp.length)
      let message = resp.map((site, i) => {
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
      console.log('After prepare for SQS', message.length)
      message = _.chunk(message, 10)
      console.log('After chunking', message.length)
      eachLimit(message, 25, pushToLambda, (err) => {
        invokeLambda()
        invokeLambda()
        .then(() => {
          return res.send({
            itemsAdded: sites.length
          })
        }).catch((e) => console.log(e))
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
  const crawler = new crawlmap({
      url: 'asd',
        sitemap: site.sitemap,
      })
  const data = await crawler.crawl()
  console.log('Crawled', data.length)
  let sites = data.map((url, i) => {
    let payload = {
      type: 'page',
      data: (typeof url === 'array' ? url[0] : url)
    }
    return {
      Id: i.toString(),
      MessageBody: JSON.stringify(payload),
      DelaySeconds: 0
    }
  })
  sites = _.chunk(sites, 10)
  //await Site.default.delete({domainName: site.domain})
  eachLimit(sites, 100, pushToLambda ,() => {
    return res.status(200).send({status: data.length + ' site added to the processing queue!'})
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
  const products = await Diff.default.scan('difference').gt(0).exec()
  console.log(products.length)
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
const invokeLambda = () => {
  return axios({
    method: 'POST',
    url: 'https://mjl05xiv1a.execute-api.eu-central-1.amazonaws.com/prod',
    headers: {'x-api-key': LAMBDA_KEY}
  }).then(console.log).catch(console.error)
}
async function pushToLambda(chunk, callback) {
    try {
        const messages = {
        Entries: chunk,
        QueueUrl: sqsUrl
      }
      chunk = await sqs.sendMessageBatchAsync(messages)
      chunk = null
      return callback()
    } catch (e) { console.log(e) }
  }