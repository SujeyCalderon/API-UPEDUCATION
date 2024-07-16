import { UserRepository } from "../repositories/UserRepository";
import { User } from "../models/User";
import { DateUtils } from "../../shared/utils/DateUtils"; 
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

const secretKey = process.env.SECRET || "";
const saltRounds = 10;

export class UserService {

    public static async login(name: string, password: string) {
        try {
            const user = await this.getUserByName(name);
            if (!user) {
                return null;
            }
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return null;
            }
            const payload = { id: user.id, email: user.email, name: user.name };
            return jwt.sign(payload, secretKey, { expiresIn: '1h' });
        } catch (error: any) {
            throw new Error(`Login error: ${error.message}`);
        }
    }

    public static async getAllUser(): Promise<User[]> {
        try {
            return await UserRepository.findAll();
        } catch (error: any) {
            throw new Error(`Error getting users: ${error.message}`);
        }
    }

    public static async getUserById(userId: number): Promise<User | null> {
        try {
            return await UserRepository.findById(userId);
        } catch (error: any) {
            throw new Error(`Error finding user: ${error.message}`);
        }
    }

    public static async getUserByName(name: string): Promise<User | null> {
        try {
            return await UserRepository.findByName(name);
        } catch (error: any) {
            throw new Error(`Error finding user by name: ${error.message}`);
        }
    }

    public static async addUser(user: User) {
        try {
            const salt = await bcrypt.genSalt(saltRounds);

            // Verifica que `user.password` no esté vacío antes de hacer el hash
            if (!user.password) {
                throw new Error('Password is required');
            }

            // Formatea fechas
            user.created_at = DateUtils.formatDate(new Date()); 
            user.updated_at = DateUtils.formatDate(new Date()); 

            // Genera el hash para la contraseña del usuario
            user.password = await bcrypt.hash(user.password, salt);

            const createdUser = await UserRepository.createUser(user);

            return { user: createdUser};
        } catch (error: any) {
            throw new Error(`Error creating user: ${error.message}`);
        }
    }

    public static async modifyUser(userId: number, userData: User) {
        try {
            const userFinded = await UserRepository.findById(userId);
            if (userFinded) {
                const salt = await bcrypt.genSalt(saltRounds);

                if (userData.name) {
                    userFinded.name = userData.name;
                }
                if (userData.password) {
                    userFinded.password = await bcrypt.hash(userData.password, salt);
                }
                if (userData.email) {
                    userFinded.email = userData.email;
                }
                if (userData.deleted !== undefined) {
                    userFinded.deleted = userData.deleted;
                }
                userFinded.updated_at = DateUtils.formatDate(new Date());

                return await UserRepository.updateUser(userId, userFinded);
            } else {
                return null;
            }
        } catch (error: any) {
            throw new Error(`Error modifying user: ${error.message}`);
        }
    }

    public static async deletedUser(userId: number): Promise<boolean> {
        try {
            return await UserRepository.deleteUser(userId);
        } catch (error: any) {
            throw new Error(`Error deleting user: ${error.message}`);
        }
    }

    public static async deleteUserLogic(userId: number): Promise<boolean> {
        try {
            return await UserRepository.deleteLogic(userId);
        } catch (error: any) {
            throw new Error(`Error logically deleting user: ${error.message}`);
        }
    }
}
