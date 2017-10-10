import assign from 'object-assign';
import _ from 'lodash';
import * as types from '../constants/actions';

/**
 * data reducer
 * @param {Object} template         Previous redux store state tree.
 * @param {Object} action       Action contains type and payload for reducer.
 *                              See actions/index.js for descriptions of
 *                              action params.
 * @returns {Object} nextState  Next redux store state tree.
 */
export default (template, action) => {
  const initialState = {
    title: null,
    id: window.chartwerkConfig.template_id,
    description: null,
    icon: null,
    tags: [],
  };

  if (typeof template === 'undefined') {
    return initialState;
  }

  let nextState = assign({}, template);
  let i;

  switch (action.type) {
    case types.API_TEMPLATE:
      nextState = _.merge({}, nextState, action.template);
      break;
    case types.SET_TEMPLATE_TITLE:
      nextState.title = action.title;
      break;
    case types.SET_TEMPLATE_DESCRIPTION:
      nextState.description = action.description;
      break;
    case types.SET_TEMPLATE_ICON:
      nextState.icon = action.icon;
      break;
    case types.ADD_TEMPLATE_TAG:
      i = nextState.tags.indexOf(action.tag);
      if (i < 0) {
        nextState.tags.push(action.tag);
      }
      break;
    case types.REMOVE_TEMPLATE_TAG:
      i = nextState.tags.indexOf(action.tag);
      if (i > -1) {
        nextState.tags.splice(i, 1);
      }
      break;
    default:
      return template;
  }
  return nextState;
};
