import React from 'react';
import ReactDOM from 'react-dom';
import TweenMax from 'gsap';

export default class GoNoGo extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

    };

    this.fpoActivityAction = this.fpoActivityAction.bind(this);

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

  render() {

    return <div className={'test-canvas ' + this.props.cTest.slug}>
      <div ref='activityProp' className='activity-prop'>{this.props.cTest.titleFull}<br/>Test</div>
    </div>;

  }
}

GoNoGo.propTypes = {
  localization: React.PropTypes.object,
  cTest: React.PropTypes.object,
};
