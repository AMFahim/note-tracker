interface SeedPost {
  title: string;
  body: string;
}

export const SEED_POSTS: Record<string, SeedPost[]> = {
  chess: [
    {
      title: 'Why I stopped memorising openings',
      body: 'For two years I learned lines twelve moves deep and still lost in the middlegame. Switching to understanding pawn structures did more for my rating in three months than all the memorisation.',
    },
    {
      title: 'Rook endgames are worth the effort',
      body: 'Most of my club games that reach an endgame reach a rook endgame. Lucena and Philidor positions took an evening each to learn and have saved more half points than anything else.',
    },
  ],
  reading: [
    {
      title: 'Reading slower on purpose',
      body: 'I set a rule this year: no more than two books a month, with notes after every chapter. I remember far more of what I read, and I abandon bad books sooner.',
    },
    {
      title: 'Three books that changed how I take notes',
      body: 'How to Take Smart Notes, The Shallows, and a worn copy of Montaigne. The first gave me a method, the second a reason, the third an example of thinking on paper.',
    },
    {
      title: 'Library cards are underrated',
      body: 'Between the local branch and the interlibrary loan service I have not bought a book in eight months. The waiting list also stops me from starting five books at once.',
    },
  ],
  photography: [
    {
      title: 'Shooting in flat light',
      body: 'Overcast days used to mean leaving the camera at home. Now they are my favourite for portraits and street scenes because the shadows stop fighting the subject.',
    },
    {
      title: 'One lens for a whole year',
      body: 'I kept a 35mm prime on the camera for twelve months. Walking closer instead of zooming changed what I noticed and how people reacted to being photographed.',
    },
  ],
  gardening: [
    {
      title: 'Tomatoes on a north-facing balcony',
      body: 'It is possible, but only with cherry varieties and a reflective board behind the pots. The harvest was small and very sweet.',
    },
    {
      title: 'Composting in a small flat',
      body: 'A sealed bokashi bin under the sink handles kitchen scraps without smell. Every few weeks it goes into the community garden bed downstairs.',
    },
  ],
  history: [
    {
      title: 'Reading primary sources without a guide',
      body: 'Letters and court records are harder going than a textbook, but they show how uncertain people were at the time. Start with a collection that has short introductions.',
    },
    {
      title: 'The museum audio guide I actually liked',
      body: 'Most audio guides repeat the wall labels. The one at the maritime museum used recordings from dock workers and changed how I saw the whole collection.',
    },
  ],
  hiking: [
    {
      title: 'Kungsleden in nine days: what I packed',
      body: 'Lighter than expected: one change of clothes, a down jacket, a gas stove and a paper map. The mosquito head net was the most valuable item by far.',
    },
    {
      title: 'Turning back is part of the hike',
      body: 'Fog came in a hundred metres below the ridge, so we turned around. The summit will still be there next summer.',
    },
  ],
  cooking: [
    {
      title: 'A weeknight dal that keeps for days',
      body: 'Red lentils, turmeric, cumin seeds tempered in ghee, and a squeeze of lime at the end. It tastes better on the third day than the first.',
    },
    {
      title: 'Learning to cook without recipes',
      body: 'I started by cooking the same three dishes every week and changing one ingredient each time. After a few months I could improvise with whatever was in the fridge.',
    },
  ],
  football: [
    {
      title: 'Five-a-side tactics for people over thirty',
      body: 'Keep the ball moving, stay compact, and let the youngest player do the pressing. We lost fewer games once we stopped all chasing the ball.',
    },
  ],
};
