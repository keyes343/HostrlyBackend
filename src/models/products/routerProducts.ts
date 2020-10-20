import express, { Router, Request, Response, NextFunction } from 'express';
import {Schema, model, Model, Document} from 'mongoose';

export class RouterProducts {
    public router: Router;
    ModelProducts: Model<Document,{}>

    // CONSTRUCTOR NEEDS TO RECEIVE ITS MODEL(S)
    constructor(ModelProducts:Model<Document,{}>){
        this.router = express.Router();
        // INITIATE THE MODEL RECEIVED
        this.ModelProducts = ModelProducts;
        // impor funtcions if required

        // INITIALIZE THE ROUTES
        this.basicGetRequest();
        this.basicPostRequests();
    }

    public basicGetRequest = () => {
        this.router.get('/getAllProducts',async(req: Request,res: Response)=>{
            console.log('triggered = /getAllProducts')
            // try {
            //     // FINDING ALL
            //     this.ModelProducts.find({},async(err,doc)=>{
            //         try {
            //             res.send(doc)
            //         } catch (error) {
            //             console.log(error)
            //         }
            //     })
            // } catch (error) {
            //     console.log(error)
            // }
        })
        this.router.post('/getOneProduct',async(req:Request, res: Response)=>{
            console.log('route = /products/getOneProduct')
            const body = req.body;
            const {googleId,email,uniqueName} = body;
            console.log({body})
            try {
                const docFound = await this.ModelProducts.findOne({uniqueName}).lean();
                if(docFound){
                    res.send(docFound)
                }else res.send('something wrong');
            } catch (error) {
                console.log(error)
            }
        })
        this.router.post('/getFewProducts', async(req:Request, res: Response)=>{
            console.log('triggered = /getFewProducts')
            const body:{
                googleId:string, email:string, arrOfUniqueNames:string[]
            } = req.body;
            const {googleId,email, arrOfUniqueNames} = body;
            try {
                console.log({arrOfUniqueNames});
                let promises:any = [];
                arrOfUniqueNames.forEach(uniqueName=>{
                    if(uniqueName !== 'blank'){
                        const prodDoc =  this.ModelProducts.findOne({uniqueName}).lean();
                        promises.push(prodDoc);
                    }
                })
                const prodDocs = await Promise.all(promises);
                if(prodDocs){
                    console.log('displaying prodDocs')
                    console.log(prodDocs);
                    res.send(prodDocs)
                }
            } catch (error) {
                console.log(error)
            }
        })
        this.router.post('/getCategoryProducts', async(req:Request, res: Response)=>{
            const body: {googleId:string, email:string, category:string} = req.body;
            const {googleId, email, category} = body;
            try {
                const allCategoryProducts = await this.ModelProducts.find({category}).lean();
                if(allCategoryProducts){
                    res.send(allCategoryProducts);
                }
            } catch (error) {
                console.log(error)
            }
        })
        this.router.post('/getPrices', async(req:Request,res:Response)=>{
            const body:{email:string,googleId:string,uniqueNames:string[]} = req.body;
            try {
                let priceList:any= {};
                let promises: any[] = [];
                body.uniqueNames.forEach(uniqueName=>{
                    if(uniqueName !== 'blank'){
                        const doc:any = this.ModelProducts.findOne({uniqueName}).lean();
                        promises.push(doc);
                    }
                })
                const docs = await Promise.all(promises);
                if(docs){
                    docs.forEach(doc=>{
                        priceList[doc.displayName] = doc.price
                    })
                    res.send({
                        txt:'ok',
                        docs:priceList
                    })
                }else res.send({
                    txt:'something wrong',doc:null
                })
                
            } catch (error) {
                console.log(error)
            }
        })
    }
    public basicPostRequests = () => {
        this.router.post('/insertProduct',async(req:Request,res: Response) => {
            const body = req.body;
            try {
                console.log({body})
                await this.ModelProducts.create({...body},(err:any,doc:any)=>{
                    if(err){
                        console.log({err});
                        res.send({err})
                    }
                    else if(doc){
                        res.send(doc);
                    }else console.log('no doc to send back')
                })
            } catch (error) {
                console.log(error)
            }
        });
        this.router.post('/editProduct', async(req:Request, res:Response)=>{
            try{
                type bodytype = {
                    'uniqueName':{
                        'pushup':'value',
                        'pullup':'value'
                    },
                    'uniqueName2':{
                        'key':'value'
                    }
                }
                const body = req.body;
                let response_payload:any = {
                    statuss: 'untouched',
                    arr: []
                };
                for (const uniqueName in body ) {
                    // exctract the keys-value pairs into an OBJECT to iterate on
                    const upsert_doc = body[uniqueName];
                    const docFound:any = await this.ModelProducts.findOne({ uniqueName });
                    for(const key in upsert_doc){
                        docFound [ key ] = upsert_doc [ key ];
                    };
                    const newDoc = await docFound.save();
                    response_payload['arr'].push(newDoc.uniqueName);
                    response_payload['statuss'] = 'touched';
                };
                res.send(response_payload)
            }catch(err){
                console.log(err)
            }
        });
        this.router.post('/editProductDetail', async(req:Request, res: Response)=>{
            const body = req.body;
            const {prevKey,leftKey,rightValue,uniqueName} = body;
            try {
                const docFound:any = await this.ModelProducts.findOne({ uniqueName });
                if(docFound){
                    delete docFound.details[prevKey];
                    docFound.details = {
                        ...docFound.details,
                        [leftKey]:rightValue
                    }
                    const newDoc = await docFound.save();
                    res.send(newDoc);
                }else res.send('something wrong');
            } catch (error) {
                console.log(error)
            }
        });
        this.router.post('/deleteProductDetail', async(req:Request, res: Response)=>{
            const body = req.body;
            const {leftKey,uniqueName} = body;
            try {
                const docFound:any = await this.ModelProducts.findOne({ uniqueName }).lean();
                if(docFound){
                    delete docFound.details[leftKey];
                }else res.send('something wrong');
                const newDoc = await this.ModelProducts.findOneAndUpdate({uniqueName},docFound,{upsert:true})
                console.log({newDoc})
                res.send(newDoc)
            } catch (error) {
                console.log(error)
            }
        })
    }
}