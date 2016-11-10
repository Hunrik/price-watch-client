import Promise from 'bluebird'
import mongoose from 'mongoose'

/**
 * Site Schema
 */
const SiteSchema = new mongoose.Schema({
  domain: {
    type: String,
    required: true,
    unique: true
  },
  sitemap: {
    type: String,
    unique: true
  },
  productPageSelector: {
    type: Array
    // required: true
  },
  priceSelector: {
    type: Array
    // required: true
  },
  productNameSelector: {
    type: Array
  },
  productIdSelector: {
    type: Array
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
})

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
SiteSchema.method({
})

/**
 * Statics
 */
SiteSchema.statics = {
  /**
   * Get Site
   * @param {ObjectId} id - The objectId of Site.
   * @returns {Promise<Site, APIError>}
   */
  get (id) {
    return this.findById(id)
      .exec()
      .then((site) => {
        if (site) {
          return site
        }
        return Promise.reject()
      })
  },
  /**
   * Get sites by their domain.
   * @param {string} domain - Domain of the sites.
   * @returns {Promise<Site[]>}
   */
  findByDomain (domain) {
    return this.find({
      domain: domain
    }).exec()
  },
  /**
   * Get sites by their type.
   * @param {string} type - Type of the sites.
   * @returns {Promise<Site[]>}
   */
  findByType (type) {
    return this.find({
      type: type
    }).exec()
  },
  /**
   * Get all product pages, optionaly by their domain.
   * @param {string} domain - Domain of the sites.
   * @returns {Promise<Site[]>}
   */
  getProductPages (domain = '') {
    return this.find({
      domain: domain,
      type: 'product'
    }).exec()
  },
  /**
   * List Sites in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of Sites to be skipped.
   * @param {number} limit - Limit number of Sites to be returned.
   * @returns {Promise<Site[]>}
   */
  list ({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec()
  }
}

/**
 * @typedef Site
 */
export default mongoose.model('Site', SiteSchema)
