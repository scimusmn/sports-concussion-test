import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Localizations = new Mongo.Collection('locals');

Localizations.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Localizations.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Localizations.schema = new SimpleSchema({
  languageKey: {
    type: String,
    label: 'The language key of the localization.',
  },
  introTitle: {
    type: String,
    label: 'The introduction title of this localization.',
  },
  introDescription: {
    type: String,
    label: 'The introduction decscription of this localization.',
  },
  beginInstruction: {
    type: String,
    label: 'The instruction to begin of this localization.',
  },
  mainMenuTitle: {
    type: String,
    label: 'The main menu title of this localization.',
  },
  navMainMenu: {
    type: String,
    label: 'The navigation main menu text of this localization.',
  },
  navHowToPlay: {
    type: String,
    label: 'The navigation How To Play text of this localization.',
  },
  navPlay: {
    type: String,
    label: 'The navigation Play text of this localization.',
  },
  colorRed: {
    type: String,
    defaultValue: 'Red',
    label: 'The word Red for this localization.',
  },
  colorOrange: {
    type: String,
    defaultValue: 'Orange',
    label: 'The word Orange for this localization.',
  },
  colorYellow: {
    type: String,
    defaultValue: 'Yellow',
    label: 'The word Yellow for this localization.',
  },
  colorGreen: {
    type: String,
    defaultValue: 'Green',
    label: 'The word Green for this localization.',
  },
  colorBlue: {
    type: String,
    defaultValue: 'Blue',
    label: 'The word Blue for this localization.',
  },
  colorPurple: {
    type: String,
    defaultValue: 'Purple',
    label: 'The word Purple for this localization.',
  },
  concussionTestIds: {
    type: [String],
    label: 'The concussion-test ids linked to this localization.',
  },
});

Localizations.attachSchema(Localizations.schema);

