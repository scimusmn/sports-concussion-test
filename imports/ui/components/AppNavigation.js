import React from 'react';
import { Link } from 'react-router';
import Constants from '../../modules/constants';

export default class AppNavigation extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

    };

  }

  renderNav() {

    const appState = Session.get('appState');
    let jsx = '';

    if (appState != Constants.STATE_INTRO && appState != Constants.STATE_MAIN_MENU) {
      jsx = <div className='top-nav-container'>

              <div className={((appState == Constants.STATE_MAIN_MENU) ? 'nav-item first active' : 'nav-item first inactive')}>
                <div className='circle'><span>1</span></div>
                <span className='nav-title'> {this.props.localization.navMainMenu} </span>
              </div>
              <div className={((appState == Constants.STATE_HOW_TO_PLAY) ? 'nav-item second active' : 'nav-item second inactive')}>
                <div className='circle'><span>2</span></div>
                <span className='nav-title'> {this.props.localization.navHowToPlay} </span>
              </div>
              <div className={((appState == Constants.STATE_PLAY) ? 'nav-item third active' : 'nav-item third inactive')}>
                <div className='circle'><span>3</span></div>
                <span className='nav-title'> {this.props.localization.navPlay} </span>
              </div>

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
