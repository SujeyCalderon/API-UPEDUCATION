import { Router } from "express";
import { getAllUsers, getUserById, updateUser, createUser, deleteUser, loginUser, deleteLogicalUser } from "../controllers/userController";
import { authMiddleware } from "../../shared/middlewares/auth";

const userRoutes: Router = Router();

userRoutes.post('/login', loginUser);

userRoutes.get('/', authMiddleware, getAllUsers);
userRoutes.get('/:id', authMiddleware, getUserById);
userRoutes.put('/:id', authMiddleware, updateUser);
userRoutes.post('/', createUser);
userRoutes.put('/deleted/:id/', authMiddleware, deleteLogicalUser);
userRoutes.delete('/:id', authMiddleware, deleteUser);

export default userRoutes;

