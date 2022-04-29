Serial HDMI Switcher
=====

Introduction
----

This is a library that uses the `serialport` to control various HDMI switchers. Primary use currently is for a library for (Homebridge)[https://github.com/emptygalaxy/homebridge-hdmi-switch].

Building
---

1. Run `npm install` in the root of the directory.
2. Run `npm run build`

Testing
---

1. Ensure that your configuration is correct in test.js
2. Run `node test.js`
3. Observe HDMI Switcher

Usage
---

### Simple

```ts
let device: HDMISwitch = new HDMISwitch('/dev/cu.usbserial-145420')
device.setInputIndex(1);
```

### Complex

You can also supply a options object to the constructor to customize the behavior of the switcher.

The following example is for a Xantech XT-SW41-4K18G:

```
new HDMISwitch(
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
```