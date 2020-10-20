import express, {Router,Response,Request,NextFunction} from 'express';
import {Schema,model,Model,Document} from 'mongoose';
import {e,t} from '../index';

export class RouterMenu {
    router:Router
    ModelMenu:Model<Document,{}>
    constructor(ModelMenu:Model<Document,{}>){
        this.router = express.Router();
        this.ModelMenu = ModelMenu;
    }

    public outgoing = () => {
        this.router.post('/getMenu', async(req:Request,res:Response)=>{
            const body:{date:Date} = req.body;
            const {date} = body;
            try {
                const gotMenu:any = await this.ModelMenu.find({date}).lean();
                if(gotMenu){
                    res.status(200).send({gotMenu})
                }else res.status(404).send();
            } catch (error) {
                console.log({error})
            }
        })
    }
    public incoming = () => {
        this.router.post('/addMenu', async(req:Request,res:Response)=>{
            const body:{menu:t.menu} = req.body;
            const {menu} = body;
            try {
                const newMenu = await this.ModelMenu.create({menu});
                if(newMenu){
                    res.status(201).send(newMenu);
                }else res.status(400).send();
            } catch (error) {
                console.log({error})
            }
        })
    }
}