import React from 'react';
import { Link } from 'react-router';
import Constants from '../../modules/constants';

export default class AppNavigation extends React.Component {

  constructor(props) {
    super(props);

    console.log('AppNavigation:constructor');

    this.state = {

    };

  }

  componentDidMount() {
    console.log('AppNavigation:componentDidMount');

  }

  renderNav() {

    const appState = Session.get('appState');
    let jsx = '';

    if (appState != Constants.STATE_INTRO && appState != Constants.STATE_MAIN_MENU) {
      jsx =   <div className='top-nav-container'>
                <div className='circle-container'>
                  <div className='circle'>
                    <p>3</p>
                  </div>
                </div>
                <br/><br/>
                <h3>

                <span className={((appState == Constants.STATE_MAIN_MENU) ? 'active-nav' : 'inactive-nav')}>( 1 ) {this.props.localization.navMainMenu} </span>&nbsp;&nbsp;
                <span className={((appState == Constants.STATE_HOW_TO_PLAY) ? 'active-nav' : 'inactive-nav')}>( 2 ) {this.props.localization.navHowToPlay} </span>&nbsp;&nbsp;
                <span className={((appState == Constants.STATE_PLAY || appState == Constants.STATE_PLAY_SCORE) ? 'active-nav' : 'inactive-nav')}>( 3 ) {this.props.localization.navPlay} </span>&nbsp;&nbsp;
              </h3>
            </div>;
    }

    return jsx;

  }

  render() {

    return <div>
            {this.renderNav()}
          </div>;

  }
}
