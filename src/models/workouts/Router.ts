import express, { Router, Request, Response, NextFunction } from 'express';
import {Schema, model, Model, Document} from 'mongoose';

export class RouterWorkouts {
    ModelWorkouts:Model<Document,{}>;
    router:Router;
    constructor (ModelWorkouts:Model<Document,{}>) {
        this.router = express.Router();
        this.ModelWorkouts = ModelWorkouts;
        this.router.use(this.verifyUser);
        this.basicGetRequests();
        this.basicPostRequests();
    }
    public verifyUser = (req:Request,res:Response,next:NextFunction) => {
        console.log('------ verifying ---------');
        const body = req.body;
        console.log({body});
        next();
    }

    public basicPostRequests = () => {
        this.router.post('/addNew', async(req:Request,res:Response)=>{
            console.log('-------- /workouts/addNew ---------');
            const body = req.body;
            const {uniqueName,displayName,hybrid,bodyParts,movements,equipments,pics,vids,notes} = body;
            try {
                const newWorkout = await this.ModelWorkouts.create({
                    uniqueName,displayName,hybrid,bodyParts,movements,equipments,pics,vids,
                    notes: notes?notes:false
                });
                if(newWorkout){
                    res.send({ok:true,doc:newWorkout});
                }else res.send({ok:false});
            } catch (error) {
                console.log(error)
            }
        })
    }
    public basicGetRequests = () => {
        this.router.post('/getWorkouts', async(req:Request,res:Response)=>{
            const body:{
                bodyPart?:string,movement?:string,equipment?:string,
                count?:number
            } = req.body;
            try {
                if(body.bodyPart){
                    let key = 'bodyParts.'+body.bodyPart
                    const docsFound = await this.ModelWorkouts.find({
                        [key]:body.count?body.count:1
                    })
                    console.log({ docsFound })
                    res.status(200).send(docsFound);
                } else if(body.movement){
                    let key = 'bodyParts.'+body.movement
                    const docsFound = await this.ModelWorkouts.find({
                        [key]:body.movement?body.movement:1
                    })
                    console.log({ docsFound })
                    res.status(200).send(docsFound);
                } else if(body.equipment){
                    let key = 'bodyParts.'+body.movement
                    const docsFound = await this.ModelWorkouts.find({
                        [key]:body.equipment?body.equipment:1
                    })
                    console.log({ docsFound })
                    res.status(200).send(docsFound);
                }
            } catch (error) {
                console.log(error)
            }
        })
    }
}