import * as types from '../constants/actions';

export const apiScripts = scripts => ({
  type: types.API_SCRIPTS,
  scripts,
});

export const setDrawScript = script => ({
  type: types.SET_DRAW_SCRIPT,
  script,
});

export const setHelperScript = script => ({
  type: types.SET_HELPER_SCRIPT,
  script,
});

export const setStyles = styles => ({
  type: types.SET_STYLES,
  styles,
});

export const setHTML = html => ({
  type: types.SET_HTML,
  html,
});

export const setDependencies = dependencies => ({
  type: types.SET_DEPENDENCIES,
  dependencies,
});
