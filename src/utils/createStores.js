import { configure } from 'mobx';
import initStores from 'utils/initStores';
import env from 'env';

configure({
  computedRequiresReaction: true,
  enforceActions: true,
});

let cachedStoreInstances = null;

export default (StoreClasses, props, options = {}, transports) => {
  const { stores = {} } = props;

  // server side
  if (env.serverSide) {
    if (Object.keys(stores).length > 0) {
      return stores;
    }
    return initStores(stores, StoreClasses, options, transports);
  }

  // client side
  if (cachedStoreInstances === null) {
    cachedStoreInstances = initStores(stores, StoreClasses, options, transports);
  }

  return cachedStoreInstances;
};
