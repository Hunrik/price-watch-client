import fs from 'fs'
import path from 'path'
/*import { dynamodb } from '../../config/secrets'*/

export default () => {
  // Find the appropriate database to connect to, default to localhost if not found.
  // Register schema as mongoose model
  const modelPath = path.join(__dirname, 'models')
  fs.readdirSync(modelPath).forEach((file) => {
    if (~file.indexOf('.js')) require(`${modelPath}/${file}`)
  })
}
