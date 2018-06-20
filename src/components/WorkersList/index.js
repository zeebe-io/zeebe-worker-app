import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  CardActions,
  Divider,
  IconButton,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { AddCircle, MoreVert } from '@material-ui/icons';
import { observer, inject } from 'mobx-react';
import { Component, Fragment } from 'react';
import { observable, action } from 'mobx';
import { Router } from '../../../server/routes';

import * as Styled from './styled';

@inject('WorkerStore')
@observer
class WorkerItemContextMenu extends Component {
  WorkerStore = this.props.WorkerStore;

  @observable isOpen = false;
  @observable anchorEl = null;

  @action
  handleOpen = (event) => {
    this.anchorEl = event.currentTarget;
    this.isOpen = true;
  };

  @action
  handleClose = () => {
    this.isOpen = false;
    this.anchorEl = null;
  };

  handleEdit = () => {
    Router.pushRoute(`/workers/${this.props.item.workerFile}`);
  };

  render() {
    return (
      <Fragment>
        <IconButton onClick={this.handleOpen}>
          <MoreVert />
        </IconButton>
        <Menu open={this.isOpen} anchorEl={this.anchorEl} onClose={this.handleClose}>
          <MenuItem onClick={this.handleEdit}>Edit</MenuItem>
          <MenuItem onClick={this.WorkerStore.remove(this.props.item)}>Delete</MenuItem>
        </Menu>
      </Fragment>
    );
  }
}

export default inject('WorkerStore')(observer(({
  items, onAdd, onActivateWorker, onDeactivateWorker, WorkerStore,
}) => (
  <Styled.Wrapper>
    <Grid container spacing={24}>
      <Grid key="adder" item xs={12} sm={6} md={6} lg={4} xl={3}>
        <Card elevation={6} style={{ cursor: 'pointer' }} onClick={onAdd}>
          <CardContent>
            <center>
              <Typography variant="title">
                <br />
                <br /> Create New Worker
                <br />
                <br />
                <br /> <AddCircle style={{ fontSize: 76 }} />
                <br />
                <br />
              </Typography>
            </center>
          </CardContent>
        </Card>
      </Grid>
      {items.map(item => (
        <Grid key={item.workerFile} item xs={12} sm={6} md={6} lg={4} xl={3}>
          <Card elevation={1}>
            <CardHeader
              title={item.meta.workerName}
              action={<WorkerItemContextMenu item={item} />}
            />
            <CardContent>
              <Grid container>
                <Grid item xs={6}>
                  <Typography variant="body1">
                      <strong>Topic</strong>
                      <br />
                      {item.meta.topicName}
                    </Typography>
                  <br />
                  <Typography variant="body1">
                      <strong>Job Type</strong>
                      <br />
                      {item.meta.jobType}
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                      <strong>Completed Jobs</strong>
                      <br />
                      {WorkerStore.state.stats.has(item.workerFile)
                        ? WorkerStore.state.stats.get(item.workerFile).completed
                        : item.completed}
                    </Typography>
                  <br />
                  <Typography variant="body1">
                      <strong>Failed Jobs</strong>
                      <br />
                      {WorkerStore.state.stats.has(item.workerFile)
                        ? WorkerStore.state.stats.get(item.workerFile).failed
                        : item.failed}
                    </Typography>
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              {item.childProcess ? (
                <IconButton onClick={onDeactivateWorker(item)}>
                  <Styled.Active />
                </IconButton>
                ) : (
                  <IconButton onClick={onActivateWorker(item)}>
                    <Styled.Inactive />
                  </IconButton>
                )}
              <Typography variant="caption">
                <strong>{item.childProcess ? 'running' : 'not running'}</strong>
              </Typography>
            </CardActions>
          </Card>
        </Grid>
        ))}
    </Grid>
  </Styled.Wrapper>
)));
