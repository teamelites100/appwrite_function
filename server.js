import { Client, Query, Databases, Storage, ID } from 'node-appwrite';

export default async ({ req, res, log }) => {
    if (req.method !== 'POST') {
        return res.json({ status: false, reason: "use proper fetch method" });
    }
    
    if (!req.query || Object.keys(req.query).length === 0) {
        return res.json({ status: false, reason: "provide proper id" });
    }
    
    const client = new Client()
        .setProject(`${process.env.PROJECT_ID}`)
        .setKey(`${process.env.KEY}`);
    
    const phone = req.query.phone;
    
    // Log some debug information
    log("Request body:", req.body);
    log("Request files:", req.files);
    
    // Check if files exist in the request
    if (!req.files || !req.files.images || req.files.images.length === 0) {
        return res.json({
            status: false, 
            reason: "No files uploaded", 
            phone: phone
        });
    }
    
    try {
        const storage = new Storage(client);
        const databases = new Databases(client);
        const uploadedFiles = [];
        
        // Process each uploaded file
        for (let i = 0; i < req.files.images.length; i++) {
            const imageFile = req.files.images[i];
            
            // Create file in storage
            const fileResult = await storage.createFile(
                `${process.env.BUCKET_ID}`,
                ID.unique(),
                imageFile
            );
            
            if (fileResult) {
                // Create document in database
                const docResult = await databases.createDocument(
                    `${process.env.DATABASE_ID}`,
                    `${process.env.COLLECTION_ID}`,
                    ID.unique(),
                    {
                        imageid: fileResult.$id,
                        phoneno: phone
                    }
                );
                
                if (docResult) {
                    uploadedFiles.push({
                        fileId: fileResult.$id,
                        docId: docResult.$id
                    });
                } else {
                    return res.json({ 
                        status: false, 
                        reason: "Failed to create database document",
                        fileId: fileResult.$id
                    });
                }
            } else {
                return res.json({ 
                    status: false, 
                    reason: "Failed to upload file to storage" 
                });
            }
        }
        
        // If all files processed successfully
        return res.json({ 
            status: true, 
            reason: "successful", 
            files: uploadedFiles 
        });
        
    } catch (error) {
        log("Error processing upload:", error);
        return res.json({
            status: false, 
            reason: "Error processing upload", 
            message: error.message
        });
    }
}