import * as React from 'react'
import { useState } from 'react';
import axios from 'axios';

export default function UploadButton() {

    const [title, settitle] = useState('')
    const [file, setfile] = useState('')
    const [formError, setFormError] = useState('');

    const handleUploadVideo = () => {
        const formData = new FormData();
        if (!title.trim()) {
            setFormError('Title is required'); // Set error message for title field
            return;
        }
        formData.append('file', file);
        formData.append('title', title);
        console.log(formData)
        axios.post('http://localhost:8000/upload/', formData)
            .then((res) => {
                console.log(res.data)
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