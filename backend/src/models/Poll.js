import mongoose from "mongoose";

const pollSchema = new mongoose.Schema({
    title: String,
    options:[{
        text: String, 
        votes: {type:Number, default: 0}
    }],
    voters: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}]
})

export default mongoose.model("Poll", pollSchema)