import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Stroop from '../components/Stroop';
import GoNoGo from '../components/GoNoGo';
import WorkingMemory from '../components/WorkingMemory';

export default class Test extends React.Component {

  constructor(props) {
    super(props);

    console.log('Test:constructor');

    this.state = {

    };

  }

  componentDidMount() {
    console.log('Test:componentDidMount');

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
        {this.renderActivity()}
      </Row>
    </div>;

  }
}

Test.propTypes = {
  localization: React.PropTypes.object,
  cTest: React.PropTypes.object,
};
