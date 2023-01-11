import mongoose from "mongoose";

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

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Add a static method to the model to check type
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("users", userSchema);

export { User };
