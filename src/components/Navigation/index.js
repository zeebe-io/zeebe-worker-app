import { Fragment } from 'react';

import { IconButton } from '@material-ui/core';
import { Menu } from '@material-ui/icons';

export default ({ onDrawerToggle }) => (
  <Fragment>
    <IconButton color="primary" aria-label="open drawer" onClick={onDrawerToggle}>
      <Menu color="action" />
    </IconButton>
  </Fragment>
);
