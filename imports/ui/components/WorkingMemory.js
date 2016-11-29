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

    };

    this.symbols = ['/images/wm_1.png',
                      '/images/wm_2.png',
                      '/images/wm_3.png',
                      '/images/wm_4.png',
                      '/images/wm_5.png',
                      '/images/wm_6.png',
                      '/images/wm_7.png',];

    this.fpoActivityAction = this.fpoActivityAction.bind(this);
    this.testCompleted = this.testCompleted.bind(this);
    this.onTrianglePress = this.onTrianglePress.bind(this);

    this.symbolOrder = [];
    this.currentSymbol = '';
    this.currentSymbolIndex = 0;

    // Set keyboard callbacks
    setTrianglePressCallback(this.onTrianglePress);

  }

  onTrianglePress() {
    console.log('WorkingMemory::onTrianglePress()');
    /*
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
*/

    // this.resetMemorySymbol();

  }

  componentDidMount() {

    // DOM is rendered and
    // ready for manipulation
    // and animations.

    // this.fpoActivityAction();

    this.beginMemoryTest();

  }

  componentWillUnmount() {

    // DOM is about to become
    // inaccessible. Clean up
    // all timers ans tweens.

    // const target = this.refs.activityProp;
    // TweenLite.killTweensOf(target);

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
    Session.set('wmCurrentSymbol', '');

    this.currentSymbolIndex = 0;

    this.resetMemorySymbol();

  }

  resetMemorySymbol() {

    Session.set('wmCurrentSymbolPath', '');

    // TODO - show "Correct' or "Incorrect"
    // feedback here with a beat to reset.

    if (Session.get('attemptCount') >= Constants.WM_SYMBOLS_PER_TEST) {

      // Test complete
      console.log('WM test complete');
      this.testCompleted();

    } else {

      setTimeout(() => {
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

    Session.set('wmCurrentSymbolPath', nextSymbol);

    console.log('-> nextMemorySymbol', nextSymbol);

    setTimeout(() => {
      this.resetMemorySymbol();
    }, Constants.WM_DELAY_BETWEEN_SYMBOLS);

  }

  renderCurrentTestSymbol() {

    let jsx = '';

    const symbolPath = Session.get('wmCurrentSymbolPath');

    if (symbolPath && symbolPath != '') {
      jsx = <img src={symbolPath}/>;
    }

    return jsx;

  }

  fpoActivityAction() {

    const target = this.refs.activityProp;

    const rTime = Math.random() * 2 + 1;
    const rX = Math.random() * 400;
    const rY = Math.random() * 300;
    const rRot = Math.random() * 360;
    const rScale = Math.random() * 4 - 2;
    const rOpac = Math.random();

    TweenMax.to(target, rTime, {x: rX, y: rY, rotation: rRot, scale: rScale, opacity: rOpac, onComplete: this.fpoActivityAction});

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
      {this.renderCurrentTestSymbol()}
    </div>;

  }
}

WorkingMemory.propTypes = {
  localization: React.PropTypes.object,
  cTest: React.PropTypes.object,
};
