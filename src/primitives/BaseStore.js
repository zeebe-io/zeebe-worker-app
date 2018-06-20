import { observable } from 'mobx';

export default class BaseStore {
  @observable state;

  constructor() {
    this.state = Object.assign({}, this.constructor.defaultState);
  }
}
