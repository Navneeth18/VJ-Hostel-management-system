const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: function() {
            return !this.image; // Only required if there's no image
        },
        default: ''
    },
    sender: {
        type: String,
        required: true
    },
    senderModel: {
        type: String,
        required: true,
        enum: ['Student', 'Admin']
    },
    senderName: {
        type: String,
        required: true
    },
    senderRollNumber: {
        type: String,
        default: null
    },
    senderProfilePhoto: {
        type: String,
        default: null
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    image: {
        type: String,
        default: null
    },
    room: {
        type: String,
        default: 'community'
    }
}, { timestamps: true });

const MessageModel = mongoose.model('Message', messageSchema);

module.exports = MessageModel;
