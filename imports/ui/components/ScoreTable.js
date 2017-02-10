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
      youLabelStyles: {},
      prevLabelStyles: {},
    };

  }

  componentDidUpdate() {

    // Position row labels
    // to align with first two
    // rows, no matter the height
    // of the columnn headers
    if (this.refs.scoreRow0 && this.refs.scoreRow1) {

      const youTop = this.refs.scoreRow0.offsetTop - 6;
      const prevTop = this.refs.scoreRow1.offsetTop + 7;

      if (this.state.youLabelStyles.top != youTop) {
        this.setState({
          youLabelStyles: {
            top: youTop,
          },
        });
      }

      if (this.state.prevLabelStyles.top != prevTop) {
        this.setState({
          prevLabelStyles: {
            top: prevTop,
          },
        });
      }

    }

  }

  renderTable() {
    let jsx = '';

    jsx = <table className='table'>
        <thead ref='scoreHead'>
          <tr ref='scoreTitleRow'>
            { this.props.cTest.scoreCategories.map((category, index) => {
              return <th key={ index }>
                {this.renderColumnHeader(category)}
              </th>;
            })}
          </tr>
        </thead>
        <tbody ref='scoreBody'>

            { this.props.scores.map((score, indexA) => {

              return <tr key={ indexA } ref={ 'scoreRow' + indexA } className={((indexA == 0) ? 'your-score' : '')}>

                        { this.props.cTest.scoreCategories.map((category, indexB) => {

                          return <td key={ indexB } className={((indexA == 9) ? 'last-row' : '')} >{score[category]}</td>;

                        })}

                      </tr>;

            })}

        </tbody>
      </table>;

    return jsx;

  }

  renderColumnHeader(category) {
    let jsx = '';

    // Get localized title
    // e.g. 'percentCorrect' -> scorePercentCorrect
    const categoryString = this.props.localization['score' + s.capitalize(category, true)];

    // Check if this will be multiline label
    let multiline = false;
    if (categoryString.split(' ').length >= 1) {
      multiline = true;
    }

    // Check if a subheader is required.
    let unitLabel = '';
    if (categoryString.indexOf('time') != -1) {
      unitLabel = '(seconds)';
    } else if (categoryString.indexOf('Tiempo') != -1) {
      unitLabel = '(segundos)';
    }

    jsx = <div>
            {categoryString}
            <p className='unit-label'> {unitLabel} </p>
          </div>;
    return jsx;
  }

  render() {

    return <div>
            <h3 className='you' style={this.state.youLabelStyles}>{this.props.localization.yourScore}</h3>
            <p className='prev-players' style={this.state.prevLabelStyles}>{this.props.localization.prevPlayers}</p>
            { this.renderTable() }
          </div>;

  }
}

ScoreTable.propTypes = {
  localization: React.PropTypes.object,
  cTest: React.PropTypes.object,
};
