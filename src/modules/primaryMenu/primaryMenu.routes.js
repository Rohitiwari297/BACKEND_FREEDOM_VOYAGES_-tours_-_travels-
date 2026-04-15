import exporess from 'express'
import { createPrimaryMenu, getPrimaryMunu } from './primaryMenu.controller.js';

const primary = exporess.Router();

primary.route('/')
    .post(createPrimaryMenu)
    .get(getPrimaryMunu);



export default primary;