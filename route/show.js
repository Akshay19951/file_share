const router = require("express").Router();
const File = require("../model/file")

router.get("/:uuid", async (req, res)=>{
    try {
        const file = await File.findOne({uuid: req.params.uuid});
        if(!file){
            return res.status(400).json({"error":"File not exists"});
        }

        return res.status(200).json(
            {
                uuid: file.uuid, 
                filename: file.filename,
                filesize: file.filesize,
                download: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`
            }
        )
    } catch (error) {
        return res.status(400).json({error: error.message})
    }
})

module.exports = router