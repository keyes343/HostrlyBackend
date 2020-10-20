import { Schema } from 'mongoose';

export const SchemaDate = new Schema({
    textInput:{type:String,required:true},
    line0:{type:String,required:true,default:'custom'}, // line 1 stuff goes here
    line1:{type:String,required:true,default:'reminder'},
    line2:{type:String,required:true,default:'add'},
    date: {type:Number,required:true,default:0},
    urgent: {type:Boolean,required:true,default:0},
    important: {type:Boolean,required:true,default:0},

    googleId: {type:String,required:false},
    email: {type:String,required:false},
})