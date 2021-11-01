import { Schema } from 'mongoose';
import mongooseToJson from '@meanie/mongoose-to-json';
import { UserInstance } from './user-model';

/**
 * Base model attributes.
 */
export default interface Attributes {
  createdAt?: Date;
  updatedAt?: Date;
}

/*
 * Comment attributes.
 */
export interface CommentAttributes extends Partial<Document> {
  content: string;
  author: UserInstance;
  parent: CommentAttributes;
}

/**
 * Adds the "expiration" attribute to delete models after the time has elapsed.
 * 
 * This function is a mongoose plugin.
 * 
 * @param schema Schema to apply the plugin
 * @param options Plugin options
 */
export function expirePlugin(schema: Schema, options: { expires: number }): void {
  schema.add({
    expiration: {
      type: Schema.Types.Date,
      default: new Date(),
      expires: options.expires
    }
  });
}

/**
 * Creates the comment schema.
 * 
 * @param container Services container
 * @returns Comment schema
 */
export function createCommentSchema() {
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
