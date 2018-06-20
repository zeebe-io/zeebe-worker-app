import { Component } from 'react';
import { inject, observer } from 'mobx-react';

import {
  Dialog,
  DialogActions,
  Typography,
  DialogTitle,
  DialogContent,
  FormGroup,
  TextField,
  Button,
  Grid,
} from '@material-ui/core';

@inject('WorkerStore')
@observer
export default class AddWorkerDialog extends Component {
  WorkerStore = this.props.WorkerStore;

  render() {
    return (
      <Dialog
        fullWidth
        open={this.WorkerStore.state.isAddDialogOpen}
        onClose={this.WorkerStore.closeAddDialog}
      >
        <form onSubmit={this.WorkerStore.handleAddSubmit}>
          <DialogTitle style={{ background: 'rgb(44, 111, 174)' }}>
            <span style={{ color: '#FFF' }}>Define properties of the new worker</span>
          </DialogTitle>
          <br />
          <DialogContent>
            <FormGroup>
              <TextField
                label="Worker Name"
                placeholder="e.g.: My other Worker"
                name="workerName"
                autoFocus
                required
              />
            </FormGroup>
            <br />
            <FormGroup>
              <TextField
                label="Topic Name"
                placeholder="e.g.: get-started"
                name="topicName"
                required
              />
            </FormGroup>
            <br />
            <FormGroup>
              <TextField
                label="Job Type"
                placeholder="e.g.: payment-service"
                name="jobType"
                required
              />
            </FormGroup>
            <br />
            <FormGroup>
              <TextField
                label="Zeebe Instance Address"
                placeholder="0.0.0.0:51015"
                name="server"
                required
              />
            </FormGroup>
            <br />
            <Grid container spacing={24}>
              <Grid item xs={6}>
                <FormGroup>
                  <TextField
                    label="Lock Duration"
                    defaultValue={30000}
                    name="lockDuration"
                    required
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={6}>
                <FormGroup>
                  <TextField label="Credits" defaultValue={30} name="credits" required />
                </FormGroup>
              </Grid>
            </Grid>
            <br />
            <Typography variant="caption">
              The NodeJS code to execute inside your worker is created in the next step.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={this.WorkerStore.closeAddDialog}>
              Cancel
            </Button>
            <Button type="submit" color="primary" variant="raised">
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  }
}
