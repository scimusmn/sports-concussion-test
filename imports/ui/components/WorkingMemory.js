import { Meteor } from 'meteor/meteor';
import React from 'react';
import ReactDOM from 'react-dom';
import TweenMax from 'gsap';
import Constants from '../../modules/constants';
import { setTrianglePressCallback } from '../../startup/client/key-map';

export default class WorkingMemory extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      showCorrectFeedback: false,
      showIncorrectFeedback: false,
      guessLockout: true,
    };

    this.symbols = [  '/images/wm_1.png',
                      '/images/wm_2.png',
                      '/images/wm_3.png',
                      '/images/wm_4.png',
                      '/images/wm_5.png',
                      '/images/wm_6.png',];

    this.testCompleted = this.testCompleted.bind(this);
    this.onTrianglePress = this.onTrianglePress.bind(this);

    this.symbolOrder = [];
    this.currentSymbol = '';
    this.currentSymbolIndex = 0;
    this.testActive = false;

    // Set keyboard callbacks
    setTrianglePressCallback(this.onTrianglePress);

  }

  onTrianglePress() {

    const correctAnswer = Session.get('correctAnswer');
    const currentSymbol = Session.get('currentSymbol');

    if (!correctAnswer || correctAnswer == '' || this.state.guessLockout) return;

    if (currentSymbol == correctAnswer) {
      // Correct
      const correctCount = Session.get('correctCount');
      Session.set('correctCount', correctCount + 1);
      this.setState({ showCorrectFeedback: true });
    } else {
      // Incorrect
      this.setState({ showIncorrectFeedback: true });
    }

    // Total attempts
    const attemptCount = Session.get('attemptCount');
    Session.set('attemptCount', attemptCount + 1);

    setTimeout(() => {
      if (this.testActive == false) return;
      this.resetGuess();
    }, Constants.WM_GUESS_LOCKOUT);

  }

  componentDidMount() {

    // DOM is rendered and
    // ready for manipulation
    // and animations.

    this.beginMemoryTest();

  }

  componentWillUnmount() {

    // DOM is about to become
    // inaccessible. Clean up
    // all timers ans tweens.

    this.testActive = false;
    Session.set('maxAttempts', 0);

  }

  beginMemoryTest() {

    // Generate symbol order
    this.symbolOrder = [];
    for (var i = 0; i < Constants.WM_SYMBOLS_PER_TEST; i++) {

      const r = Math.floor(Math.random() * this.symbols.length);
      const rSymbol = this.symbols[r];
      console.log('this.symbols...', this.symbols.length, r, rSymbol);
      this.symbolOrder.push(rSymbol);

    }

    console.log('symbolOrder', this.symbolOrder);

    // Ensure all scores are reset
    Session.set('attemptCount', 0);
    Session.set('correctCount', 0);
    Session.set('currentSymbol', '');
    Session.set('correctAnswer', '');

    Session.set('maxAttempts', Constants.WM_SYMBOLS_PER_TEST);

    this.currentSymbolIndex = 0;

    this.setState({ guessLockout: false });

    this.resetMemorySymbol();

    this.testActive = true;

  }

  resetGuess() {
    this.setState({ showIncorrectFeedback: false });
    this.setState({ showCorrectFeedback: false });
    this.setState({ guessLockout: false});
  }

  resetMemorySymbol() {

    Session.set('currentSymbol', '');

    if (this.currentSymbolIndex >= Constants.WM_SYMBOLS_PER_TEST) {

      // Test complete
      console.log('WM test complete');
      this.testCompleted();

    } else {

      setTimeout(() => {
        if (this.testActive == false) return;
        this.nextMemorySymbol();
      }, Constants.WM_DELAY_BETWEEN_SYMBOLS);

    }

  }

  nextMemorySymbol() {

    // Total attempts
    const attemptCount = Session.get('attemptCount');
    Session.set('attemptCount', attemptCount + 1);

    this.currentSymbolIndex++;
    const nextSymbol = this.symbolOrder[this.currentSymbolIndex];

    Session.set('currentSymbol', nextSymbol);

    console.log('-> nextMemorySymbol', nextSymbol);

    // What is the current correct answer?
    if (this.currentSymbolIndex >= 2) {
      const twoPrevious = this.symbolOrder[this.currentSymbolIndex - 2];
      Session.set('correctAnswer', twoPrevious);
    } else {
      Session.set('correctAnswer', '');
    }

    setTimeout(() => {
      if (this.testActive == false) return;
      this.resetMemorySymbol();
    }, Constants.WM_DELAY_BETWEEN_SYMBOLS);

  }

  renderCurrentTestSymbol() {

    let jsx = '';

    const symbolPath = Session.get('currentSymbol');

    if (symbolPath && symbolPath != '') {
      jsx = <img className='test-symbol' src={symbolPath}/>;
    }

    return jsx;

  }

  testCompleted() {

    const testKey = this.props.cTest.slug;

    Meteor.apply('submitScore', [{
      testKey: testKey,
      timestamp: new Date().getTime(),
      percentCorrect: Math.round(Math.random() * 100),
      normalTime: Math.round(Math.random() * 100),
      interferenceTime: Math.round(Math.random() * 100),
      bestTime: Math.round(Math.random() * 100),
      averageTime: Math.round(Math.random() * 100),
      missedPairs: Math.round(Math.random() * 100),
      falsePairs: Math.round(Math.random() * 100),
      correctAnswers: Math.round(Math.random() * 100),
    },], {

      onResultReceived: (error, response) => {

        if (error) console.warn(error.reason);
        if (response) console.log('submitScore success:', response);

        // Progress to score screen.
        Session.set('appState', Constants.STATE_PLAY_SCORE);

      },

    });

  }

  render() {

    return <div className={'test-canvas ' + this.props.cTest.slug}>
      { this.renderCurrentTestSymbol() }
      { this.state.showCorrectFeedback ? <img className='feedback' src='/images/feedback_O.png'/> : null }
      { this.state.showIncorrectFeedback ? <img className='feedback' src='/images/feedback_X.png'/> : null }
    </div>;

  }
}

WorkingMemory.propTypes = {
  localization: React.PropTypes.object,
  cTest: React.PropTypes.object,
};
