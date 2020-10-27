import express, { Router, Request, Response, NextFunction } from 'express';
import mongoose, {Schema, model, Model, Document} from 'mongoose';
import app from './index';
// import { passport } from './passport'; // "./" is needed as passport is being called from a ts file, not the npm module.
import { addUser, User_type } from './models/';

import { MongooseDatabase } from './mongoose';

class ExpressRouter{
    // MAIN ROUTER FOR THIS ENTIRE APP
    router: Router;
    addUser: any;
    MongooseInstance: MongooseDatabase; db: any;
    // Sub-Routers
    UserRouter: Router;
    // RouterProducts: Router;
    RouterDate: Router;
    RouterWorkouts: Router;
    RouterMenu: Router;
    // Models
    User: Model<Document, User_type>;


    constructor(){
        this.router = express.Router();
        this.MongooseInstance = new MongooseDatabase(); // initializing Main-Mongoose class
        this.db = this.MongooseInstance.db;

        // USER MODEL & ROUTER
        this.User = this.MongooseInstance.User;
        this.UserRouter = this.MongooseInstance.UserRouter // extracting the 'router' object from class
        
        // this.RouterProducts = this.MongooseInstance.RouterProducts_extractedRoutes; // extracting route
        this.RouterDate = this.MongooseInstance.RouterDate_extractedRoutes;
        this.RouterWorkouts = this.MongooseInstance.RouterWorkouts_extractedRoutes;
        this.RouterMenu = this.MongooseInstance.RouterMenu_extractedRoutes;
        

        this.router.use('/users', this.UserRouter); // assigning path for router extension
        // this.router.use('/products', this.RouterProducts);
        // this.router.use('/custom', this.RouterDate);
        // this.router.use('/workouts', this.RouterWorkouts);
        this.router.use('/menu',this.RouterMenu);
        this.routes(); // invoking the Main Route
    }

    public routes =()=> {

        this.router.post('/name',(req:Request, res:Response)=>{
            res.send({
                name:'John343',
            })
        });
        this.router.post('/ppost',async(req:Request, res:Response)=>{
            console.log('aaa =', this.User )
            try {
                const a = await this.User.findOne({name:'affa'});
                res.send(a)
            } catch (error) {
                console.log(error);
            }
        });
        this.router.get('/logout', (req:Request,res:Response) => {
            // req.logout();
            res.redirect('/');
        })
        this.router.post('/addUser', async(req:Request, res:Response) => {
            // let a:any;
            // try {
            //     a = await this.addUser ( req, res );
            // } catch (error) {
                
            // }
            // const b = { test2:'test done'}
            // res.status(200).send({text:'addUser route'});
            
            let triggered: string = 'not touched'
            let return_user:any = {
                googleName: 'not_initialized',
                age: 0
            };
            let errorr:any = 'touched but not created';
            try {
                triggered = '1st step';
                
                await this.User.create({
                    googleName:'jeeeeet',
                    age: 20,
                }, (err:any,doc:any)=>{
                    if(err){
                        errorr = err;
                        triggered = 'err happened';
                    }else {
                        return_user.username = 'success';
                        return_user.age = 100;
                        triggered = 'success triggered';
                    }
                });
                // const user = await add_user.save();
            } catch (error) {
                errorr = error
            };
            res.status(200).send({
                return_user,
                errorr,
                triggered
            });
        })
    }
}
const InitializeExpressRouter = new ExpressRouter(); // initializing the main class inside this file
export const router = InitializeExpressRouter.router; // this will be used by the main express app for routing
export const User = InitializeExpressRouter.User;
// export const UserRouter = InitializeExpressRouter.UserRouter;
