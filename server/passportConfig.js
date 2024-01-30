const LocalStrategy = require('passport-local').Strategy
const { pool } = require('./dbConfig')
const bcrypt = require('bcrypt')

function initialize(passport) {
  console.log('Initialized')

  const authenticateUser = (email, password, done) => {
    console.log(email, password)
    pool.query(
      `SELECT * FROM base WHERE email = $1`,
      [email],
      (err, results) => {
        if (err) {
          throw err
        }
        console.log(results.rows)

        if (results.rows.length > 0) {
          const user = results.rows[0]

          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              console.log(err)
            }
            if (isMatch) {
              return done(null, user)
            } else {
              //password корректный
              return done(null, false, { message: 'Password is incorrect' })
            }
          })
        } else {
          // нет пользователя
          return done(null, false, {
            message: 'No user with that email address',
          })
        }
      }
    )
  }

  passport.use(
    new LocalStrategy(
      { usernameField: 'email', passwordField: 'password' },
      authenticateUser
    )
  )
  // Хранит данные пользователя внутри сеанса. serializeUser определяет, какие данные пользователя
  // объект должен быть сохранен в сеансе. Результат метода serializeUser прилагается
  // к сеансу как req.session.passport.user = {}. Здесь, например, это было бы (как мы предоставляем
  //  идентификатор пользователя в качестве ключа) req.session.passport.user = {id: 'xyz'}
  passport.serializeUser((user, done) => done(null, user.id))

  // В deserializeUser этот ключ сопоставляется с массивом / базой данных в памяти или любым ресурсом данных.
  // Извлеченный объект присоединяется к объекту запроса как req.user

  passport.deserializeUser((id, done) => {
    pool.query(`SELECT * FROM base WHERE id = $1`, [id], (err, results) => {
      if (err) {
        return done(err)
      }
      console.log(`ID is ${results.rows[0].id}`)
      return done(null, results.rows[0])
    })
  })
}

module.exports = initialize
