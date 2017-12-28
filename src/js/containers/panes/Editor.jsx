import React from 'react';

import Tabs from './../tabs/index';
import Nav from './../tabs/Nav';

const Editor = props => (
  <div id="editor-pane" className="clearfix" role="tabpanel">
    <Nav />
    <Tabs {...props} />
  </div>
);

Editor.propTypes = {
  actions: React.PropTypes.object,
  werk: React.PropTypes.object,
};

export default Editor;
