import mongoose from 'mongoose';
const ObjectId = mongoose.Schema.Types.ObjectId;

// what it takes to cerate a user
interface EmailAttrs {
  email: string;
  user: string;
  isEmailValidated: boolean;
  codePassword: string;
  expirationCodePassword: Date; // 15 min delay => used to reinitialize password after forgetting it
  expirationValidLink: Date; // 1 hour delay =>  Date when the link expired to validate your email
}

export interface EmailDoc extends mongoose.Document {
  email: string;
  user: string;
  isEmailValidated: boolean;
  codePassword: string;
  expirationCodePassword: Date;
  expirationValidLink: Date;
}

interface EmailModel extends mongoose.Model<EmailDoc> {
  build(attrs: EmailAttrs): EmailDoc;
}

mongoose.set('strictQuery', false);
const emailSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: 'users',
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    isEmailValidated: {
      type: Boolean,
      required: true,
      default: false,
    },
    codePassword: {
      type: String,
      required: false,
    },
    expirationCodePassword: {
      type: Date,
      required: false,
    },
    expirationValidLink: {
      type: Date,
      required: false,
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
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

// Add a static method to the model to check type
emailSchema.statics.build = (attrs: EmailAttrs) => {
  return new Email(attrs);
};

const Email = mongoose.model<EmailDoc, EmailModel>('email', emailSchema);

export { Email };
