import {Client, Query, Databases, Storage, ID} from 'node-appwrite'

export default async({req, res,log}) => {
    if(req.method !== 'POST') {
        return res.json({status: false, reason: "use proper fetch method"});
    }
    
    if(!req.query || Object.keys(req.query).length === 0) {
        return res.json({status: false, reason: "provide proper id"});
    }
    
    const client = new Client()
        .setProject(`${process.env.PROJECT_ID}`)
        .setKey(`${process.env.KEY}`);
    
    const phone = req.query.phone;
    const imagepaths = req.files?.images;

    // log(req);
    log(req.images);
    log(req.body);
    
    if(!imagepaths || imagepaths.length === 0) {
        return res.json({
            status: false, 
            reason: "No files uploaded", 
            phone: phone
        });
    }
    
    try {
        // Process each uploaded file
        for(let i = 0; i < imagepaths.length; i++) {
            const storage = new Storage(client);
            const fileResult = await storage.createFile(
                `${process.env.BUCKET_ID}`,
                ID.unique(), 
                imagepaths[i]
            );
            
            if(fileResult) {
                const databases = new Databases(client);
                const docResult = await databases.createDocument(
                    `${process.env.DATABASE_ID}`,
                    `${process.env.COLLECTION_ID}`, 
                    ID.unique(),
                    {
                        imageid: fileResult.$id,
                        phoneno: phone
                    }
                );
                
                if(docResult) {
                    return res.json({status: true, reason: "successful"});
                } else {
                    return res.json({status: false, reason: "failed to upload document"});
                }
            } else {
                return res.json({status: false, reason: "failed to upload file"});
            }
        }
        
        // This code is unreachable as we're returning in the loop
        return res.json({status: false, reason: "No files were processed"});
    } catch(error) {
        console.error("Error processing upload:", error);
        return res.json({
            status: false, 
            reason: "Error processing upload", 
            message: error.message
        });
    }
}