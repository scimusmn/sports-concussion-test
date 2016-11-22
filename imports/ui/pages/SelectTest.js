import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Constants from '../../modules/constants';

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
    console.log('SelectTest:componentDidMount');

  }

  getTestLink(slug) {

    return '/test/' + slug;

  }

  renderHeadband() {

    const appState = Session.get('appState');
    let jsx = '';

    if (appState == Constants.STATE_INTRO) {
      jsx = <h2>{this.props.localization.introTitle}</h2>;
    } else if (appState == Constants.STATE_MAIN_MENU) {
      jsx = <h2>{this.props.localization.mainMenuTitle}</h2>;
    }

    return jsx;

  }

  renderLowerBody() {

    const appState = Session.get('appState');
    let jsx = '';

    if (appState == Constants.STATE_INTRO) {
      jsx = <div>
              <p>{this.props.localization.introDescription}</p>
              <hr/>
              <p><em>{this.props.localization.beginInstruction}</em></p>
            </div>;
    } else if (appState == Constants.STATE_MAIN_MENU) {
      jsx = <div>
              { this.props.cTests.map((cTest, index) => {
                return <Col xs={4} key={ index }>
                  <h3 >{cTest.titleFull}</h3>
                  <p>{cTest.introInstruction}</p>
                  <p><em>Press {(index + 1)}</em></p>
                </Col>;
              })}
            </div>;
    }

    return jsx;

  }

  render() {

    return <div>
      <Row>
        <Col xs={12}>
          {this.renderHeadband()}
          {this.renderLowerBody()}
        </Col>
      </Row>
    </div>;

  }
}

SelectTest.propTypes = {
  localization: React.PropTypes.object,
  cTests: React.PropTypes.array,
};
