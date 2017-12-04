import * as React from 'react';
import { MuseClient, EEGReading, channelNames } from 'muse-js';
import '../styles/MuseInterface.css';
import ElectrodePanel from './ElectrodePanel'
import ConnectPanel from './ConnectPanel'
import DetailsPanel from './DetailsPanel'
import AccelerometerPanel from './AccelerometerPanel'


function MuseInterface() {
  let OscCanvases = Array.from(document.querySelectorAll('.electrode-osc canvas')) as HTMLCanvasElement[];

  function fitToContainer(canvas: HTMLCanvasElement){
    canvas.style.width='100%';
    canvas.style.height='100%';
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  OscCanvases.forEach((item, index) => {
    fitToContainer(item);
  });

  let connect = async () => {
    let graphTitles = Array.from(document.querySelectorAll('.electrode-item h3'));
    let canvases = Array.from(document.querySelectorAll('.electrode-item canvas')) as HTMLCanvasElement[];
    let canvasCtx = canvases.map(canvas => canvas.getContext('2d'));
    let oscCanvases = Array.from(document.querySelectorAll('.electrode-osc canvas')) as HTMLCanvasElement[];
    let oscCtxs = oscCanvases.map(canvas => canvas.getContext('2d'));

    function fitToContainer(canvas: HTMLCanvasElement){
      canvas.style.width='100%';
      canvas.style.height='100%';
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
  
    oscCanvases.forEach((item, index) => {
      fitToContainer(item);
    });

    graphTitles.forEach((item, index) => {
      item.textContent = channelNames[index];
    });

    // capture incoming socket data in an array of arrays
    let EEGData = [] as Array<any>;
    EEGData[0] = [] as Array<number>;
    EEGData[1] = [] as Array<number>;
    EEGData[2] = [] as Array<number>;
    EEGData[3] = [] as Array<number>;
    EEGData[4] = [] as Array<number>;

    let xPositions = [] as Array<number>;
    xPositions[0] = 0;
    xPositions[1] = 0;
    xPositions[2] = 0;
    xPositions[3] = 0;
    xPositions[4] = 0;

    let x = 0;
    let plotOsc = true;

    function plot(reading: EEGReading) {
      const canvas = canvases[reading.electrode];
      const context = canvasCtx[reading.electrode];
      const oscCanvas = oscCanvases[reading.electrode];
      const oscCtx = oscCtxs[reading.electrode]!;
      let data = EEGData[reading.electrode];
      // let x = xPositions[reading.electrode];

      if (!context) {
        return;
      }
      const width = canvas.width / 12.0;
      const height = canvas.height / 2.0;
      context.fillStyle = 'green';
      context.clearRect(0, 0, canvas.width, canvas.height);

      // var panAtX = oscCanvas.width;

      for (let i = 0; i < reading.samples.length; i++) {
        const sample = reading.samples[i] / 15.;
        if (sample > 0) {
          context.fillRect(i * 25, height - sample, width, sample);
        } else {
          context.fillRect(i * 25, height, width, -sample);
        }

        let oscSample = reading.samples[i];
        data.push(oscSample);
      }

      if (x > data.length - 1) {
        return;
      }

      if (!plotOsc) {
        return;
      }

      if (x++ < oscCanvas.width) {
        oscCtx.fillRect(x, data[x], 1, 1);
      } else {
        oscCtx.clearRect(0, 0, oscCanvas.width, oscCanvas.height);

        for (var xx = 0; xx < oscCanvas.width; xx++) {
          var y = data[x - oscCanvas.width + xx];
          oscCtx.fillRect(xx, y, 1, 1)
        }
      }
    }

    let client = new MuseClient();
    client.connectionStatus.subscribe(status => {
      console.log(status ? 'Connected!' : 'Disconnected')
    });

    try {
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
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css" />
      <DetailsPanel />
      <ConnectPanel connect = { () => connect() } />
      <AccelerometerPanel />
      <ElectrodePanel />
    </div>
  )
}

export default MuseInterface;