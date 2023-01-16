import mongoose from "mongoose";
import { PasswordManager } from "../services/password-manager";

// what it takes to cerate a user
interface UserAttrs {
  username: string;
  password: string;
}

// interface that describes the properties the user document has
interface UserDoc extends mongoose.Document {
  username: string;
  password: string;
  // Add mongoose to add properties for us here
}

// Interface that describes the properties that a User Model has
// Tell the interface that it's going to be a build fn
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

mongoose.set("strictQuery", false);
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transform(doc: mongoose.Document, ret: any) {
        // Make direct changes to the JSON OBJECT
        delete ret.password;
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

// Not possible to add ES6 syntax, otherwise it will be overwritten (context of the file)
// before we save the user, we want to hash the password
userSchema.pre("save", async function (done) {
  // hash the password if it is has been modified
  if (this.isModified("password")) {
    const hashed = await PasswordManager.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

// Add a static method to the model to check type
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("users", userSchema);

export { User };
