import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import assign from 'object-assign';
import actions from '../actions';
import reducers from '../reducers';

import * as api from '../misc/api';

const store = createStore(reducers, compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));

// const unsubscribe =
store.subscribe(() => {
  window.chartwerk = assign({}, store.getState());
  api.redraw();
  // console.log(store.getState());
  // console.log( JSON.stringify(store.getState(), null, '\t' ) );
  return;
});

// unsubscribe();

store.dispatch(actions.fetchWerk())
    .then(() => {
      api.injectDependencies(window.chartwerk.scripts.dependencies);
      api.applyScripts(window.chartwerk.scripts);
      api.initialize();
    });

export default store;
