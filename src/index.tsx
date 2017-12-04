import * as React from 'react';
import * as ReactDOM from 'react-dom';
import MuseInterface from './components/MuseInterface';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(
  <MuseInterface />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
