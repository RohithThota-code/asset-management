const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    getProfile, 
    logoutUser, 
    authenticateToken 
} = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authenticateToken, getProfile); // Profile route with middleware
router.post('/logout', logoutUser);


module.exports = router;





