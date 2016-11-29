import Promise from 'bluebird'
import dynamoose from 'dynamoose'
import cacheManager from 'cache-manager'
var memoryCache = cacheManager.caching({store: 'memory', max: 100, ttl: 300/*seconds*/});
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
      const cached = await memoryCache.get('products')
      if (cached === undefined) {
        let i = 0
        let sites = await Diff.scan().exec()
        let lastElem = sites.lastKey
        while (lastElem) {
          console.log('Cyclin', i++)
          let resp = await Diff.scan().startAt(lastElem).exec()
          lastElem = resp.lastKey
          console.log('Response: ', resp.length)
          sites = sites.concat(resp)
        } 
        console.log('Setting cache')
        await memoryCache.set('products', sites)
        console.log('Serving from DB')
        return sites
      }
      console.log('Serving from cache')
      return cached
    } catch (e) {
      console.log(e) 
      throw new Error(e)
    }
}

export default Diff
