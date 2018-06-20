import styled from 'styled-components';

import { Drawer as StyledDrawer } from '@material-ui/core';

export const Menu = styled.div`
  width: 240px;
`;

export const Drawer = styled(StyledDrawer)`
  > div {
    background: rgb(44, 111, 174);
    > div {
      height: 100%;
    }
  }
`;

export const Link = styled.a`
  color: initial;
  text-decoration: none;
`;

export const ZeebeLogo = styled.div`
  background-image: url('/static/favicons/mstile-150x150.png');
  width: 100%;
  height: 125px;
  background-repeat: no-repeat;
  background-position: center -45px;
  background-size: cover;
`;
