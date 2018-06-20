import { Component } from 'react';
import { Typography, Divider, Button, DialogActions, DialogContent } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';

import { Controlled as CodeMirror } from 'react-codemirror2';

import withRoot from 'utils/withRoot';
import DefaultLayout from 'layouts/DefaultLayout';
import Router from 'next/router';
import { action } from 'mobx';

if (process.browser) {
  require('codemirror/mode/javascript/javascript');
}

const codeMirrorOptions = {
  mode: {
    name: 'javascript',
    json: true,
  },
  theme: 'eclipse',
  lineNumbers: true,
};

const StyledCodeMirror = styled(CodeMirror)`
  -webkit-font-smoothing: initial;
  -moz-osx-font-smoothing: initial;
`;

@inject('WorkerStore')
@observer
class EditWorker extends Component {
  WorkerStore = this.props.WorkerStore;

  componentDidMount() {
    this.WorkerStore.fetchCurrentWorker(this.props.query.id);
  }

  handleBack = () => {
    Router.back();
  };

  handleSave = () => {
    this.WorkerStore.updateCurrentWorker();
  };

  @action
  handleCodeChange = (editor, data, value) => {
    if (this.WorkerStore.state.currentWorker) {
      this.WorkerStore.state.currentWorker.code = value;
    }
  };

  render() {
    const { currentWorker } = this.WorkerStore.state;
    return (
      <DefaultLayout>
        <Typography variant="display1" component="h1" style={{ margin: '25px 0px 25px 25px' }}>
          Edit Worker {currentWorker && currentWorker.meta.workerName}
        </Typography>
        <Divider />
        <DialogContent style={{ margin: 0, padding: 0 }}>
          <StyledCodeMirror
            style={{ webkitFontSmoothing: 'initial', mozOsxFontSmoothing: 'initial' }}
            value={currentWorker && currentWorker.code}
            options={codeMirrorOptions}
            onBeforeChange={this.handleCodeChange}
          />
        </DialogContent>
        <Divider />
        <div style={{ margin: 20 }}>
          <Typography variant="caption">
            You can check out the{' '}
            <a href="https://www.npmjs.com/package/zbc-node#features" target="_blank">
              Zeebe Node Client Documentation here
            </a>.
          </Typography>
        </div>
        <DialogActions>
          <Button color="secondary" onClick={this.handleBack}>
            BACK
          </Button>
          <Button variant="raised" color="primary" onClick={this.handleSave}>
            SAVE
          </Button>
        </DialogActions>
      </DefaultLayout>
    );
  }
}

EditWorker.getInitialProps = ({ query }) => ({
  query,
});

export default withRoot(EditWorker);
