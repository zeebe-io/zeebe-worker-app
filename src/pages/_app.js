import { Provider } from 'mobx-react';
import App, { Container } from 'next/app';
import 'isomorphic-fetch';

import createStores from 'utils/createStores';

// Stores
import BrowserStore from 'stores/BrowserStore';
import UIStore from 'stores/UIStore';
import WorkerStore from 'stores/WorkerStore';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/eclipse.css';

const StoreClasses = [{ UIStore }, { BrowserStore }, { WorkerStore }];

const http = {
  get: async (path) => {
    const response = await fetch(path);
    const json = await response.json();
    return json;
  },
  post: async (path, data) => {
    const response = await fetch(path, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json',
      },
    });
    const json = await response.json();
    return json;
  },
  delete: async (path, data) => {
    const response = await fetch(path, {
      method: 'DELETE',
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json',
      },
    });
    const json = await response.json();
    return json;
  },
  put: async (path, data) => {
    const response = await fetch(path, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json',
      },
    });
    const json = await response.json();
    return json;
  },
};

class MyApp extends App {
  constructor(props) {
    super(props);

    const options = {
      http,
    };

    this.stores = createStores(StoreClasses, props, {}, options);
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <Provider {...this.stores}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    );
  }
}

MyApp.getInitialProps = async ({ Component, ctx }) => {
  const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

  const isServer = !!ctx.req;
  const stores = createStores(StoreClasses, { isServer }, ctx, { http });

  return {
    isServer,
    stores,
    pageProps,
  };
};

export default MyApp;
