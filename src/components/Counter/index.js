import { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';

import { Button, Typography } from '@material-ui/core';

@inject('UIStore')
@observer
export default class Counter extends Component {
  UIStore = this.props.UIStore;

  render() {
    return (
      <Fragment>
        <Button color="secondary" variant="raised" onClick={this.UIStore.incrementCounter}>
          Click me
        </Button>
        {this.UIStore.state.counter}
        <Typography variant="body1">Hello</Typography>
        <Typography variant="body2">Hello</Typography>
      </Fragment>
    );
  }
}
