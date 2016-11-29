import Promise from 'bluebird'
import dynamoose from 'dynamoose'
/*import NodeCache from 'node-cache'
const cache = new NodeCache({ stdTTL: 1000, checkperiod: 120 })*/
/**
 * Site Schema
 */
const ProductSchema = new dynamoose.Schema({
  url: {
    type: String,
    required: true,
    rangeKey: true
  },
  domainName: {
    type: String,
    required: true,
    hashKey: true
  },
  productId: {
    type: Number
  },
  productName: {
    type: String
  },
  price: {
    type: Array
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})
const Product = dynamoose.model('Product', ProductSchema)
/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */

/**
 * Statics
 */
/**
 * Get Site
 * @param {ObjectId} id - The objectId of Site.
 * @returns {Promise<Site, APIError>}
 */
export const get = (id) => {
  return this.findById(id)
    .exec()
    .then((site) => {
      if (site) {
        return site
      }
      return Promise.reject()
    })
}
/**
 * Get sites by their domain.
 * @param {string} domain - Domain of the sites.
 * @returns {Promise<Site[]>}
 */
export const findByDomain = (domain) => {
  return new Promise((resolve, reject) => {
    Product.get({domainName: domain})
      .exec()
      .then(resolve)
      .catch(reject)
  })
}
/**
 * Get sites by their type.
 * @param {string} type - Type of the sites.
 * @returns {Promise<Site[]>}
 */
export const findByPID = (domain, pid) => {
  return new Promise((resolve, reject) => {
    Product.get({domainName: domain, productId: pid})
      .then(resolve)
      .catch(reject)
  })
}
/**
 * Get all product pages, optionaly by their domain.
 * @param {string} domain - Domain of the sites.
 * @returns {Promise<Site[]>}
 */
export const findByUrl = (url) => {
  return new Promise((resolve, reject) => {
    Product.get({url: url})
      .then(resolve)
      .catch(reject)
  })
}
export const list = (skip) => {
  return new Promise((resolve, reject) => {
    Product.scan()
      .startAt(skip)
      .exec()
      .then(resolve)
      .catch(reject)
  })
}
/*export const getAllProducts = async function (limit) {
    try {
      const cached = await cache.get('products')
      if (cached === undefined) {
        let i = 0
        let sites = await Product.scan().exec()
        let lastElem = sites.lastKey
        while (lastElem) {
          console.log('Cyclin', i++)
          let resp = await Product.scan().startAt(lastElem).exec()
          lastElem = resp.lastKey
          sites = sites.concat(resp)
        } 
        cache.set('products', sites)
        return sites
      }
      return cached
    } catch (e) { throw new Error(e) }
}
export const getTopProducts = async function (limit) {
    try {
      const cached = await cache.get('topProdcts')
      if (cached === undefined) {
        const sites = await Product.scan().limit(limit).exec()
        cache.set('topProdcts', sites)
        return sites
      }
      return cached
    } catch (e) { throw new Error(e) }
}*/
/**
 * @typedef Site
 */
export default Product
