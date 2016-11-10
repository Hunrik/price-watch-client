import session from 'express-session'
export default () => {
  return require('connect-dynamodb')({session: session})
}
