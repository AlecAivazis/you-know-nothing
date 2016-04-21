// external imports
import sequelize from 'sequelize'

// u
const database = new sequelize({
    dialect: 'sqlite',
    storage: './votes.db'
})

export default database