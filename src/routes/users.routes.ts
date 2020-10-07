import { Router } from 'express';
// controller
import UserController from '../controllers/UserController';
// middleware
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();

const userController = new UserController();

// routes
usersRouter.get('/', ensureAuthenticated, userController.index);

usersRouter.post('/', userController.store);

usersRouter.put('/', ensureAuthenticated, userController.update);

usersRouter.post('/auth', userController.auth);

export default usersRouter;
