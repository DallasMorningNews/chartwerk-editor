import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import 'bootstrap/js/dist/util';
import 'bootstrap/js/dist/tab';
import App from './containers/App';
import store from './stores/';

import './../scss/app.scss';



// window.addEventListener('beforeunload', (e) => {
//   const confirmationMessage = 'Do you want to leave this page? Any unsaved changes will be lost.';
//
//   (e || window.event).returnValue = confirmationMessage; // Gecko + IE
//   return confirmationMessage; // Gecko + Webkit, Safari, Chrome etc.
// });

const Chartwerk = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

ReactDOM.render(
  <Chartwerk />,
  document.getElementById('chartwerk-app'));
