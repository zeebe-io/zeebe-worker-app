import { observer } from 'mobx-react';
import {
  Hidden,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Divider,
} from '@material-ui/core';
import { Traffic, Memory, Home } from '@material-ui/icons';

import Link from 'next/link';
import * as Styled from './styled';

const MenuItem = ({ href, children }) => (
  <Link href={href} prefetch>
    <Styled.Link active href={href}>
      {children}
    </Styled.Link>
  </Link>
);

const Menu = () => (
  <Styled.Menu>
    <List>
      <MenuItem href="/">
        <Styled.ZeebeLogo />
        <center>
          <Typography style={{ color: '#FFF' }}>
            <strong>Zeebe Worker App</strong>
          </Typography>
        </center>
      </MenuItem>
      <br />
      <Divider />
      <br />
      <MenuItem href="/">
        <ListItem button>
          <ListItemIcon>
            <Home style={{ color: '#FFF' }} />
          </ListItemIcon>
          <ListItemText primary={<span style={{ color: '#FFF' }}>Home</span>} />
        </ListItem>
      </MenuItem>
      <MenuItem href="/status">
        <ListItem button>
          <ListItemIcon>
            <Traffic style={{ color: '#FFF' }} />
          </ListItemIcon>
          <ListItemText primary={<span style={{ color: '#FFF' }}>Status</span>} />
        </ListItem>
      </MenuItem>
      <MenuItem href="/workers">
        <ListItem button>
          <ListItemIcon>
            <Memory style={{ color: '#FFF' }} />
          </ListItemIcon>
          <ListItemText primary={<span style={{ color: '#FFF' }}>Workers</span>} />
        </ListItem>
      </MenuItem>
    </List>
    <Divider />
    <br />
    <center>
      <Typography variant="caption" style={{ color: '#EEE' }}>
        Camunda Services GmbH © 2018
      </Typography>
    </center>
  </Styled.Menu>
);

export default observer(({ isOpen, onClose }) => (
  <aside>
    <Hidden mdUp implementation="css">
      <Styled.Drawer
        variant="temporary"
        anchor="left"
        open={isOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Menu />
      </Styled.Drawer>
    </Hidden>
    <Hidden smDown implementation="css">
      <Styled.Drawer variant="permanent" open>
        <Menu />
      </Styled.Drawer>
    </Hidden>
  </aside>
));
