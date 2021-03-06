import Promise from 'bluebird'
import dynamoose from 'dynamoose'

/**
 * Site Schema
 */
const SiteSchema = new dynamoose.Schema({
  domainName: {
    type: String,
    required: true,
    unique: true,
    hashKey: true
  },
  sitemap: {
    type: String,
    unique: true
  },
  productPageSelector: {
    type: [String]
    // required: true
  },
  priceSelector: {
    type: [String]
    // required: true
  },
  productNameSelector: {
    type: [String]
  },
  productIdSelector: {
    type: [String]
  },
  enabled: {
    type: Boolean,
    default: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
})
const Site = dynamoose.model('Site', SiteSchema)
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
    Site.get({domainName: domain})
      .then(resolve)
      .catch(reject)
  })
}
/**
 * List Sites in descending order of 'createdAt' timestamp.
 * @param {number} skip - Number of Sites to be skipped.
 * @param {number} limit - Limit number of Sites to be returned.
 * @returns {Promise<Site[]>}
 */
export const list = () => {
  return new Promise((resolve, reject) => {
    Site.scan()
      .exec()
      .then(resolve)
      .catch(reject)
  })
}

/**
 * @typedef Site
 */
export default Site
