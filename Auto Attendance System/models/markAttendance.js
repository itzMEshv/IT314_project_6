const mongoose = require('mongoose')

const markAttendanceSchema = new mongoose.Schema({
    lectureId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    lectureName:{
        type:String,
        required:true
    },
    studentEmail:{
        type:String,
        required:true
    },
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }
})

module.exports = mongoose.model('MarkAttendance',markAttendanceSchema)