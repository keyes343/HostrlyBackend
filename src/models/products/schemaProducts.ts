import { Schema } from 'mongoose';

export const SchemaProducts = new Schema({
    uniqueName: { type: String, required: true }, // eg - ubon
    displayName: { type: String, required: true, default:'testing' },
    price: { type: Number, required: true, default: 0 }, 
    details: { type: Schema.Types.Mixed, required: true, default:{Brand:'Unknown'} },
    description: { type: Array, required:true, default:['test'] },
    face: {type:Array, required:true, default:['test'] },
    cover: {type:Array, required:true, default:['test'] },
    category: {type:String, required:true }
})