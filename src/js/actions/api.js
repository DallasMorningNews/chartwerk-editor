import { locations } from './../misc/config';

import * as uiActions from './ui';
import * as dataActions from './data';
import * as axisActions from './axis';
import * as marginActions from './margin';
import * as scriptActions from './script';
import * as textActions from './text';
import * as templateActions from './template';
import * as embedActions from './embed';


export default function fetchWerk() {
  const endpoint = window.chartwerkConfig.chart_id !== '' ?
    locations.chart : locations.template;
  return dispatch => fetch(endpoint)
    .then(
      response => response.json())
    .then(
      (response) => {
        const data = response.data;
        // Dispatch API actions for data props
        if (data.data) {
          dispatch(dataActions.apiData(data.data));
        }
        if (data.scripts) {
          dispatch(scriptActions.apiScripts(data.scripts));
        }
        if (data.axes) {
          dispatch(axisActions.apiAxes(data.axes));
        }
        if (data.datamap) {
          dispatch(dataActions.apiDatamap(data.datamap));
        }
        if (data.margins) {
          dispatch(marginActions.apiMargins(data.margins));
        }
        if (data.ui) {
          dispatch(uiActions.apiUI(data.ui));
        }
        if (data.text) {
          dispatch(textActions.apiText(data.text));
        }
        if (data.template) {
          dispatch(templateActions.apiTemplate(data.template));
        }
        if (data.embed) {
          dispatch(embedActions.apiEmbed(data.embed));
        }
      })
    .catch((error) => {
      console.log('API ERROR', error);
      console.log('ERROR STACK', error.stack);
    });
}
