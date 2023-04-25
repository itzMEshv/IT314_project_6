const mongoose = require('mongoose')

const allLecturesSchema = new mongoose.Schema({
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    lectureName:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('AllLectures',allLecturesSchema)