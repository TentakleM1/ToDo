const { pool } = require('../dbConfig')
const bcrypt = require('bcrypt')

async function register(req, res) {
  const { name, email, password, password2 } = req.body

  let errors = []

  console.log({
    name,
    email,
    password,
    password2,
  })
  ///////////////// Проверка на вшивость

  ////  Проверка все ли поля заполнены
  if (!name || !email || !password || !password2) {
    errors.push({ message: 'Пожалуйста заполните все поля ввода данных' })
  }

  //// Проверка длины пароля
  if (password.length < 6) {
    errors.push({ message: 'Пароль должен быть не менее 6 символов' })
  }

  //// Проверка совпадают ли пароли в поля ввода данных
  if (password !== password2) {
    errors.push({ message: 'Пароли не совпадают' })
  }

  //// Если все ОК то проверка сначала на почту после регистрация
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
            message: 'Email уже зарегистрирован',
          })
        }

        /////      Всё ОК пошла регистрация
        else {
          pool.query(
            `INSERT INTO base (name, email, password)
                VALUES ($1, $2, $3)
                RETURNING id, password`,
            [name, email, hashedPassword],
            (err, results) => {
              if (err) {
                throw err
              }

              ////   Возврат на окно авторизации
              console.log(results.rows)
              req.flash(
                'success_msg',
                'Вы зарегистрировались. Пожалуйста авторизуйтесь'
              )
              res.redirect('/users/login')
            }
          )
        }
      }
    )
  }
}

module.exports = register
