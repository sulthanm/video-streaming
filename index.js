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
import User from './model/user.mjs'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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
        const result = await video.save()
        return result
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
        (async () => {
            if (error) {
                console.log(`exec error: ${error}`)
            }
            console.log(`stdout: ${stdout}`)
            console.log(`stderr: ${stderr}`)
            const videoUrl = `http://localhost:8000/uploads/courses/${lessonId}/index.m3u8`
            const title = req.body.title
            try {
                const result = await insertData(videoUrl, title);
                return res.json(result);
            } catch (err) {
                console.error('Error inserting data into database:', err);
                return res.status(500).json({ error: 'Error inserting data into database' });
            }
        })()
    })

})
app.get('/api/all-videos', async (req, res) => {
    try {
        const videos = await Video.find().sort({ createdAt: -1 }).exec();;
        const videosJson = videos.map(video => video.toJSON());
        return res.json(videosJson);
    } catch (err) {
        console.error('Error fetching data:', err);
        return 
    }
})

app.post('/sign-in', (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide all fields' });
    }

    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(400).json({ error: 'Please Sign-Up' });
            }
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    console.log("Password wrong", err);
                    return res.status(401).json({ error: 'Wrong username or password' }); 
                }

                if (isMatch) {
                    const payload = {
                        name: user.name,
                        email: user.email
                    };

                    jwt.sign(payload, 'blahsomething', (err, token) => {
                        if (err) throw err;

                        res.cookie('token', token, { httpOnly: true, maxAge: 3600 * 1000 });
                        res.status(200).json({ message: 'User logged in', name : user.name });

                        console.log('User logged in');
                    });
                } else {
                    res.status(401).json({ error: 'Invalid Credentials' });
                }
            });
        })
        .catch(err => console.error("Error message in finding user", err));
});

app.post('/sign-up', (req, res) => {
    const { name, email, password } = req.body;

    console.log('name:', name);

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Please provide all fields' });
    }

    User.findOne({ email })
        .then(user => {
            if (user) {
                return res.status(400).json({ error: 'User already exists' });
            }
            const newUser = new User({ name, email, password });
            bcrypt.genSalt(10, (err, salt) => {
                if (err) throw err;
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => {
                            jwt.sign(
                                {id : user.id},
                                'blahsomething',
                                { expiresIn: 3600 },
                                (err, token) => {
                                    if (err) throw err;

                                    res.cookie('token', token, { httpOnly: true });
                                    res.json({
                                        user: {
                                            name: user.name,
                                            email: user.email
                                        }
                                    });
                                }
                            );
                        })
                        .catch(err => console.error(err));
                });
            });
        })
        .catch(err => console.error(err));
});

app.listen(8000, ()=> {
    console.log("app is listening at 8000")
})