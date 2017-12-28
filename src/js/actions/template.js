import * as types from '../constants/actions';

export const apiTemplate = template => ({
  type: types.API_TEMPLATE,
  template,
});

export const setTemplateTitle = title => ({
  type: types.SET_TEMPLATE_TITLE,
  title,
});

export const setTemplateDescription = description => ({
  type: types.SET_TEMPLATE_DESCRIPTION,
  description,
});

export const setTemplateIcon = icon => ({
  type: types.SET_TEMPLATE_ICON,
  icon,
});

export const addTemplateTag = tag => ({
  type: types.ADD_TEMPLATE_TAG,
  tag,
});

export const removeTemplateTag = tag => ({
  type: types.REMOVE_TEMPLATE_TAG,
  tag,
});
