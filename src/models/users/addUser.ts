import { Request, Response, NextFunction } from 'express';
import { User } from '../incoming';
import { User_type } from './types'

const addUser = async(req:Request, res:Response ) => {
    // const c = { test:'test doneeee'};
    // return c;
    try {
        await User.create({
            googleName: 'weeeee',
            age:200
        }, (err:any,doc:any)=>{
            if(err){
                res.send({erroris:err});
                return;
            }else {
                res.send({
                    userdoc:doc,
                    status:'success weeeee'
                });
                return;
            }
        });
        // const user = await add_user.save();
    } catch (error) {
        res.send({error})
    } 
    const c = { test:'triggered from addUser.ts'}
    return c
    // res.status(200).send({
    // });
    
}

export default addUser;