const mongoose = require('mongoose')

const allCoursesSchema = new mongoose.Schema({
    courseCode:{
        type:String,
        required:true
    },
    instructorId:{
        type:mongoose.Schema.Types.ObjectId,
        required: true
    },
    courseName:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('AllCourses',allCoursesSchema)