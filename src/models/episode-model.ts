import { Document, Mongoose, Model, Schema } from "mongoose";
import ServiceContainer from "../services/service-container";
import Attributes from "./model";
import mongooseToJson from '@meanie/mongoose-to-json';
import { CharacterInstance } from "./character-model";
import { CommentInstance } from "./coment-model";

/*
 * Episode attributes.
 */
export interface EpisodeAttributes extends Attributes {
    externalId: number;
    characters: CharacterInstance[];
    comments: CommentInstance[];
}

/*
 * Episode instance.
 */
export interface EpisodeInstance extends EpisodeAttributes, Document { }

/**
 * Creates the Episode model.
 * 
 * @param container Services container
 * @param mongoose Mongoose instance
 */
export default function createModel(container: ServiceContainer, mongoose: Mongoose): Model<EpisodeInstance> {
    return mongoose.model<EpisodeInstance>('Episode', createEpisodeSchema(container), 'Episodes');
}

/**
* Creates the Episode schema.
* 
* @param container Services container
* @returns Episode schema
*/
function createEpisodeSchema(container: ServiceContainer) {
    const schema = new Schema<EpisodeInstance>({
        externalId: {
            types: Schema.Types.Number,
            required: [true, 'External ID is required']
        },
        characters: [{
            type: Schema.Types.ObjectId,
            default: []
        }]
    },
        {
            timestamps: true,
            toJSON: { virtuals: true },
            toObject: { virtuals: true }
        });

    schema.plugin(mongooseToJson)

    return schema;
}
