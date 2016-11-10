export const db = process.env.MONGOHQ_URL || process.env.MONGODB_URI || 'mongodb://hunrik:akela@ds057176.mlab.com:57176/shop-crawler?3t.connection.name=mongolab+crawler&3t.databases=shop-crawler&3t.uriVersion=2&3t.connectionMode=direct&readPreference=primary'

export default {
  db
}
