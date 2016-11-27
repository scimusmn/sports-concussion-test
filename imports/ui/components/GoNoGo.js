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

    };

    this.testCompleted = this.testCompleted.bind(this);
    this.fpoActivityAction = this.fpoActivityAction.bind(this);

    // Set keyboard callbacks
    setTrianglePressCallback(this.onTrianglePress);

  }

  onTrianglePress() {
    console.log('GoNoGo::onTrianglePress()');
  }

  componentDidMount() {

    // DOM is rendered and
    // ready for manipulation
    // and animations.

    this.fpoActivityAction();

  }

  componentWillUnmount() {

    // DOM is about to become
    // inaccessible. Clean up
    // all timers ans tweens.

    const target = this.refs.activityProp;
    TweenLite.killTweensOf(target);

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
      <div ref='activityProp' className='activity-prop' onClick={this.testCompleted}>{this.props.cTest.titleFull}<br/>Test</div>
    </div>;

  }
}

GoNoGo.propTypes = {
  localization: React.PropTypes.object,
  cTest: React.PropTypes.object,
};
