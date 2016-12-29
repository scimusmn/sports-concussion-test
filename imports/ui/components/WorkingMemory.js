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

    this.symbols = ['/images/wm_1.png',
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

    if (this.state.guessLockout) return;

    const correctAnswer = Session.get('correctAnswer');
    const currentSymbol = Session.get('currentSymbol');

    if (correctAnswer == true) {
      // Correct
      const correctCount = Session.get('correctCount');
      Session.set('correctCount', correctCount + 1);
      this.setState({ showCorrectFeedback: true });
    } else {
      // Incorrect
      this.setState({ showIncorrectFeedback: true });

      const falsePairs = Session.get('wmFalsePairs');
      Session.set('wmFalsePairs', falsePairs + 1);

    }

    // Increment possible correct pairs
    const matchAttempts = Session.get('wmActiveAnswers');
    Session.set('wmActiveAnswers', matchAttempts + 1);

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

    // Ensure all scores are reset
    Session.set('attemptCount', 0);
    Session.set('correctCount', 0);
    Session.set('currentSymbol', '');
    Session.set('correctAnswer', false);
    Session.set('wmPossibleMatches', 0);
    Session.set('wmActiveAnswers', 0);
    Session.set('wmMissedPairs', 0);
    Session.set('wmFalsePairs', 0);
    Session.set('maxAttempts', Constants.WM_SYMBOLS_PER_TEST);

    this.currentSymbolIndex = 0;

    this.setState({ guessLockout: false });

    // Generate symbol order
    this.symbolOrder = [];
    for (var i = 0; i < Constants.WM_SYMBOLS_PER_TEST; i++) {

      // Choose random symbol
      const r = Math.floor(Math.random() * this.symbols.length);
      let rSymbol = this.symbols[r];

      // If within force random odds.
      // force a match this round.
      if (i >= 2 && Math.random() < Constants.WM_FORCE_MATCH) {
        const twoPrevious = this.symbolOrder[i - 2];
        rSymbol = twoPrevious;
      }

      this.symbolOrder.push(rSymbol);

    }

    // Onward...
    this.testActive = true;
    this.resetMemorySymbol();

  }

  resetGuess() {
    this.setState({ showIncorrectFeedback: false });
    this.setState({ showCorrectFeedback: false });
    this.setState({ guessLockout: false});
  }

  resetMemorySymbol() {

    Session.set('currentSymbol', '');

    if (this.currentSymbolIndex != 0 && this.state.showCorrectFeedback == false && this.state.showIncorrectFeedback == false) {

      // If user DID NOT press button
      // and it was NOT a match, count
      // as a correct answer
      if (Session.get('correctAnswer') == false) {
        const correctCount = Session.get('correctCount');
        Session.set('correctCount', correctCount + 1);

      }

      // If user DID NOT press button
      // and it WAS a match, count
      // as a missed pair.
      if (Session.get('correctAnswer') == true) {

        const missedPairs = Session.get('wmMissedPairs');
        Session.set('wmMissedPairs', missedPairs + 1);

      }

    }

    if (this.currentSymbolIndex >= Constants.WM_SYMBOLS_PER_TEST) {

      // Test complete
      this.testCompleted();

    } else {

      setTimeout(() => {
        if (this.testActive == false) return;
        this.resetGuess();
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

    // Is the current symbol a correct match?
    if (this.currentSymbolIndex >= 2) {

      const twoPrevious = this.symbolOrder[this.currentSymbolIndex - 2];

      if (nextSymbol == twoPrevious) {
        Session.set('correctAnswer', true);

        // Increment possible correct pairs
        const possibleMatches = Session.get('wmPossibleMatches');
        Session.set('wmPossibleMatches', possibleMatches + 1);

      } else {
        Session.set('correctAnswer', false);
      }

    } else {
      Session.set('correctAnswer', false);
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

    const correctPairs = Session.get('correctCount');
    const percentCorrect = Math.floor((correctPairs / Constants.WM_SYMBOLS_PER_TEST) * 100);
    const missedPairs = Session.get('wmMissedPairs');
    const falsePairs = Session.get('wmFalsePairs');

    Meteor.apply('submitScore', [{

      testKey: testKey,
      timestamp: new Date().getTime(),
      percentCorrect: percentCorrect + '%',
      missedPairs: missedPairs + '',
      falsePairs: falsePairs + '',
      correctPairs: correctPairs + '',

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
