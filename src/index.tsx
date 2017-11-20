import * as React from 'react';
import * as ReactDOM from 'react-dom';
import MuseInterface from './components/MuseInterface';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(
  <MuseInterface name="DreamLabs I/O" />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
