import { action } from 'mobx';
import propTypes from 'prop-types';

import BaseStore from 'primitives/BaseStore';

class UIStore extends BaseStore {
  static stateTypes = {
    counter: propTypes.number.isRequired,
  };

  static defaultState = {
    counter: 0,
  };

  @action
  incrementCounter = () => {
    this.state.counter += 1;
  };
}

export default UIStore;
