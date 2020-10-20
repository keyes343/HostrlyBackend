// import passport from 'passport';
// import { Strategy } from 'passport-google-oauth20';
// import { client_ID, client_Secret } from './keys';
// import { db, User } from './mongoose';
// import {Schema, model} from 'mongoose';

// export class Passport {
//     public clientID: string;
//     public clientSecret: string;
//     public GoogleStrategy: Strategy;
//     public db: any; public User: any;
//     constructor(){
//         this.clientID = client_ID;
//         this.clientSecret = client_Secret;
        
//         this.db = db;
//         this.User = User;

//         this.GoogleStrategy = new Strategy(
//             {
//             // option for google stragegy
//             clientID: client_ID,
//             clientSecret: client_Secret,
//             callbackURL: '/auth/google/redirect'
//             },
//             (accessToken:any, refreshToken:any, profile:any, done:any)=>this.callBackForGoogleStrategy(accessToken, refreshToken, profile, done))
//         passport.use(this.GoogleStrategy);
//         passport.serializeUser((user:any,done:any)=> this.serializeUser(user,done));
//         passport.deserializeUser((id:string,done:any) => this.deserialize(id,done));
//     }
//     // serializeUser
//     public serializeUser = (user:any,done:any) => {
//         done(null, user.id)
//     }
//     // deserialize
//     public deserialize = async(id:string,done:any) => {
//         const User:any = this.User;
//         const removedID = await User.findById(id);
//         done(null, removedID);
//     }
//     // passport callback function
//     public callBackForGoogleStrategy = async(accessToken:any, refreshToken:any, profile:any, done:any):Promise<any> => {
//         // User here is one of the mongoose schemas
//         const User:any = this.User;
//         try{
//             //
//             const currentUser = await User.findOne({
//                 googleid: profile.id
//             })
//             if (currentUser){
//                 // if user exists
//                 done(null, currentUser);
//             } else {
//                 // create user
//                 User.name = profile.displayName;
//                 User.googleid = profile.id;
//                 const newUser = await User.save();
//                 done(null, newUser);
//                 alert(newUser);
//             }
//         }catch (err){
//             console.log(err);
//         }finally {
//             //
//         }
//         return done(null, profile);
//     }
// }

// export {passport};


// // an article that helped me setup auth
// // https://medium.com/binar-academy/social-login-login-with-google-account-4b10224494ac