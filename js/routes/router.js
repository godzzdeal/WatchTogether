const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const db = require('../lib/db.js');
const userMiddleware = require('../middleware/users.js');

router.post('/signup', userMiddleware.validateRegister, (req, res, next) => {
  db.query(
    `SELECT * FROM users WHERE LOWER(login) = LOWER(${db.escape(
      req.body.login
    )});`,
    (err, result) => {
      if (result.length) {
        return res.status(409).send({
          msg: 'This login is already in use!'
        });
      } else {
        // username is available
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).send({
              msg: err
            });
          } else {
            // has hashed pw => add to database
            db.query(
              `INSERT INTO users (id, login, password, registered) VALUES ('${uuid.v4()}', ${db.escape(
                req.body.login
              )}, ${db.escape(hash)}, now())`,
              (err, result) => {
                if (err) {
                  throw err;
                  return res.status(400).send({
                    msg: err
                  });
                }
                return res.status(201).send({
                  msg: 'Registered!'
                });
              }
            );
          }
        });
      }
    }
  );
});

router.post('/signin', (req, res, next) => {
  db.query(
    `SELECT * FROM users WHERE login = ${db.escape(req.body.login)};`,
    (err, result) => {
      // user does not exists
      if (err) {
        throw err;
        return res.status(400).send({
          msg: err
        });
      }
      if (!result.length) {
        return res.status(401).send({
          msg: 'Login or password is incorrect!'
        });
      }
      // check password
      bcrypt.compare(
        req.body.password,
        result[0]['password'],
        (bErr, bResult) => {
          // wrong password
          if (bErr) {
            throw bErr;
            return res.status(401).send({
              msg: 'Login or password is incorrect!'
            });
          }
          if (bResult) {
            const token = jwt.sign({
              login: result[0].login,
              userId: result[0].id
            },
              'SECRETKEY', {
              expiresIn: '7d'
            }
            );
            db.query(
              `UPDATE users SET last_login = now() WHERE id = '${result[0].id}'`
            );
            return res.status(200).send({
              msg: 'Logged in!',
              token,
              user: result[0]
            });
          }
          return res.status(401).send({
            msg: 'Login or password is incorrect!'
          });
        }
      );
    }
  );
});

router.get('/secret-route', userMiddleware.isLoggedIn, (req, res, next) => {
  console.log(req.userData);
  res.send('This is the secret content. Only logged in users can see that!');
});
module.exports = router;