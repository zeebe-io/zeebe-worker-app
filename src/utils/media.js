// these sizes are arbitrary and you can set them to whatever you wish
import { css } from 'styled-components';

const sizes = {
  xl: 1919,
  lg: 1279,
  md: 959,
  sm: 599,
  xs: 359,
};

// iterate through the sizes and create a media template
export default Object.keys(sizes).reduce((accumulator, label) => {
  // use em in breakpoints to work properly cross-browser and support users
  // changing their browsers font-size: https://zellwk.com/blog/media-query-units/
  const emSize = sizes[label] / 16;
  // eslint-disable-next-line
  accumulator[label] = (...args) => css`@media (max-width: ${emSize}em) {${css(...args)};}`;
  return accumulator;
}, {});
