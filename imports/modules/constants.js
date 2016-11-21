export default class Constants {};

// App state enumeration
Constants.STATE_MAIN_MENU = 0;
Constants.STATE_HOW_TO_PLAY = 1;
Constants.STATE_PLAY = 2;
Constants.STATE_PLAY_SCORE = 3;

// Freeze all definitions so
// they cannot be changed.
Object.freeze(Constants);
