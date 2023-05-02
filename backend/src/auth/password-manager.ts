import * as bcrypt from 'bcrypt';
// import { randomBytes } from "crypto";

export class PasswordManager {
  static async toHash(password: string) {
    // const salt = randomBytes(8).toString("hex");
    return bcrypt.hashSync(password, 10);
  }

  static async compare(
    storedpassword: string,
    suppliedPassword: string,
  ): Promise<boolean> {
    // const [hashedPassword, salt] = storedpassword.split(".");
    const result: boolean = await bcrypt.compare(
      suppliedPassword,
      storedpassword,
    );
    return result;
  }
}
