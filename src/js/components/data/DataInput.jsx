import React from 'react';
import { Converter } from 'csvtojson';
import Modal from 'react-modal';
import JsonTable from 'react-json-table';
import DataSelect from './DataSelect';


export default React.createClass({

  propTypes: {
    actions: React.PropTypes.object,
    werk: React.PropTypes.object,
  },

  getInitialState() {
    return {
      format: null,
      preview: false,
      sortedHeader: [],
    };
  },

  handleDataChange(e) {
    const data = e.target.value;
    const actions = this.props.actions;

    actions.setRawData(data);

    const tsvConverter = new Converter({
      delimiter: '	', // eslint-disable-line no-tabs
      flatKeys: true,
      checkType: false,
    });
    const csvConverter = new Converter({
      delimiter: ',', // comma-delimited
      flatKeys: true,
      checkType: false,
    });

    /**
     * typeCheck - Checks type of data pasted by user
     * Checks in order: JSON, TSV, CSV
     *
     * @param  {str} data   User-pasted data as string.
     * @return {void}
     */
    function typeCheck(localData) {
      const header = localData.split('\n')[0];
      if (localData === '') {
        this.setState(this.getInitialState());
        return;
      }
      // Try JSON data
      try {
        const jsonObj = JSON.parse(localData);
        actions.attachData(jsonObj);
        this.setState({
          format: 'JSON',
          sortedHeader: Object.keys(jsonObj[0]),
        });
        actions.setHeaderSort(this.state.sortedHeader);
      } catch (error) {
        // Try TSV
        if (localData.indexOf('	') > -1) { // eslint-disable-line no-tabs
          this.setState({ sortedHeader: header.split('	').map(h => h.trim()) }); // eslint-disable-line no-tabs
          tsvConverter.fromString(localData);
        // CSV
        } else {
          this.setState({ sortedHeader: header.split(',').map(h => h.trim()) });
          csvConverter.fromString(localData);
        }
      }
    }


    /**
     * parse - Sets state from obj returned from converter
     *
     * @param  {str} format 'TSV' or 'CSV'
     * @param  {obj} jsonObj Obj returned by converter
     * @returns {void}
     */
    function parse(format, jsonObj) {
      actions.attachData(jsonObj);
      actions.setHeaderSort(this.state.sortedHeader);
      this.setState({ format });
    }

    csvConverter.on('end_parsed', parse.bind(this, 'CSV'));
    tsvConverter.on('end_parsed', parse.bind(this, 'TSV'));

    typeCheck.bind(this)(data);
  },

  render() {
    const success = this.props.werk.data.length < 1 ? '' :
        (<div>
          <p className="parse-success">
            Successfully parsed {this.state.format} data
            <button className="btn btn-sm"
              onClick={() => this.setState({ preview: true })}
            >
                Preview
            </button>
          </p>
          <DataSelect werk={this.props.werk} actions={this.props.actions} />
        </div>);

    return (
      <div>
        <textarea
          rows="7"
          className="form-control"
          placeholder="Paste your data here with a header row."
          value={this.props.werk.ui.rawData}
          onChange={this.handleDataChange}
        />
        {success}
        <Modal
          isOpen={this.state.preview}
          onRequestClose={() => this.setState({ preview: false })}
        >
          <i
            className="fa fa-times"
            role="button"
            tabIndex={0}
            onClick={() => this.setState({ preview: false })}
          />
          <JsonTable
            rows={this.props.werk.data}
            columns={this.props.werk.datamap.sort}
          />
        </Modal>
      </div>
    );
  },
});
