import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default class SelectTest extends React.Component {

  constructor(props) {
    super(props);

    console.log('SelectTest:constructor');

    // Bind methods to 'this'
    this.getTestLink = this.getTestLink.bind(this);

    this.state = {

    };

  }

  componentDidMount() {
    // console.log('SelectTest:componentDidMount');
  }

  getTestLink(slug) {

    return '/test/' + slug;

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
        { this.props.cTests.map((cTest, index) => {
          return <Col xs={4} key={ index }>
            <h3 >{cTest.titleFull}</h3>
            <p>{cTest.introInstruction}</p>
            <LinkContainer to={this.getTestLink(cTest.slug)}>
              <Button>Go</Button>
            </LinkContainer>
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
