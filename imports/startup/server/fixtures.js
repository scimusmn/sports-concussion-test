import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Accounts } from 'meteor/accounts-base';

import { Localizations } from '../../api/localizations';
import { ConcussionTests } from '../../api/concussion-tests';
import { upsertConcussionTest } from '../../api/methods.js';
import faker from 'faker';

// import s = require('underscore.string');
import s from 'underscore.string';

const users = [{
  email: 'admin@admin.com',
  password: 'password',
  profile: {
    name: { first: 'Carl', last: 'Winslow' },
  },
  roles: ['admin'],
},];

users.forEach(({ email, password, profile, roles }) => {
  const userExists = Meteor.users.findOne({ 'emails.address': email });

  if (!userExists) {
    const userId = Accounts.createUser({ email, password, profile });
    Roles.addUsersToRoles(userId, roles);
  }
});

var localizations = Localizations.find();

if (!localizations || localizations.count() == 0) {

  // Needs to be seeded
  seedLocalizations();

}

function seedLocalizations() {

  console.log('Seeding Localizations...');

  const localKeys = ['en', 'es_MX'];

  for (var i = 0; i < localKeys.length; i++) {

    const languageKey = localKeys[i];

    // Set faker language.
    faker.locale = languageKey;

    const localizationDoc = {
      languageKey: languageKey,
      introTitle: faker.commerce.productAdjective() + ' ' + faker.commerce.productName(),
      introDescription: faker.lorem.paragraph(),
      beginInstruction: 'Press the ' + faker.commerce.productAdjective() + ' button to begin.',
      mainMenuTitle: 'Pick A ' + faker.commerce.productAdjective() + ' Test',
      navMainMenu: 'Main menu ' + faker.locale,
      navHowToPlay: 'How to play ' + faker.locale,
      navPlay: 'Play ' + faker.locale,
      concussionTestIds: seedConcussionTests(),
    };

    Localizations.insert(localizationDoc);

  }

}

function seedConcussionTests() {

  console.log('Seeding ConcussionTests...');

  const seedTests = ['Stroop', 'Go/No-go', 'Working Memory'];

  let docIds = [];

  for (var i = 0; i < seedTests.length; i++) {

    const testTitle = seedTests[i];

    let scoreCategories = [];
    if (testTitle == 'Stroop') scoreCategories = ['percentCorrect', 'normalTime', 'interferenceTime', 'difference'];
    if (testTitle == 'Go/No-go') scoreCategories = ['percentCorrect', 'bestTime', 'averageTime'];
    if (testTitle == 'Working Memory') scoreCategories = ['percentCorrect', 'missedPairs', 'falsePairs', 'correctAnswers'];

    const doc = {
      titleFull: testTitle,
      titleShort: testTitle,
      slug: s.slugify(testTitle),
      description: faker.lorem.paragraph(),
      introInstruction: faker.lorem.paragraph(),
      buttonInstruction: faker.lorem.paragraph(),
      scoringTitle: 'Scoring ' + faker.locale,
      scoringInstruction: faker.lorem.paragraph(),
      scoreCategories: scoreCategories,
    };

    const docId = ConcussionTests.insert(doc);
    docIds.push(docId);

  }

  return docIds;

}
