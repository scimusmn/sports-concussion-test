import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Documents from '../documents/documents';
import { Localizations } from '../localizations';
import { ConcussionTests } from '../concussion-tests';


Meteor.publish('documents.list', () => Documents.find());

Meteor.publish('documents.view', (_id) => {
  check(_id, String);
  return Documents.find(_id);
});

// Publish all Localizations
Meteor.publish('locals', () => Localizations.find());

// Publish all Concussion Tests
Meteor.publish('cTests', () => ConcussionTests.find());
