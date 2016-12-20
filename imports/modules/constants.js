export default class Constants {};

// App state enumeration
Constants.STATE_INTRO = 0;
Constants.STATE_MAIN_MENU = 1;
Constants.STATE_HOW_TO_PLAY = 2;
Constants.STATE_PLAY = 3;
Constants.STATE_PLAY_SCORE = 4;

// Concussion test ids
Constants.TEST_STROOP = 'stroop';
Constants.TEST_GONOGO = 'gono-go';
Constants.TEST_WORKING_MEMORY = 'working-memory';

// Stroop
Constants.STROOP_TOTAL_ATTEMPTS = 10;
Constants.STROOP_DELAY_BETWEEN_WORDS = 500;

// Stroop colors
Constants.COLOR_WORDS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
Constants.COLOR_COLORS = {red:'#FF0000',
                          orange:'#FFA500',
                          yellow:'#FFFF00',
                          green:'#00FF00',
                          blue:'#0000FF',
                          purple:'#800080',};

// Go No Go
Constants.GNG_SYMBOLS_PER_TEST = 10;
Constants.GNG_DELAY_BETWEEN_SYMBOLS = 3000;
Constants.GNG_GUESS_LOCKOUT = 1500;

// Working Memory
Constants.WM_SYMBOLS_PER_TEST = 25;
Constants.WM_DELAY_BETWEEN_SYMBOLS = 1500;
Constants.WM_GUESS_LOCKOUT = 1000;

// Freeze all definitions so
// they cannot be changed.
Object.freeze(Constants);
