
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
      break;
    case 50: // 2 - Control button 2

      console.log('globalKeydown: Control button 2');
      break;
    case 51: // 3 - Control button 3

      console.log('globalKeydown: Control button 3');
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
      break;
    case 90: // Z - Test button RED

      console.log('globalKeydown: Test button RED');
      break;
    case 88: // X - Test button ORANGE

      console.log('globalKeydown: Test button ORANGE');
      break;
    case 67: // C - Test button YELLOW

      console.log('globalKeydown: Test button YELLOW');
      break;
    case 86: // V - Test button GREEN

      console.log('globalKeydown: Test button GREEN');
      break;
    case 66: // B - Test button BLUE

      console.log('globalKeydown: Test button BLUE');
      break;
    case 78: // N - Test button PURPLE

      console.log('globalKeydown: Test button PURPLE');
      break;

  }

}

function setLanguage(languageKey) {

  Session.set('languageKey', languageKey);

}

// Default to english
setLanguage('en');
