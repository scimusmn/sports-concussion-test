import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { check } from 'meteor/check';
import Localizations from './localizations';
import ConcussionTests from './concussion-tests';
import { Scores } from './scores';
import logger from '../modules/logger.js';

Meteor.methods({

  submitScore(data) {

    check(data, Scores.schema);

    logger.info({message:'test-completed', results:data});

    Scores.insert(data);

    return true;

  },

});
