import React from 'react';

const StroopWord = (props) => (
  <div>
    <h1 style={{color: props.color}}>{props.word}</h1>
  </div>
);

StroopWord.propTypes = {
  color: React.PropTypes.string,
  word: React.PropTypes.string,
};

export default StroopWord;
