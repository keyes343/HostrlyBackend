import { Schema } from 'mongoose';
import {t} from './incoming'

export const Address = new Schema({
    pincode:{type:Number,required:true},
    area:{type:String,required:true},
    state:{type:String,required:true},
    city:{type:String,required:true},
    subDivision:{type:String,required:true},
    street:{type:String,required:true},
    landmard:{type:String,required:true},
    building:{type:String,require:true},
    extraInfo:{type:String,required:true}
})
