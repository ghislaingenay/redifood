import mongoose from 'mongoose';
import { PasswordManager } from '../../src/auth/password-manager';

// what it takes to cerate a user
interface UserAttrs {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface IUserData extends UserAttrs {
  id: string;
}

// interface that describes the properties the user document has
export interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

mongoose.set('strictQuery', false);
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
  },
  //   validate: {
  //     validator: function(v) {
  //       return /\d{3}-\d{3}-\d{4}/.test(v);
  //     },
  //     message: props => `${props.value} is not a valid phone number!`
  //   },
  //   required: [true, 'User phone number required']
  // }
  {
    timestamps: true, // add createdAt and updatedAt
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

userSchema.pre('save', async function (done) {
  // hash the password if it is has been modified
  if (this.isModified('password')) {
    const hashed = await PasswordManager.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

// Add a static method to the model to check type
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('users', userSchema);

export { User };
