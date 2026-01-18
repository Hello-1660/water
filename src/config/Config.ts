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
    date: DateConfig
}



export class UIConfig {
    public mainConfig: MainUIConfig

    constructor(parseConfig: any) {
        this.mainConfig = parseConfig.main
    }
}