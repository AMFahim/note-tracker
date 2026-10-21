interface SeedUser {
  name: string;
  email: string;
  interests: string[];
}

export const SEED_PASSWORD = 'Demo1234';

export const SEED_USERS: SeedUser[] = [
  {
    name: 'Kenji Watanabe',
    email: 'kenji.watanabe@example.com',
    interests: ['chess', 'photography', 'cycling'],
  },
  {
    name: 'Lucía Fernández',
    email: 'lucia.fernandez@example.com',
    interests: ['reading', 'gardening', 'chess'],
  },
  {
    name: 'Tomasz Nowak',
    email: 'tomasz.nowak@example.com',
    interests: ['chess', 'history', 'cycling'],
  },
  {
    name: 'Priya Raman',
    email: 'priya.raman@example.com',
    interests: ['reading', 'hiking', 'photography'],
  },
  {
    name: 'Mateus Oliveira',
    email: 'mateus.oliveira@example.com',
    interests: ['football', 'cooking', 'hiking'],
  },
  {
    name: 'Ingrid Solberg',
    email: 'ingrid.solberg@example.com',
    interests: ['hiking', 'reading', 'knitting'],
  },
  {
    name: 'Yusuf Demir',
    email: 'yusuf.demir@example.com',
    interests: ['cooking', 'history', 'chess'],
  },
  {
    name: 'Mei Lin Tan',
    email: 'meilin.tan@example.com',
    interests: ['photography', 'gardening', 'reading'],
  },
];
