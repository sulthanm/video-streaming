import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
    title: {
        type : String,
        required : true
    },
    videoPath: {
        type : String,
        required : true
    }

},{
    collection : 'all_videos'
});

const Video =  mongoose.model('Video', videoSchema);

export default Video