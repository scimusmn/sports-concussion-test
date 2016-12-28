import { Meteor } from 'meteor/meteor';
import React from 'react';
import ReactDOM from 'react-dom';
import Constants from '../../modules/constants';
import s from 'underscore.string';
import { camelToTitleCase } from '../../modules/utils';

export default class ScoreTable extends React.Component {

  constructor(props) {

    super(props);

    this.state = {

    };

    console.log('constructor:ScoreTable');
    console.dir(props);

  }

  renderTable() {
    let jsx = '';

    jsx = <table className='table'>
        <thead>
          <tr>
            { this.props.cTest.scoreCategories.map((category, index) => {
              return <th key={ index }>
                {this.renderColumnHeader(category)}
              </th>;
            })}
          </tr>
        </thead>
        <tbody>

            { this.props.scores.map((score, indexA) => {

              return <tr key={ indexA } className={((indexA == 0) ? 'your-score' : '')}>

                      { this.props.cTest.scoreCategories.map((category, indexB) => {
                          return <td key={ indexB }>
                            {score[category]}
                          </td>;
                          })}
                      </tr>;

            })}

        </tbody>
      </table>;

    return jsx;

  }

  renderColumnHeader(category) {
    let jsx = '';

    // Convert to title case
    const categoryString = camelToTitleCase(category);

    // Check if this will be multiline label
    let multiline = false;
    if (categoryString.split(' ').length >= 1) {
      multiline = true;
    }

    // Check if a subheader is required.
    let unitLabel = '';
    if (categoryString.indexOf('Time') != -1) {
      unitLabel = '(seconds)';
    }

    jsx = <div>
            {categoryString}
            <p className='unit-label'>&nbsp;{unitLabel}&nbsp;</p>
          </div>;
    return jsx;
  }

  render() {

    return <div>
            { this.renderTable() }
          </div>;

  }
}

ScoreTable.propTypes = {
  localization: React.PropTypes.object,
  cTest: React.PropTypes.object,
};
