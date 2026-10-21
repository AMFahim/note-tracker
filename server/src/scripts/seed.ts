import { INestApplicationContext, Logger } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { Model, Types } from 'mongoose';
import { Role } from '../common/constants/role.enum';
import { Note } from '../modules/notes/schemas/note.schema';
import { Post } from '../modules/posts/schemas/post.schema';
import { CreateUserDto } from '../modules/users/dto/create-user.dto';
import { PasswordService } from '../modules/users/password.service';
import { User } from '../modules/users/schemas/user.schema';
import { UsersService } from '../modules/users/users.service';
import { runScript } from './script-context';
import { SEED_NOTES } from './seed-data/notes';
import { SEED_POSTS } from './seed-data/posts';
import { SEED_PASSWORD, SEED_USERS } from './seed-data/users';

const NOTES_PER_USER = 3;
const POSTS_PER_USER = 2;

async function toCreateUserDto(input: Partial<CreateUserDto>) {
  const dto = plainToInstance(CreateUserDto, input);
  await validateOrReject(dto, { whitelist: true, forbidNonWhitelisted: true });
  return dto;
}

async function upsertAdmin(app: INestApplicationContext, logger: Logger) {
  const dto = await toCreateUserDto({
    name: process.env.ADMIN_NAME ?? 'Administrator',
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    role: Role.Admin,
  });
  const userModel = app.get<Model<User>>(getModelToken(User.name));
  const existing = await userModel.findOne({ email: dto.email });

  if (!existing) {
    await app.get(UsersService).create(dto);
    logger.log(`Created admin ${dto.email}`);
    return;
  }

  existing.set({
    name: dto.name,
    role: Role.Admin,
    password: await app.get(PasswordService).hash(dto.password),
  });
  await existing.save();
  logger.log(`Updated admin ${dto.email}`);
}

function pickNotes(userIndex: number) {
  return Array.from(
    { length: NOTES_PER_USER },
    (_, offset) =>
      SEED_NOTES[(userIndex + offset * SEED_USERS.length) % SEED_NOTES.length],
  );
}

function createPostPicker() {
  const used = new Map<string, number>();
  return (interests: string[]) =>
    interests.slice(0, POSTS_PER_USER).flatMap((interest) => {
      const variants = SEED_POSTS[interest] ?? [];
      const index = used.get(interest) ?? 0;
      used.set(interest, index + 1);
      return variants.length ? [variants[index % variants.length]] : [];
    });
}

async function seedDemoData(app: INestApplicationContext, logger: Logger) {
  const usersService = app.get(UsersService);
  const userModel = app.get<Model<User>>(getModelToken(User.name));
  const noteModel = app.get<Model<Note>>(getModelToken(Note.name));
  const postModel = app.get<Model<Post>>(getModelToken(Post.name));
  const pickPosts = createPostPicker();
  let created = 0;

  for (const [index, seedUser] of SEED_USERS.entries()) {
    const posts = pickPosts(seedUser.interests);
    if (await userModel.exists({ email: seedUser.email })) {
      continue;
    }
    const user = await usersService.create(
      await toCreateUserDto({ ...seedUser, password: SEED_PASSWORD }),
    );
    const owner: Types.ObjectId = user._id;
    await noteModel.insertMany(
      pickNotes(index).map((note) => ({ ...note, owner })),
    );
    await postModel.insertMany(
      posts.map((post) => ({ ...post, author: owner })),
    );
    created += 1;
  }

  logger.log(
    `Created ${created} demo users (${SEED_USERS.length - created} already present)`,
  );
}

void runScript('Seed', async (app, logger) => {
  await upsertAdmin(app, logger);
  await seedDemoData(app, logger);
});
