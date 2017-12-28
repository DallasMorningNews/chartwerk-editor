import * as types from '../constants/actions';

export const apiMargins = margins => ({
  type: types.API_MARGINS,
  margins,
});

export const setMarginSingleTop = percent => ({
  type: types.SET_MARGIN_SINGLE_TOP,
  percent,
});

export const setMarginSingleBottom = percent => ({
  type: types.SET_MARGIN_SINGLE_BOTTOM,
  percent,
});

export const setMarginSingleRight = percent => ({
  type: types.SET_MARGIN_SINGLE_RIGHT,
  percent,
});

export const setMarginSingleLeft = percent => ({
  type: types.SET_MARGIN_SINGLE_LEFT,
  percent,
});

export const setMarginDoubleTop = percent => ({
  type: types.SET_MARGIN_DOUBLE_TOP,
  percent,
});

export const setMarginDoubleBottom = percent => ({
  type: types.SET_MARGIN_DOUBLE_BOTTOM,
  percent,
});

export const setMarginDoubleRight = percent => ({
  type: types.SET_MARGIN_DOUBLE_RIGHT,
  percent,
});

export const setMarginDoubleLeft = percent => ({
  type: types.SET_MARGIN_DOUBLE_LEFT,
  percent,
});
