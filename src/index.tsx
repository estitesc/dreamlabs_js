import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Hello from './components/Hello';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(
  <Hello name="bugsby" exclamationLevel={5}/>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
