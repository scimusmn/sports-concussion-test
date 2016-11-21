import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Row, Col, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Stroop from '../components/Stroop';
import GoNoGo from '../components/GoNoGo';
import WorkingMemory from '../components/WorkingMemory';

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

    demoVid.onended = function() {
      console.log('demoVid ended');
    };

  }

  componentWillUnmount() {

    // DOM is about to become
    // inaccessible. Clean up
    // all timers ans tweens.

  }

  submitScore(testKey) {

    // const testKey = this.props.cTest.slug;

    console.log('submitscore', testKey);
    Meteor.apply('submitScore', [{
      testKey: testKey,
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
      },

    });

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
          <h2>{this.props.cTest.titleFull}</h2>
          <p>{this.props.cTest.introInstruction}</p>
        </Col>
      </Row>
      <Row>
        { this.props.cTest.scoreCategories.map(function(category, index) {
          return <Col xs={4} key={ index }>
            <p>{category}</p>
          </Col>;
        })}
      </Row>
      <Row>
        <Col xs={12}>
          {this.renderActivity()}
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          {this.renderDemonstration()}
        </Col>
      </Row>
      <Row>
        <Col xs={4} >
        <Button onClick={ this.submitScore(this.props.cTest.slug) }>Submit Score</Button>
        { this.props.scores.map(function(categoryScore, index) {
          return <p key={ index }>{categoryScore}</p>;
        })}
        </Col>
      </Row>
    </div>;

  }
}

Test.propTypes = {
  localization: React.PropTypes.object,
  cTest: React.PropTypes.object,
};
