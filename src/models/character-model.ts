import { Document, Mongoose, Model, Schema } from "mongoose";
import ServiceContainer from "../services/service-container";
import Attributes, { CommentAttributes, createCommentSchema } from "./model";
import mongooseToJson from '@meanie/mongoose-to-json';

/*
 * Character attributes.
 */
export interface CharacterAttributes extends Attributes {
    externalId: number;
    episodes: EpisodesInstance[];
}

/*
 * Character instance.
 */
export interface CharacterInstance extends CharacterAttributes, Document { }

/**
 * Creates the character model.
 * 
 * @param container Services container
 * @param mongoose Mongoose instance
 */
export default function createModel(container: ServiceContainer, mongoose: Mongoose): Model<CharacterInstance> {
    return mongoose.model<CharacterInstance>('Character', createCharacterSchema(container), 'characters');
}

/**
* Creates the character schema.
* 
* @param container Services container
* @returns Character schema
*/
function createCharacterSchema(container: ServiceContainer) {
    const schema = new Schema<CharacterInstance>({
        externalId: {
            types: Schema.Types.Number,
            required: [true, 'External ID is required']
        },
        episodes: [{
            type: createEpisodeSchema(),
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
