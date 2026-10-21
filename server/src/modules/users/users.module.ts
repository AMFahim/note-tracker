import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotesModule } from '../notes/notes.module';
import { PostsModule } from '../posts/posts.module';
import { PasswordService } from './password.service';
import { ProfileController } from './profile.controller';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    NotesModule,
    PostsModule,
  ],
  controllers: [ProfileController, UsersController],
  providers: [UsersService, PasswordService],
  exports: [UsersService, PasswordService],
})
export class UsersModule {}
