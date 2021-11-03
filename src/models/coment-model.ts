import { Document, Model, Mongoose, Schema } from "mongoose";
import ServiceContainer from "../services/service-container";
import { UserInstance } from "./user-model";
import { mongooseToJson } from "@meanie/mongoose-to-json";
import Attributes from "./model";

/*
 * Comment attributes.
 */
export interface CommentAttributes extends Attributes {
  content: string;
  author: UserInstance;
  parent: CommentAttributes;
}

/*
* Comment instance.
*/
export interface CommentInstance extends CommentAttributes, Document { }

/**
 * Creates the comment model.
 * 
 * @param container Services container
 * @param mongoose Mongoose instance
 */
export default function createModel(container: ServiceContainer, mongoose: Mongoose): Model<CommentInstance> {
  return mongoose.model<CommentInstance>('Comment', createCommentSchema(container), 'comments');
}
/**
 * Creates the comment schema.
 * 
 * @param container Services container
 * @returns Comment schema
 */
export function createCommentSchema(container: ServiceContainer) {
  const schema = new Schema({
    content: {
      type: Schema.Types.String,
      required: [true, 'Content is required']
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required']
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      default: null
    }
  }, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  });

  schema.plugin(mongooseToJson)

  return schema;
}
