import {Schema} from 'mongoose';

export const SchemaMenu = new Schema({
    date:{type:Date,required:true,default:new Date()},
    Rice:{type:[String],required:true,default:[]},
    Dal:{type:[String],required:true,default:[]},
    Sabji:{type:[String],required:true,default:[]},
    Fruits:{type:[String],required:true,default:[]},
    Others:{type:[String],required:true,defaut:[]},
})