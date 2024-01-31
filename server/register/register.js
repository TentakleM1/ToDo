const { pool } = require('../dbConfig')
const bcrypt = require('bcrypt')

async function register(req, res) {
  const { login, password, repytpassword } = req.body

  let errors = []

  console.log({
    login,
    password,
    repytpassword,
  })
  ///////////////// Проверка на вшивость

  ////  Проверка все ли поля заполнены
  if (!login || !password || !repytpassword) {
    errors.push({ message: 'Пожалуйста заполните все поля ввода данных' })
  }

  //// Проверка длины пароля
  if (password.length < 6) {
    errors.push({ message: 'Пароль должен быть не менее 6 символов' })
  }

  //// Проверка совпадают ли пароли в поля ввода данных
  if (password !== repytpassword) {
    errors.push({ message: 'Пароли не совпадают' })
  }

  //// Если все ОК то проверка сначала на почту после регистрация
  if (errors.length > 0) {
    res.render('register', { errors, login, password, repytpassword })
  } else {
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log(hashedPassword)
    // Validation passed
    pool.query(
      `SELECT * FROM base
        WHERE login = $1`,
      [login],
      (err, results) => {
        if (err) {
          console.log(err)
        }
        console.log(results.rows)

        if (results.rows.length > 0) {
          return res.render('register', {
            message: 'Login уже зарегистрирован',
          })
        }

        /////      Всё ОК пошла регистрация
        else {
          pool.query(
            `INSERT INTO base (login, password)
                VALUES ($1, $2)
                RETURNING id, password`,
            [login, hashedPassword],
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
