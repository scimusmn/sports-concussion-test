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
                {camelToTitleCase(category)}
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

  renderScoreRow(index) {

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
