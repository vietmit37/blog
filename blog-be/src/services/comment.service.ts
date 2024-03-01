import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '@entities/Comment.entity';
import { CommentsAndTotal } from '@interfaces/comment-and-total.interface';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}
  async findAll(): Promise<CommentsAndTotal> {
    const [comments, total] = await this.commentRepository.findAndCount({
      relations: ['user'],
      order: { id: 'ASC' },
    });

    return {
      comments,
      total,
    };
  }

  async findOne(id: number): Promise<Comment> {
    const user = await this.commentRepository.findOne({
      relations: ['user', 'post'],
      where: { id },
    });

    if (!user) {
      throw new HttpException(
        'Không tìm thấy bài Comment!',
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }
}
