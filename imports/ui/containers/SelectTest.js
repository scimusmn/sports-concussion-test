import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { Localizations } from '../../api/localizations.js';
import { ConcussionTests } from '../../api/concussion-tests.js';
import SelectTestPage from '../pages/SelectTest.js';
import Loading from '../components/Loading.js';

const composer = (params, onData) => {

  // This session variable is
  // reactive to toggle switch
  const curLanguageKey = Session.get('languageKey');

  const localsSubscription = Meteor.subscribe('locals');
  const cTestsSubscription = Meteor.subscribe('cTests');

  if (localsSubscription.ready() && cTestsSubscription.ready()) {

    console.log('SelectTest: subscriptions ready');
    const localization = Localizations.findOne({languageKey: curLanguageKey });

    // Grab ids of associated tests
    const testIds = localization.concussionTestIds;

    const cTests = ConcussionTests.find({_id: { $in: testIds }}).fetch();

    // We want to make the subscription
    // reliant on appState so if it changes
    // after a screensaver, it will re-render.
    const appState = Session.get('appState');

    // Pass filtered data into component
    onData(null, { localization, cTests });

  }

};

export default composeWithTracker(composer, Loading)(SelectTestPage);
