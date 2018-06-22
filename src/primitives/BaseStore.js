import { observable } from 'mobx';

export default class BaseStore {
  @observable state;

  constructor(initialState) {
    this.state = Object.assign({}, this.constructor.defaultState);
    if (initialState) {
      this.state = Object.assign(this.state, initialState);
    }
  }
}
