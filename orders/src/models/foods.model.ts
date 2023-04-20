import mongoose from 'mongoose';
import { IFoodOrder, INameId } from '../../redifood-module/src/interfaces';

type FoodsAttrs = IFoodOrder;

interface FoodsDoc extends mongoose.Document {
  id?: number;
  itemName: string;
  itemPhoto: string;
  itemPrice: number;
  section: INameId;
  extra: INameId;
  item_quantity: number;
}

interface FoodsModel extends mongoose.Model<FoodsDoc> {
  build(attrs: FoodsAttrs): FoodsDoc;
}

mongoose.set('strictQuery', false);
const foodsSchema = new mongoose.Schema(
  {
    itemPhoto: {
      type: String,
      required: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    itemQuantity: {
      type: Number,
      required: true,
    },
    itemPrice: {
      type: Number,
      required: true,
    },
    section: {
      type: { name: String, id: Number },
      required: true,
    },
    extra: {
      type: { name: String, id: Number },
      required: true,
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
foodsSchema.statics.build = (attrs: FoodsAttrs) => {
  return new Food(attrs);
};

const Food = mongoose.model<FoodsDoc, FoodsModel>('foods', foodsSchema);

export { Food };
