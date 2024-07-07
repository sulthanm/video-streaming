import * as React from 'react'
import { useState } from 'react';
import axios from 'axios';
import Textarea from '@mui/joy/Textarea';
import { Hidden } from '@mui/material';
import { display, fontSize, height, width } from '@mui/system';
import { alignProperty } from '@mui/material/styles/cssUtils';

const styles = {
    uploadArea : {
        marginTop : '20px',
        height : '50px',
        width : '100%',
        display : 'flex',
        flexWrap : 'wrap',
        alignItems: 'middle', // You can change this to 'flex-start', 'flex-end', 'center', 'stretch', or 'baseline'
        justifyContent: 'center',
        gap : '20px'
    },
    text : {
        flexBasis : '30%',
        height : '100%'
    },
    fileInput : {
        height : '30%',
        flexBasis : '15%',
        alignProperty : 'center'
    },
    input : {
        fontSize : '15px'
    },
    uploadBtn : {
        backgroundColor : '#ff000f',
        padding : '10px',
        borderRadius : '10px',
        transition : '0.5s'
    }
}

export default function UploadButton({addURL}) {

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
                <div id="upload-area" style={styles.uploadArea}>
                    {/* <label for="text-title">Example textarea</label> */}
                    
                    <Textarea 
                        
                        name='Soft' 
                        minRows={2} 
                        required onChange={(event) => settitle(event.target.value)} 
                        variant="soft" 
                        placeholder="Type in here…"
                        style = {styles.text}
                    />
                   
                    {formError && !title.trim() && <p style={{ color: 'red' }}>{formError}</p>}
                    <div class="mb-1" style={styles.fileInput} >
                        <input required class="form-control" type="file" id="formFile" style = {styles.input} onChange={(event) => setfile(event.target.files[0])} />
                    </div>
                    <button onClick={handleUploadVideo} style={styles.uploadBtn}>UPLOAD VIDEO</button>
         
                </div>
            </>
        );
    }