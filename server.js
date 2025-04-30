import { Client, Query, Databases, Storage, ID } from 'node-appwrite';

export default async ({ req, res, log }) => {
    // Log request details for debugging
    log("Request headers:", req.headers);
    log("Request body type:", typeof req.body);
    log("Request body keys:", req.body ? Object.keys(req.body) : "No body");
    
    // Check request method
    if (req.method !== 'POST') {
        return res.json({ status: false, reason: "use proper fetch method" });
    }
    
    // Check for phone query parameter
    if (!req.query || !req.query.phone) {
        return res.json({ status: false, reason: "provide proper phone id in query" });
    }
    
    const phone = req.query.phone;
    
    // Initialize Appwrite client
    const client = new Client()
        .setProject(`${process.env.PROJECT_ID}`)
        .setKey(`${process.env.KEY}`);
    
    const storage = new Storage(client);
    const databases = new Databases(client);
    
    try {
        // In Appwrite Functions, file uploads should be accessible via req.body
        // The file might be directly in req.body or under a specific key
        
        let fileData = null;
        
        // Option 1: Check if the file is directly in req.body (if the client sent raw binary)
        if (req.body && Buffer.isBuffer(req.body)) {
            log("Found file data as buffer in req.body");
            fileData = req.body;
        } 
        // Option 2: Check if images field exists in form data
        else if (req.body && req.body.images) {
            log("Found images in form data");
            fileData = req.body.images;
        }
        // Option 3: Check if file is in req.body under a different key
        else if (req.body) {
            // Try to find a Buffer or file-like object in req.body
            for (const key in req.body) {
                if (Buffer.isBuffer(req.body[key]) || 
                    (typeof req.body[key] === 'object' && req.body[key] !== null)) {
                    log(`Found potential file data in field: ${key}`);
                    fileData = req.body[key];
                    break;
                }
            }
        }
        
        // Check if we found any file data
        if (!fileData) {
            log("No file data found in request");
            return res.json({
                status: false,
                reason: "No file data found in request",
                requestInfo: {
                    contentType: req.headers['content-type'],
                    bodyKeys: req.body ? Object.keys(req.body) : [],
                }
            });
        }
        
        // Upload file to storage
        log("Attempting to upload file to storage");
        const fileResult = await storage.createFile(
            `${process.env.BUCKET_ID}`,
            ID.unique(),
            fileData
        );
        
        if (!fileResult) {
            return res.json({ 
                status: false, 
                reason: "Failed to upload file to storage" 
            });
        }
        
        log("File uploaded successfully:", fileResult.$id);
        
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
        
        if (!docResult) {
            return res.json({ 
                status: false, 
                reason: "Failed to create database document",
                fileId: fileResult.$id
            });
        }
        
        log("Document created successfully:", docResult.$id);
        
        // Return successful response
        return res.json({
            status: true,
            reason: "File uploaded and document created successfully",
            fileId: fileResult.$id,
            docId: docResult.$id
        });
        
    } catch (error) {
        log("Error processing request:", error);
        return res.json({
            status: false,
            reason: "Error processing request",
            message: error.message,
            stack: error.stack
        });
    }
}