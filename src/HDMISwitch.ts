import SerialPort = require('serialport');

export class HDMISwitch {
  path: string;
  options: HDMISwitchOptions;

  private serial: SerialPort;

  constructor(path: string, options?: HDMISwitchOptions) {
    this.path = path;
    this.options = options ? options : DefaultHDMISwitchOptions;

    this.serial = new SerialPort(
      this.path,
      {
        autoOpen: true,
        baudRate: this.options.Baud,
      },
      (err?: Error | null) => {
        if (err) {
          return console.log(`[serial-hdmi-switch] Error: ${err.message}`);
        }
      }
    );

    // The open event is always emitted
    this.serial.on('open', () => {
      // open logic
      console.log(
        `[serial-hdmi-switch] Opened Serial Connection to ${path} at ${this.options.Baud} baud.`
      );
    });
  }

  private sendCommand(command: string) {
    const message: string = command + this.options.CommandEnd;
    console.log(`[serial-hdmi-switch] Sending Message: ${message}.`);
    this.serial.write(message, 'utf8', (error?: Error | null) => {
      if (error) {
        return console.log(
          `[serial-hdmi-switch] Error on write: ${error.message}`
        );
      }
      console.log('[serial-hdmi-switch] Message written.');
    });
  }

  public powerOn() {
    this.sendCommand(this.options.Commands.PowerOn);
  }

  public powerOff() {
    this.sendCommand(this.options.Commands.PowerOff);
  }

  public setInput(source: number) {
    this.sendCommand(
      this.options.Commands.OutputSelect.replace('%d', source.toString(10))
    );
  }

  public setInputIndex(index: number) {
    if (index >= this.options.MaxInputs) {
      throw new Error(
        'Requested Input is outside the range specified in HDMI Switch Options.'
      );
    }

    if (index < 0) {
      throw new Error('Requested Input is below 0. No such input exists.');
    }

    this.setInput(index + (this.options.ZeroIndexed ? 0 : 1));
  }
}

interface HDMISwitchOptions {
  Commands: SerialCommands;
  CommandEnd: string;
  // HDMI Outputs by serial are referred to zero-indexed, example: HDMI 1 is port0.
  ZeroIndexed: boolean;
  MaxInputs: number;
  Baud: number;
}

interface SerialCommands {
  PowerOn: string;
  PowerOff: string;
  OutputSelect: string;
}

const DefaultSerialCommands: SerialCommands = {
  PowerOn: 'poweron',
  PowerOff: 'poweroff',
  // %d is replaced with the Requested Port.
  OutputSelect: 'port%d',
};

const DefaultHDMISwitchOptions: HDMISwitchOptions = {
  Commands: DefaultSerialCommands,
  CommandEnd: 'R',
  ZeroIndexed: true,
  MaxInputs: 5,
  Baud: 9600,
};

// Backwards compatble typing.
export type Source = number;
