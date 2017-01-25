import Constants from '../../modules/constants';
import { reset } from '../../modules/screensaver';
import logger from '../../modules/logger';
import { browserHistory } from 'react-router';

/**
 *
 * Listen for keystrokes
 * across entire application.
 *
 * 1 - Control button 1
 * 2 - Control button 2
 * 3 - Control button 3
 * O - Language toggle ENGLISH
 * P - Language toggle SPANISH
 * T - Test button TRIANGLE
 * Z - Test button RED
 * X - Test button ORANGE
 * C - Test button YELLOW
 * V - Test button GREEN
 * B - Test button BLUE
 * N - Test button PURPLE
 *
 */

document.addEventListener('keydown', function(event) {

  globalKeydown(event.which);

});

function globalKeydown(key) {

  reset();

  switch (key) {
    case 49: // 1 - Control button 1

      console.log('globalKeydown: Control button 1');
      controlPress(1);
      break;
    case 50: // 2 - Control button 2

      console.log('globalKeydown: Control button 2');
      controlPress(2);
      break;
    case 51: // 3 - Control button 3

      console.log('globalKeydown: Control button 3');
      controlPress(3);
      break;
    case 79: // O - Language toggle ENGLISH

      console.log('globalKeydown: Language toggle ENGLISH');
      setLanguage('en');
      break;
    case 80: // P - Language toggle SPANISH

      console.log('globalKeydown: Language toggle SPANISH');
      setLanguage('es_MX');
      break;
    case 84: // T - Test button TRIANGLE

      console.log('globalKeydown: Test button TRIANGLE');
      trianglePress();
      break;
    case 90: // Z - Test button RED

      console.log('globalKeydown: Test button RED');
      colorPress('red');
      break;
    case 88: // X - Test button ORANGE

      console.log('globalKeydown: Test button ORANGE');
      colorPress('orange');
      break;
    case 67: // C - Test button YELLOW

      console.log('globalKeydown: Test button YELLOW');
      colorPress('yellow');
      break;
    case 86: // V - Test button GREEN

      console.log('globalKeydown: Test button GREEN');
      colorPress('green');
      break;
    case 66: // B - Test button BLUE

      console.log('globalKeydown: Test button BLUE');
      colorPress('blue');
      break;
    case 78: // N - Test button PURPLE

      console.log('globalKeydown: Test button PURPLE');
      colorPress('purple');
      break;

  }

}

function setLanguage(languageKey) {

  Session.set('languageKey', languageKey);

}

function controlPress(num) {

  const appState = Session.get('appState');

  // Send message to any listeners
  if (numPressCallback) {
    numPressCallback(num);
  }

  if (appState == Constants.STATE_MAIN_MENU) {

    // Begin test in 'how to play' state.
    Session.set('appState', Constants.STATE_HOW_TO_PLAY);

    // Log for analytics
    logger.info({message:'test-selection', test:num});

    // Navigate to selected test
    switch (num) {
      case 1:
        browserHistory.push('/test/' + Constants.TEST_STROOP);
        break;
      case 2:
        browserHistory.push('/test/' + Constants.TEST_GONOGO);
        break;
      case 3:
        browserHistory.push('/test/' + Constants.TEST_WORKING_MEMORY);
        break;
    }

  } else {

    // Switch app state
    switch (num) {
      case 1:

        // Navigate to main menu
        Session.set('appState', Constants.STATE_MAIN_MENU);
        browserHistory.push('/');
        break;
      case 2:
        Session.set('appState', Constants.STATE_HOW_TO_PLAY);
        break;
      case 3:
        Session.set('appState', Constants.STATE_PLAY);
        break;
    }

  }

}

function trianglePress() {

  const appState = Session.get('appState');

  switch (appState) {
    case Constants.STATE_INTRO:
      Session.set('appState', Constants.STATE_MAIN_MENU);
      console.log('appState GO TO MAIN', Session.get('appState'));

      break;
    case Constants.STATE_PLAY:
      trianglePressCallback();
      break;
  }

}

function colorPress(color) {

  const appState = Session.get('appState');

  if (appState == Constants.STATE_PLAY) {
    colorPressCallback(color);
  }

}

var numPressCallback = function(num) {};

export var setNumPressCallback = function(func) {

  numPressCallback = func;

};

var colorPressCallback = function(color) {};

export var setColorPressCallback = function(func) {

  colorPressCallback = func;

};

var trianglePressCallback = function() {};

export var setTrianglePressCallback = function(func) {

  trianglePressCallback = func;

};

// Default to english
setLanguage('en');
