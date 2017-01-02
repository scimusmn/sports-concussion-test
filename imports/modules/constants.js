export default class Constants {};

// Seconds of inactivity
// required to trigger
// screensaver and reset.
Constants.TIMEOUT_SECS = 360;

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
Constants.STROOP_TOTAL_ATTEMPTS = 20; // 20
Constants.STROOP_DELAY_BETWEEN_WORDS = 500;
Constants.STROOP_FORCE_NORMAL = 0.3; // Chance of forcing a 'normal' round

// Stroop colors
Constants.COLOR_WORDS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
Constants.COLOR_COLORS = {red:'#d52229',
                          orange:'#f26322',
                          yellow:'#ebed4f',
                          green:'#2ba54a',
                          blue:'#0094c3',
                          purple:'#493087',};

// Go No Go
Constants.GNG_SYMBOLS_PER_TEST = 12; // 12
Constants.GNG_DELAY_FOR_PATTERNED = 4000;
Constants.GNG_GUESS_LOCKOUT = 1500;

// Working Memory
Constants.WM_SYMBOLS_PER_TEST = 42; // 42
Constants.WM_DELAY_SHOW_SYMBOLS = 1500;
Constants.WM_DELAY_BETWEEN_SYMBOLS = 250;
Constants.WM_GUESS_LOCKOUT = 1000;
Constants.WM_FORCE_MATCH = 0.25; // Chance of forcing a match round

// Freeze all definitions so
// they cannot be changed.
Object.freeze(Constants);
