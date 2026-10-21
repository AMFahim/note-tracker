import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Types } from 'mongoose';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CursorPaginationDto } from '../../common/dto/pagination.dto';
import type { AuthUser } from '../../common/interfaces/auth-user.interface';
import { ParseObjectIdPipe } from '../../common/pipes/parse-object-id.pipe';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Public()
  @Get()
  findAll(@Query() query: CursorPaginationDto) {
    return this.postsService.findPage(query);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.postsService.findById(id);
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreatePostDto) {
    return this.postsService.create(user.id, dto);
  }
}
