import express, { Router, Request, Response, NextFunction } from 'express';
import {Schema, model, Model, Document} from 'mongoose';

export class RouterDate {
    router:Router
    ModelDate: Model<Document,{}>
    constructor(ModelDate:Model<Document,{}>){
        this.router = express.Router();
        this.ModelDate = ModelDate;
        this.router.use('/reminder/add',(req:Request,res:Response,next:NextFunction)=>{
            console.log('----- body -------')
            console.log(req.body);
            next();
        })
        this.basicGetRequests();

    }
    public basicGetRequests = () => {
        this.router.post('/reminder/add', async(req:Request,res:Response) => {
            console.log('------- /reminder/add -------')
            const body:{
                email:string,googleId:number,
                date:number, textPayload:string,
                line0:string,line1:string,line2:string,
                urgent:boolean,important:boolean
            } = req.body;
            const {date,textPayload,line0,line1,line2,urgent,important,googleId,email} = body;
            try {
                const freshDoc = await this.ModelDate.create({
                    date,
                    textInput:textPayload,
                    line0,line1,line2,urgent,important,
                });
                // googleId,email
                console.log({freshDoc})
                if(freshDoc){
                    res.send({
                        ok:true,doc:freshDoc
                    })
                }else res.send({ok:false,doc:body})
            } catch (error) {
                console.log(error)
            }
        })
    }
}