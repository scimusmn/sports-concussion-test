import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Accounts } from 'meteor/accounts-base';

import { Localizations } from '../../api/localizations';
import { ConcussionTests } from '../../api/concussion-tests';
import { upsertConcussionTest } from '../../api/methods.js';
import faker from 'faker';

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

var locals = Localizations.find();

if (!locals || locals.count() == 0) {
  // Needs to be seeded
  seedLocalizations();

}

function seedLocalizations() {

  console.log('Seeding Localizations...');

  const localKeys = ['en', 'es_MX'];

  for (var i = 0; i < localKeys.length; i++) {

    const lKey = localKeys[i];

    // Set faker language.
    faker.locale = lKey;

    const localDoc = {
      languageKey: lKey,
      introTitle: faker.commerce.productAdjective() + ' ' + faker.commerce.productName(),
      introDescription: faker.lorem.paragraph(),
      concussionTestIds: [faker.company.bsNoun(), faker.company.bsNoun(), faker.company.bsNoun()],
    };

    Localizations.insert(localDoc);

  }

}

var cTests = ConcussionTests.find();

if (!cTests || cTests.count() == 0) {
  // Needs to be seeded
  seedConcussionTests();

}

function seedConcussionTests() {

  console.log('Seeding ConcussionTests...');

  const seedTests = ['Stroop', 'Go/No-go', 'Working Memory'];

  for (var i = 0; i < seedTests.length; i++) {

    const testTitle = seedTests[i];

    const doc = {
      titleFull: testTitle,
      titleShort: testTitle,
      description: faker.lorem.paragraph(),
      introInstruction: faker.lorem.paragraph(),
      buttonInstruction: faker.lorem.paragraph(),
      scoringInstruction: faker.lorem.paragraph(),
      scoreCategories: [faker.company.bsNoun(), faker.company.bsNoun(), faker.company.bsNoun()],
    };

    ConcussionTests.insert(doc);

  }

}
