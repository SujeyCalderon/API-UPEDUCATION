import { ResultSetHeader } from "mysql2";
import connection from "../../shared/config/database";
import { User } from "../models/User";

export class UserRepository {

    public static async findAll(): Promise<User[]> {
        const query = "SELECT * FROM user WHERE deleted = 0";
        return new Promise((resolve, reject) => {
            connection.query(query, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    const users: User[] = results as User[];
                    resolve(users);
                }
            });
        });
    }
    
    public static async findById(id: number): Promise<User | null> {
        const query = "SELECT * FROM user WHERE id = ? AND deleted = 0";
        return new Promise((resolve, reject) => {
            connection.query(query, [id], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    const users: User[] = results as User[];
                    if (users.length > 0) {
                        resolve(users[0]);
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }
    
    
    public static async findByName(name: string): Promise<User | null> {
        return new Promise((resolve, reject) => {
          connection.query('SELECT * FROM user WHERE name= ?', [name], (error: any, results) => {
            if (error) {
              reject(error);
            } else {
              const employees: User[] = results as User[];
              if (employees.length > 0) {
                resolve(employees[0]);
              } else {
                resolve(null);
              }
            }
          });
        });
      }

    public static async createUser(user: User): Promise<User> {
        const { name, email, password, created_by, updated_at, updated_by, deleted } = user;
        const query = `INSERT INTO user (name, email, password, created_by, updated_at, updated_by, deleted) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const values = [name, email, password, created_by, updated_at, updated_by, deleted ? 1 : 0];

        return new Promise((resolve, reject) => {
            connection.query(query, values, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    const createUserId = (result as any).insertId;
                    const createdUser: User = { ...user, id: createUserId };
                    resolve(createdUser);
                }
            });
        });
    }
    
    public static async updateUser(userId: number, userData: User): Promise<User | null> {
        const { name, email, updated_at, updated_by, deleted } = userData;
        const query = `UPDATE user SET name = ?, email = ?, updated_at = ?, updated_by = ?, deleted = ? WHERE id = ?`;
        const values = [name, email, updated_at, updated_by, deleted ? 1 : 0, userId];

        return new Promise((resolve, reject) => {
            connection.query(query, values, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    if ((result as any).affectedRows > 0) {
                        resolve({ ...userData, id: userId });
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }

    public static async deleteUser(id: number): Promise<boolean> {
        const query = 'DELETE FROM user WHERE id = ?';
        return new Promise((resolve, reject) => {
            connection.query(query, [id], (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    if ((result as ResultSetHeader).affectedRows > 0) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
            });
        });
    }

    public static async deleteLogic(id: number): Promise<boolean> {
        const query = 'UPDATE user SET deleted = 1 WHERE id = ?';
        return new Promise((resolve, reject) => {
            connection.query(query, [id], (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    if ((result as ResultSetHeader).affectedRows > 0) {
                        resolve(true);
                    } else {
                        resolve(false); 
                    }
                }
            });
        });
    }
}
