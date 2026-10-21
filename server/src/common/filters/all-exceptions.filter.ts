import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { mongo, Error as MongooseError } from 'mongoose';
import { STATUS_CODES } from 'node:http';

const DUPLICATE_KEY = 11000;

interface ResolvedError {
  statusCode: HttpStatus;
  message: string[];
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();
    const { statusCode, message } = this.resolve(exception);

    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(exception);
    }

    response.status(statusCode).json({
      statusCode,
      error: STATUS_CODES[statusCode],
      message,
      path: request.originalUrl,
      timestamp: new Date().toISOString(),
    });
  }

  private resolve(exception: unknown): ResolvedError {
    if (exception instanceof HttpException) {
      return {
        statusCode: exception.getStatus(),
        message: this.messagesOf(exception),
      };
    }
    if (
      exception instanceof mongo.MongoServerError &&
      exception.code === DUPLICATE_KEY
    ) {
      const keyValue = (exception.keyValue ?? {}) as Record<string, unknown>;
      const field = Object.keys(keyValue)[0] ?? 'value';
      return {
        statusCode: HttpStatus.CONFLICT,
        message: [`${field} is already in use`],
      };
    }
    if (exception instanceof MongooseError.CastError) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: [`${exception.path} is invalid`],
      };
    }
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: ['Internal server error'],
    };
  }

  private messagesOf(exception: HttpException): string[] {
    const body = exception.getResponse();
    if (typeof body === 'string') {
      return [body];
    }
    const { message } = body as { message?: string | string[] };
    if (Array.isArray(message)) {
      return message;
    }
    return [message ?? exception.message];
  }
}
