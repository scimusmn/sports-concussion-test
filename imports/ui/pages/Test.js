import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Row, Col, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Stroop from '../components/Stroop';
import GoNoGo from '../components/GoNoGo';
import WorkingMemory from '../components/WorkingMemory';
import Constants from '../../modules/constants';
import { camelToTitleCase } from '../../modules/utils';

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
      jsx = <Row>
              <Col xs={4}>
                <h3>{this.props.cTest.scoringTitle}</h3>
                <p>{this.props.cTest.scoringInstruction}</p>
              </Col>
              <Col xs={8}>
                {this.renderScoresTable()}
              </Col>
            </Row>;
    }

    return jsx;

  }

  renderScoresTable() {
    let jsx = '';

    jsx = <div>
            { this.props.cTest.scoreCategories.map((category, index) => {
              return <Col xs={2} key={ index }>
                <h3>{camelToTitleCase(category)}</h3>
                { this.props.scores.map((score, index) => {
                  return <p key={ index } className={((index == 0) ? 'your-score' : '')}>
                    {score[category]}
                  </p>;
                })}
              </Col>;
            })}
          </div>;

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

    return <div className='main-container'>
      <div className='headband'>
        {this.renderHeadband()}
      </div>
      <div className='content'>
        {this.renderLowerBody()}
      </div>
    </div>;

  }
}

Test.propTypes = {
  localization: React.PropTypes.object,
  cTest: React.PropTypes.object,
};
