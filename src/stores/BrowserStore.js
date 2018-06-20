import BaseStore from 'primitives/BaseStore';

class BrowserStore extends BaseStore {
  static defaultState = {
    cookie: undefined,
  };

  constructor(initialState, { req }) {
    super(initialState);

    if (!this.state.cookie) {
      this.state.cookie = req ? req.headers.cookie : document.cookie;
    }
  }
}

export default BrowserStore;
