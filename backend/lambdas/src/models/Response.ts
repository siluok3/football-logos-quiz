export interface ApiResponse<T> {
  statusCode: number;
  body: string;
}

export interface ErrorResponse {
  statusCode: number;
  body: string;
}

export function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
}

export function createErrorResponse(message: string, statusCode = 500): ErrorResponse {
  return {
    statusCode: statusCode,
    body: JSON.stringify({ message }),
  };
}