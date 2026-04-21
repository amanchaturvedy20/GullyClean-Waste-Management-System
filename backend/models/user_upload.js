const {model, Schema} = require("mongoose");

const userUploadSchema = new Schema({
    userId: {
        ref : "User",
        type: Schema.Types.ObjectId,
        required : true
    },
    fileUrl : {
        type : String,
        required : true
    },
    binId:{
        type : String
    },
    requestedDate : {
        type : Date,
        required : true
    },
    notes : {
        type : String
    },
    status : {
        type : String,
        enum : ['pending', 'approved', 'rejected', 'completed'],
        default : 'pending'
    }},
    {timestamps : true});

const userUploadModel = model("UserUploadModel", userUploadSchema);
module.exports = userUploadModel;