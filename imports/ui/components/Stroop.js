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

    };

    this.testCompleted = this.testCompleted.bind(this);
    this.onColorPress = this.onColorPress.bind(this);

    // Set keyboard callbacks
    setColorPressCallback(this.onColorPress);

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

  }

  onColorPress(color) {

    const correctAnswer = Session.get('stroopColorKey');

    if (!correctAnswer || correctAnswer == '') return;

    // Visually indicate which
    // color was pressed.
    const btn = this.refs[color];
    if (btn) {
      btn.className = 'rect-btn active';
      setTimeout(() => {
        btn.className = 'rect-btn';
      }, 1000);
    }

    if (color == correctAnswer) {
      // Correct
      console.log('Stroop: Correct');
      const correctCount = Session.get('correctCount');
      Session.set('correctCount', correctCount + 1);
    } else {
      // Incorrect
      console.log('Stroop: Incorrect');
    }

    // Total attempts
    const attemptCount = Session.get('attemptCount');
    Session.set('attemptCount', attemptCount + 1);

    this.resetStroopWord();

  }

  beginStroopTest() {

    // Ensure all scores are reset
    Session.set('attemptCount', 0);
    Session.set('correctCount', 0);
    Session.set('startTime', 0);
    Session.set('guessTime', 0);

    this.resetStroopWord();

  }

  resetStroopWord() {

    Session.set('stroopWord', '');
    Session.set('stroopColorKey', '');
    Session.set('stroopColor', '');

    // TODO - show "Correct' or "Incorrect"
    // feedback here with a beat to reset.

    if (Session.get('attemptCount') >= Constants.STROOP_TOTAL_ATTEMPTS) {

      // Test complete
      console.log('Stroop test complete');
      this.testCompleted();

    } else {

      setTimeout(() => {
        this.nextStroopWord();
      }, Constants.STROOP_DELAY_BETWEEN_WORDS);

    }

  }

  nextStroopWord() {

    const stroopWord = this.fishRandomColor();
    const colorKey = this.fishRandomColor();
    const stroopColor = Constants.COLOR_COLORS[colorKey];

    Session.set('stroopWord', stroopWord);
    Session.set('stroopColorKey', colorKey);
    Session.set('stroopColor', stroopColor);

    console.log('-> nextStroopWord', stroopWord, stroopColor);

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

  testCompleted() {

    const testKey = this.props.cTest.slug;

    const correctAnswers = Session.get('correctCount');
    const percentCorrect = Math.floor((correctAnswers / Constants.STROOP_TOTAL_ATTEMPTS) * 100);

    console.log('Results', correctAnswers, '/', Constants.STROOP_TOTAL_ATTEMPTS);

    // Stroop score categories
    // "percentCorrect",
    // "missedPairs",
    // "falsePairs",
    // "correctAnswers"

    Meteor.apply('submitScore', [{
      testKey: testKey,
      timestamp: new Date().getTime(),
      percentCorrect: percentCorrect,
      normalTime: Math.round(Math.random() * 100),
      interferenceTime: Math.round(Math.random() * 100),
      bestTime: Math.round(Math.random() * 100),
      averageTime: Math.round(Math.random() * 100),
      missedPairs: Math.round(Math.random() * 100),
      falsePairs: Math.round(Math.random() * 100),
      correctAnswers: correctAnswers,
    },], {

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

            </div>
            {this.renderButtonGuide()}
          </div>;

  }
}

Stroop.propTypes = {
  localization: React.PropTypes.object,
  cTest: React.PropTypes.object,
};
