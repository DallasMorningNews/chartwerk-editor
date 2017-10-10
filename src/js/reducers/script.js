import assign from 'object-assign';
import _ from 'lodash';
import * as types from '../constants/actions';

/**
 * script reducer
 * @param {Object} scripts        Previous redux store state tree.
 * @param {Object} action       Action contains type and payload for reducer.
 *                              See actions/index.js for descriptions of
 *                              action params.
 * @returns {Object} nextState  Next redux store state tree.
 */
export default (scripts, action) => {
  const initialState = {
    draw: 'function draw(){\n}',
    helper: 'var werkHelper = {};',
    styles: '',
    html: '',
    dependencies: {
      scripts: [],
      styles: [],
    },
  };

  if (typeof scripts === 'undefined') {
    return initialState;
  }

  let nextState = assign({}, scripts);
  switch (action.type) {
    case types.API_SCRIPTS:
      nextState = _.merge({}, nextState, action.scripts);
      break;
    case types.SET_DRAW_SCRIPT:
      nextState.draw = action.script;
      break;
    case types.SET_HELPER_SCRIPT:
      nextState.helper = action.script;
      break;
    case types.SET_STYLES:
      nextState.styles = action.styles;
      break;
    case types.SET_HTML:
      nextState.html = action.html;
      break;
    case types.SET_DEPENDENCIES:
      nextState.dependencies.scripts = action.dependencies.scripts.slice();
      nextState.dependencies.styles = action.dependencies.styles.slice();
      break;
    default:
      return scripts;
  }

  return nextState;
};
