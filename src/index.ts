import { CookieSession } from './cookieSession'; // not from the node module, but from another ts file
import express, {Application,Request,Response,NextFunction, Router} from 'express';
import cors from 'cors';
import { router } from './router';
// import { passport } from './passport';

// import { User } from './router';


class App {
    public app: Application;
    constructor(){
        this.app = express();
        this.app.options('*',cors());
        this.app.use(cors());
        this.setConfig();
    }

    private setConfig() {
        // const corsOptions = {
        //     origin:'http://localhost:3000',
        //     optionSuccessStatus:200
        // }
        // Allows us to receive requests with data in json format
        
        this.app.use(express.json({limit: '50mb'}));
        // Allows us to receive requests with data in x-www-form-urlencoded format
        this.app.use(express.urlencoded({ limit: '50mb', extended:true}));
        // "origin": "*",
        // "methods": ["GET","HEAD","PUT","PATCH","POST","DELETE"],
        // "preflightContinue": false,
        // "optionsSuccessStatus": 204
        
        this.app.use('/', router);
        // this.app.options('/',(req:Request,res:Response,next:NextFunction)=>{
        //     res.setHeader('Access-Control-Allow-Origin',"*");
        //     res.setHeader('Access-Control-Allow-Headers',"Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token");
        //     if(req.method === 'OPTIONS'){
        //         console.log('-------- yes options exist -------')
        //         // res.header('Access-Control-Allow-Methods','');
        //         res.setHeader('Access-Control-Allow-Methods',"GET,PUT,POST,DELETE,PATCH");
        //         return res.status(200).json({})
        //     }
        //     next();
        // })

        // this.app.use(new CookieSession().cookie);
        // this.app.use(passport.initialize());
        // this.app.use(passport.session());
    }
}

export default new App().app;
// tutorial for typescript with node and express
// https://dev.to/nyagarcia/pokeapi-rest-in-nodejs-with-express-typescript-mongodb-and-docker-part-1-5f8g