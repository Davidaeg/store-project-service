export enum ErrorsName {
  BadRequestError = "BadRequestError",
  NotFoundException = "NotFoundException",
  ValidationError = "ValidationError",
  InternalServerError = "InternalServerError",
  UnprocessableEntityException = "UnprocessableEntityException",
  Unauthorized = "Unauthorized",
}

export enum HTTP_STATUS {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  UNPROCESSABLE_ENTITY = 422,
}
