/**
 * Defining a User Model in mongoose
 * Code modified from https://github.com/sahat/hackathon-starter
 */

import bcrypt from 'bcrypt-nodejs'
import dynamoose from 'dynamoose'
import uuid from 'uuid'
// Other oauthtypes to be added

/*
 User Schema
 */

const UserSchema = new dynamoose.Schema({
  id: { type: String, unique: true},
  email: { type: String, unique: true, lowercase: true },
  password: String,
  tokens: Array,
  profile: {
    name: { type: String, default: '' },
    gender: { type: String, default: '' },
    location: { type: String, default: '' },
    website: { type: String, default: '' },
    picture: { type: String, default: '' }
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  google: {}
})

function encryptPassword (password) {
  return bcrypt.genSalt(5, (saltErr, salt) => {
    if (saltErr) throw new Error(saltErr)
    return bcrypt.hash(password, salt, null, (hashErr, hash) => {
      if (hashErr) throw new Error(hashErr)
      return hash
    })
  })
}

/**
 * Password hash middleware.
 */
export const addUser = (data) => {
  return new Promise((resolve, reject) => {
    UserSchema.create({
      id: uuid.v4(),
      email: data.email,
      password: encryptPassword(data.password)
    }).then(resolve).catch(reject)
  })
}
/*
 Defining our own custom document instance method
 */
export const comparePassword = (candidatePassword, uid) => {
  return new Promise((resolve, reject) => {
    UserSchema.get({id: uid}).then(({password}) => {
      bcrypt.compare(candidatePassword, password, (err, isMatch) => {
        if (err) return reject(err)
        return resolve(isMatch)
      })
    })
  })
}
export default UserSchema
