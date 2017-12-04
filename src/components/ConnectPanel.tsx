import * as React from 'react';

export interface Props {
  connect(): any
}

class ConnectPanel extends React.Component<Props, object> {
  props: Props

  render() {
    return (
      <div className="row">
        <div className="col-md-4">
          <button onClick={ () => this.props.connect() }>
            Connect Muse
          </button>
        </div>
        <div className="col-md-4">Temperature: <span id="temperature">unknown</span></div>
        <div className="col-md-4">Battery: <span id="batteryLevel">unknown</span></div>
      </div>
    )
  }
}

export default ConnectPanel;