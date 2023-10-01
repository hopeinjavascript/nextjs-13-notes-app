// REPONSES ARE GROUPED IN FIVE CATEGORIES

// Informational responses (100 – 199)
// Successful responses (200 – 299)
// Redirection messages (300 – 399)
// Client error responses (400 – 499)
// Server error responses (500 – 599)

export const HTTP_STATUS_CODES = {
  // status codes
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,

  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403, // not allowed!
  NOT_FOUND: 404,
  PAYLOAD_TOO_LARGE: 413,
  TOO_MANY_REQUESTS: 429,

  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
  INSUFFICIENT_STOiRAGE: 507,
};

export default function setResponse(res) {
  return {
    success(msg, data) {
      res.status(HTTP_STATUS_CODES.SUCCESS).json({
        success: true,
        msg,
        data,
      });
    },
    created(msg, data) {
      res.status(HTTP_STATUS_CODES.CREATED).json({
        success: true,
        msg,
        data,
      });
    },
    noContent(msg) {
      res.status(HTTP_STATUS_CODES.NO_CONTENT).json({
        success: true,
        msg,
      });
    },

    badRequest(msg) {
      res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        success: false,
        msg,
      });
    },
    unauthorized(msg) {
      res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        msg,
      });
    },
    forbidden(msg) {
      res.status(HTTP_STATUS_CODES.FORBIDDEN).json({
        success: false,
        msg,
      });
    },
    notFound(msg) {
      res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
        success: false,
        msg,
      });
    },
    payloadTooLarge(msg) {
      res.status(HTTP_STATUS_CODES.PAYLOAD_TOO_LARGE).json({
        success: false,
        msg,
      });
    },
    tooManyRequests(msg) {
      res.status(HTTP_STATUS_CODES.TOO_MANY_REQUESTS).json({
        success: false,
        msg,
      });
    },

    internalServerError(msg) {
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        msg,
      });
    },
    serviceUnavailable(msg) {
      res.status(HTTP_STATUS_CODES.SERVICE_UNAVAILABLE).json({
        success: false,
        msg,
      });
    },
    insufficientStorage(msg) {
      res.status(HTTP_STATUS_CODES.INSUFFICIENT_STORAGE).json({
        success: false,
        msg,
      });
    },
  };
}
