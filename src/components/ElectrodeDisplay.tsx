import * as React from 'react';

export interface Props {
  number: number;
}

function ElectrodeDisplay({ number }: Props) {
  return (
    <div className="electrode-item col-md-2">
      <canvas id="electrode{ number }"></canvas>
    </div>
  )
}

export default ElectrodeDisplay;