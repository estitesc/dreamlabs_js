import * as React from 'react';
import '../styles/Hello.css';

export interface Props {
  name: string;
  exclamationLevel?: number;
}

function Hello({ name, exclamationLevel = 1 }: Props) {
  if(exclamationLevel <= 0) {
    throw new Error('Not enthusiastic enough');
  }

  return (
    <div className="hello">
      <div className="greeting">
        Hello {name + getExclamationMarks(exclamationLevel)}
      </div>
    </div>
  )
}

export default Hello;

// helpers

function getExclamationMarks(numChars: number) {
  return Array(numChars + 1).join('!');
}