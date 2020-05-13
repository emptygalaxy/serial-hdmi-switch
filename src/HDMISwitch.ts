import SerialPort = require('serialport');

export class HDMISwitch
{
    path: string;
    private commandEnd:string = "R";
    private serial:SerialPort;

    constructor(path:string)
    {
        this.path = path;

        this.serial = new SerialPort(this.path, {
            autoOpen: true,
            baudRate: 9600
        }, err => {
            if (err)
            {
                return console.log('Error: ', err.message)
            }
        });

        // The open event is always emitted
        this.serial.on('open', function() {
            // open logic
            console.log('open');
        });


        // this.serial.on('data', function (data:Buffer) {
        //
        //     let series:number[] = [0x26, 0xcb, 0xa1, 0x29, 0x01, 0xc6, 0x79, 0x01, 0x06, 0x69, 0x73, 0xd6, 0x16];
        //     let test:Buffer = Buffer.from(series);
        //
        //     if(!data.equals(test) && !data.equals(test2) && !data.equals(test3))
        //     {
        //         console.log('Difference:', data, data.toString());
        //     }
        // });
    }

    private sendCommand(command:string)
    {
        let message:string = command + this.commandEnd;
        console.log('send message: ', message);
        this.serial.write(message, 'utf8', (error?: Error | null) => {
            if (error) {
                return console.log('Error on write: ', error.message)
            }
            console.log('message written');
        });
    }

    public powerOn()
    {
        this.sendCommand(SerialCommand.PowerOn);
    }

    public powerOff()
    {
        this.sendCommand(SerialCommand.PowerOff);
    }

    public setInput(source:Source)
    {
        let command: SerialCommand | null = HDMISwitch.getSourceCommand(source);

        if(command != null)
            this.sendCommand(command);
    }

    public setInputIndex(index:number)
    {
        let sources:Source[] = [Source.HDMI_1, Source.HDMI_2, Source.HDMI_3, Source.HDMI_4, Source.HDMI_5];
        if(index >= 0 && index < sources.length)
        {
            let source:Source = sources[Math.round(index)];
            this.setInput(source);
        }
    }

    private static getSourceCommand(source:Source):SerialCommand|null
    {
        switch(source)
        {
            case Source.HDMI_1:
                return SerialCommand.HDMI_1;
            case Source.HDMI_2:
                return SerialCommand.HDMI_2;
            case Source.HDMI_3:
                return SerialCommand.HDMI_3;
            case Source.HDMI_4:
                return SerialCommand.HDMI_4;
            case Source.HDMI_5:
                return SerialCommand.HDMI_5;
        }
        return null;
    }
}

enum SerialCommand
{
    PowerOn = 'poweron',
    PowerOff = 'poweroff',
    HDMI_1 = 'port0',
    HDMI_2 = 'port1',
    HDMI_3 = 'port2',
    HDMI_4 = 'port3',
    HDMI_5 = 'port4'
}

export enum Source
{
    HDMI_1,
    HDMI_2,
    HDMI_3,
    HDMI_4,
    HDMI_5
}