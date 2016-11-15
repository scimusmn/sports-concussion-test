import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';

export default class SelectTest extends React.Component {

  constructor(props) {
    super(props);

    console.log('SelectTest:constructor');

    this.state = {

    };

  }

  componentDidMount() {
    console.log('SelectTest:componentDidMount');
  }

  render() {

    return (<div>

        <h2>{this.props.localization.introTitle}</h2>
        <p>{this.props.localization.introDescription}</p>

      </div>);
  }

  render() {

    return <div>
      <Row>
        <Col xs={12}>
          <h2>{this.props.localization.introTitle}</h2>
          <p>{this.props.localization.introDescription}</p>
        </Col>
      </Row>
      <Row>
        { this.props.cTests.map(function(cTest, index) {
          return <Col xs={4} key={ index }>
            <h3 >{cTest.titleFull}</h3>
            <p>{cTest.introInstruction}</p>
          </Col>;
        })}
      </Row>
    </div>;

  }
}

SelectTest.propTypes = {
  localization: React.PropTypes.object,
  cTests: React.PropTypes.array,
};
