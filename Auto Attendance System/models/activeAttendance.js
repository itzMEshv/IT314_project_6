const mongoose = require('mongoose')

const activeAttendanceSchema = new mongoose.Schema({
    lectureId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    startTime:{
        type:Date,
        required:true
    },
    minutes:{
        type: Number,
        required:true
    }
})

module.exports = mongoose.model('ActiveAttendance',activeAttendanceSchema)