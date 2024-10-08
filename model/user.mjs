import mongoose from "mongoose";

const user = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required :true
    },
    password : {
        type : String,
        required : true
    }
}, {
    timestamps : true,
    collection : 'all_users'
});

const User = mongoose.model('User', user)
export default User