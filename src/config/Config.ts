export interface MainCommonConfig {
    fontSize: number,
    fontFamily: string,
    fontColor: string
}

export interface TimeConfig extends MainCommonConfig {}

export interface DateConfig extends MainCommonConfig {
    content: string
}

export interface MainUIConfig {
    time: TimeConfig,
    date: DateConfig,
    position: position
}

interface position {
    x: number,
    y: number
}



export class UIConfig {
    public mainConfig: MainUIConfig

    constructor(parseConfig: any) {
        this.mainConfig = parseConfig.mainConfig
    }
}




export interface Setting {
    autostart: boolean
    dark: boolean
    showClock: boolean
}

export class SettingConfig {
    public setting: Setting

    constructor(parseConfig: any) {
        this.setting = parseConfig.setting
    }
}