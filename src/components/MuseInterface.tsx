import * as React from 'react';
import { MuseClient, EEGReading, channelNames } from 'muse-js';
import '../styles/MuseInterface.css';
import ElectrodePanel from './ElectrodePanel'
import ConnectPanel from './ConnectPanel'
import DetailsPanel from './DetailsPanel'
import AccelerometerPanel from './AccelerometerPanel'

const numberOfElectrodes = 4;

function MuseInterface() {

  function fitOscCanvases(oscCanvases: HTMLCanvasElement[]) {
    function fitToContainer(canvas: HTMLCanvasElement){
      canvas.style.width='100%';
      canvas.style.height='100%';
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
  
    oscCanvases.forEach((item, index) => {
      fitToContainer(item);
    });
  }

  function setupDataArrays(EEGData: Array<any>, xPositions: Array<number>) {
    for(var i = 0; i < numberOfElectrodes; i++) {
      EEGData[i] = [] as Array<number>;
      xPositions[i] = 0;
    }
  }

  function animateLineOsc(oscCanvas: HTMLCanvasElement, oscCtx: CanvasRenderingContext2D, data: Array<any>, x: number) {
    oscCtx.clearRect(0, 0, oscCanvas.width, oscCanvas.height);
    oscCtx.beginPath();
    oscCtx.moveTo(0,0);
    
    if (x < oscCanvas.width) {
      for(xx = 0; xx < data.length; xx++) {
        oscCtx.lineTo(xx, data[xx]);
      }
    } else {
      for (var xx = 0; xx < oscCanvas.width; xx++) {
        var y = data[x - oscCanvas.width + xx];
        oscCtx.lineTo(xx, y);
      }
    }

    oscCtx.stroke();
  }

  let connect = async () => {
    let graphTitles = Array.from(document.querySelectorAll('.electrode-item h3'));
    let canvases = Array.from(document.querySelectorAll('.electrode-item canvas')) as HTMLCanvasElement[];
    let canvasCtx = canvases.map(canvas => canvas.getContext('2d')) as CanvasRenderingContext2D[];
    let oscCanvases = Array.from(document.querySelectorAll('.electrode-osc canvas')) as HTMLCanvasElement[];
    let oscCtxs = oscCanvases.map(canvas => canvas.getContext('2d')) as CanvasRenderingContext2D[];
    let EEGData = [] as Array<any>;
    let xPositions = [] as Array<number>;

    fitOscCanvases(oscCanvases);
    setupDataArrays(EEGData, xPositions);

    graphTitles.forEach((item, index) => {
      item.textContent = channelNames[index];
    });

    function animate() {
      requestAnimationFrame(animate);

      oscCanvases.forEach((oscCanvas, index) => {
        animateLineOsc(oscCanvas, oscCtxs[index], EEGData[index], xPositions[index]);
      });
    }

    animate();

    function plot(reading: EEGReading) {
      const canvas = canvases[reading.electrode];
      const context = canvasCtx[reading.electrode];
      let data = EEGData[reading.electrode];

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

        let oscSample = reading.samples[i];
        data.push(oscSample);
        xPositions[reading.electrode]++;
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