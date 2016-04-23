// external imports
import sequelize from 'sequelize'
// local imports
import database from '../db'

// export the model from this file
export default database.define('vote', {
    option: {
        type: sequelize.STRING,
    },
    datetime: {
        type: sequelize.DATE,
        defaultValue: sequelize.NOW
    }
})