const express = require('express')
const { pool } = require('./dbConfig')
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const path = require('path')
console.log(
  path.join(__dirname, '../front/vite-project/dist/src/pages/auth/auth.html')
)
const register = require('./register/register')

require('dotenv').config()
const app = express()

const PORT = process.env.PORT || 2000

const initializePassport = require('./passportConfig')

initializePassport(passport)

// Middleware

// Parses details from a form
app.use(express.json())
app.use(express.static(path.join(__dirname, '../front/vite-project/dist')))
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
  res.sendFile(
    path.join(
      __dirname,
      '../front/vite-project/dist/src/pages/registration/registration.html'
    )
  )
})

app.get('/users/login', checkAuthenticated, (req, res) => {
  // flash задает переменную messages. passport задает сообщение об ошибке
  res.sendFile(
    path.join(__dirname, '../front/vite-project/dist/src/pages/auth/auth.html')
  )
})

app.get('/users/dashboard', checkNotAuthenticated, (req, res) => {
  console.log(req.isAuthenticated())
  res.render('dashboard', { user: req.user.name })
})

app.get('/users/logout', (req, res) => {
  req.logout()
  res.render('index', { message: 'Вы успешно авторизовались' })
})

app.post('/users/register', async (req, res) => {
  register(req, res)
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
  console.log(`Сервер запущен на порту ${PORT}`)
})
