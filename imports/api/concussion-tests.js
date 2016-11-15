import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const ConcussionTests = new Mongo.Collection('cTests');

ConcussionTests.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

ConcussionTests.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

ConcussionTests.schema = new SimpleSchema({
  titleFull: {
    type: String,
    label: 'The full title of the test.',
  },
  titleShort: {
    type: String,
    label: 'The shortened title of the test.',
  },
  description: {
    type: String,
    label: 'The full description of the test.',
  },
  introInstruction: {
    type: String,
    label: 'The introductory instructions of the test.',
  },
  buttonInstruction: {
    type: String,
    label: 'The bottom button instruction of the test.',
  },
  scoringInstruction: {
    type: String,
    label: 'The scoring instructions of the test.',
  },
  scoreCategories: {
    type: [String],
    label: 'The categories used in scoring the test.',
  },
});

ConcussionTests.attachSchema(ConcussionTests.schema);


