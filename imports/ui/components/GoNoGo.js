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
      waitingForRoundStart: false,
      reactionTime: 0.0,
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
    this.correctAnswerTimes = [];
    this.testActive = false;

    this.setState({ waitingForRoundStart: true });

    // Set keyboard callbacks
    setTrianglePressCallback(this.onTrianglePress);

  }

  onTrianglePress() {

    console.log('GoNoGo::onTrianglePress()');

    // Waiting for round to start
    if (this.state.waitingForRoundStart == true) {

      Session.set('currentSymbol', this.idleSymbol);
      this.setState({ waitingForRoundStart: false });

      const randomDelay = Math.ceil(Math.random() * 3000 + 500);

      setTimeout(() => {
        if (this.testActive == false) return;
        this.nextMemorySymbol();
      }, randomDelay);

      return;

    }

    const currentSymbol = Session.get('currentSymbol');

    if (!currentSymbol || currentSymbol == '' || currentSymbol == this.idleSymbol || this.state.guessLockout) return;

    // Would this triangle be correct?
    const isCorrect = Session.get('correctAnswer');

    if (isCorrect == true) {

      // Correct
      const correctCount = Session.get('correctCount');
      Session.set('correctCount', correctCount + 1);
      this.setState({ showCorrectFeedback: true });

      // How long did it take to answer?
      const now = Date.now();
      let answerTime = now - Session.get('startTime');
      this.correctAnswerTimes.push(answerTime);
      this.setState({ reactionTime: answerTime });

    } else {
      // Incorrect
      this.setState({ showIncorrectFeedback: true });
    }

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

    clearTimeout(this.timer);

    // Generate symbol order
    this.symbolOrder = [];
    for (var i = 0; i < Constants.GNG_SYMBOLS_PER_TEST; i++) {

      const r = Math.floor(Math.random() * this.symbols.length);
      const rSymbol = this.symbols[r];
      this.symbolOrder.push(rSymbol);

    }

    // Ensure all scores are reset
    Session.set('attemptCount', 0);
    Session.set('correctCount', 0);
    Session.set('currentSymbol', '');
    Session.set('correctAnswer', false);
    Session.set('startTime', 0);

    Session.set('maxAttempts', Constants.GNG_SYMBOLS_PER_TEST);

    this.currentSymbolIndex = 0;
    this.correctAnswerTimes = [];

    this.resetMemorySymbol();

    this.testActive = true;

  }

  resetMemorySymbol() {

    console.log('resetMemorySymbol', Session.get('correctAnswer'), this.state.showCorrectFeedback, this.state.showIncorrectFeedback);
    if (this.currentSymbolIndex != 0 &&
      !Session.get('correctAnswer') &&
      !this.state.showCorrectFeedback &&
      !this.state.showIncorrectFeedback) {
      // If user abstains during
      // a patterned triangle, count
      // as correct answer.
      const correctCount = Session.get('correctCount');
      Session.set('correctCount', correctCount + 1);

    }

    if (this.currentSymbolIndex >= Constants.GNG_SYMBOLS_PER_TEST) {

      // Test complete
      this.testCompleted();

    } else {

      // Wait for user action to start next round
      this.setState({ waitingForRoundStart: true });
      this.resetGuess();

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

    // Would this triangle be correct?
    let isCorrect = false;
    for (var i = 0; i < this.correctSymbols.length; i++) {
      if (nextSymbol == this.correctSymbols[i]) {
        isCorrect = true;
        break;
      }
    }

    Session.set('correctAnswer', isCorrect);

    // Timestamp to later find
    // how long it took to answer.
    Session.set('startTime', Date.now());

    setTimeout(() => {
      if (this.testActive == false) return;
      this.resetMemorySymbol();
    }, Constants.GNG_DELAY_FOR_PATTERNED);

  }

  renderCurrentTestSymbol() {

    let jsx = '';

    const symbolPath = Session.get('currentSymbol');

    if (this.state.waitingForRoundStart == true) {
      jsx = <h3 className='round-wait'>Press Triangle...</h3>;
    } else if (symbolPath && symbolPath != '') {
      jsx = <img className='test-symbol' src={symbolPath}/>;
    }

    return jsx;

  }

  getFastestTime(timesArray) {

    if (timesArray.length == 0) {
      return 0;
    }

    let time = 999.0;

    // Find shortest time
    for (var i = 0; i < timesArray.length; i++) {
      if (timesArray[i] < time) {
        time = timesArray[i];
      }
    }

    // Convert to seconds
    const secs = time / 1000.0;

    // Trim to two decimal points
    return secs.toFixed(2);

  }

  getAverageTime(timesArray) {

    if (timesArray.length == 0) {
      return 0;
    }

    let time = 0.0;

    // Sum recorded correct guess times
    for (var i = 0; i < timesArray.length; i++) {
      time += timesArray[i];
    }

    // Average recorded correct times
    time = (time / timesArray.length);

    // Convert to seconds
    const secs = time / 1000.0;

    // Trim to two decimal points
    return secs.toFixed(2);

  }

  testCompleted() {

    const testKey = this.props.cTest.slug;

    const correctAnswers = Session.get('correctCount');
    const percentCorrect = Math.floor((correctAnswers / Constants.GNG_SYMBOLS_PER_TEST) * 100);

    const bestTime = this.getFastestTime(this.correctAnswerTimes);
    const averageTime = this.getAverageTime(this.correctAnswerTimes);

    Meteor.apply('submitScore', [{

      testKey: testKey,
      timestamp: new Date().getTime(),
      percentCorrect: percentCorrect + '%',
      bestTime: bestTime + 's',
      averageTime: averageTime + 's',

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
      { this.state.showCorrectFeedback ? <div><img className='feedback' src='/images/feedback_O.png'/><p className='feedback-sub'>{this.state.reactionTime}</p></div> : null }
      { this.state.showIncorrectFeedback ? <img className='feedback' src='/images/feedback_X.png'/> : null }
    </div>;

  }
}

GoNoGo.propTypes = {
  localization: React.PropTypes.object,
  cTest: React.PropTypes.object,
};
