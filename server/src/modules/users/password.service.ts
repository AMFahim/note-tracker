import { Injectable, OnModuleInit } from '@nestjs/common';
import * as argon2 from 'argon2';
import { randomBytes } from 'node:crypto';

const ARGON2_OPTIONS: argon2.HashOptions = {
  type: argon2.argon2id,
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
};

@Injectable()
export class PasswordService implements OnModuleInit {
  private dummyHash: string;

  async onModuleInit() {
    this.dummyHash = await this.hash(randomBytes(32).toString('hex'));
  }

  hash(plain: string): Promise<string> {
    return argon2.hash(plain, ARGON2_OPTIONS);
  }

  verify(hash: string, plain: string): Promise<boolean> {
    return argon2.verify(hash, plain);
  }

  async verifyTimingSafe(hash: string | undefined, plain: string) {
    const matches = await this.verify(hash ?? this.dummyHash, plain);
    return hash !== undefined && matches;
  }
}
