import express from 'express'
import { getAllUsers, getProfile, updateProfile } from './user.controller.js';
import { isLoggedIn } from '../../middleware/authMiddleware.js';

const user = express.Router()

user.route('/profile')
    .get(isLoggedIn, getProfile)
    .put(isLoggedIn, updateProfile);
user.route('/all-profile')
    .get(isLoggedIn, getAllUsers)

export default user;