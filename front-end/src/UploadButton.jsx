import * as React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { red } from '@mui/material/colors';

export default function UploadButton({addURL}) {

    const [title, settitle] = useState('')
    const [file, setfile] = useState('')
    const [formError, setFormError] = useState('');
    const [newLink, setNewLink] = useState('');

    const handleUploadVideo = () => {
        const formData = new FormData();
        if (!title.trim()) {
            setFormError('Title is required'); // Set error message for title field
            return;
        }
        formData.append('file', file);
        formData.append('title', title);
        axios.post('http://localhost:8000/upload/', formData)
            .then((res) => {
                if (res.data._id && res.data.title && res.data.videoPath) {
                    const newVideo = {
                      _id: res.data._id,
                      title: res.data.title,
                      videoPath: res.data.videoPath,
                      createdAt: res.data.createdAt,
                      updatedAt: res.data.updatedAt,
                      __v: res.data.__v
                    };
                    addURL(newVideo);
                }
                
            })
            .catch((err) => {
                console.log("Error in uploading: ", err)
            })
        };
        return (
            <>
                <div id="upload-area">
                    <textarea required name="video-title" cols="70" rows="3" placeholder="Video is about ..?"
                        onChange={(event) => settitle(event.target.value)} >
                    </textarea>
                    {formError && !title.trim() && <p style={{ color: 'red' }}>{formError}</p>}
                    <input required type="file" onChange={(event) => setfile(event.target.files[0])} />
                    <button onClick={handleUploadVideo}>UPLOAD VIDEO</button>
         
                </div>
            </>
        );
    }