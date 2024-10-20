const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  }
  next()
}

const notFound = (request, response) => {
  response.status(404).json({ error: 'Not Found' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (
    error.name === 'MongoServerError' &&
    error.message.includes('E11000 duplicate key error')
  ) {
    return response
      .status(400)
      .json({ error: 'expected `username` to be unique' })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' })
  } else if (error.name === 'PasswordValidation') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'InvalidToken') {
    return response.status(401).json({ error: e.message })
  } else if (error.name === 'Unauthorized') {
    return response.status(403).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  requestLogger,
  notFound,
  errorHandler,
  tokenExtractor,
}
