import * as types from '../constants/actions';

export const apiAxes = axes => ({
  type: types.API_AXES,
  axes,
});

// COLOR AXIS

/**
 * Sets a path that navigates color object (from constants/colors).
 * @param  {string} path    A string that represents the path to a color
 *                          array in constants/colors, accessed via the
 *                          lodash function _.get .
 * @return {Object}         Action payload.
 */
export const setColorScheme = path => ({
  type: types.SET_COLOR_SCHEME,
  path,
});

export const colorByFacet = () => ({
  type: types.COLOR_BY_FACET,
});

export const setIgnoreScale = () => ({
  type: types.IGNORE_SCALE,
});

export const setQuantize = () => ({
  type: types.SET_QUANTIZE,
});

export const unsetQuantize = () => ({
  type: types.UNSET_QUANTIZE,
});

export const setQuantizeColumn = column => ({
  type: types.SET_QUANTIZE_COLUMN,
  column,
});

export const unsetQuantizeColumn = () => ({
  type: types.UNSET_QUANTIZE_COLUMN,
});

export const setQuantizeDomain = domain => ({
  type: types.SET_QUANTIZE_DOMAIN,
  domain,
});

export const setQuantizeRange = range => ({
  type: types.SET_QUANTIZE_RANGE,
  range,
});

export const setQuantizeGroups = groups => ({
  type: types.SET_QUANTIZE_GROUPS,
  groups,
});

export const setQuantizeReverse = () => ({
  type: types.SET_QUANTIZE_REVERSE,
});

export const setColor = (column, color) => ({
  type: types.SET_COLOR,
  column,
  color,
});

export const unsetColor = column => ({
  type: types.UNSET_COLOR,
  column,
});

export const resetColor = () => ({
  type: types.RESET_COLOR,
});

// BASE AXIS

export const setBaseType = datatype => ({
  type: types.SET_BASE_TYPE,
  datatype,
});

export const setDateFormat = dateFormat => ({
  type: types.SET_DATE_FORMAT,
  dateFormat,
});

export const unsetDateFormat = () => ({
  type: types.UNSET_DATE_FORMAT,
});

export const setBaseSingleDateString = dateString => ({
  type: types.SET_BASE_SINGLE_DATESTRING,
  dateString,
});

export const setBaseDoubleDateString = dateString => ({
  type: types.SET_BASE_DOUBLE_DATESTRING,
  dateString,
});

export const setBaseSingleFrequency = frequency => ({
  type: types.SET_BASE_SINGLE_FREQUENCY,
  frequency,
});

export const setBaseDoubleFrequency = frequency => ({
  type: types.SET_BASE_DOUBLE_FREQUENCY,
  frequency,
});

export const setBaseSingleTicks = ticks => ({
  type: types.SET_BASE_SINGLE_TICKS,
  ticks,
});

export const setBaseDoubleTicks = ticks => ({
  type: types.SET_BASE_DOUBLE_TICKS,
  ticks,
});

export const setBaseSingleCustomTicks = ticks => ({
  type: types.SET_BASE_SINGLE_CUSTOMTICKS,
  ticks,
});

export const setBaseDoubleCustomTicks = ticks => ({
  type: types.SET_BASE_DOUBLE_CUSTOMTICKS,
  ticks,
});

export const setBaseMin = min => ({
  type: types.SET_BASE_MIN,
  min,
});

export const setBaseMax = max => ({
  type: types.SET_BASE_MAX,
  max,
});

export const setBaseLabel = label => ({
  type: types.SET_BASE_LABEL,
  label,
});

export const setBasePrefix = prefix => ({
  type: types.SET_BASE_PREFIX,
  prefix,
});

export const setBaseSuffix = suffix => ({
  type: types.SET_BASE_SUFFIX,
  suffix,
});

export const addBaseShadedRegion = () => ({
  type: types.ADD_BASE_SHADED_REGION,
});

export const setBaseShadedRegionMin = (index, min) => ({
  type: types.SET_BASE_SHADED_REGION_MIN,
  index,
  min,
});

export const setBaseShadedRegionMax = (index, max) => ({
  type: types.SET_BASE_SHADED_REGION_MAX,
  index,
  max,
});

export const removeBaseShadedRegion = index => ({
  type: types.REMOVE_BASE_SHADED_REGION,
  index,
});

// VALUE AXIS

export const setValueSingleTicks = ticks => ({
  type: types.SET_VALUE_SINGLE_TICKS,
  ticks,
});

export const setValueDoubleTicks = ticks => ({
  type: types.SET_VALUE_DOUBLE_TICKS,
  ticks,
});

export const setValueSingleCustomTicks = ticks => ({
  type: types.SET_VALUE_SINGLE_CUSTOMTICKS,
  ticks,
});

export const setValueDoubleCustomTicks = ticks => ({
  type: types.SET_VALUE_DOUBLE_CUSTOMTICKS,
  ticks,
});

export const setValueMin = min => ({
  type: types.SET_VALUE_MIN,
  min,
});

export const setValueMax = max => ({
  type: types.SET_VALUE_MAX,
  max,
});

export const setValueLabel = label => ({
  type: types.SET_VALUE_LABEL,
  label,
});

export const setValuePrefix = prefix => ({
  type: types.SET_VALUE_PREFIX,
  prefix,
});

export const setValueSuffix = suffix => ({
  type: types.SET_VALUE_SUFFIX,
  suffix,
});

export const addValueShadedRegion = () => ({
  type: types.ADD_VALUE_SHADED_REGION,
});

export const setValueShadedRegionMin = (index, min) => ({
  type: types.SET_VALUE_SHADED_REGION_MIN,
  index,
  min,
});

export const setValueShadedRegionMax = (index, max) => ({
  type: types.SET_VALUE_SHADED_REGION_MAX,
  index,
  max,
});

export const removeValueShadedRegion = index => ({
  type: types.REMOVE_VALUE_SHADED_REGION,
  index,
});

export const setScalePrefix = prefix => ({
  type: types.SET_SCALE_PREFIX,
  prefix,
});

export const setScaleSuffix = suffix => ({
  type: types.SET_SCALE_SUFFIX,
  suffix,
});
