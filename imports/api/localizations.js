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
  concussionTestIds: {
    type: [String],
    label: 'The concussion-test ids linked to this localization.',
  },
});

Localizations.attachSchema(Localizations.schema);

