import {
  HttpException,
  HttpStatus,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

function getConstraints(errors: ValidationError[]): string[] {
  const constraints: string[] = [];

  for (const error of errors) {
    if (error.constraints) {
      constraints.push(...Object.values(error.constraints));
    }

    if (error.children) {
      constraints.push(...getConstraints(error.children));
    }
  }

  return constraints;
}

export class MyValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[]) => {
        return new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: getConstraints(validationErrors).join(', '),
          },
          HttpStatus.BAD_REQUEST,
        );
      },
    });
  }
}
