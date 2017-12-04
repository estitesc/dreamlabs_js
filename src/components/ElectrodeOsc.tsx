import * as React from 'react';

export interface Props {
  number: number;
}

function ElectrodeOsc({ number }: Props) {
  return (
    <div className="electrode-osc col-md-9">
      <canvas />
    </div>
  )
}

export default ElectrodeOsc;