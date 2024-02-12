export enum ErrorsName {
  BadRequestError = "BadRequestError",
  NotFoundException = "NotFoundException",
  ValidationError = "ValidationError",
  InternalServerError = "InternalServerError",
  UnprocessableEntityException = "UnprocessableEntityException",
}

export enum HTTP_STATUS {
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  UNPROCESSABLE_ENTITY = 422,
}
