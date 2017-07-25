/// <reference types="vss-web-extension-sdk" />

import WidgetHelpers = require("TFS/Dashboards/WidgetHelpers");
import WidgetContracts = require("TFS/Dashboards/WidgetContracts");

class WidgetConfiguration {
    private widgetConfigurationContext: WidgetContracts.IWidgetConfigurationContext;

    load(widgetSettings: WidgetContracts.WidgetSettings,
         widgetConfigurationContext: WidgetContracts.IWidgetConfigurationContext) :  IPromise<WidgetContracts.WidgetStatus>{
        var $queryDropdown = $("#query-path-dropdown");
                    
        this.widgetConfigurationContext = widgetConfigurationContext;
        var settings = JSON.parse(widgetSettings.customSettings.data);         

         if (settings && settings.queryPath) {
            $queryDropdown.val(settings.queryPath);
        }
        $queryDropdown.on("change", () => {            
            this.onChange();
        });                                 

        return WidgetHelpers.WidgetStatusHelper.Success();
    }

    onChange(){
        var eventName = WidgetHelpers.WidgetEvent.ConfigurationChange;
        var eventArgs = WidgetHelpers.WidgetEvent.Args(this.getCustomSettings());
        this.widgetConfigurationContext.notify(eventName, eventArgs);
    }

    //Allows the widget to validate the state
    onSave(): IPromise<WidgetContracts.SaveStatus> {
        return WidgetHelpers.WidgetConfigurationSave.Valid(this.getCustomSettings() );
    }
    
    getCustomSettings():  WidgetContracts.CustomSettings{
        return  {
            data: JSON.stringify({
                queryPath: this.getQueryOption()
            })
        };
    }

    getQueryOption(): string{
        return $("#query-path-dropdown").val();
    }
}

VSS.register("BoilerplateConfigurationWidget.Configuration", function () {   
    var $queryDropdown = $("#query-path-dropdown");
    let widgetConfiguration = new WidgetConfiguration();        
    return widgetConfiguration;
});