import * as types from '../constants/actions';

export const apiUI = ui => ({
  type: types.API_UI,
  ui,
});

export const setRawData = data => ({
  type: types.SET_RAW_DATA,
  data,
});

export const changePreview = size => ({
  type: types.CHANGE_PREVIEW,
  size,
});

export const setAvailableDataClass = dataClass => ({
  type: types.SET_AVAILABLE_DATA_CLASS,
  dataClass,
});

export const setDataClassAlias = (dataClass, alias) => ({
  type: types.SET_DATA_CLASS_ALIAS,
  dataClass,
  alias,
});

export const syncCustomClasses = classes => ({
  type: types.SYNC_CUSTOM_CLASSES,
  classes,
});
