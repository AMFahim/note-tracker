import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note } from '../modules/notes/schemas/note.schema';
import { Post } from '../modules/posts/schemas/post.schema';
import { User } from '../modules/users/schemas/user.schema';
import { runScript } from './script-context';

const MODEL_NAMES = [User.name, Note.name, Post.name];

void runScript('SyncIndexes', async (app, logger) => {
  for (const name of MODEL_NAMES) {
    const model = app.get<Model<unknown>>(getModelToken(name));
    const dropped = await model.syncIndexes();
    const indexes = (await model.listIndexes()) as { name: string }[];
    logger.log(
      `${model.collection.name}: ${indexes.map((index) => index.name).join(', ')}` +
        (dropped.length ? ` (dropped ${dropped.join(', ')})` : ''),
    );
  }
});
