import { Document, Model, Mongoose, Schema } from "mongoose";
import ServiceContainer from "../services/service-container";
import Attributes, { CommentAttributes, createCommentSchema } from "./model";
import mongooseToJson from '@meanie/mongoose-to-json';

/*
 * Theory attributes.
 */
export interface TheoryAttributes extends Attributes {
  title: string;
  content: string;
  comments: CommentAttributes[];
}

/*
 * Theory instance.
 */
export interface TheoryInstance extends TheoryAttributes, Document { }

/**
 * Creates the theory model.
 * 
 * @param container Services container
 * @param mongoose Mongoose instance
 */
export default function createModel(container: ServiceContainer, mongoose: Mongoose): Model<TheoryInstance> {
  return mongoose.model<TheoryInstance>('Theory', createTheorySchema(container), 'theories');
}

/**
 * Creates the theory schema.
 * 
 * @param container Services container
 * @returns Theory schema
 */
function createTheorySchema(container: ServiceContainer) {
  const schema = new Schema<TheoryInstance>({
    title: {
      type: Schema.Types.String,
      required: [true, 'Title is required']
    },
    content: {
      type: Schema.Types.String,
      required: [true, 'Content is required']
    },
    comments: {
      type: [{
        type: createCommentSchema()
      }],
      default: []
    }
  },
    {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true }
    });

  schema.plugin(mongooseToJson)

  return schema;
}