import { Controller, Get, Param, Query } from '@nestjs/common';
import { Types } from 'mongoose';
import { Public } from '../../common/decorators/public.decorator';
import { CursorPaginationDto } from '../../common/dto/pagination.dto';
import { ParseObjectIdPipe } from '../../common/pipes/parse-object-id.pipe';
import { PostsService } from './posts.service';

@Controller('users/:id/posts')
export class UserPostsController {
  constructor(private readonly postsService: PostsService) {}

  @Public()
  @Get()
  findByAuthor(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Query() query: CursorPaginationDto,
  ) {
    return this.postsService.findByAuthor(id, query);
  }
}
