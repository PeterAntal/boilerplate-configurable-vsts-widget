export interface WidgetSettings{}

export interface QueryWidgetSettings extends WidgetSettings{
    queryId: string;
}


export class WidgetSettingsHelper<T extends WidgetSettings> {
    public static Serialize<T>(widgetSettings: T): string{
        return JSON.stringify(widgetSettings);
    }

    public static Parse<T>(settingsString: string): T{
        let settings= JSON.parse(settingsString);
        if(!settings){
            settings = {};
        }
        return settings;
    }
}