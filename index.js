import express from 'express'
import cors from 'cors'
import multer from 'multer'
import {v4 as uuidv4} from 'uuid'
import path from "path"
import fs from "fs"
import {exec} from "child_process" //watch out
import { stderr, stdout, title } from 'process'
import { error } from 'console'
import db from './config/mongo-db.mjs'
import Video from './model/video.mjs'

const app = express()
db()
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

async function insertData(pathV, titleV) {
    try {
        const video = new Video({
            title : titleV,
            videoPath : pathV
        })
        const res = await video.save()
        console.log(`Video is added ${res}`)
    }catch (err) {
        console.error('Error inserting data:', err);
    } 
}

app.post("/upload", upload.single('file'), function(req, res) {
    const lessonId = uuidv4()
    const videoPath = req.file.path
    const outputPath = `./uploads/courses/${lessonId}`
    const hlsPath = `${outputPath}/index.m3u8`
    console.log(req.file)
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, {recursive: true})
    }
    //ffmpeg
    const ffmpegCommand = `ffmpeg -i ${videoPath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 -f hls ${hlsPath}`

    // no queue because of POC, not to be used as production
    exec(ffmpegCommand, (error, stdout, stderr), (error, stdout, stderr) => {
        if (error) {
            console.log(`exec error: ${error}`)
        }
        console.log(`stdout: ${stdout}`)
        console.log(`stderr: ${stderr}`)
        const videoUrl = `http://localhost:8000/uploads/courses/${lessonId}/index.m3u8`
        const title = req.body.title
        insertData(videoUrl, title)
        res.json({
            message: "Video coberted to HLS format",
            videoUrl: videoUrl,
            lessonId: lessonId
        })
    })

})
app.get('api/all-videos', async function(req, res){
    try {
        const videos = await Video.find(); // Fetch all documents from the Video collection
        const videosJson = videos.map(video => video.toJSON()); // Convert each document to JSON
        console.log('All videos in JSON format:', JSON.stringify(videosJson, null, 2)); // Pretty-print JSON
        return videosJson;
    } catch (err) {
        console.error('Error fetching data:', err);
    }
})

app.listen(8000, ()=> {
    console.log("app is listening at 8000")
})