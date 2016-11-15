import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import ConcussionTests from './concussion-tests';

export const upsertConcussionTest = new ValidatedMethod({
  name: 'cTests.upsert',
  validate: new SimpleSchema({
    titleFull: { type: String, optional: true },
  }).validator(),
  run(document) {
    return ConcussionTests.upsert({ _id: document._id }, { $set: document });
  },
});

export const removeConcussionTest = new ValidatedMethod({
  name: 'cTests.remove',
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  run({ _id }) {
    ConcussionTests.remove(_id);
  },
});
