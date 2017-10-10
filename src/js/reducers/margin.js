import assign from 'object-assign';
import _ from 'lodash';
import * as types from '../constants/actions';

/**
 * margins reducer
 * @param {Object} margins         Previous redux store state tree.
 * @param {Object} action       Action contains type and payload for reducer.
 *                              See actions/index.js for descriptions of
 *                              action params.
 * @returns {Object} nextState  Next redux store state tree.
 */
export default (margins, action) => {
  const initialState = {
    single: {
      top: 0.05,
      right: 0.02,
      bottom: 0.05,
      left: 0.02,
    },
    double: {
      top: 0.05,
      right: 0.02,
      bottom: 0.05,
      left: 0.02,
    },
  };

  if (typeof margins === 'undefined') {
    return initialState;
  }

  let nextState = assign({}, margins);

  switch (action.type) {
    case types.API_MARGINS:
      nextState = _.merge({}, nextState, action.margins);
      break;
    case types.SET_MARGIN_SINGLE_TOP:
      nextState.single.top = action.percent;
      break;
    case types.SET_MARGIN_SINGLE_BOTTOM:
      nextState.single.bottom = action.percent;
      break;
    case types.SET_MARGIN_SINGLE_RIGHT:
      nextState.single.right = action.percent;
      break;
    case types.SET_MARGIN_SINGLE_LEFT:
      nextState.single.left = action.percent;
      break;
    case types.SET_MARGIN_DOUBLE_TOP:
      nextState.double.top = action.percent;
      break;
    case types.SET_MARGIN_DOUBLE_BOTTOM:
      nextState.double.bottom = action.percent;
      break;
    case types.SET_MARGIN_DOUBLE_RIGHT:
      nextState.double.right = action.percent;
      break;
    case types.SET_MARGIN_DOUBLE_LEFT:
      nextState.double.left = action.percent;
      break;
    default:
      return margins;
  }

  return nextState;
};
