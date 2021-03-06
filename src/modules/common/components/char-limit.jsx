import React from 'react';
import PropTypes from 'prop-types';

const CharLimit = ({ limit, string }) => {
  const remaining = limit - string.length;
  return (
    <span>
      {remaining} of {limit} characters remaining.
    </span>
  );
};

CharLimit.propTypes = {
  limit: PropTypes.number.isRequired,
  string: PropTypes.string.isRequired,
};

CharLimit.defaultProps = {
  limit: 0,
  string: '',
};

export default CharLimit;
