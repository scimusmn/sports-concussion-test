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

// Freeze all definitions so
// they cannot be changed.
Object.freeze(Constants);
