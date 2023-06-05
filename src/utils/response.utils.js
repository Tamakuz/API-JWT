const responseWithData = (res, statusCode, data) => res.status(statusCode).json(data)

const ok = (res, data) => responseWithData(res, 200, data)

const created = (res, data) => responseWithData(res, 201, data)

const unauthorize = (res) => responseWithData(res, 401, {
  status: 401,
  message: "Unauthorized"
})

const error = (res) => responseWithData(res, 500, {
  status: 500,
  message: "Oops! something wrong!"
})

const badRequest = (res, message) => responseWithData(res, 400, {
  status: 400,
  message
})

export default {
  ok,
  created,
  unauthorize,
  error,
  badRequest
}