import {HDMISwitch} from './HDMISwitch';

// Simple Example
const SimpleExample: HDMISwitch = new HDMISwitch('/dev/cu.usbserial-145420');

// Complicated Example
const ComplicatedExample = new HDMISwitch('/dev/cu.usbserial-145420', {
  Baud: 57600,
  ZeroIndexed: false,
  CommandEnd: '\r',
  MaxInputs: 4,
  Commands: {
    PowerOn: 'OUTON',
    PowerOff: 'OUTOFF',
    OutputSelect: 'OUT FR %d',
  },
});

const device = SimpleExample || ComplicatedExample;

// loop through each input
let currentInput = 0;
setTimeout(() => {
  device.powerOff();

  setTimeout(() => {
    device.powerOn();

    setInterval(() => {
      currentInput++;
      currentInput %= device.options.MaxInputs;

      device.setInputIndex(currentInput);
    }, 10000);
  }, 2000);
}, 1000);
