import './App.css'
import VideoPlayer from './VideoPlayer' 
import ButtonAppBar from './Header'
import UploadButton from './UploadButton'
import { useEffect, useRef } from 'react'
import { Grid } from '@mui/material'
// import Button from '@mui/material/Button';
import { useEffect } from 'react'

function App() {

  const playerRef = useRef(null)

  const videoLink = "http://localhost:8000/uploads/courses/479c0c97-ebe0-4ed6-a83e-4359366115ea/index.m3u8"

  const videoPlayerOptions = {
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: videoLink,
        type: "application/x-mpegURL"
      }
    ]
  }

  const handlePlayerReady = (player) => {

    playerRef.current = player;

    // You can handle player events here, for example:

    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };
  
  const fetchAllVideos = () => {
    axios.get('http://localhost:8000/api/all-videos')
      .then((res) => {
          console.log(res.data)
      })
      .catch((err) => {
          console.log("Error in uploading: ", err)
      })
    };
  }

  useEffect(() => {
    // Fetch initial data or subscribe to events
    console.log('Component mounted');
    // Clean-up function can be returned here if needed
    return () => {
      console.log('Component unmounted');
    };
  }, [fetchAllVideos]);
  
  return (
      <>
    
        <ButtonAppBar />
        <UploadButton />

        <button className="filter">All</button>

 
          <Grid container spacing={3}>
            <Grid item xs={12} sm={3}>
              <VideoPlayer options={videoPlayerOptions} onReady={handlePlayerReady} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <VideoPlayer options={videoPlayerOptions} onReady={handlePlayerReady} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <VideoPlayer options={videoPlayerOptions} onReady={handlePlayerReady} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <VideoPlayer options={videoPlayerOptions} onReady={handlePlayerReady} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <VideoPlayer options={videoPlayerOptions} onReady={handlePlayerReady} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <VideoPlayer options={videoPlayerOptions} onReady={handlePlayerReady} />
            </Grid>

          </Grid>

      </>
    )
  }

  export default App