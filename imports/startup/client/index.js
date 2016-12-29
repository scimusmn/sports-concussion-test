import { Bert } from 'meteor/themeteorchef:bert';
import 'bootstrap/dist/css/bootstrap.min.css';
import './key-map.js';
import './routes.js';
import Constants from '../../modules/constants';

Bert.defaults.style = 'growl-top-right';

Session.set('appState', Constants.STATE_MAIN_MENU);
