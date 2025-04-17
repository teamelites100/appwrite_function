import {Client,Query,Databases,Storage,ID} from 'node-appwrite'


export default async({req,res})=>{
    
    
    const client = new Client()
    .setProject(`${process.env.PROJECT_ID}`)
    .setKey(`${process.env.KEY}`)


      if(req.method=='POST'){
        return res.json({name:"imagepaths",req:req});
        if(req.query!=='' && req.query){
           
            const phone = req.query.phone;
            const imagepaths = req.files;

            if(imagepaths == undefined ) return res.json({name:"imagepaths",req:req});

           for(let i = 0 ; i < imagepaths.length ; i++){

            const storage = new Storage(client);
            const result = await storage.createFile(
                `${process.env.BUCKET_ID}`,
                ID.unique(), 
                imagepaths[i], 
            );

            if( result){

                const databases = new Databases(client);

                const result = await databases.createDocument(
                    `${process.env.DATABASE_ID}`,
                    `${process.env.COLLECTION_ID}`, 
                    ID.unique(),
                   {
                    imageid:result.$id,
                    phoneno:phone
                   }
                );
                
                if(result){
                    return res.json({status:true,reason:"successful"})
                }
                else{
                    return res.json({status:false,reason:"failed to upload"})
                }
            }
            else{
                return res.json({status:false,reason:"invalid userid"})
            }
           }
            if(response){
                return res.json({name:response.name,userid:response.$id,email:response.email,createdAt:response.$createdAt,status:true,reason:"successful"})
            }
            else{
                return res.json({status:false,reason:"invalid userid"})
            }
        }
        else{
            return res.json({status:false,reason:"provide proper id"})
        }
      }
      else
      {
        return res.json({status:false,reason:"use proper fetch method"})
          }
        

}


// import { Client } from 'appwrite';

// // This is your Appwrite function
// // It's executed each time we get a request
// export default async ({ req, res, log, error }) => {
//   // Why not try the Appwrite SDK?
//   //
//   // Set project and set API key
//   const client = new Client()
    

//   // You can log messages to the console
//   log('Hello, Logs!');

//   // If something goes wrong, log an error
//   error('Hello, Errors!');

//   // The `req` object contains the request data
//   if (req.method === 'GET') {
//     // Send a response with the res object helpers
//     // `res.text()` dispatches a string back to the client
//     return res.text('Hello, World!');
//   }

//   // `res.json()` is a handy helper for sending JSON
//   return res.json({
//     motto: 'Build like a team of hundreds_',
//     learn: 'https://appwrite.io/docs',
//     connect: 'https://appwrite.io/discord',
//     getInspired: 'https://builtwith.appwrite.io',
//   });
// };
