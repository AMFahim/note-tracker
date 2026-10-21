import { applyDecorators } from '@nestjs/common';
import {
  ArrayMaxSize,
  IsArray,
  IsEmail,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import {
  EMAIL_MAX,
  INTEREST_MAX,
  INTEREST_MIN,
  INTEREST_PATTERN,
  INTERESTS_MAX,
  NAME_MAX,
  NAME_MIN,
  PASSWORD_MAX,
  PASSWORD_MIN,
} from '../constants/validation.constants';
import {
  NormalizeInterests,
  Trim,
  TrimLowerCase,
} from './transform.decorators';

export const IsName = () =>
  applyDecorators(
    Trim(),
    IsString(),
    Length(NAME_MIN, NAME_MAX, {
      message: `name must be ${NAME_MIN}–${NAME_MAX} characters`,
    }),
  );

export const IsEmailAddress = () =>
  applyDecorators(
    TrimLowerCase(),
    IsEmail({}, { message: 'email must be a valid email address' }),
    MaxLength(EMAIL_MAX, {
      message: `email must be at most ${EMAIL_MAX} characters`,
    }),
  );

export const IsPassword = (property = 'password') =>
  applyDecorators(
    IsString(),
    Length(PASSWORD_MIN, PASSWORD_MAX, {
      message: `${property} must be ${PASSWORD_MIN}–${PASSWORD_MAX} characters`,
    }),
    Matches(/[A-Za-z]/, { message: `${property} must contain a letter` }),
    Matches(/\d/, { message: `${property} must contain a number` }),
  );

export const IsInterestList = () =>
  applyDecorators(
    NormalizeInterests(),
    IsArray(),
    ArrayMaxSize(INTERESTS_MAX, {
      message: `interests must contain at most ${INTERESTS_MAX} items`,
    }),
    IsString({ each: true }),
    Length(INTEREST_MIN, INTEREST_MAX, {
      each: true,
      message: `interests must each be ${INTEREST_MIN}–${INTEREST_MAX} characters`,
    }),
    Matches(INTEREST_PATTERN, {
      each: true,
      message: 'interests may only contain letters, numbers, spaces or hyphens',
    }),
  );
