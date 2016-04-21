// external imports
import {STRING} from 'sequelize'
// local imports
import database from '../db'

// export the model from this file
export default database.define('vote', {
    category: {
        type: STRING,
    }
})