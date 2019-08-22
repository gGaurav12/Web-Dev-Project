const Sequelize = require('sequelize')

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'users.db'
})

const Users= sequelize.define('users',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        max:10,
        min:1

    },
    Username:{
        type:Sequelize.STRING,
        
    
    },
    password:{
        type:Sequelize.STRING,
        allowNull:true,
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