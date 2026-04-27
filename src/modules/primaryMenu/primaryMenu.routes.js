import exporess from 'express'
import { createPrimaryMenu, deletePrimary, getPrimaryMunu, updatePrimary } from './primaryMenu.controller.js';

const primary = exporess.Router();

primary.route('/')
    .post(createPrimaryMenu)
    .get(getPrimaryMunu);

primary.route('/:id')
    .patch(updatePrimary)
    .delete(deletePrimary);




export default primary;