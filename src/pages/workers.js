import { Component } from 'react';

import withRoot from 'utils/withRoot';
import DefaultLayout from 'layouts/DefaultLayout';
import WorkersList from 'components/WorkersList';
import { Typography, Divider } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import AddWorkerDialog from 'components/AddWorkerDialog';

@inject('WorkerStore')
@observer
class Workers extends Component {
  WorkerStore = this.props.WorkerStore;

  render() {
    return (
      <DefaultLayout>
        <Typography variant="display1" component="h1" style={{ margin: '25px 0px 25px 25px' }}>
          Workers
        </Typography>
        <Divider />
        <WorkersList
          items={this.WorkerStore.state.workers}
          onAdd={this.WorkerStore.openAddDialog}
          onActivateWorker={this.WorkerStore.activateWorker}
          onDeactivateWorker={this.WorkerStore.deactivateWorker}
        />
        <AddWorkerDialog />
      </DefaultLayout>
    );
  }
}

export default withRoot(Workers);
