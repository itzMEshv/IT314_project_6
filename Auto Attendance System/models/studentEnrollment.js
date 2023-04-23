const mongoose = require('mongoose')

const studentEnrollmentSchema = new mongoose.Schema({
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    studentEmail:{
        type:String,
        required:true
    },
    instructorId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    courseCode:{
        type:String,
        required: true
    },
    courseName:{
        type:String,
        required:true
    },
    instructorName:{
        type:String,
        required:true
    },
    instructorEmail:{
        type:String,
        required:true
    },
    studentName:{
        type:String
    }
})

module.exports = mongoose.model('StudentEnrollment',studentEnrollmentSchema)