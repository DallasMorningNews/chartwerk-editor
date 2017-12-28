import * as types from '../constants/actions';

export const apiData = data => ({
  type: types.API_DATA,
  data,
});

export const apiDatamap = datamap => ({
  type: types.API_DATAMAP,
  datamap,
});

export const addBase = column => ({
  type: types.ADD_BASE,
  column,
});

export const addValue = column => ({
  type: types.ADD_VALUE,
  column,
});

export const addScale = column => ({
  type: types.ADD_SCALE,
  column,
});

export const addSeries = column => ({
  type: types.ADD_SERIES,
  column,
});

export const addFacet = column => ({
  type: types.ADD_FACET,
  column,
});

export const addIgnore = column => ({
  type: types.ADD_IGNORE,
  column,
});

export const removeBase = () => ({
  type: types.REMOVE_BASE,
});

export const removeValue = () => ({
  type: types.REMOVE_VALUE,
});

export const removeScale = () => ({
  type: types.REMOVE_SCALE,
});

export const removeSeries = column => ({
  type: types.REMOVE_SERIES,
  column,
});

export const removeFacet = () => ({
  type: types.REMOVE_FACET,
});

export const removeIgnore = column => ({
  type: types.REMOVE_IGNORE,
  column,
});

export const resetDatamap = () => ({
  type: types.RESET_DATAMAP,
});

export const attachData = data => ({
  type: types.ATTACH_DATA,
  data,
});

export const setHeaderSort = data => ({
  type: types.SET_HEADER_SORT,
  data,
});

export const setCustomKeys = keys => ({
  type: types.SET_CUSTOM_KEYS,
  keys,
});

export const setCustomValue = (key, value) => ({
  type: types.SET_CUSTOM_VALUE,
  key,
  value,
});
