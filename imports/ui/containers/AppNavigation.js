import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import Loading from '../components/Loading.js';
import { Localizations } from '../../api/localizations.js';
import AppNavigation from '../components/AppNavigation.js';

const composer = (params, onData) => {

  // This session variable is
  // reactive to toggle switch
  const curLanguageKey = Session.get('languageKey');
  const appState = Session.get('appState');

  const localsSubscription = Meteor.subscribe('locals');

  if (localsSubscription.ready()) {

    const localization = Localizations.findOne({languageKey: curLanguageKey });

    // Pass filtered data into component
    onData(null, { localization, appState });

  }

};

export default composeWithTracker(composer, Loading)(AppNavigation);
