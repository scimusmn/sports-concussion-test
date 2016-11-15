import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Documents from '../documents/documents';
import ConcussionTests from '../concussion-tests';

Meteor.publish('documents.list', () => Documents.find());

Meteor.publish('documents.view', (_id) => {
  check(_id, String);
  return Documents.find(_id);
});

Meteor.publish('cTests', () => ConcussionTests.find());
