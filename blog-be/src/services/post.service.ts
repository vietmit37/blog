import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '@entities/Post.entity';
import {
  PostsAndTotal,
  PostsAndTotalPagnation,
} from '@interfaces/post-and-total.interface';
import { User } from '@entities/User.entity';
import { FilterPostDto } from '@dtos/post/filter-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}
  async findAll(): Promise<PostsAndTotal> {
    const [posts, total] = await this.postRepository.findAndCount({
      relations: ['user'],
      order: { id: 'ASC' },
    });

    return {
      posts,
      total,
    };
  }

  async findOne(id: number): Promise<Post> {
    const user = await this.postRepository.findOne({
      relations: ['tags', 'comment'],
      where: { id },
    });

    if (!user) {
      throw new HttpException('Không tìm thấy bài Post!', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async findPostByUser(
    user: User,
    query: FilterPostDto,
  ): Promise<PostsAndTotalPagnation> {
    const item_per_page = Number(query.item_per_page) || 10;
    const page = Number(query.page) || 1;
    const skip = (page - 1) * item_per_page;
    const [posts, total] = await this.postRepository.findAndCount({
      where: { user: { id: user.id } },
      relations: ['user', 'tags', 'comment'],
      order: { createdDate: 'DESC' },
      take: item_per_page,
      skip,
    });
    const lastPage = Math.ceil(total / item_per_page);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;
    return { posts, total, currentPage: page, nextPage, prevPage, lastPage };
  }
}
