/**
 * A re-usable layout example, to have for example
 * static components which are on more then 1 specific page
 */
// import DevTools from 'mobx-react-devtools';
import { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';

import { Toolbar, Hidden, AppBar } from '@material-ui/core';

import FullScreen from 'primitives/FullScreen';
import Navigation from 'components/Navigation';

import Sidebar from 'components/Sidebar';

import Styled from './styled';

@observer
class DefaultLayout extends Component {
  @observable isOpen = false;

  @action
  toggleDrawer = () => {
    this.isOpen = !this.isOpen;
  };

  render() {
    const { toggleDrawer, isOpen, props } = this;
    const { children } = props;
    return (
      <FullScreen>
        <Hidden mdUp implementation="css">
          <AppBar position="static">
            <Toolbar>
              <Navigation onDrawerToggle={toggleDrawer} />
            </Toolbar>
          </AppBar>
        </Hidden>
        <Sidebar isOpen={isOpen} onClose={toggleDrawer} />
        <Styled.Content>{children}</Styled.Content>
      </FullScreen>
    );
  }
}

export default DefaultLayout;
