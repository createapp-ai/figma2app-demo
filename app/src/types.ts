export type Lodable<Value> =
  | {
      state: 'default';
    }
  | {
      state: 'loading';
    }
  | {
      state: 'hasError';
      error: string;
    }
  | {
      state: 'hasData';
      data: Value;
    };

// Use this type to define the state of your component/screen.
export type State = 'default' | 'loading' | 'hasError' | 'hasData';
