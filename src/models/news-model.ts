import { Document, Mongoose, Model, Schema } from "mongoose";
import ServiceContainer from "../services/service-container";
import Attributes, { CommentAttributes, createCommentSchema } from "./model";
import mongooseToJson from '@meanie/mongoose-to-json';

/*
 * News attributes.
 */
export interface NewsAttributes extends Attributes {
    title: string;
    content: string;
    comments: CommentAttributes[];
}

/*
 * News instance.
 */
export interface NewsInstance extends NewsAttributes, Document { }

/**
 * Creates the news model.
 * 
 * @param container Services container
 * @param mongoose Mongoose instance
 */
export default function createModel(container: ServiceContainer, mongoose: Mongoose): Model<NewsInstance> {
    return mongoose.model<NewsInstance>('News', createNewsSchema(container), 'News');
}

/**
* Creates the news schema.
* 
* @param container Services container
* @returns News schema
*/
function createNewsSchema(container: ServiceContainer) {
    const schema = new Schema<NewsInstance>({
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
