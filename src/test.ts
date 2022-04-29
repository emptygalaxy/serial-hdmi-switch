import {HDMISwitch, Source} from "./HDMISwitch";

const ComplicatedExample = () => new HDMISwitch(
    '/dev/cu.usbserial-145420',
    {
        Baud: 57600,
        ZeroIndexed: false,
        CommandEnd: '\r',
        MaxInputs: 4,
        Commands: {
            PowerOn: 'OUTON',
            PowerOff: 'OUTOFF',
            OutputSelect: 'OUT FR %d',
        }
    }
);

// Simple Example
let device:HDMISwitch = new HDMISwitch('/dev/cu.usbserial-145420')

let currentInput = 0;

setTimeout(() => {
    device.powerOff();

    setTimeout(() => {
        device.powerOn();

        setInterval(()=>{
            currentInput ++;
            currentInput %= device.options.MaxInputs;

            device.setInputIndex(currentInput);
        }, 10000);
    }, 2000);
}, 1000);
