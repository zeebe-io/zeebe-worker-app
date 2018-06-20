import DefaultContent from 'primitives/Content';
import styled from 'styled-components';
import media from 'utils/media';

const Content = styled(DefaultContent)`
  padding-left: 240px;
  ${media.md`
    padding-left: 0px;
  `};
`;

export default {
  Content,
};
