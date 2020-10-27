import express, {Router,Response,Request,NextFunction} from 'express';
import {Schema,model,Model,Document} from 'mongoose';
import {e,t} from '../index';

export class RouterMenu {
    router:Router
    ModelMenu:Model<Document,{}>
    constructor(ModelMenu:Model<Document,{}>){
        this.router = express.Router();
        this.ModelMenu = ModelMenu;

        this.outgoing();
        this.incoming();
    }

    public outgoing = () => {
        this.router.post('/getMenu', async(req:Request,res:Response)=>{
            // console.log('---------- /getMenu----------');
            const body:{date?:Date,dateNum?:number,root:boolean,email:string,googleId:string} = req.body;
            const {date,dateNum,root,email,googleId} = body;
            console.log({root})
            try {
                if(root){
                    const gotMenu:t.menu|null = await this.ModelMenu.findOne({root,email,googleId}).lean();
                    if(gotMenu){
                        res.status(200).send(gotMenu)
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
        this.router.post('/getSelectedFoodItems', async(req:Request, res: Response)=>{
            console.log('--- /getSelectedFoodItems ----');
            const body:{googleId:string,email:string} = req.body;
            const {googleId,email} = body;
            console.log({googleId,email});

            try {
                const getSelectedFoodItems:t.menu|null = await this.ModelMenu.findOne({googleId,email,root:false}).lean();
                // console.log({getSelectedFoodItems})
                if(getSelectedFoodItems) {
                    let doc = getSelectedFoodItems.foodItems;
                    // console.log({doc})
                    res.status(200).send(doc);
                    // console.log('---- found and sent --------');
                }else{
                    res.status(204).send();
                    // console.log('----- no doc exists, only status returned ----')
                }
            } catch (error) {
                console.log({error});
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
            const body:{foodItem:string} = req.body;
            const {foodItem} = body;
            try {
                const menuFound:any = await this.ModelMenu.findOne().lean();
                const {foodItems} = menuFound;
                if(menuFound && menuFound.foodItems.hasOwnProperty(foodItem)){
                    delete foodItems[foodItem]
                }
                const deleted = await this.ModelMenu.findOneAndUpdate({},{foodItems},{new:true});
                res.status(200).send(deleted);
            } catch (error) {
                console.log({error})
            }
        })
        this.router.post('/addMenuItem_root',async(req:Request, res: Response)=>{
            console.log('---- /addMenuItem_root ------')
            const body:{googleId:string,root:boolean,email:string,foodItem:string} = req.body;
            const {googleId,root,email,foodItem} = body;
            console.log({foodItem});
            try {
                const rootMenu:t.menu|null = await this.ModelMenu.findOne({googleId,email,root}).lean();
                const allFoodItems :{[foodItem:string]:boolean} = {
                    ...rootMenu?.foodItems,
                    [foodItem]:true
                } 
                console.log({foodItem});
                if(rootMenu) {
                    const updated:any = await this.ModelMenu.findOneAndUpdate({googleId,email,root},{foodItems:allFoodItems},{new:true});
                    if(updated){
                        res.status(200).send(updated);
                        console.log('----updated----')
                    }else res.send(400).send();
                }else{
                    const created = await this.ModelMenu.create({googleId,email,root,foodItems:{[foodItem]:true} });
                    res.status(200).send(created);
                    console.log('----created-----');
                }
            } catch (error) {
                console.log({error})
            }
        })
        this.router.post('/modifySelectedItemsInMenu', async(req:Request, res: Response)=>{
            console.log('---- /modifySelectedItemsInMenu-----')
            const body:{foodItem:string,email:string,googleId:string,userIs:string,foodEvent:string} = req.body;
            const {foodItem,googleId,email,userIs,foodEvent} = body;
            try {
                const gotMenu:any = await this.ModelMenu.findOne({googleId,email,root:false}).lean();
                if(gotMenu) {
                    const {foodItems} = gotMenu;
                    if(foodItems.hasOwnProperty(foodItem)){
                        delete foodItems[foodItem];
                        console.log('-- unticked --')
                    }else{
                        foodItems[foodItem] = true;
                        console.log('-- ticked --')
                    }
                    const modified = await this.ModelMenu.findOneAndUpdate({googleId,email,root:false},{foodItems,foodEvent},{new:true});
                    if(modified){
                        res.status(200).send(modified);
                    }else res.status(204).send();
                }else {
                    const created = await this.ModelMenu.create({googleId,email,userIs,foodEvent,foodItems:{[foodItem]:true}, root:false });
                    if(created){
                        console.log('--- new menu created for foodEvent -----');
                        res.status(201).send(created);
                    }else{
                        console.log(' ----- some error happened -------')
                        res.status(400).send();
                    } 
                }                
            } catch (error) {
                console.log({error});
            }
        });
        
    }
}