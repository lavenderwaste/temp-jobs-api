const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {

  const user = await User.create({ ...req.body })
  const token = user.createJWT() //from our User model we invoque our named createJWT for the token

  res.status(StatusCodes.CREATED).json({user: { name:user.name }, token })
}

const login = async (req, res) => {
  const {email, password} = req.body

  if(!email || !password) {
    throw new BadRequestError('please provide email and password')
  }

  const user = await User.findOne({email})

  if(!user) {
    throw new UnauthenticatedError('Invalid credentials')
  }

  //compare password to login
  const isPasswordCorrect = await user.comparePassword(password) //we get the password that the user input and compare it
  //then we check the password comparisson
  if(!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid credentials')
  }

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token})
}

module.exports = {
  register,
  login,
}