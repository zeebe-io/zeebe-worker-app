import { Component } from 'react';

import withRoot from 'utils/withRoot';
import DefaultLayout from 'layouts/DefaultLayout';
import { Typography, Divider } from '@material-ui/core';

class Home extends Component {
  render() {
    return (
      <DefaultLayout>
        <Typography variant="display1" component="h1" style={{ margin: '25px 0px 25px 25px' }}>
          Home
        </Typography>
        <Divider />
      </DefaultLayout>
    );
  }
}

export default withRoot(Home);
