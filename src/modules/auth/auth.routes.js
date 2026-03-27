import express from 'express'
import { loginUser, logoutUser, registerUser } from './auth.controller.js'

const auth = express.Router();

auth.route('/register')
    .post(registerUser)
auth.route('/login')
    .post(loginUser)
auth.route('/logout')
    .post(logoutUser)


export default auth;