import _ from 'lodash';
import * as types from '../constants/actions';

/**
 * data reducer
 * @param {Object} embed        Previous redux store state tree.
 * @param {Object} action       Action contains type and payload for reducer.
 *                              See actions/index.js for descriptions of
 *                              action params.
 * @returns {Object} nextState  Next redux store state tree.
 */
export default (embed, action) => {
  const initialState = {
    dimensions: {},
  };

  if (typeof embed === 'undefined') {
    return initialState;
  }

  let nextState = _.merge({}, embed);

  switch (action.type) {
    case types.API_EMBED:
      nextState = _.merge({}, nextState, action.embed);
      break;
    case types.SET_EMBED_DIMENSIONS:
      nextState.dimensions = _.merge({}, action.dimensions);
      break;
    default:
      return embed;
  }
  return nextState;
};
