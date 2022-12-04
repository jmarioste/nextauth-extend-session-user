import users from "data/users.json";
import { User } from "next-auth";

export interface IUserService {
  signInCredentials(email: string, password: string): Promise<User> | User;
}

export class InMemoryUserService implements IUserService {
  signInCredentials(email: string, password: string): User | Promise<User> {
    const user = users.find((user) => {
      const emailFound = email === user.email;
      const isPasswordCorrect = password === user.password;
      const userFound = emailFound && isPasswordCorrect;
      return userFound;
    }) as User;

    if (!user) {
      throw new Error("Invalid email or password");
    }

    return user;
  }
}
