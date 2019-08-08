const express = require('express')
const app = express()
//const hbs = require('hbs')
let { Books, Users, sequelize } = require('./db')
const LocalStrategy = require('passport-local').Strategy
const passport = require('passport')
const session = require('express-session')
const flash = require('express-flash')


app.use(session({
    secret: 'averylongstring',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60 * 60 * 1000,
    },
}))

app.use(passport.initialize())

app.use(passport.session())

app.set('view engine', 'hbs')

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use(flash())

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))


passport.serializeUser(function (user, done) {
    done(null, user.Username)
})

passport.deserializeUser(function (Username, done) {
    Users.findOne({
        where: {
            Username: Username,
        }
    }).then((user) => {
        if (!user) {
            return done(new Error("No such user"))

        }
        return done(null, user)
    }).catch((err) => {
        done(err)
    })
})

passport.use('local', new LocalStrategy(function (username, password, done) {
    Users.findOne({
        where: {
            Username: username,
        }
    }).then((user) => {
        if (!user) {
            console.log('no user')
            return done(null, false, { message: "No such user" })
        }
        if (user.password != password) {
            console.log('incorrect password')
            return done(null, false, { message: "Wrong Password" })
        }
        console.log('user found')

        done(null, user)


    }).catch(done)
}))

app.get('/login', (req, res) => {
    res.render('login')
})



app.get('/signup', (req, res) => {
    res.render('sign')
})

app.post('/signup', (req, res) => {
    Users.create({
        Username: req.body.username,
        password: req.body.password
    }).then((createdUser) => {
        res.redirect('/login')
    })
})

app.get('/', (req, res) => {
    if (req.user) {
        res.render('front')
    } else {
        res.redirect('/login')
    }
})

app.get('/delete', (req, res) => {
    res.render('delete')
})

app.get('/1', (req, res) => {
    Books.findAll().then((el) => {
        const all = el
        res.render('Show', { all })
    })
})

app.get('/2', (req, res) => {
    res.render('about')
})

let al = {}
app.post('/', (req, res) => {
    Books.findAll({
        where: {
            title: req.body.but,
        }
    }).then((el) => {
        al = el
        console.log(al)
        res.redirect('/3')
    })
})

app.get('/3', (req, res) => {
    res.render('find', { al })
})

app.post('/add', (req, res) => {
    const book = {
        title: req.body.t,
        author: req.body.AN,
        genre: req.body.G,
        edition: req.body.E,
        Url: req.body.U,
        sr: req.body.s,
    }
    Books.create(book).then((el) => {
        res.redirect('/add')
    })
})

app.post('/delete', (req, res) => {
    Books.destroy({
        where: {
            title: req.body.titl,
        }
    }).then(() => {
        res.redirect('/delete')
    })
})

app.get('/add', (req, res) => {
    Books.findAll().then((el) => {
        const al = el
        res.render('add', { al })
    })
})

sequelize.sync().then(() => {
    app.listen(3000, () => {
        console.log("Successfully Created")
    })
})
/* Users.sync().then((

) => {
    console.log("Users created")
}) */