import express from 'express'
import { loginUser, logoutUser, registerUser } from './auth.controller.js'
import upload from '../../middleware/uploadMiddleware.js';

const auth = express.Router();

auth.route('/register')
    .post(upload.single('avatar'), registerUser)
auth.route('/login')
    .post(loginUser)
auth.route('/logout')
    .post(logoutUser)


export default auth;