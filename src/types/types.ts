import {categoryFood as food} from './enums';

export type menu = {
    root:boolean,
    date:Date,dateNow:number,
    googleId:string,email:string,
    foodItems: {
        [foodItem:string]:boolean
    }
}

