import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import VideoPlayer from '../video/VideoPlayer';
import UploadButton from '../upload/UploadButton';
import { Grid, Typography, Card, CardHeader, IconButton, Avatar, CardMedia, CardContent } from '@mui/material';
import { red } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import './Wall.css';

export default function Wall() {
  const playerRef = useRef(null);
  const [allVideoLinks, setAllVideoLinks] = useState([]);

  const addVideoURL = (elem) => {
    setAllVideoLinks([...allVideoLinks, elem]);
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;
    player.on("waiting", () => {
      console.log("Player is waiting");
    });
    player.on("dispose", () => {
      console.log("Player will dispose");
    });
  };

  const fetchAllVideos = () => {
    axios.get('http://localhost:8000/api/all-videos')
      .then((res) => {
        setAllVideoLinks(res.data);
      })
      .catch((err) => {
        console.log("Error in fetching videos: ", err);
      });
  };

  useEffect(() => {
    fetchAllVideos();
    console.log('Component mounted');
    return () => {
      console.log('Component unmounted');
    };
  }, []);

  return (
    <>
      <UploadButton addURL={addVideoURL} />
      <div>
        <button className="filter">All</button>
      </div>
      <div>
        <Grid container style={{ padding: '10px' }} spacing={3}>
          {allVideoLinks.map((videoData, index) => (
            <Grid item xs={12} md={3} key={index}>
              <Card>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: red[500] }}>
                      R
                    </Avatar>
                  }
                  action={
                    <IconButton aria-label="settings">
                      <MoreVertIcon />
                    </IconButton>
                  }
                  title={videoData.title}
                  subheader={videoData.createdAt}
                />
                <CardMedia>
                  <VideoPlayer
                    options={{
                      controls: true,
                      responsive: true,
                      fluid: true,
                      sources: [{ src: videoData.videoPath, type: "application/x-mpegURL" }]
                    }}
                    onReady={handlePlayerReady}
                  />
                </CardMedia>
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {videoData.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </>
  );
}
