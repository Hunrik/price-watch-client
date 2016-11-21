import Promise from 'bluebird'
import dynamoose from 'dynamoose'

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
export default Diff
