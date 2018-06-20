export default (oldStores, storeClasses, options, transports) => {
  const initializedStores = {};

  storeClasses.forEach((Store) => {
    const StoreClassName = Object.keys(Store)[0];
    const StoreClass = Store[StoreClassName];
    const oldState = oldStores[StoreClassName] && oldStores[StoreClassName].state;
    initializedStores[StoreClassName] = new StoreClass(oldState, options, transports);
  });
  return initializedStores;
};
