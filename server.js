import {Client,Query,Databases,Storage,ID} from 'appwrite'


export default async({req,res})=>{
    // const client = new Client()
    // .setEndpoint(`https://cloud.appwrite.io/v1`)
    // .setProject(process.env.PROJECT_ID)
    // .setKey(process.env.KEY)



    //   if(req.method=='POST'){
    //     if(req.query!=='' && req.query){
           
    //         const phone = req.query.phone;
    //         const imagepaths = req.files;

    //        for(let i = 0 ; i < imagepaths.length ; i++){

    //         const storage = new Storage(client);
    //         const result = await storage.createFile(
    //             `${process.env.BUCKET_ID}`,
    //             ID.unique(), 
    //             imagepaths[i], 
    //         );

    //         if( result){

    //             const databases = new Databases(client);

    //             const result = await databases.createDocument(
    //                 `${process.env.DATABASE_ID}`,
    //                 `${process.env.COLLECTION_ID}`, 
    //                 ID.unique(),
    //                {
    //                 imageid:result.$id,
    //                 phoneno:phone
    //                }
    //             );
                
    //             if(result){
    //                 return res.json({status:true,reason:"successful"})
    //             }
    //             else{
    //                 return res.json({status:false,reason:"failed to upload"})
    //             }
    //         }
    //         else{
    //             return res.json({status:false,reason:"invalid userid"})
    //         }
    //        }
    //         if(response){
    //             return res.json({name:response.name,userid:response.$id,email:response.email,createdAt:response.$createdAt,status:true,reason:"successful"})
    //         }
    //         else{
    //             return res.json({status:false,reason:"invalid userid"})
    //         }
    //     }
    //     else{
    //         return res.json({status:false,reason:"provide proper id"})
    //     }
    //   }
    //   else
    //   {
        //   }
        
            return res.json({status:false,reason:"use proper fetch method"})

    //   return res.j
}