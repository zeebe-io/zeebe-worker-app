import styled from 'styled-components';
import { FlashOn, FlashOff } from '@material-ui/icons';

export const Wrapper = styled.div`
  padding: 24px;
  flex-grow: 1;
  background: #f0f0f0;
`;

export const Active = styled(FlashOn)`
  color: #2bc081;
`;

export const Inactive = styled(FlashOff)`
  color: #aaa;
`;

export default {};
