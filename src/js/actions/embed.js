import * as types from '../constants/actions.js';


export const apiEmbed = embed => ({
  type: types.API_EMBED,
  embed,
});

export const setEmbedDimensions = dimensions => ({
  type: types.SET_EMBED_DIMENSIONS,
  dimensions,
});
