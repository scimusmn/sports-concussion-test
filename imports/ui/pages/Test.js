import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Row, Col, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Stroop from '../components/Stroop';
import GoNoGo from '../components/GoNoGo';
import WorkingMemory from '../components/WorkingMemory';
import Constants from '../../modules/constants';

export default class Test extends React.Component {

  constructor(props) {
    super(props);

    console.log('Test:constructor');
    console.dir(props);

    this.state = {

    };

  }

  componentDidMount() {

    // DOM is rendered and
    // ready for manipulation
    // and animations.

    const demoVid = this.refs.demoVid;

    if (demoVid) {
      demoVid.onended = function() {
        console.log('demoVid ended');
      };
    }

  }

  componentWillUnmount() {

    // DOM is about to become
    // inaccessible. Clean up
    // all timers ans tweens.

  }

  renderHeadband() {

    let jsx = <h2>{this.props.cTest.titleFull}</h2>;
    return jsx;

  }

  renderLowerBody() {

    const appState = this.props.appState;
    let jsx = '';

    console.log('render vbody appState ', appState);

    if (appState == Constants.STATE_HOW_TO_PLAY) {
      jsx = <Row>
              <Col xs={4}>
                <h3>{this.props.cTest.introTitle}</h3>
                <p>{this.props.cTest.introInstruction}</p>
              </Col>
              <Col xs={8}>
                {this.renderDemonstration()}
              </Col>
            </Row>;
    } else if (appState == Constants.STATE_PLAY) {
      jsx = <Row>
              <Col xs={12}>
                {this.renderActivity()}
              </Col>
            </Row>;
    } else if (appState == Constants.STATE_PLAY_SCORE) {
     /* jsx = <Row>
              <Col xs={4}>
                <h3>Scoring</h3>
                <p>{this.props.cTest.scoringInstruction}</p>
              </Col>
              <Col xs={8}>
                { this.props.cTest.scoreCategories.map(function(category, index) {
                  return <Col xs={2} key={ index }>
                    <p>{category}</p>
                  </Col>;
                })}
              </Col>
            </Row>;*/
            jsx = <Row>
              <Col xs={12}>
                { this.props.scores.map(function(score, index) {
                  return <Col xs={2} key={ index }>
                    <p>{score.timestamp}</p>
                  </Col>;
                })}
              </Col>
            </Row>;
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

    const vidPath = '/videos/demo-' + this.props.cTest.slug + '.mp4';
    const demoVid = <video ref='demoVid' width='972' height='706' autoPlay='autoplay' >
                      <source src={vidPath} type='video/mp4' />
                    </video>;

    return demoVid;

  }

  render() {

    return <div>
      <Row>
        <Col xs={12}>
          {this.renderHeadband()}
        </Col>
      </Row>
      {this.renderLowerBody()}
    </div>;

  }
}

Test.propTypes = {
  localization: React.PropTypes.object,
  cTest: React.PropTypes.object,
};
