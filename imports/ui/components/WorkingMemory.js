import { Meteor } from 'meteor/meteor';
import React from 'react';
import ReactDOM from 'react-dom';
import TweenMax from 'gsap';
import BaseTest from './BaseTest';
import Constants from '../../modules/constants';
import { setTrianglePressCallback } from '../../startup/client/key-map';

export default class WorkingMemory extends BaseTest {

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

    // Set keyboard callbacks
    setTrianglePressCallback(this.onTrianglePress);

  }

  // Respond to all presses
  // of the triangle button
  onTrianglePress() {

    if (this.state.guessLockout == true) return;

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

      const falsePairs = Session.get('falsePairs');
      Session.set('falsePairs', falsePairs + 1);

    }

    this.setState({ guessLockout: true });

    // Increment possible correct pairs
    const matchAttempts = Session.get('activeAnswers');
    Session.set('activeAnswers', matchAttempts + 1);

  }

  // Prep for and begin new test
  beginTest() {

    super.beginTest();

    // Ensure all scores are reset
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

        const missedPairs = Session.get('missedPairs');
        Session.set('missedPairs', missedPairs + 1);

      }

    }

    // Hide feedback symbol
    this.state.showIncorrectFeedback = false;
    this.state.showCorrectFeedback = false;

    if (this.currentSymbolIndex >= Constants.WM_SYMBOLS_PER_TEST) {

      // Test complete
      this.testCompleted();

    } else {

      let delay = Constants.WM_DELAY_BETWEEN_SYMBOLS * 5;

      // Longer delay on first round
      // to allow user to get ready.
      if (this.currentSymbolIndex == 0) delay = 1500;

      setTimeout(() => {
        if (this.testActive == false) return;
        this.resetGuess();
        this.nextMemorySymbol();
      }, delay);

    }

  }

  nextMemorySymbol() {

    // Total attempts
    const attemptCount = Session.get('attemptCount');
    Session.set('attemptCount', attemptCount + 1);

    const nextSymbol = this.symbolOrder[this.currentSymbolIndex];
    Session.set('currentSymbol', nextSymbol);

    // Is the current symbol a correct match?
    if (this.currentSymbolIndex >= 2) {

      const twoPrevious = this.symbolOrder[this.currentSymbolIndex - 2];

      if (nextSymbol == twoPrevious) {
        Session.set('correctAnswer', true);

        // Increment possible correct pairs
        const possibleMatches = Session.get('possibleMatches');
        Session.set('possibleMatches', possibleMatches + 1);

      } else {
        Session.set('correctAnswer', false);
      }

    } else {
      Session.set('correctAnswer', false);
    }

    this.currentSymbolIndex++;

    setTimeout(() => {
      if (this.testActive == false) return;
      this.resetMemorySymbol();
    }, Constants.WM_DELAY_SHOW_SYMBOLS);

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

    const correctPairs = Session.get('correctCount');
    const percentCorrect = Math.floor((correctPairs / Constants.WM_SYMBOLS_PER_TEST) * 100);
    const missedPairs = Session.get('missedPairs');
    const falsePairs = Session.get('falsePairs');

    const scoreDoc = {
      percentCorrect: percentCorrect + '%',
      missedPairs: missedPairs + '',
      falsePairs: falsePairs + '',
      correctPairs: correctPairs + '',
    };

    super.submitResults(scoreDoc);

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
