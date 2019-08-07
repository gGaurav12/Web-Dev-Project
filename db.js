const Sequelize = require('sequelize')

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'users.db'
})

const Users= sequelize.define('users',{
    Username:{
        type:Sequelize.STRING,
        primaryKey:true,
    
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false,
    },

})

const Books = sequelize.define('books',{
    
    title: {
        type: Sequelize.STRING,
        
    },
    author: {
        type: Sequelize.STRING,
    },
    genre: {
        type: Sequelize.STRING,
    },
    edition:{
        type:Sequelize.STRING,
    },
    Url:{
        type: Sequelize.STRING,
    },
    sr:{
        type:Sequelize.STRING,
    }
    
})

module.exports = {
    Users,
    Books,
    sequelize
}