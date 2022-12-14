// const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {

  let customError = {
    // set defaults errors
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, please try again'
  }

  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // } just for reference

  //check for the type of error
  if(err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors).map((item) => item.message).join(',') //if you check the whole error object you will find errors: password, name, or email objects and their values, inside them they have the message which we need
    customError.statusCode = 400
  }

  if(err.code && err.code === 11000) { //check error code in the postman, this is for duplicate email
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value` //we used js Object.keys since not it will only appear as "[Object object]"
    customError.statusCode = 400 //bad request
  }

  if(err.name === 'CastError') { //single job error, in postman put a wrong id job and you will get the error
    customError.msg = `No item found with id: ${err.value}`
    customError.statusCode = 404
  }
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err }) //use this for checking the complete error object and gather the information you want to use, like keyValue, 'ValidationError', 'CastError', message, etc
  return res.status(customError.statusCode).json({ msg: customError.msg }) //use this to check the final result of your custom error status and messages

}

module.exports = errorHandlerMiddleware
