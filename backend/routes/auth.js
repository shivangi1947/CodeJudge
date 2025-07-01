const express = require('express');
const router = express.Router();
const { register, login, logout, getUserById } = require('../controllers/auth');

router.post('/register', register);//done
router.post('/login', login);//login
router.get('/:userId', getUserById);//done
router.post('/logout', logout);//done

module.exports = router;
