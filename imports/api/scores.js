import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Scores = new Mongo.Collection('scores');

Scores.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Scores.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Scores.schema = new SimpleSchema({
  testKey: {
    type: String,
    label: 'The test that generated this score.',
    optional: false,
  },
  timestamp: {
    type: Number,
    label: 'The timestamp taken when this score was generated.',
    optional: false,
  },
  percentCorrect: {
    type: String,
    label: 'Percent correct of this score.',
    optional: true,
  },
  normalTime: {
    type: String,
    label: 'Normal time of this score.',
    optional: true,
  },
  interferenceTime: {
    type: String,
    label: 'Interference time of this score.',
    optional: true,
  },
  difference: {
    type: String,
    label: 'Difference between normal and interference times.',
    optional: true,
  },
  bestTime: {
    type: String,
    label: 'Best time of this score.',
    optional: true,
  },
  averageTime: {
    type: String,
    label: 'Average time of this score.',
    optional: true,
  },
  missedPairs: {
    type: String,
    label: 'Number of pairs missed.',
    optional: true,
  },
  falsePairs: {
    type: String,
    label: 'Number of false pairs.',
    optional: true,
  },
  correctAnswers: {
    type: String,
    label: 'Number of correct answers.',
    optional: true,
  },
});

Scores.attachSchema(Scores.schema);

