import { ICustomResponse } from '@interfaces/custom-response.interface';
import {
  Catch,
  ExceptionFilter,
  ExecutionContext,
  ForbiddenException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { QueryFailedError, UpdateValuesMissingError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ExecutionContext): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status: number =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message =
      exception instanceof HttpException
        ? (exception.getResponse() as ICustomResponse).message
          ? (exception.getResponse() as ICustomResponse).message
          : exception.getResponse()
        : '';

    if (exception instanceof TypeError) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Lỗi server!';
    }

    if (exception instanceof ForbiddenException) {
      status = HttpStatus.FORBIDDEN;
      message = 'Bạn không có quyền truy cập tài nguyên này!';
    }

    if (exception instanceof JsonWebTokenError) {
      status = HttpStatus.UNAUTHORIZED;
      message = 'Không gửi kèm token!';
    }

    if (exception instanceof TokenExpiredError) {
      status = HttpStatus.UNAUTHORIZED;
      message = 'Hết thời hạn đăng nhập!';
    }

    if (exception instanceof QueryFailedError) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Lỗi truy vấn!';
    }

    if (exception instanceof UpdateValuesMissingError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Không thể cập nhật thông tin trống!';
    }

    response.status(status).json({
      message: message,
      statusCode: status,
    });
  }
}
