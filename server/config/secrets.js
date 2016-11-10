/** Important **/
/** You should not be committing this file to GitHub **/
/** Repeat: DO! NOT! COMMIT! THIS! FILE! TO! YOUR! REPO! **/
export const sessionSecret = process.env.SESSION_SECRET || 'Your Session Secret goes here'
export const google = {
  clientID: process.env.GOOGLE_CLIENTID || '62351010161-eqcnoa340ki5ekb9gvids4ksgqt9hf48.apps.googleusercontent.com',
  clientSecret: process.env.GOOGLE_SECRET || '6cKCWD75gHgzCvM4VQyR5_TU',
  callbackURL: process.env.GOOGLE_CALLBACK || '/auth/google/callback'
}
export const dynamodb = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'AKIAJSTO62ZD2IKPO2NA',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '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',
  region: process.env.AWS_REGION || 'eu-central-1'
}
export default {
  sessionSecret,
  google,
  dynamodb
}

/*export AWS_ACCESS_KEY_ID=AKIAJSTO62ZD2IKPO2NA
export AWS_SECRET_ACCESS_KEY=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
export AWS_REGION=eu-central-1*/