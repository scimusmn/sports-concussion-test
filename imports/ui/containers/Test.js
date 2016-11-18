import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { Localizations } from '../../api/localizations.js';
import { ConcussionTests } from '../../api/concussion-tests.js';
import TestPage from '../pages/Test.js';
import Loading from '../components/Loading.js';

const composer = (params, onData) => {

  // This session variable is
  // reactive to toggle switch
  const curLanguageKey = Session.get('languageKey');

  const localsSubscription = Meteor.subscribe('locals');
  const cTestsSubscription = Meteor.subscribe('cTests');
  const curTestSlug = params.routeParams.slug;

  if (localsSubscription.ready() && cTestsSubscription.ready()) {

    console.log('Test: subscriptions ready');
    const localization = Localizations.findOne({languageKey: curLanguageKey });

    // Grab ids of associated tests
    const testIds = localization.concussionTestIds;

    // Test that matches current language
    // AND matches current slug
    const cTest = ConcussionTests.findOne({_id: { $in: testIds }, slug: curTestSlug});

    // Pass filtered data into component
    onData(null, { localization, cTest });

  }

};

export default composeWithTracker(composer, Loading)(TestPage);