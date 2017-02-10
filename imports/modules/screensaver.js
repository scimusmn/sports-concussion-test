import Constants from './constants';
import { browserHistory } from 'react-router';
import logger from '../modules/logger';

let ssTimeout = {};
let ssShowing = false;

export const reset = () => {

  restartTimeout();

};

function restartTimeout() {

  Meteor.clearTimeout(ssTimeout);

  hideScreensaver();

  ssTimeout = Meteor.setTimeout(() => {

    showScreensaver();

  }, Constants.TIMEOUT_SECS * 1000);

}

function showScreensaver() {
  if (ssShowing == false) {
    console.log('showScreensaver()');
    ssShowing = true;

    // Log for analytics
    logger.info({message:'inactivity-timeout', test:Session.get('currentTest'), round:Session.get('attemptCount'), language:Session.get('languageKey')});

    // Navigate to main menu
    Session.set('appState', Constants.STATE_MAIN_MENU);
    browserHistory.push('/');

    // Might as well reload browser
    // here to clear any stragglers
    // App will realod into default
    // screensaver state.
    location.reload();

  }
}

function hideScreensaver() {
  if (ssShowing == true) {
    console.log('hideScreensaver()');
    ssShowing = false;
  }
}
