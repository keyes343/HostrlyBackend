import mongoose, {Schema, model, Model, Document} from 'mongoose';
import { User_type, userSchema, UserRouter, 
    SchemaDate, RouterDate,
    SchemaProducts, RouterProducts,
    SchemaWorkouts, RouterWorkouts,
    RouterMenu, SchemaMenu } from './models/index'; // type+schema
import { Router } from 'express';

export class MongooseDatabase {
    db: any;
    UserRouter_class: UserRouter;
    UserRouter: any;
    RouterProducts_extractedRoutes: Router;
    RouterDate_extractedRoutes: Router;
    RouterWorkouts_extractedRoutes: Router;
    RouterMenu_extractedRoutes: Router;

    // ROUTER
    RouterProducts: RouterProducts;
    RouterDate: RouterDate;
    RouterWorkouts: RouterWorkouts;
    RouterMenu: RouterMenu;
    // SCHEMA
    SchemaUser: Schema<User_type>; 
    SchemaProducts: Schema;
    SchemaDate: Schema;
    SchemaWorkouts: Schema;
    SchemaMenu: Schema;
    // MODEL
    User: Model<Document, {}>;
    ModelProducts: Model<Document, {} >;
    ModelDate: Model<Document, {}> ;
    ModelWorkouts: Model<Document, {}> ;
    ModelMenu: Model<Document, {}>;

    constructor(){
        this.db = mongoose;
        this.SchemaUser = userSchema;
        this.SchemaProducts = SchemaProducts;
        this.SchemaDate = SchemaDate;
        this.SchemaWorkouts = SchemaWorkouts;
        this.SchemaMenu = SchemaMenu;

        // USER MODEL
        this.User = model('user',this.SchemaUser); // define a model
        this.UserRouter_class = new UserRouter(this.User); // invoking the class by passing in a model
        this.UserRouter = this.UserRouter_class.router; // extracting property from class
        
        // PRODUCT MODEL
        this.ModelProducts = model('product',this.SchemaProducts); // INITIATE MODEL
        this.RouterProducts = new RouterProducts(this.ModelProducts); // INITIATE CLASS BY PASSING MODEL
        this.RouterProducts_extractedRoutes = this.RouterProducts.router; // EXTRACT ROUTES SO TO BE USED AHEAD
        
        // MENU MODEL
        this.ModelMenu = model('menu',this.SchemaMenu);
        this.RouterMenu = new RouterMenu(this.ModelMenu);
        this.RouterMenu_extractedRoutes = this.RouterMenu.router;

        // CUSTOM MODEL
        this.ModelDate = model('custom', this.SchemaDate);
        this.RouterDate = new RouterDate(this.ModelDate);
        this.RouterDate_extractedRoutes = this.RouterDate.router;

        // WORKOUT MODEL
        this.ModelWorkouts = model('workout',this.SchemaWorkouts);
        this.RouterWorkouts = new RouterWorkouts(this.ModelWorkouts);
        this.RouterWorkouts_extractedRoutes = this.RouterWorkouts.router;

        this.initializeMongoose();
    }
    public initializeMongoose = async() => {
        const uri_auth = 'mongodb+srv://hostel:jeet343@hostel.d0s8t.mongodb.net/root?retryWrites=true&w=majority';
        // const uri_auth = 'mongodb+srv://jeet343:jeet343@mazelix-akpyd.mongodb.net/root?retryWrites=true&w=majority';
        try {
            await this.db.connect(uri_auth, {useNewUrlParser:true, useUnifiedTopology: true, useFindAndModify: false});
            console.log('beep beep');
            // this.User = new auth.Model('user',this.SchemaUser);
            
            // await this.db.connection.once('open',this.func_2);
            // const a = await this.db.connection.once('open',()=>console.log('connected'))
            // console.log(a);

        } catch (error) {
            console.log(error)
        }
    }
    private func_2 =()=> {
        //this.User = model('user',this.SchemaUser);
        console.log('connected')
    }
}

// export const mongooseInstance = new MongooseDatabase();
// export const db = mongooseInstance.db;
// export const User = mongooseInstance.User;