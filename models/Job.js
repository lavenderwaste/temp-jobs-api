const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, 'Please provide the company name'],
    maxlength:50
  },
  position: {
    type: String,
    required: [true, 'Please provide position'],
    maxlength:100
  },
  status: {
    type: String,
    enum:['interview', 'declined', 'pending'],
    default: 'pending'
  },
  createdBy: {
    type: mongoose.Types.ObjectId, //we tied this object with the User model, we assing each job with a User
    ref: 'User', //this is the reference that points to the User model
    required:[true, 'Please provide user']
  }
}, {timestamps:true})

module.exports = mongoose.model('Job', JobSchema)