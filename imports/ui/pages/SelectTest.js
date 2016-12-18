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
      jsx = <h2 className='centered'>{this.props.localization.introTitle}</h2>;
    } else if (appState == Constants.STATE_MAIN_MENU) {
      jsx = <h2 className='centered'>{this.props.localization.mainMenuTitle}</h2>;
    }

    return jsx;

  }

  renderLowerBody() {

    const appState = Session.get('appState');
    let jsx = '';

    if (appState == Constants.STATE_INTRO) {
      jsx = <div className='divide-horizontal intro'>
              <p className='descrip'>{this.props.localization.introDescription}</p>
              <div className='button-guide'><p><span className='triangle'></span><span className='tag'>{this.props.localization.beginInstruction}</span></p></div>
            </div>;
    } else if (appState == Constants.STATE_MAIN_MENU) {
      jsx = <div className='divide-thirds main-menu'>
              { this.props.cTests.map((cTest, index) => {
                return <div className={'third i-' + index} key={ index }>
                  <h3 >{cTest.titleFull}</h3>
                  <p>{cTest.description}</p>
                  <div className='bottom inactive'>
                    <div className='circle'><span>{(index + 1)}</span></div>
                  </div>
                </div>;
              })}
            </div>;
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
      </div>
    </div>;

  }
}

SelectTest.propTypes = {
  localization: React.PropTypes.object,
  cTests: React.PropTypes.array,
};
