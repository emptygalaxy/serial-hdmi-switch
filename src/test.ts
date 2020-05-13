import {HDMISwitch, Source} from "./HDMISwitch";

let device:HDMISwitch = new HDMISwitch('/dev/cu.usbserial-40130');
let currentInput = 0;

setTimeout(() => {
    device.powerOff();

    setTimeout(() => {
        device.powerOn();

        setInterval(()=>{
            currentInput ++;
            currentInput %= 5;

            device.setInputIndex(currentInput);
        }, 10000);
    }, 2000);
}, 1000);
