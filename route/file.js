const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const File = require("../model/file")
const {v4: uuid4} = require("uuid");


let storage = multer.diskStorage({
    destination: (req, file, cb)=> cb(null, "uploads/"),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`
        cb(null, uniqueName)
    }
})

let upload = multer({
    storage,
    limit: {fileSize: 1000000 * 100}
}).single('image');

router.post("/", (req, res)=>{
    //Store image
    upload(req, res, async (err)=>{
        try {
            if(!req.file){
                return res.json({error:'All fields required'})
            }
        
            if(err){
                return res.status(500).send({error: err.message})
            }
            
            //store into database
            const file = new File({
                filename: req.file.filename,
                uuid: uuid4(),
                path: req.file.path,
                size: req.file.size
            });
    

            const response = await file.save();
            return res.json({file: `${process.env.APP_BASE_URL}/files/${response.uuid}`})
        } catch (error) {
            res.status(400).json({error: error.message})
        }
    })
    
})

router.post("/send", async (req, res)=>{
    const {uuid, emailFrom, emailTo} = req.body;
    if(!uuid || !emailFrom || !emailTo){
        return res.status(422).send({error: "All fields are required!"});
    }
    
    const file = await File.findOne({uuid})
    if(file.sender){
        return res.status(422).send({error:"Email already sent!"});
    }

    file.sender = emailFrom;
    file.receiver = emailTo;
    
    // const response = await file.save();

    //send email;
    const sendMail = require("../service/emailService");
    const op = {
        from: emailFrom,
        to: emailTo,
        subject: `inShare file share`,
        text: `${emailFrom} shared file with you.`,
        emailFrom: emailFrom,
        downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
        size: parseInt(file.size/1000) + ' KB',
        expires: "24 hours"
    };
    res.status(200).json(op);
})

module.exports = router;