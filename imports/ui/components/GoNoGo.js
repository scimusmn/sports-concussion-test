import { Meteor } from 'meteor/meteor';
import React from 'react';
import ReactDOM from 'react-dom';
import TweenMax from 'gsap';
import Constants from '../../modules/constants';
import { setTrianglePressCallback } from '../../startup/client/key-map';

export default class GoNoGo extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      showCorrectFeedback: false,
      showIncorrectFeedback: false,
      guessLockout: false,
    };

    this.symbols = ['/images/gonogo_tri_1.png',
                      '/images/gonogo_tri_2.png',
                      '/images/gonogo_tri_3.png',
                      '/images/gonogo_tri_4.png',
                      '/images/gonogo_tri_5.png',];

    this.correctSymbols = ['/images/gonogo_tri_1.png',
                            '/images/gonogo_tri_2.png',
                            '/images/gonogo_tri_3.png',];

    this.idleSymbol = '/images/gonogo_idle.png';

    this.testCompleted = this.testCompleted.bind(this);
    this.onTrianglePress = this.onTrianglePress.bind(this);
    this.resetMemorySymbol = this.resetMemorySymbol.bind(this);
    this.nextMemorySymbol = this.nextMemorySymbol.bind(this);

    this.symbolOrder = [];
    this.currentSymbol = '';
    this.currentSymbolIndex = 0;
    this.testActive = false;

    // Set keyboard callbacks
    setTrianglePressCallback(this.onTrianglePress);

  }

  onTrianglePress() {

    console.log('GoNoGo::onTrianglePress()');

    const currentSymbol = Session.get('currentSymbol');

    if (!currentSymbol || currentSymbol == '' || currentSymbol == this.idleSymbol || this.state.guessLockout) return;

    // Would this triangle be correct?
    let isCorrect = false;
    for (var i = 0; i < this.correctSymbols.length; i++) {
      if (currentSymbol == this.correctSymbols[i]) {
        isCorrect = true;
        break;
      }
    }

    if (isCorrect) {
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
    }, Constants.GNG_GUESS_LOCKOUT);

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

  }

  beginMemoryTest() {

    clearTimeout(this.timer);

    // Generate symbol order
    this.symbolOrder = [];
    for (var i = 0; i < Constants.GNG_SYMBOLS_PER_TEST; i++) {

      const r = Math.floor(Math.random() * this.symbols.length);
      const rSymbol = this.symbols[r];
      this.symbolOrder.push(rSymbol);

    }

    console.log('symbolOrder', this.symbolOrder);

    // Ensure all scores are reset
    Session.set('attemptCount', 0);
    Session.set('correctCount', 0);
    Session.set('currentSymbol', '');
    Session.set('correctAnswer', '');

    this.currentSymbolIndex = 0;

    this.resetMemorySymbol();

    this.testActive = true;

  }

  resetMemorySymbol() {

    Session.set('currentSymbol', this.idleSymbol);

    // TODO - show "Correct' or "Incorrect"
    // feedback here with a beat to reset.

    if (this.currentSymbolIndex >= Constants.GNG_SYMBOLS_PER_TEST) {

      // Test complete
      console.log('GNG test complete');
      this.testCompleted();

    } else {

      setTimeout(() => {
        if (this.testActive == false) return;
        this.nextMemorySymbol();
      }, Constants.GNG_DELAY_BETWEEN_SYMBOLS);

    }

  }

  resetGuess() {
    this.setState({ showIncorrectFeedback: false });
    this.setState({ showCorrectFeedback: false });
    this.setState({ guessLockout: false});
  }

  nextMemorySymbol() {

    // Total attempts
    const attemptCount = Session.get('attemptCount');
    Session.set('attemptCount', attemptCount + 1);

    this.currentSymbolIndex++;
    const nextSymbol = this.symbolOrder[this.currentSymbolIndex];

    Session.set('currentSymbol', nextSymbol);

    setTimeout(() => {
      if (this.testActive == false) return;
      this.resetMemorySymbol();
    }, Constants.GNG_DELAY_BETWEEN_SYMBOLS);

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
      <img className='center-top' src='/images/gonogo_instruct.png'/>
      { this.renderCurrentTestSymbol() }
      { this.state.showCorrectFeedback ? <img className='feedback' src='/images/feedback_O.png'/> : null }
      { this.state.showIncorrectFeedback ? <img className='feedback' src='/images/feedback_X.png'/> : null }
    </div>;

  }
}

GoNoGo.propTypes = {
  localization: React.PropTypes.object,
  cTest: React.PropTypes.object,
};
