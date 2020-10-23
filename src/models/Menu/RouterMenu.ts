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
            const body:{date?:Date,dateNum?:number,root:boolean,email:string,googleId:string} = req.body;
            const {date,dateNum,root,email,googleId} = body;
            try {
                if(root){
                    const gotMenu:t.menu|null = await this.ModelMenu.findOne({root,email,googleId}).lean();
                    if(gotMenu){
                        res.status(200).send({gotMenu})
                    }else{
                        // root menu doesnt exist, create one
                        const rootMenu = await this.ModelMenu.create({
                            root:true,
                            googleId, email,
                            foodItems:{}
                        })
                        if(rootMenu){
                            res.status(201).send('root menu created successfully')
                        }else{
                            res.status(404).send('this shudnt be possible');
                        }
                    }
                }else if(dateNum){
                    // search for a menu from specific date
                }
            } catch (error) {
                console.log({error})
            }
        })
    }
    public incoming = () => {
        this.router.post('/addMenu_date', async(req:Request,res:Response)=>{
            const body:{foodItems:string[],date:Date,dateNum:number} = req.body;
            const {foodItems,date,dateNum} = body;
            const newObj:any = {};
            foodItems.forEach(item=> newObj[item]=true);
            try {
                const getMenu:t.menu|null = await this.ModelMenu.findOne({root:true}).lean();
                if(getMenu){
                    const allFoodItems = {
                        ...getMenu.foodItems,
                        ...newObj
                    }
                    console.log({foodItems})
                    const updatedMenu = await this.ModelMenu.findOneAndUpdate({},{foodItems:allFoodItems},{new:true});
                    if(updatedMenu){
                        res.status(200).send(updatedMenu);
                    }else res.status(400).send();
                }else{
                    const newMenu:Document = await this.ModelMenu.create({
                        root:true,
                        date,dateNum,
                        foodItems:newObj
                    });
                    if(newMenu){
                        res.status(201).send(newMenu);
                    }else res.status(400).send();

                }
            } catch (error) {
                console.log({error})
            }
        })
        // this.router.post('/addMenu_root', async(req:Request, res: Response)=>{
        //     const body:{foodItem:string,foodItems:string[]} = req.body;
        //     const {foodItems,foodItem} = body;
        //     try {
        //         if(foodItem){

        //         }
        //     } catch (error) {
        //         console.log({error})
        //     }
        // })
        this.router.post('/deleteMenuItem', async (req, res) => {
            const body:{deleteThis:string} = req.body;
            try {
                const menuFound:any = await this.ModelMenu.findOne().lean();
                if(menuFound && menuFound.hasOwnProperty(body.deleteThis)){
                    delete menuFound[body.deleteThis]
                }
                const deleted = await this.ModelMenu.findOneAndUpdate({},{...menuFound});
            } catch (error) {
                console.log({error})
            }
        })
        this.router.post('/addMenuItem_root',async(req:Request, res: Response)=>{
            const body:{googleId:string,root:boolean,email:string,foodItem:string} = req.body;
            const {googleId,root,email,foodItem} = body;
            try {
                const rootMenu:t.menu|null = await this.ModelMenu.findOne({googleId,email,root:true}).lean();
                const allFoodItems :{[foodItem:string]:boolean} = {
                    ...rootMenu?.foodItems,
                    [foodItem]:true
                } 
                console.log({foodItem});
                if(rootMenu) {
                    res.status(200).send
                }
            } catch (error) {
                console.log({error})
            }
        })
    }
}