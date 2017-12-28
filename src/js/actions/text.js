import * as types from '../constants/actions';

export const apiText = texts => ({
  type: types.API_TEXT,
  texts,
});

export const setHeadline = headline => ({
  type: types.SET_HEADLINE,
  headline,
});

export const setChatter = chatter => ({
  type: types.SET_CHATTER,
  chatter,
});

export const setFootnote = footnote => ({
  type: types.SET_FOOTNOTE,
  footnote,
});

export const setDataSource = source => ({
  type: types.SET_DATASOURCE,
  source,
});

export const setAuthor = author => ({
  type: types.SET_AUTHOR,
  author,
});

export const addAnnotation = annotation => ({
  type: types.ADD_ANNOTATION,
  annotation,
});

export const removeAnnotation = index => ({
  type: types.REMOVE_ANNOTATION,
  index,
});

export const changeAnnotation = (index, annotation) => ({
  type: types.CHANGE_ANNOTATION,
  index,
  annotation,
});

export const changeAnnotationText = (index, text) => ({
  type: types.CHANGE_ANNOTATION_TEXT,
  index,
  text,
});

export const changeAnnotationPosition = (index, x, y) => ({
  type: types.CHANGE_ANNOTATION_POSITION,
  index,
  x,
  y,
});

export const changeAnnotationDimensions = (index, width) => ({
  type: types.CHANGE_ANNOTATION_DIMENSIONS,
  index,
  width,
});

export const changeAnnotationAlign = (index, align) => ({
  type: types.CHANGE_ANNOTATION_ALIGN,
  index,
  align,
});

export const changeAnnotationFontSize = (index, size) => ({
  type: types.CHANGE_ANNOTATION_FONT_SIZE,
  index,
  size,
});

export const changeAnnotationBackground = index => ({
  type: types.CHANGE_ANNOTATION_BACKGROUND,
  index,
});

export const changeAnnotationSize = (index, size) => ({
  type: types.CHANGE_ANNOTATION_SIZE,
  index,
  size,
});

export const changeAnnotationColor = (index, color) => ({
  type: types.CHANGE_ANNOTATION_COLOR,
  index,
  color,
});

export const setLegendActive = () => ({
  type: types.SET_LEGEND_ACTIVE,
});

export const unsetLegend = () => ({
  type: types.UNSET_LEGEND,
});

export const setLegendKeys = keys => ({
  type: types.SET_LEGEND_KEYS,
  keys,
});

export const changeLegendKey = (index, color, text) => ({
  type: types.CHANGE_LEGEND_KEY,
  index,
  color,
  text,
});

export const changeLegendKeyOrderUp = index => ({
  type: types.CHANGE_LEGEND_KEY_ORDER_UP,
  index,
});

export const changeLegendKeyOrderDown = index => ({
  type: types.CHANGE_LEGEND_KEY_ORDER_DOWN,
  index,
});

export const changeLegendTitle = text => ({
  type: types.CHANGE_LEGEND_TITLE,
  text,
});

export const changeLegendAlign = (size, align) => ({
  type: types.CHANGE_LEGEND_ALIGN,
  size,
  align,
});

export const changeLegendBackground = size => ({
  type: types.CHANGE_LEGEND_BACKGROUND,
  size,
});

export const changeLegendInside = size => ({
  type: types.CHANGE_LEGEND_INSIDE,
  size,
});

export const changeLegendPosition = (size, x, y) => ({
  type: types.CHANGE_LEGEND_POSITION,
  size,
  x,
  y,
});

export const changeLegendWidth = (size, width) => ({
  type: types.CHANGE_LEGEND_WIDTH,
  size,
  width,
});

export const setChartTitle = title => ({
  type: types.SET_CHART_TITLE,
  title,
});
