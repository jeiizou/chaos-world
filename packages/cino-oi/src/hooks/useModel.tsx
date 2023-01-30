import React from 'react';

const EMPTY: unique symbol = Symbol();

export interface ModelProviderProps<State = void> {
  initialState?: State;
  children: React.ReactNode;
}

export interface Model<Value, State = void> {
  Provider: React.ComponentType<ModelProviderProps<State>>;
  useContext: () => Value;
}

export function composeProviders(providers: Array<Model<unknown>>, displayName?: string) {
  const result: React.FC<{ children?: React.ReactNode }> = function ComposedProviders({
    children,
  }: {
    children?: React.ReactNode;
  }) {
    return providers.reduceRight(
      (acc, current) => <current.Provider>{acc}</current.Provider>,
      React.createElement(React.Fragment, null, children),
    );
  };

  if (displayName) {
    result.displayName = displayName;
  }

  return result;
}

export function createModel<Value, State = void>(
  useHook: (initialState?: State) => Value,
): Model<Value, State> {
  let HooksContext = React.createContext<Value | typeof EMPTY>(EMPTY);

  function Provider(props: ModelProviderProps<State>) {
    let value = useHook(props.initialState);
    return <HooksContext.Provider value={value}>{props.children}</HooksContext.Provider>;
  }

  function useContext(): Value {
    let value = React.useContext(HooksContext);
    if (value === EMPTY) {
      throw new Error('Component must be wrapped with <Model.Provider>');
    }
    return value;
  }

  return { Provider, useContext };
}
