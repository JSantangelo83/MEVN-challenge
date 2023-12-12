import { Router } from 'express';
import { isAdmin, isLogged } from '../controllers/auth.controller';
import { createUser, deleteUser, listUsers, updateUser } from '../controllers/user.controller';

const router = Router();

router.post('/login', ()=>{}) //test

router.get('/', isLogged, listUsers)

router.post('/', isLogged, isAdmin, createUser)
router.post('/', isLogged, isAdmin, createUser)

router.delete('/:id', isLogged, isAdmin, deleteUser)

router.put('/:id', isLogged, isAdmin, updateUser)

export default router;