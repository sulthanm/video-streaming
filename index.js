import express from 'express'
import cors from 'cors'
import multer from 'multer'
import {v4 as uuidv4} from 'uuid'
import path from "path"
import fs from "fs"
import {exec} from "child_process" //watch out
import { stderr, stdout } from 'process'

const app = express()

//multur middleware
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./uploads")
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "-" + uuidv4() + path.extname
        (file.originalname))
    }
})

// multer configuration
const upload = multer({storage: storage})

app.use(
    cors({
        origin: ["http://localhost:8000", "http://localhost:5173"],
        credentials : true
    })
)
app.use((req, res, next)=>{
    res.header("Access-Control-Alllow-Origin", "*")
    res.header(
        "Access-Control-Alllow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    )
    next()
})

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use("/uploads", express.static("uploads"))


app.get('/', (req, res)=> {
    res.json({message : "Hello"})
})

app.post("/upload", upload.single('file'), function(req, res) {
    const lessonId = uuidv4()
    const videoPath = req.file.path
    const outputPath = `./uploads/courses/${lessonId}`
    const hlsPath = `${outputPath}/index.m3u8`
    console.log("Lessonid", lessonId)
    console.log("Vidoe path", videoPath)
    console.log("Output path", outputPath)
    console.log("Hlspath", hlsPath)
    
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath)
    }
    


})

app.listen(8000, ()=> {
    console.log("app is listening at 3000")
})