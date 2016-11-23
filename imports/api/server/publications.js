import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Localizations } from '../localizations';
import { ConcussionTests } from '../concussion-tests';
import { Scores } from '../scores';

// Publish all Localizations
Meteor.publish('locals', () => Localizations.find());

// Publish all Concussion Tests
Meteor.publish('cTests', () => ConcussionTests.find());

// Publish all Scores
Meteor.publish('scores', () => Scores.find());
