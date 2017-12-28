import React from 'react';

import DataTab from './Data';
import AxesTab from './Axes';
import LayoutTab from './Layout';
import TextTab from './Text';
import AnnotationsTab from './Annotations';
import CodeTab from './Code';
import PublishTab from './Publish';

const Tabs = props => (
  <div className="tab-content">
    <DataTab {...props} />
    <AxesTab {...props} />
    <LayoutTab {...props} />
    <TextTab {...props} />
    <AnnotationsTab {...props} />
    <CodeTab {...props} />
    <PublishTab {...props} />
  </div>
);

Tabs.propTypes = {
  actions: React.PropTypes.object,
  werk: React.PropTypes.object,
};

export default Tabs;
