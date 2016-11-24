import Promise from 'bluebird'
import dynamoose from 'dynamoose'
import NodeCache from 'node-cache'
const cache = new NodeCache({ stdTTL: 1000, checkperiod: 120 })
/**
 * Site Schema
 */
const DiffSchema = new dynamoose.Schema({
  url: {
    type: String,
    required: true,
    rangeKey: true
  },
  domainName: {
    hashKey: true,
    type: String,
    required: true
  },
  productName: {
    type: String
  },
  difference: {
    type: Number,
    default: 0
  },
  oldPrice: {
    type: Number
  },
  newPrice: {
    type: Number,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {timestamps: false})
const Diff = dynamoose.model('Diff', DiffSchema)
/**
 * @typedef Site
 */
export const getAllProducts = async function (limit) {
    try {
      const cached = await cache.get('products')
      if (cached === undefined) {
        let i = 0
        let sites = await Diff.scan().exec()
        let lastElem = sites.lastKey
        while (lastElem) {
          console.log('Cyclin', i++)
          let resp = await Diff.scan().startAt(lastElem).exec()
          lastElem = resp.lastKey
          sites = sites.concat(resp)
        } 
        cache.set('products', sites)
        return sites
      }
      return cached
    } catch (e) { throw new Error(e) }
}

export default Diff
