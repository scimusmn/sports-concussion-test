import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Row, Col, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Stroop from '../components/Stroop';
import GoNoGo from '../components/GoNoGo';
import WorkingMemory from '../components/WorkingMemory';
import ScoreTable from '../components/ScoreTable';
import { setNumPressCallback } from '../../startup/client/key-map';
import Constants from '../../modules/constants';
import { camelToTitleCase } from '../../modules/utils';

export default class Test extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

    };

    // Set keyboard callbacks
    this.onNumberPress = this.onNumberPress.bind(this);

  }

  componentDidMount() {

    // DOM is rendered and
    // ready for manipulation
    // and animations.

    // Set keyboard callbacks
    setNumPressCallback(this.onNumberPress);

  }

  componentDidUpdate() {

    // Restart video on
    // language change
    const demoVid = this.refs.demoVid;
    if (demoVid) {
      demoVid.currentTime = 0.0;
      demoVid.load();
    }

  }

  componentWillUnmount() {

    // DOM is about to become
    // inaccessible. Clean up
    // all timers ans tweens.

    // Disconnent keyboard callbacks
    setNumPressCallback(null);

  }

  onNumberPress(num) {

    // Restart video if 2 is pressed during
    // demonstration video.
    if (this.props.appState == Constants.STATE_HOW_TO_PLAY && num == 2) {
      const demoVid = this.refs.demoVid;
      if (demoVid) {
        demoVid.currentTime = 0.0;
        demoVid.load();
      }
    }

  }

  renderHeadband() {

    let jsx = <div>
                <h2 className='leftAlign'>{this.props.cTest.titleFull}</h2>
                {this.renderProgress()}
              </div>;
    return jsx;

  }

  renderProgress() {

    let jsx = '';

    if (Session.get('maxAttempts') > 0) {
      jsx = <h3 className='right'>{Session.get('attemptCount') + ' / ' + Session.get('maxAttempts')}</h3>;
    }

    return jsx;

  }

  renderInstructions() {

    return <p>{this.renderInstructText()}</p>;

  }

  renderInstructText() {

    return this.props.cTest.demoInstruction.split('∆').map((text,i) => {
      // return <span key={i}>{((i == 0) ? '' : <span className='mini-tri'> </span>)}{text}</span>;

      return <span key={i}>{((i == 0) ? '' : <span className='inline-tri'><img src='/images/button-triangle.png' height='20' width='20' /></span>)}{text}</span>;

    });

  }

  renderLowerBody() {

    const appState = this.props.appState;
    let jsx = '';

    if (appState == Constants.STATE_HOW_TO_PLAY) {
      jsx = <div className='divide-vertical'>
              <Row>
                <Col xs={4} className='leftCol'>
                  <h3>{this.props.cTest.demoTitle}</h3>
                  {this.renderInstructions()}
                </Col>
                <Col xs={8} className='rightCol'>
                  {this.renderDemonstration()}
                </Col>
              </Row>
            </div>;
    } else if (appState == Constants.STATE_PLAY) {
      jsx = <div className='divide-horizontal'>
              <Row>
                <Col xs={12}>
                  {this.renderActivity()}
                </Col>
              </Row>
            </div>;
    } else if (appState == Constants.STATE_PLAY_SCORE) {
      jsx = <div className='divide-vertical'>
              <Row>
                <Col xs={4} className='leftCol pre'>
                  <h3>{this.props.cTest.scoringTitle}</h3>
                  <p>{this.props.cTest.scoringInstruction.split('\n').map(i => {
                    return <div key={i}>{i}</div>;
                  })}</p>
                </Col>
                <Col xs={8}>
                  <ScoreTable localization={this.props.localization} cTest={this.props.cTest} scores={this.props.scores}></ScoreTable>
                </Col>
              </Row>
            </div>;
    }

    return jsx;

  }

  renderActivity() {

    let activity = '';

    switch (this.props.cTest.slug) {
      case 'stroop':
        activity = <Stroop localization={this.props.localization} cTest={this.props.cTest}></Stroop>;
        break;
      case 'gono-go':
        activity = <GoNoGo localization={this.props.localization} cTest={this.props.cTest}></GoNoGo>;
        break;
      case 'working-memory':
        activity = <WorkingMemory localization={this.props.localization} cTest={this.props.cTest}></WorkingMemory>;
        break;
      default:
        console.log('Warning: activity slug not recognized. Unable to render.');
    }

    return activity;

  }

  renderDemonstration() {

    const vidPath = '/videos/demo-' + this.props.cTest.slug + '-' + this.props.localization.languageKey + '.mp4';
    const demoVid = <video ref='demoVid' width='972' height='706' autoPlay='autoplay' >
                      <source src={vidPath} type='video/mp4' />
                    </video>;

    return demoVid;

  }

  renderButtonGuide() {
    let jsx = '';

    if (this.props.appState == Constants.STATE_PLAY) {

      switch (this.props.cTest.slug) {
        case 'stroop':
          /*
            stroop button guide moved inside test -tn
          */
          break;
        case 'gono-go':
        case 'working-memory':
          jsx = <div className='button-guide'>
                  <h3>
                    <span className='triangle'></span>
                    <span className='tag'>{this.props.localization.beginInstruction}</span>
                  </h3>
                </div>;
          break;
        default:
          console.log('Warning: activity slug not recognized. Unable to render.');
      }

    }

    return jsx;

  }

  render() {

    return <div className='main-container'>
      <div className='headband'>
        {this.renderHeadband()}
      </div>
      <div className='lower-body'>
        {this.renderLowerBody()}
        {this.renderButtonGuide()}
      </div>
    </div>;

  }
}

Test.propTypes = {
  localization: React.PropTypes.object,
  cTest: React.PropTypes.object,
};
