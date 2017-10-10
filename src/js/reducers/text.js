import assign from 'object-assign';
import _ from 'lodash';
import * as types from '../constants/actions';

// src: https://github.com/sindresorhus/array-move/blob/master/index.js
function arrayMove(x, from, to) {
  const y = x.slice();
  y.splice((to < 0 ? y.length + to : to), 0, y.splice(from, 1)[0]);
  return y;
}


/**
 * text reducer
 * @param {Object} texts        Previous redux store state tree.
 * @param {Object} action       Action contains type and payload for reducer.
 *                              See actions/index.js for descriptions of
 *                              action params.
 * @returns {Object} nextState  Next redux store state tree.
 */
export default (texts, action) => {
  const initialState = {
    headline: null,
    chatter: null,
    footnote: null,
    source: null,
    author: null,
    title: null,
    annotations: [],
    legend: {
      active: false,
      keys: [],
      title: '',
      single: {
        inside: false,
        align: 'l',
        background: true,
        width: 250,
        position: {
          x: 10,
          y: 10,
        },
      },
      double: {
        inside: false,
        align: 'l',
        background: true,
        width: 500,
        position: {
          x: 10,
          y: 10,
        },
      },
    },
  };

  if (typeof texts === 'undefined') {
    return initialState;
  }

  let nextState = assign({}, texts);
  switch (action.type) {
    case types.API_TEXT:
      nextState = _.merge({}, nextState, action.texts);
      break;
    case types.SET_HEADLINE:
      nextState.headline = action.headline;
      break;
    case types.SET_CHATTER:
      nextState.chatter = action.chatter;
      break;
    case types.SET_FOOTNOTE:
      nextState.footnote = action.footnote;
      break;
    case types.SET_DATASOURCE:
      nextState.source = action.source;
      break;
    case types.SET_AUTHOR:
      nextState.author = action.author;
      break;
    case types.SET_CHART_TITLE:
      nextState.title = action.title;
      break;
    case types.ADD_ANNOTATION:
      nextState.annotations.push(action.annotation);
      break;
    case types.REMOVE_ANNOTATION:
      nextState.annotations.splice(action.index, 1);
      break;
    case types.CHANGE_ANNOTATION:
      nextState.annotations[action.index] = action.annotation;
      break;
    case types.CHANGE_ANNOTATION_TEXT:
      nextState.annotations[action.index].text = action.text;
      break;
    case types.CHANGE_ANNOTATION_POSITION:
      nextState.annotations[action.index].x = action.x;
      nextState.annotations[action.index].y = action.y;
      break;
    case types.CHANGE_ANNOTATION_DIMENSIONS:
      nextState.annotations[action.index].w = action.width;
      break;
    case types.CHANGE_ANNOTATION_ALIGN:
      nextState.annotations[action.index].align = action.align;
      break;
    case types.CHANGE_ANNOTATION_FONT_SIZE:
      nextState.annotations[action.index].fontSize = action.size;
      break;
    case types.CHANGE_ANNOTATION_BACKGROUND:
      nextState
        .annotations[action.index]
        .background = !nextState
        .annotations[action.index]
        .background;
      break;
    case types.CHANGE_ANNOTATION_SIZE:
      nextState.annotations[action.index].size = action.size;
      break;
    case types.CHANGE_ANNOTATION_COLOR:
      nextState.annotations[action.index].color = action.color;
      break;
    case types.SET_LEGEND_ACTIVE:
      nextState.legend.active = !nextState.legend.active;
      break;
    case types.UNSET_LEGEND:
      nextState.legend = assign({}, initialState.legend);
      break;
    case types.SET_LEGEND_KEYS:
      nextState.legend.keys = action.keys;
      break;
    case types.CHANGE_LEGEND_KEY:
      nextState.legend.keys[action.index] = {
        color: action.color,
        text: action.text,
      };
      break;
    case types.CHANGE_LEGEND_KEY_ORDER_UP:
      nextState.legend.keys = arrayMove(
        nextState.legend.keys,
        action.index,
        action.index - 1
      );
      break;
    case types.CHANGE_LEGEND_KEY_ORDER_DOWN:
      nextState.legend.keys = arrayMove(
        nextState.legend.keys,
        action.index,
        action.index + 1
      );
      break;
    case types.CHANGE_LEGEND_TITLE:
      nextState.legend.title = action.text;
      break;
    case types.CHANGE_LEGEND_ALIGN:
      if (action.size === 'single') {
        nextState.legend.single.align = action.align;
      } else {
        nextState.legend.double.align = action.align;
      }
      break;
    case types.CHANGE_LEGEND_BACKGROUND:
      if (action.size === 'single') {
        nextState.legend.single.background = !nextState.legend.single.background;
      } else {
        nextState.legend.double.background = !nextState.legend.double.background;
      }
      break;
    case types.CHANGE_LEGEND_INSIDE:
      if (action.size === 'single') {
        nextState.legend.single.inside = !nextState.legend.single.inside;
      } else {
        nextState.legend.double.inside = !nextState.legend.double.inside;
      }
      break;
    case types.CHANGE_LEGEND_POSITION:
      if (action.size === 'single') {
        nextState.legend.single.position.x = action.x;
        nextState.legend.single.position.y = action.y;
      } else {
        nextState.legend.double.position.x = action.x;
        nextState.legend.double.position.y = action.y;
      }
      break;
    case types.CHANGE_LEGEND_WIDTH:
      if (action.size === 'single') {
        nextState.legend.single.width = action.width;
      } else {
        nextState.legend.double.width = action.width;
      }
      break;
    default:
      return texts;
  }

  return nextState;
};
