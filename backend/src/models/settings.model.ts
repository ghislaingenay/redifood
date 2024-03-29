import mongoose from 'mongoose';
import { ECurrency, ELanguage } from '../../redifood-module/src/interfaces';
import { UserDoc } from './users.model';
const ObjectId = mongoose.Schema.Types.ObjectId;

export interface SettingsAttrs {
  user: UserDoc | string;
  haveFoodImage: boolean;
  vat: number;
  currency: ECurrency;
  language: ELanguage;
}

export interface SettingsDoc extends mongoose.Document {
  user: UserDoc;
  haveFoodImage: boolean;
  vat: number;
  currency: ECurrency;
  language: ELanguage;
}

interface SettingsModel extends mongoose.Model<SettingsDoc> {
  build(attrs: SettingsAttrs): SettingsDoc;
}

mongoose.set('strictQuery', false);
const settingsSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: 'users',
      required: true,
      unique: true,
    },
    haveFoodImage: {
      type: Boolean,
      required: true,
    },
    vat: {
      type: Number,
      required: true,
      default: 7,
    },
    currency: {
      type: String,
      enum: Object.values(ECurrency),
      required: true,
      default: ECurrency.USD,
    },
    language: {
      type: String,
      enum: Object.values(ELanguage),
      required: true,
      default: ELanguage.ENGLISH,
    },
  },
  {
    toJSON: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transform(doc: mongoose.Document, ret: any) {
        // Make direct changes to the JSON OBJECT
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

// Add a static method to the model to check type
settingsSchema.statics.build = (attrs: SettingsAttrs) => {
  return new Setting(attrs);
};

const Setting = mongoose.model<SettingsDoc, SettingsModel>(
  'settings',
  settingsSchema,
);

export { Setting };
