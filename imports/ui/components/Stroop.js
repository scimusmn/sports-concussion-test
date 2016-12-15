import { Meteor } from 'meteor/meteor';
import React from 'react';
import ReactDOM from 'react-dom';
import TweenMax from 'gsap';
import StroopWord from './StroopWord';
import Constants from '../../modules/constants';
import { setColorPressCallback } from '../../startup/client/key-map';

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

    let jsx = <div className='button-guide'>
        <div className='rect-btn'>
          <p>{this.props.localization.colorRed}</p>
        </div>
        <div className='rect-btn'>
          <p>{this.props.localization.colorOrange}</p>
        </div>
        <div className='rect-btn'>
          <p>{this.props.localization.colorYellow}</p>
        </div>
        <div className='rect-btn'>
          <p>{this.props.localization.colorGreen}</p>
        </div>
        <div className='rect-btn'>
          <p>{this.props.localization.colorBlue}</p>
        </div>
        <div className='rect-btn'>
          <p>{this.props.localization.colorPurple}</p>
        </div>
      </div>;


    return jsx;
  }

  render() {

    return <div className={'test-canvas ' + this.props.cTest.slug}>
      <StroopWord word={this.getStroopWord()} color={this.getStroopColor()}></StroopWord>
      {this.renderButtonGuide()}

    </div>;

  }
}

Stroop.propTypes = {
  localization: React.PropTypes.object,
  cTest: React.PropTypes.object,
};
