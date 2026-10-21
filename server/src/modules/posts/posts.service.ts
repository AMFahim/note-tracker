import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import { CursorPaginationDto } from '../../common/dto/pagination.dto';
import { toObjectId } from '../../common/utils/object-id.util';
import {
  cursorOfId,
  beforeCursor,
  Page,
  sliceWindow,
  toPage,
} from '../../common/utils/pagination.util';
import { User } from '../users/schemas/user.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UserPosts } from './interfaces/user-posts.interface';
import { Post, PostDocument } from './schemas/post.schema';

const AUTHOR_FIELDS = 'name';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(
    author: Types.ObjectId,
    dto: CreatePostDto,
  ): Promise<PostDocument> {
    const post = await this.postModel.create({ ...dto, author });
    return post.populate('author', AUTHOR_FIELDS);
  }

  async findPage({
    limit,
    cursor,
  }: CursorPaginationDto): Promise<Page<PostDocument[]>> {
    const posts = await this.postModel
      .find(beforeCursor(cursor))
      .sort({ _id: -1 })
      .limit(limit + 1)
      .populate('author', AUTHOR_FIELDS);
    return toPage(posts, limit, cursorOfId);
  }

  async findById(id: Types.ObjectId): Promise<PostDocument> {
    const post = await this.postModel
      .findById(id)
      .populate('author', AUTHOR_FIELDS);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async findByAuthor(
    authorId: Types.ObjectId,
    { limit, cursor }: CursorPaginationDto,
  ): Promise<Page<UserPosts>> {
    const postStages: PipelineStage.Lookup['$lookup']['pipeline'] = [
      ...(cursor ? [{ $match: { _id: { $lt: toObjectId(cursor) } } }] : []),
      { $sort: { _id: -1 } },
      { $limit: limit + 1 },
      {
        $project: {
          _id: 0,
          id: '$_id',
          title: '$title',
          body: '$body',
          createdAt: '$createdAt',
        },
      },
    ];

    const [result] = await this.userModel.aggregate<UserPosts>([
      { $match: { _id: authorId } },
      { $project: { name: 1 } },
      {
        $lookup: {
          from: this.postModel.collection.name,
          localField: '_id',
          foreignField: 'author',
          pipeline: postStages,
          as: 'posts',
        },
      },
      { $project: { _id: 0, author: { id: '$_id', name: '$name' }, posts: 1 } },
    ]);

    if (!result) {
      throw new NotFoundException('User not found');
    }

    const { items, meta } = sliceWindow(result.posts, limit, (post) =>
      post.id.toHexString(),
    );
    return new Page({ author: result.author, posts: items }, meta);
  }

  async deleteByAuthor(author: Types.ObjectId): Promise<void> {
    await this.postModel.deleteMany({ author });
  }
}
