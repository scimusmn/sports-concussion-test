import { Meteor } from 'meteor/meteor';
import React from 'react';
import ReactDOM from 'react-dom';
import TweenMax from 'gsap';
import StroopWord from './StroopWord';
import Constants from '../../modules/constants';
import { setColorPressCallback } from '../../startup/client/key-map';
import s from 'underscore.string';

export default class Stroop extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      showCorrectFeedback: false,
      showIncorrectFeedback: false,
    };

    this.testCompleted = this.testCompleted.bind(this);
    this.onColorPress = this.onColorPress.bind(this);

    // Set keyboard callbacks
    setColorPressCallback(this.onColorPress);

    this.testActive = false;
    this.normalTimes = [];
    this.interferenceTimes = [];

  }

  componentDidMount() {

    // DOM is rendered and
    // ready for manipulation
    // and animations.

    this.beginStroopTest();

  }

  componentWillUnmount() {

    // DOM is about to become
    // inaccessible. Clean up
    // all timers ans tweens.

    this.testActive = false;
    Session.set('maxAttempts', 0);

  }

  onColorPress(color) {

    const correctAnswer = Session.get('stroopColorKey');

    // Prevent double guessing.
    if (!correctAnswer || correctAnswer == '' || this.state.showCorrectFeedback || this.state.showIncorrectFeedback) return;

    // Visually indicate which
    // color was pressed.

    const btn = this.refs[color];
    if (btn) {
      btn.className = 'rect-btn active';
      setTimeout(() => {
        if (this.testActive == false) return;
        btn.className = 'rect-btn';
      }, 1000);
    }

    // Is answer correct?
    if (color == correctAnswer) {
      // Correct
      console.log('Stroop: Correct');
      const correctCount = Session.get('correctCount');
      Session.set('correctCount', correctCount + 1);
      this.setState({ showCorrectFeedback: true });

      // How long did it take to guess?
      const now = Date.now();
      let guessTime = now - Session.get('startTime');

      // Save time it took to guess
      console.log('Correct guess, is normal?', Session.get('isNormalRound'));
      if (Session.get('isNormalRound') == true) {
        console.log('normalTime', guessTime);
        this.normalTimes.push(guessTime);
      } else {
        this.interferenceTimes.push(guessTime);
        console.log('interferenceTime', guessTime);
      }

    } else {
      // Incorrect
      console.log('Stroop: Incorrect');
      this.setState({ showIncorrectFeedback: true });
    }

    setTimeout(() => {
      if (this.testActive == false) return;
      this.resetStroopWord();
    }, Constants.STROOP_DELAY_BETWEEN_WORDS);

  }

  beginStroopTest() {

    // Ensure all scores are reset
    Session.set('attemptCount', 0);
    Session.set('correctCount', 0);
    Session.set('startTime', 0);

    Session.set('maxAttempts', Constants.STROOP_TOTAL_ATTEMPTS);

    this.testActive = true;
    this.normalTimes = [];
    this.interferenceTimes = [];

    this.resetStroopWord();

  }

  resetStroopWord() {

    Session.set('stroopWord', '');
    Session.set('stroopColorKey', '');
    Session.set('stroopColor', '');

    this.setState({ showIncorrectFeedback: false });
    this.setState({ showCorrectFeedback: false });

    if (Session.get('attemptCount') >= Constants.STROOP_TOTAL_ATTEMPTS) {

      // Test complete
      console.log('Stroop test complete');
      this.testCompleted();

    } else {

      setTimeout(() => {
        if (this.testActive == false) return;
        this.nextStroopWord();
      }, Constants.STROOP_DELAY_BETWEEN_WORDS);

    }

  }

  nextStroopWord() {

    const stroopWord = this.fishRandomColor();
    let colorKey = stroopWord; // Default is that color matches word.

    // If random is outside force chance, allow
    // color/word mismatch.
    if (Math.random() > Constants.STROOP_FORCE_NORMAL) {
      colorKey = this.fishRandomColor();
    }

    const stroopColor = Constants.COLOR_COLORS[colorKey];

    Session.set('stroopWord', stroopWord);
    Session.set('stroopColorKey', colorKey);
    Session.set('stroopColor', stroopColor);

    // Is this a 'normal' round,
    // or and interference round?
    if (colorKey == stroopWord) {
      Session.set('isNormalRound', true);
    } else {
      Session.set('isNormalRound', false);
    }

    // Increment attempt count
    const attemptCount = Session.get('attemptCount');
    Session.set('attemptCount', attemptCount + 1);

    const now = Date.now();
    Session.set('startTime', now);

  }

  getStroopWord() {

    let word = '';
    if (Session.get('stroopWord') != '') {
      word = Session.get('stroopWord');

      // Get localized version
      word = this.props.localization['color' + s.capitalize(word, true)];
    }

    return word;

  }

  getStroopColor() {

    let color = '';
    if (Session.get('stroopColor') != '') {
      color = Session.get('stroopColor');
    }

    return color;

  }

  fishRandomColor() {

    const color = Constants.COLOR_WORDS[Math.floor(Math.random() * Constants.COLOR_WORDS.length)];
    return color;

  }

  getAverageTime(timesArray) {

    if (timesArray.length == 0) {
      return 0;
    }

    let time = 0.0;

    // Sum recorded 'normal' guess times
    for (var i = 0; i < timesArray.length; i++) {
      time += timesArray[i];
    }

    // Average 'normal' times
    time = (time / timesArray.length);

    // Convert to seconds
    const secs = time / 1000.0;

    // Trim to two decimal points
    return secs.toFixed(2);

  }

  testCompleted() {

    const testKey = this.props.cTest.slug;

    const correctPairs = Session.get('correctCount');
    const percentCorrect = Math.floor((correctPairs / Constants.STROOP_TOTAL_ATTEMPTS) * 100);

    // Get average 'normal' time.
    let normalTime = this.getAverageTime(this.normalTimes);

    // Get average 'interference' time.
    let interferenceTime = this.getAverageTime(this.interferenceTimes);

    // Difference between interference time and normal time
    let difference = (interferenceTime - normalTime).toFixed(2);

    // Catch normal non-values
    if (normalTime == 0) {
      normalTime = '--';
      difference = '--';
    }

    // Catch interfence non-values
    if (interferenceTime == 0) {
      interferenceTime = '--';
      difference = '--';
    }

    // Stroop score categories
    // [ Percent correct | Normal time | Interference time | Difference ]

    const scoreDoc = {

      testKey: testKey,
      timestamp: new Date().getTime(),
      percentCorrect: percentCorrect + '%',
      normalTime: normalTime.toString(),
      interferenceTime: interferenceTime.toString(),
      difference: difference.toString(),
      correctPairs: correctPairs.toString(),

    };

    console.dir(scoreDoc);

    Meteor.apply('submitScore', [scoreDoc], {

      onResultReceived: (error, response) => {

        if (error) console.warn(error.reason);
        if (response) console.log('submitScore success:', response);

        // Progress to score screen.
        Session.set('appState', Constants.STATE_PLAY_SCORE);

      },

    });

  }

  renderButtonGuide() {

    let jsx = '';

    jsx = <div className='button-guide rects'>
            <div ref='red' className='rect-btn'>
              <p>{this.props.localization.colorRed}</p>
            </div>
            <div ref='orange' className='rect-btn'>
              <p>{this.props.localization.colorOrange}</p>
            </div>
            <div ref='yellow' className='rect-btn'>
              <p>{this.props.localization.colorYellow}</p>
            </div>
            <div ref='green' className='rect-btn'>
              <p>{this.props.localization.colorGreen}</p>
            </div>
            <div ref='blue' className='rect-btn'>
              <p>{this.props.localization.colorBlue}</p>
            </div>
            <div ref='purple' className='rect-btn'>
              <p>{this.props.localization.colorPurple}</p>
            </div>
          </div>;

    return jsx;
  }

  render() {

    return <div>
            <div className={'test-canvas ' + this.props.cTest.slug}>
                <StroopWord word={this.getStroopWord()} color={this.getStroopColor()}></StroopWord>
                { this.state.showCorrectFeedback ? <img className='feedback' src='/images/feedback_O.png'/> : null }
                { this.state.showIncorrectFeedback ? <img className='feedback' src='/images/feedback_X.png'/> : null }
            </div>
            {this.renderButtonGuide()}
          </div>;

  }
}

Stroop.propTypes = {
  localization: React.PropTypes.object,
  cTest: React.PropTypes.object,
};
