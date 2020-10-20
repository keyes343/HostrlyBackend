import { Schema } from 'mongoose';
import { User_type } from './types'
import { Address } from './subSchemas'

export const userSchema = new Schema<User_type>({
    googleId: { type:String, required:true, default:'' },
    username: { type:String, required:true, default:'' },
    firstName: { type:String, required:true, default:'' },
    lastName: { type:String, required:true, default:'' },
    email: { type:String, required:true, default:'' },
    profilePic: { type:String, required:true, default:'' },
    address: {type:{
        pincode:{type:Number,required:true},
        area:{type:String,required:true},
        state:{type:String,required:true},
        city:{type:String,required:true},
        subDivision:{type:String,required:true},
        street:{type:String,required:true},
        landmard:{type:String,required:true},
        building:{type:String,require:true},
        extraInfo:{type:String,required:true}
    }, required:false}
    // accessToken: { type:String, required:true, default:'blank' },
    // tokenId: { type:String, required:true, default:'blank' },
});