import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Accounts } from 'meteor/accounts-base';

import { Localizations } from '../../api/localizations';
import { ConcussionTests } from '../../api/concussion-tests';
import { Scores } from '../../api/scores';
import faker from 'faker';

import s from 'underscore.string';

var localizations = Localizations.find();

if (!localizations || localizations.count() == 0) {

  // Seed static data from
  // external json files
  loadLocalizations();
  loadConcussionTests();

  // If you have no json
  // files, seed with lorem ipsum.
  // seedLocalizations();

}

var scores = Scores.find();

if (!scores || scores.count() == 0) {

  // Create 10 placeholder scores
  for (var i = 0; i < 30; i++) {

    let testKey = 'stroop';
    if (i >= 10) testKey = 'gono-go';
    if (i >= 20) testKey = 'working-memory';

    const scoreDoc = {
      testKey: testKey,
      timestamp: Math.ceil(Math.random() * 10000),
      percentCorrect: '--',
      normalTime: '--',
      interferenceTime: '--',
      difference: '--',
      bestTime: '--',
      averageTime: '--',
      missedPairs: '--',
      falsePairs: '--',
      correctPairs: '--',
    };

    Scores.insert(scoreDoc);

  }

}

function loadLocalizations() {

  var data = JSON.parse(Assets.getText('locals.json'));
  data.forEach(function(item, index, array) {
    Localizations.insert(item);
  });

}

function loadConcussionTests() {

  var data = JSON.parse(Assets.getText('cTests.json'));
  data.forEach(function(item, index, array) {
    ConcussionTests.insert(item);
  });

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
      introTitle: faker.commerce.productName(),
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
      demoTitle: 'Instructions' + faker.locale,
      demoInstruction: faker.lorem.paragraph(),
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

