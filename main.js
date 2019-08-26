const express = require('express')
const app = express()
const hbs = require('hbs')
let { Books, Users, sequelize } = require('./db')
const LocalStrategy = require('passport-local').Strategy
const passport = require('passport')
const session = require('express-session')
const path = require('path')
const http = require('http')
const server = http.createServer(app)
const socketio = require('socket.io')
const io = socketio(server)
const GitHubStrategy = require('passport-github').Strategy;
const PORT= process.env.PORT || 3000;


//passport
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

app.use(express.static('public'))

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.get('/login', (req, res) => {
    res.render('login')
})


app.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
   }),(req,res)=>{
    if(req.body.username=="Gaurav" && req.body.password=="gaurav")
    {
        res.redirect('/admin')
    }
    else{
        res.redirect('/')
    }
    
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

app.get('/login/github',
  passport.authenticate('github'))
     
 


app.get('/login/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    
    res.redirect('/');
  });

passport.use(new GitHubStrategy({
    clientID:  "Iv1.f83d82dc94df9b29",
    clientSecret:  "46f03e20279d67edbb3d4efb9f50f77601e559e5",
    callbackURL: "http://localhost:3000/login/github/callback"
  },
  (accessToken, refreshToken, profile, done)=> {
    Users.findCreateFind({ 
        where:{Username: profile.id },
    defaults:{
        Username: profile.id,
        ghAccessToken:accessToken,
    }
    
    }).then((user)=>{
        //console.log(profile)
        done(null,profile)
    }).catch(done)
  }))

  passport.serializeUser(function (user, done) {
    done(null, user)
})

passport.deserializeUser(function (user, done) {
       done(null, user)
       console.log(user)
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

app.get('/admin',(req,res)=>{
    if(req.user.Username=="Gaurav" && req.user.password=="gaurav")
           {res.render('admin')}
           else{res.redirect('/')}
})

//normal part

app.get('/', (req, res) => {
    if (req.user) {
        res.render('front')
    } else {
        res.redirect('/login')
    }
})

app.get('/delete', (req, res) => {
    if(req.user.Username=="Gaurav" && req.user.password=="gaurav")
    {
    res.render('delete')
}
else
{
res.redirect('/login')
}
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



app.get('/add', (req, res) => {
    if(req.user.Username=="Gaurav" && req.user.password=="gaurav")
    {
    Books.findAll().then((el) => {
        const al = el
        res.render('add', { al })
    })}
    else{res.redirect('/login')}
})

app.get('/logout',(req,res)=>{
    req.session.destroy()
    res.redirect('/login')
})

/*app.use('/contact',(req,res)=>{
    if(req.user)
   res.render('contact')
    
    else{res.send("Not an Authorised User")}
})*/

// socket part

app.get('/contact', (req, res) => {
    if(req.user)
    res.render('index')
    else{res.redirect('/login')}

})


//listen on every connection
io.on('connection', (socket) => {
    console.log('New user connected')
    //console.log(socket)

	//default username
	socket.username = "p"

    //listen on change_username
    socket.on('change_username', (data) => {
        socket.username = data.username
    })

    //listen on new_message
    socket.on('new_message', (data) => {
        //broadcast the new message
        io.sockets.emit('new_message', {message : data.message, username : socket.username});
    })

   
})


sequelize.sync().then(() => {
    server.listen(PORT, () => {
        console.log("Successfully Created")
    })
})
