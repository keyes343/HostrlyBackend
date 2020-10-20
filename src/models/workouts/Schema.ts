import { Schema } from 'mongoose';

export const SchemaWorkouts = new Schema({
    uniqueName: {type:String,required:true},
    displayName: {type:String,required:true},
    hybrid: {type:Boolean,required:true,default:false},
    pics:{type:Array,required:true,default:[]},
    vids:{type:Array,required:true,default:[]},
    notes:{type:Schema.Types.Mixed, required:true,default:false},
    bodyParts: {type: {
        chest: {type:Number,required:true,default:0},
        biceps: {type:Number,required:true,default:0},
        triceps: {type:Number,required:true,default:0},
        deltoids: {type:Number,required:true,default:0},
        traps: {type:Number,required:true,default:0},
        lats: {type:Number,required:true,default:0},
        abs: {type:Number,required:true,default:0},
        hams: {type:Number,required:true,default:0},
        quads: {type:Number,required:true,default:0},
    } ,required:true, default:{
        chest: 0, biceps: 0, triceps: 0, deltoids: 0, traps: 0, lats: 0, hams: 0, quads: 0
    }},

    movements: {type:{
        pull: {type:Number,required:true,default:0},
        push: {type:Number,required:true,default:0},
        suspend: {type:Number,required:true,default:0},
        raise: {type:Number,required:true,default:0},
        curl: {type:Number,required:true,default:0},
        grip: {type:Number,required:true,default:0},
        plank: {type:Number,required:true,default:0},
    }, required:true, default:{
        pull:0, push:0, suspension:0, raises:0, curls:0, grip:0, plank:0
    }},

    equipments: { type:{
        dumbbell: {type:Number,required:true,default:0},
        barbell: {type:Number,required:true,default:0},
        cable: {type:Number,required:true,default:0},
        body: {type:Number,required:true,default:0},
    },required:true,default:{
        dumbbell:0,barbell:0,cable:0,body:0
    }}
})