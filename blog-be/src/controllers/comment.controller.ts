import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CommentService } from '@services/comment.service';
import { ICustomResponse } from '@interfaces/custom-response.interface';
import { CommentsAndTotal } from '@interfaces/comment-and-total.interface';
import { Comment } from '@entities/Comment.entity';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  @Get()
  async findAll(): Promise<ICustomResponse<CommentsAndTotal>> {
    return {
      message: 'Thành công!',
      result: await this.commentService.findAll(),
    };
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<ICustomResponse<Comment>> {
    return {
      message: 'Thành công!',
      result: await this.commentService.findOne(id),
    };
  }
}
