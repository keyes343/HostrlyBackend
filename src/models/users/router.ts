import express, { Router, Request, Response, NextFunction } from 'express';
import mongoose, {Schema, model, Model, Document} from 'mongoose';
import cors from 'cors';
import { error } from 'console';


export class UserRouter {
    public router:Router;
    public User: Model<mongoose.Document, {}>;
    
    constructor(User:Model<Document, {}>){
        this.router = express.Router();
        // this.router.use(cors({
        //     "origin": "*",
        //     "methods": ["GET","HEAD","PUT","PATCH","POST","DELETE"],
        //     "preflightContinue": false,
        //     "optionsSuccessStatus": 204
        // }))

        // this.router.use((req:Request,res:Response,next:NextFunction)=>{
        //     res.header('Access-Control-Allow-Origin',"*");
        //     res.header('Access-Control-Allow-Headers',"*");
        //     if(req.method === 'OPTIONS'){
        //         res.header('Access-Control-Allow-Methods',"GET,PUT,POST,DELETE,PATCH");
        //         return res.status(200).json({})
        //     }
        //     next();
        // })
        
        this.User = User;
        this.editUser();
        this.addUser();
        this.basicgetRequests();
    }

    public consoling =()=> {
        console.log('User Users>router.js =  ', this.User);
    }
    public editUser = () => {
        this.router.post('/editUser', async(req:Request, res:Response)=>{
            const body = req.body;
            try {
                const foundDoc = await this.User.findOne({googleId:body.googleId});
                if(foundDoc){
                    // do something with this user data, edit and save it in database
                }
            } catch (error) {
                res.send({error})
            }
        })
        this.router.post('/updateAddress', async(req:Request,res:Response)=>{
            const body:{
                googleId:string,email:string,address:{
                    pin:string,ph:string,locality:string,area:string,city:string,state:string, building:string, landmark:string,extraInfo:string
                }
            } = req.body;
            const {googleId,email,address} = body
            // console.log({address})
            try {
                const userDoc:any = await this.User.findOne({googleId,email}).lean();
                if(userDoc){
                    const newDoc = await this.User.findOneAndUpdate({googleId,email},{address}, {new:true} );
                    // console.log({newDoc});
                    if(newDoc){
                        res.send({
                            txt:'ok',doc:newDoc
                        })
                    }else res.send({txt:'address cudnt be updated, dunno y'})
                }else res.send({txt:'user doesnt exist, this cant be possible'})
            } catch (error) {
                console.log(error)
            }
        })
        this.router.post('/getAddress', async(req:Request,res:Response)=>{
            const body:{ googleId:string,email:string } = req.body;
            const {googleId,email} = body
            // console.log({googleId,email})
            try {
                const userDoc:any = await this.User.findOne({googleId,email}).lean();
                if(userDoc && userDoc.address){
                    res.send({
                        txt:'ok',doc:userDoc.address
                    })
                    console.log('sent')
                }else {
                    res.send({txt:'user doesnt exist, this cant be possible',doc:false});
                    console.log('address doesnt exist it seems')
                }
            } catch (error) {
                console.log(error)
            }
        })
    }
    public addUser = () => {
        this.router.post('/addUser', async(req:Request, res:Response)=>{
            const body = req.body;
            // console.log({body})
            const { googleId, googleName, email } = body;
            if(email){
                try {
                    await this.User.create({
                        googleId, googleName, email
                    }, (err:any,doc:any)=>{
                        if(err){
                            res.send({erroris:err, status:'failed, see error'});
                            return;
                        }else {
                            res.send({
                                userdoc:doc,
                                docCreated:true
                            });
                            return;
                        }
                    });
                    // const user = await add_user.save();
                } catch (error) {
                    console.log({error})
                }
            }else {
                res.send('UserName on Req.Body is empty')
            }
        })
    }
    public basicgetRequests = () => {
        this.router.post('/acknowledgeUser', async(req:Request, res:Response,next:NextFunction)=>{
            const body = req.body;
            // confirmed variables
            const {googleId,email} = body;
            // below vars may/may not exits
            const {userName,lastName,firstName,profilePic} = body;
            
            try {
                if(googleId){
                    const user = await this.User.findOne({ googleId }).lean()
                    if(user){
                        console.log(' --- user exists ---- ')
                        next()
                        res.send(user);
                    }else{
                        this.User.create({...body},(err:any,newUser:any)=>{
                            if(newUser){
                                console.log(' ---- new user created ---- ')
                                next();
                                res.send(newUser);
                            }else {
                                next();
                                res.send(err);
                            }
                            console.log(err);
                        })
                    }
                }else{
                    res.send('googleId doesnt seem to be have been received in incoming payload')
                }
            } catch (error) {
                console.log({error})
            }
        } )
        this.router.post('/getNavHistory', async(req:Request, res: Response) => {
            const body = req.body;
            const {googleId,email} = body;
            try {
                const docFound:any = this.User.findOne({googleId,email},{_id:0,__v:0}).lean();
                if(docFound){
                    const {navHistory} = docFound;
                    if(navHistory){
                        // console.log('navHistory found and sending back to frondend')
                        res.send(navHistory);
                    }else{
                        // console.log('inserting navHistory which didnt exist earlier')
                        await this.User.findOneAndUpdate({googleId,email},{navHistory: {path:'/',displayName:'Home'} },
                        (err:any,doc:any)=>{
                            if(err) res.send({err});
                            else if (doc) res.send({txt:'all ok',doc});
                        })
                    }
                }else res.send('user profile not found');
            } catch (error) {
                console.log(error)
            }
        })
    }
    public basicPostRequests = () => {
        this.router.post('/editNavHistory', async(req:Request, res: Response) => {
            const body = req.body;
            const {googleId,email,insertComponentName} = body;
            try {
                const docFound:any = this.User.findOne({googleId,email},{_id:0,__v:0}).lean();
                if(docFound){
                    const navHistory:string[] = docFound.navHistory;
                    navHistory.push(insertComponentName);
                    await this.User.findOneAndUpdate({googleId,email},{navHistory},(err:any,doc:any)=>{
                        if(err) res.send({err});
                        else if (doc) res.send({txt:'all ok',doc});
                    })
                }
            } catch (error) {
                console.log(error)
            }
        })
    }
    
}