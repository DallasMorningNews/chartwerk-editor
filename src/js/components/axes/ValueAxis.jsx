import React from 'react';

import NumericFormat from './NumericFormat';
import ShadedRegions from './ShadedRegions';

const ValueAxis = (props) => {
  const valueLabel = props.werk.datamap.value ?
    props.werk.ui.datamap.filter(d => d.class === 'value')[0].alias :
    props.werk.ui.datamap.filter(d => d.class === 'series')[0].alias;

  if (props.werk.datamap.series < 1 &&
    !props.werk.datamap.value) {
    return (
      <div>
        <h4>No {valueLabel} selected on the Data tab.</h4>
        <hr />
      </div>
    );
  }

  return (
    <div>
      <h4>{valueLabel}</h4>
      <NumericFormat {...props} type="value" />
      <ShadedRegions {...props} axis="value" />
      <hr />
    </div>
  );
};

ValueAxis.propTypes = {
  actions: React.PropTypes.object,
  werk: React.PropTypes.object,
};

export default ValueAxis;
