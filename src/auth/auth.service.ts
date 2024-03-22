import { SignInResponseUser, UserType } from "@models/user/user.entity";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { UsersModel } from "models/user/user";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

export class AuthService {
  constructor(private usersModel: UsersModel) {}

  async signup(email: string, password: string) {
    // See if email is in use
    const user = await this.usersModel.findByEmail(email);
    if (user) {
      throw new Error("El email ya esta en uso");
    }

    // Hash the users password
    // Generate a salt
    const salt = randomBytes(8).toString("hex");

    // Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Join the hashed result and the salt together
    const result = salt + "." + hash.toString("hex");

    // Create a new user and save it
    const newUser = await this.usersModel.create({
      username: email,
      password: result,
    });

    // return the user
    return newUser;
  }

  async signin(email: string, password: string) {
    const user = await this.usersModel.findByEmailforLogin(email);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    const [salt, storedHash] = user.password.split(".");

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString("hex")) {
      throw new Error("Error en Contraseña");
    }

    if (Object.values(UserType).includes(user.userType)) {
      return user as SignInResponseUser;
    } else {
      throw new Error("Tipo de usuario desconocido");
    }
  }
}
