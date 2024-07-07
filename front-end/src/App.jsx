import './App.css';
import VideoPlayer from './VideoPlayer';
import ButtonAppBar from './Header';
import UploadButton from './UploadButton';
import { useEffect, useRef, useState  } from 'react';
import { Grid } from '@mui/material';
import axios from 'axios'; // Don't forget to import axios
import zIndex from '@mui/material/styles/zIndex';

function App() {
  const playerRef = useRef(null);
  const [allVideoLinks, setAllVideoLinks] = useState([])
  const addVideoURL = (elem) =>{
    setAllVideoLinks([ elem, ...allVideoLinks])
  }
  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
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
        setAllVideoLinks(res.data)
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
      <ButtonAppBar />
      <UploadButton addURL={addVideoURL} />

      <button className="filter">All</button>

      <Grid container spacing={3}>
      {allVideoLinks.map((videoData, index) => (
          <Grid key={index} item xs={12} sm={3}>
            <VideoPlayer options={{
              controls: true,
              responsive: true,
              fluid: true,
              sources: [
                {
                  src: videoData.videoPath,
                  type: "application/x-mpegURL"
                }
              ]
            }} onReady={handlePlayerReady} />
          </Grid>
      ))}
      </Grid>
    </>
  );
}

export default App;
