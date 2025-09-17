const mongoose = require('mongoose');


const chatSchame = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    title:{
        type: String,
        required: true
    },
    lastActivityAt: {
        type: Date,
        default: Date.now
    }
},{
    timestamps: true
})

const chatModel = mongoose.model('chat', chatSchame);

module.exports = chatModel;