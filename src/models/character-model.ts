import { Document, Mongoose, Model, Schema } from "mongoose";
import ServiceContainer from "../services/service-container";
import Attributes from "./model";
import mongooseToJson from '@meanie/mongoose-to-json';
import { EpisodeInstance } from "./episode-model";
import { CommentInstance } from "./coment-model";

/**
 * Character attributes.
 **/
export interface CharacterAttributes extends Attributes {
  externalId: number;
  episodes: EpisodeInstance[];
  replicas: ReplicaAttributes[];
  comments: CommentInstance[];
}

/*
 * Replica attributes.
 */
export interface ReplicaAttributes extends Attributes {
  content: string;
  character: CharacterInstance;
  episode: EpisodeInstance;
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
      type: Schema.Types.ObjectId,
      ref: 'Episode',
      default: []
    }],
    replicas: [{
      type: createReplicaSchema(),
      default: []
    }],
    comments: {
      type: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
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

function createReplicaSchema() {
  const schema = new Schema({
    content: {
      type: Schema.Types.String,
      required: [true, 'Content is required']
    },
    character: {
      type: Schema.Types.ObjectId,
      ref: 'Character'
    },
    episode: {
      type: Schema.Types.ObjectId,
      ref: 'Episode'
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
