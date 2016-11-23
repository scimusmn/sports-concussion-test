import Constants from '../../modules/constants';
import { browserHistory } from 'react-router';

/**
 *
 * Listen for keystrokes
 * across entire application.
 *
 */

document.addEventListener('keydown', function(event) {

  globalKeydown(event.which);

});

function globalKeydown(key) {

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

  if (appState == Constants.STATE_MAIN_MENU) {

    // Begin test in 'how to play' state.
    Session.set('appState', Constants.STATE_HOW_TO_PLAY);

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
      break;
  }

  // TODO - If current game is

}

function colorPress(color) {

  const appState = Session.get('appState');

  if (appState == Constants.STATE_PLAY) {
    console.log('Trigger color press: ' + color);
  }

}

// Default to english
setLanguage('en');
