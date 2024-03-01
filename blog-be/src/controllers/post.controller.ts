import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostService } from '@services/post.service';
import { ICustomResponse } from '@interfaces/custom-response.interface';
import {
  PostsAndTotal,
  PostsAndTotalPagnation,
} from '@interfaces/post-and-total.interface';
import { Post } from '@entities/Post.entity';
import RequestWithUser from '@interfaces/request-with-user.interface';
import JwtAuthenticationGuard from '@guards/jwt.guard';
import { FilterPostDto } from '@dtos/post/filter-post.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async findAll(): Promise<ICustomResponse<PostsAndTotal>> {
    return {
      message: 'Thành công!',
      result: await this.postService.findAll(),
    };
  }
  @Get('user')
  @UseGuards(JwtAuthenticationGuard)
  async findPostByUser(
    @Req() req: RequestWithUser,
    @Query() query: FilterPostDto,
  ): Promise<ICustomResponse<PostsAndTotalPagnation>> {
    return {
      result: await this.postService.findPostByUser(req.user, query),
      message: 'Thành công!',
    };
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<ICustomResponse<Post>> {
    return {
      message: 'Thành công!',
      result: await this.postService.findOne(id),
    };
  }
}
