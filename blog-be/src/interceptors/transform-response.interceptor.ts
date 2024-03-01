import {
  CallHandler,
  ClassSerializerInterceptor,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class Response<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformResponseInterceptor<T>
  extends ClassSerializerInterceptor
  implements NestInterceptor<T, Promise<Response<T>>>
{
  intercept(
    context: ExecutionContext,
    call$: CallHandler,
  ): Observable<Promise<Response<T>>> {
    return call$.handle().pipe(
      map(async (data) => {
        return {
          statusCode: context.switchToHttp().getResponse().statusCode,
          message: data.message,
          data: instanceToPlain(data.result) as unknown as T,
        };
      }),
    );
  }
}
