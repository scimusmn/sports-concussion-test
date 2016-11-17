import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default class Test extends React.Component {

  constructor(props) {
    super(props);

    console.log('Test:constructor');

    console.dir(props);

    this.state = {

    };

  }

  componentDidMount() {
    console.log('Test:componentDidMount');
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
    </div>;

  }
}

Test.propTypes = {
  localization: React.PropTypes.object,
  cTest: React.PropTypes.object,
};
