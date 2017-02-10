import { Meteor } from 'meteor/meteor';
import React from 'react';
import ReactDOM from 'react-dom';
import Constants from '../../modules/constants';

export default class BaseTest extends React.Component {

  constructor(props) {

    super(props);

    this.testCompleted = this.testCompleted.bind(this);
    this.testActive = false;

  }

  componentDidMount() {

    this.beginTest();

  }

  componentWillUnmount() {

    this.testActive = false;
    Session.set('maxAttempts', 0);

  }

  beginTest() {

    console.log('BaseTest.beginTest()');

    Session.set('attemptCount', 0);
    Session.set('correctCount', 0);
    Session.set('startTime', 0);

    Session.set('currentSymbol', '');
    Session.set('correctAnswer', false);

  }

  submitResults(scoreDoc) {

    // Add test key and timestamp
    scoreDoc.testKey = this.props.cTest.slug;
    scoreDoc.timestamp = new Date().getTime();

    Meteor.apply('submitScore', [scoreDoc], {

      onResultReceived: (error, response) => {

        if (error) console.warn(error.reason);
        if (response) console.log('submitResults success:', response);

        // Progress to score screen.
        Session.set('appState', Constants.STATE_PLAY_SCORE);

      },

    });

  }

}

BaseTest.propTypes = {
  localization: React.PropTypes.object,
  cTest: React.PropTypes.object,
};
