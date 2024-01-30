const express = require('express')
const { pool } = require('./dbConfig')
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
require('dotenv').config()
const app = express()

const PORT = process.env.PORT || 3000

const initializePassport = require('./passportConfig')

initializePassport(passport)

// Middleware

// Parses details from a form
app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs')

app.use(
  session({
    // Ключ, который мы хотим сохранить в секрете, который зашифрует всю нашу информацию
    secret: process.env.SESSION_SECRET,
    // Должны ли мы повторно сохранять наши переменные сеанса, если ничего не изменилось, чего мы не делаем
    resave: false,
    // Сохраните пустое значение, если нет value, чего мы не хотим делать
    saveUninitialized: false,
  })
)
// Функция внутри паспорта, которая инициализирует паспорт
app.use(passport.initialize())
// Сохраните наши переменные, которые будут сохраняться в течение всего сеанса. Работает с app.use(Session) выше
app.use(passport.session())
app.use(flash())

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/users/register', checkAuthenticated, (req, res) => {
  res.render('register.ejs')
})

app.get('/users/login', checkAuthenticated, (req, res) => {
  // flash задает переменную messages. passport задает сообщение об ошибке
  console.log(req.session.flash.error)
  res.render('login.ejs')
})

app.get('/users/dashboard', checkNotAuthenticated, (req, res) => {
  console.log(req.isAuthenticated())
  res.render('dashboard', { user: req.user.name })
})

app.get('/users/logout', (req, res) => {
  req.logout()
  res.render('index', { message: 'You have logged out successfully' })
})

app.post('/users/register', async (req, res) => {
  const { name, email, password, password2 } = req.body

  let errors = []

  console.log({
    name,
    email,
    password,
    password2,
  })

  if (!name || !email || !password || !password2) {
    errors.push({ message: 'Please enter all fields' })
  }

  if (password.length < 6) {
    errors.push({ message: 'Password must be a least 6 characters long' })
  }

  if (password !== password2) {
    errors.push({ message: 'Passwords do not match' })
  }

  if (errors.length > 0) {
    res.render('register', { errors, name, email, password, password2 })
  } else {
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log(hashedPassword)
    // Validation passed
    pool.query(
      `SELECT * FROM base
        WHERE email = $1`,
      [email],
      (err, results) => {
        if (err) {
          console.log(err)
        }
        console.log(results.rows)

        if (results.rows.length > 0) {
          return res.render('register', {
            message: 'Email already registered',
          })
        } else {
          pool.query(
            `INSERT INTO base (name, email, password)
                VALUES ($1, $2, $3)
                RETURNING id, password`,
            [name, email, hashedPassword],
            (err, results) => {
              if (err) {
                throw err
              }
              console.log(results.rows)
              req.flash('success_msg', 'You are now registered. Please log in')
              res.redirect('/users/login')
            }
          )
        }
      }
    )
  }
})

app.post(
  '/users/login',
  passport.authenticate('local', {
    successRedirect: '/users/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true,
  })
)

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/users/dashboard')
  }
  next()
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/users/login')
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
