import assign from 'object-assign';
import _ from 'lodash';
import * as types from '../constants/actions';
import defaultDatamap from '../constants/datamap';


/**
 * ui reducer
 * @param {Object} ui         Previous redux store state tree.
 * @param {Object} action       Action contains type and payload for reducer.
 *                              See actions/index.js for descriptions of
 *                              action params.
 * @returns {Object} nextState  Next redux store state tree.
 */
export default (ui, action) => {
  const initialState = {
    rawData: null,
    size: 'single',
    datamap: defaultDatamap,
  };

  if (typeof ui === 'undefined') {
    return initialState;
  }

  let nextState = assign({}, ui);

  const setAvailable = (dataClass) => {
    const map = nextState.datamap.slice();
    const i = _.indexOf(map, _.find(map, { class: dataClass }));
    map[i].available = !map[i].available;
    return map;
  };

  const setAlias = (dataClass, alias) => {
    const map = nextState.datamap.slice();
    const i = _.indexOf(map, _.find(map, { class: dataClass }));
    map[i].alias = alias;
    return map;
  };

  /**
   * Parses classes to retain all default class objects
   * and add new class objects.
   * @param  {array} classes Incomplete classes array.
   * @return {array}         New array of classes object.
   */
  const syncClasses = (classes) => {
    const defaultClasses = defaultDatamap.map(d => d.class);
    const retainClasses = _.filter(nextState.datamap,
      d => defaultClasses.indexOf(d.class) > -1);
    const newClasses = classes.slice().map((d) => {
      const fullObject = {
        class: d.class,
        alias: d.alias,
        available: true,
      };
      return fullObject;
    });
    return retainClasses.concat(newClasses);
  };

  switch (action.type) {
    case types.API_UI:
      nextState = _.merge({}, nextState, action.ui);
      break;
    case types.SET_RAW_DATA:
      nextState.rawData = action.data;
      break;
    case types.CHANGE_PREVIEW:
      nextState.size = action.size;
      break;
    case types.SET_AVAILABLE_DATA_CLASS:
      nextState.datamap = setAvailable(action.dataClass);
      break;
    case types.SET_DATA_CLASS_ALIAS:
      nextState.datamap = setAlias(action.dataClass, action.alias);
      break;
    case types.SYNC_CUSTOM_CLASSES:
      nextState.datamap = syncClasses(action.classes);
      break;
    default:
      return ui;
  }
  return nextState;
};
