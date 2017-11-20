import * as React from 'react';
import { MuseClient, EEGReading, channelNames } from 'muse-js';
import '../styles/MuseInterface.css';

export interface Props {
  name: string;
}

function MuseInterface({ name }: Props) {
  let connect = async () => {
    let graphTitles = Array.from(document.querySelectorAll('.electrode-item h3'));
    let canvases = Array.from(document.querySelectorAll('.electrode-item canvas')) as HTMLCanvasElement[];
    let canvasCtx = canvases.map(canvas => canvas.getContext('2d'));

    graphTitles.forEach((item, index) => {
      item.textContent = channelNames[index];
    });

    function plot(reading: EEGReading) {
      const canvas = canvases[reading.electrode];
      const context = canvasCtx[reading.electrode];
      if (!context) {
        return;
      }
      const width = canvas.width / 12.0;
      const height = canvas.height / 2.0;
      context.fillStyle = 'green';
      context.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < reading.samples.length; i++) {
        const sample = reading.samples[i] / 15.;
        if (sample > 0) {
          context.fillRect(i * 25, height - sample, width, sample);
        } else {
          context.fillRect(i * 25, height, width, -sample);
        }
      }
    }

    let client = new MuseClient();
    client.connectionStatus.subscribe(status => {
      console.log(status ? 'Connected!' : 'Disconnected')
    });

    try {
      client.enableAux = true;
      await client.connect();
      await client.start();
      (document as any).getElementById('headset-name')!.innerText = client.deviceName;
      client.eegReadings.subscribe(reading => {
        plot(reading);
      });
      client.telemetryData.subscribe(reading => {
        document.getElementById('temperature')!.innerText = reading.temperature.toString() + '℃';
        document.getElementById('batteryLevel')!.innerText = reading.batteryLevel.toFixed(2) + '%';
      });
      client.accelerometerData.subscribe(accel => {
        const normalize = (v: number) => (v / 16384.).toFixed(2) + 'g';
        document.getElementById('accelerometer-x')!.innerText = normalize(accel.samples[2].x);
        document.getElementById('accelerometer-y')!.innerText = normalize(accel.samples[2].y);
        document.getElementById('accelerometer-z')!.innerText = normalize(accel.samples[2].z);
      });
      await client.deviceInfo().then(deviceInfo => {
        document.getElementById('hardware-version')!.innerText = deviceInfo.hw;
        document.getElementById('firmware-version')!.innerText = deviceInfo.fw;
      });
    } catch (err) {
      console.error('Connection failed', err);
    }
  }

  return (
    <div>
      <button onClick={ () => connect() }>
        Connect!
      </button>

      <p>Props Name: <span> { name } </span></p>

      <div>
        Name: <span id="headset-name">unknown</span>
        Firmware: <span id="firmware-version">unknown</span>,
        Hardware version: <span id="hardware-version">unknown</span>.
      </div>

      <div>
          Temperature: <span id="temperature">unknown</span>, Battery: <span id="batteryLevel">unknown</span>
      </div>

      <div>
        Accelerometer: x=<span 
        id="accelerometer-x">?</span>, y=<span 
        id="accelerometer-y">?</span>, z=<span 
        id="accelerometer-z">?</span>
      </div>

      <div className="electrode-section">
        <div className="electrode-item">
          <h3>Electrode 1</h3>
          <canvas id="electrode1"></canvas>
        </div>

        <div className="electrode-item">
          <h3>Electrode 2</h3>
          <canvas id="electrode2"></canvas>
        </div>

        <div className="electrode-item">
          <h3>Electrode 3</h3>
          <canvas id="electrode3"></canvas>
        </div>

        <div className="electrode-item">
          <h3>Electrode 4</h3>
          <canvas id="electrode4"></canvas>
        </div>

        <div className="electrode-item">
          <h3>Electrode 5</h3>
          <canvas id="electrode5"></canvas>
        </div>
      </div>
    </div>
  )
}

export default MuseInterface;

// helpers

// function getExclamationMarks(numChars: number) {
//   return Array(numChars + 1).join('!');
// }