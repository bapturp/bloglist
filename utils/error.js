const InvalidTokenError = () => {
  const e = new Error('invalid token')
  e.name = 'InvalidToken'
  return e
}

const UnauthorizedError = () => {
  const e = new Error('Unauthorized')
  e.name = 'Unauthorized'
  return e
}

module.exports = {
  InvalidTokenError,
  UnauthorizedError,
}
