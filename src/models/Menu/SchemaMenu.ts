import {Schema} from 'mongoose';

export const SchemaMenu = new Schema({
    root: {type:Boolean,required:true,default:false},
    email:{type:String,required:true,default:''},
    googleId:{type:String,required:true,default:''},
    date:{type:Date,required:true,default:new Date()},
    dateNum:{type:Number,required:true,default:Date.now()},
    foodItems:{type:Schema.Types.Mixed,required:true,default:{}},

    userIs: {type:String,required:true,default:'Owner'},
    foodEvent: {type:String,required:true,default:'all'},

})