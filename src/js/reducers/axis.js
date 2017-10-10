import assign from 'object-assign';
import _ from 'lodash';
import * as types from '../constants/actions';

/**
 * axis reducer
 * @param {Object} axis         Previous redux store state tree.
 * @param {Object} action       Action contains type and payload for reducer.
 *                              See actions/index.js for descriptions of
 *                              action params.
 * @returns {Object} nextState  Next redux store state tree.
 */
export default (axis, action) => {
  const initialState = {
    color: {
      domain: [],
      range: [],
      scheme: 'categorical.default',
      byFacet: false,
      ignoreScale: false,
      quantize: false,
      quantizeProps: {
        column: null,
        groups: 0,
        reverseColors: false,
      },
    },
    base: {
      type: null,
      dateFormat: null,
      min: null,
      max: null,
      label: '',
      prefix: '',
      suffix: '',
      format: {
        double: {
          dateString: 'Y',
          frequency: 1,
          ticks: 7,
          customTicks: [],
        },
        single: {
          dateString: 'Y',
          frequency: 1,
          ticks: 7,
          customTicks: [],
        },
      },
      shadedRegions: [],
    },
    value: {
      min: null,
      max: null,
      label: '',
      prefix: '',
      suffix: '',
      format: {
        double: {
          ticks: 7,
          customTicks: [],
        },
        single: {
          ticks: 7,
          customTicks: [],
        },
      },
      shadedRegions: [],
    },
    scale: {
      prefix: '',
      suffix: '',
    },
  };

  if (typeof axis === 'undefined') {
    return initialState;
  }

  let nextState = assign({}, axis);
  let i;

  switch (action.type) {
    case types.API_AXES:
      nextState = _.merge({}, nextState, action.axes);
      break;
     /**
      * COLOR AXIS
      */
    case types.SET_COLOR_SCHEME:
      nextState.color.scheme = action.path;
      break;
    case types.COLOR_BY_FACET:
      nextState.color.byFacet = !nextState.color.byFacet;
      break;
    case types.IGNORE_SCALE:
      nextState.color.ignoreScale = !nextState.color.ignoreScale;
      break;
    case types.SET_QUANTIZE:
      nextState.color.quantize = true;
      break;
    case types.UNSET_QUANTIZE:
      nextState.color.quantize = false;
      nextState.color.quantizeProps = initialState.color.quantizeProps;
      break;
    case types.SET_QUANTIZE_COLUMN:
      nextState.color.quantizeProps.column = action.column;
      break;
    case types.UNSET_QUANTIZE_COLUMN:
      nextState.color.quantizeProps = initialState.color.quantizeProps;
      break;
    case types.SET_QUANTIZE_DOMAIN:
      nextState.color.domain = action.domain;
      break;
    case types.SET_QUANTIZE_RANGE:
      nextState.color.range = action.range.slice();
      break;
    case types.SET_QUANTIZE_GROUPS:
      nextState.color.quantizeProps.groups = action.groups;
      break;
    case types.SET_QUANTIZE_REVERSE:
      nextState.color.quantizeProps.reverseColors = !nextState.color.quantizeProps.reverseColors;
      break;
    case types.SET_COLOR:
      i = nextState.color.domain.indexOf(action.column);
      if (i > -1) {
        nextState.color.range[i] = action.color;
      } else {
        nextState.color.domain.push(action.column);
        nextState.color.range.push(action.color);
      }
      break;
    case types.UNSET_COLOR:
      i = nextState.color.domain.indexOf(action.column);
      if (i > -1) {
        nextState.color.domain.splice(i, 1);
        nextState.color.range.splice(i, 1);
      }
      break;
    case types.RESET_COLOR:
      nextState.color.domain = [];
      nextState.color.range = [];
      nextState.color.quantize = false;
      nextState.color.quantizeProps = assign({}, initialState.color.quantizeProps);
      break;
     /**
      * BASE AXIS
      */
    case types.SET_BASE_TYPE:
      nextState.base.type = action.datatype;
      break;
    case types.SET_DATE_FORMAT:
      nextState.base.dateFormat = action.dateFormat;
      break;
    case types.UNSET_DATE_FORMAT:
      nextState.base.dateFormat = null;
      break;
    case types.SET_BASE_SINGLE_DATESTRING:
      nextState.base.format.single.dateString = action.dateString;
      break;
    case types.SET_BASE_DOUBLE_DATESTRING:
      nextState.base.format.double.dateString = action.dateString;
      break;
    case types.SET_BASE_SINGLE_FREQUENCY:
      nextState.base.format.single.frequency = action.frequency;
      break;
    case types.SET_BASE_DOUBLE_FREQUENCY:
      nextState.base.format.double.frequency = action.frequency;
      break;
    case types.SET_BASE_SINGLE_TICKS:
      nextState.base.format.single.ticks = action.ticks;
      break;
    case types.SET_BASE_SINGLE_CUSTOMTICKS:
      nextState.base.format.single.customTicks = action.ticks;
      break;
    case types.SET_BASE_DOUBLE_TICKS:
      nextState.base.format.double.ticks = action.ticks;
      break;
    case types.SET_BASE_DOUBLE_CUSTOMTICKS:
      nextState.base.format.double.customTicks = action.ticks;
      break;
    case types.SET_BASE_MIN:
      nextState.base.min = action.min;
      break;
    case types.SET_BASE_MAX:
      nextState.base.max = action.max;
      break;
    case types.SET_BASE_LABEL:
      nextState.base.label = action.label;
      break;
    case types.SET_BASE_PREFIX:
      nextState.base.prefix = action.prefix;
      break;
    case types.SET_BASE_SUFFIX:
      nextState.base.suffix = action.suffix;
      break;
    case types.ADD_BASE_SHADED_REGION:
      nextState.base.shadedRegions.push({
        min: null,
        max: null,
      });
      break;
    case types.SET_BASE_SHADED_REGION_MIN:
      nextState.base.shadedRegions[action.index].min = action.min;
      break;
    case types.SET_BASE_SHADED_REGION_MAX:
      nextState.base.shadedRegions[action.index].max = action.max;
      break;
    case types.REMOVE_BASE_SHADED_REGION:
      nextState.base.shadedRegions.splice(action.index, 1);
      break;
     /**
      * VALUE AXIS
      */
    case types.SET_VALUE_SINGLE_TICKS:
      nextState.value.format.single.ticks = action.ticks;
      break;
    case types.SET_VALUE_SINGLE_CUSTOMTICKS:
      nextState.value.format.single.customTicks = action.ticks;
      break;
    case types.SET_VALUE_DOUBLE_TICKS:
      nextState.value.format.double.ticks = action.ticks;
      break;
    case types.SET_VALUE_DOUBLE_CUSTOMTICKS:
      nextState.value.format.double.customTicks = action.ticks;
      break;
    case types.SET_VALUE_MIN:
      nextState.value.min = action.min;
      break;
    case types.SET_VALUE_MAX:
      nextState.value.max = action.max;
      break;
    case types.SET_VALUE_LABEL:
      nextState.value.label = action.label;
      break;
    case types.SET_VALUE_PREFIX:
      nextState.value.prefix = action.prefix;
      break;
    case types.SET_VALUE_SUFFIX:
      nextState.value.suffix = action.suffix;
      break;
    case types.ADD_VALUE_SHADED_REGION:
      nextState.value.shadedRegions.push({
        min: null,
        max: null,
      });
      break;
    case types.SET_VALUE_SHADED_REGION_MIN:
      nextState.value.shadedRegions[action.index].min = action.min;
      break;
    case types.SET_VALUE_SHADED_REGION_MAX:
      nextState.value.shadedRegions[action.index].max = action.max;
      break;
    case types.REMOVE_VALUE_SHADED_REGION:
      nextState.value.shadedRegions.splice(action.index, 1);
      break;
    case types.SET_SCALE_PREFIX:
      nextState.scale.prefix = action.prefix;
      break;
    case types.SET_SCALE_SUFFIX:
      nextState.scale.suffix = action.suffix;
      break;
    default:
      return axis;
  }
  return nextState;
};
