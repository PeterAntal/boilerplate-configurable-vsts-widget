
/// <reference types="vss-web-extension-sdk" />

import * as Q from 'q';
import * as React from 'react';
import ReactDOM = require('react-dom');


import WidgetHelpers = require('TFS/Dashboards/WidgetHelpers');
import WidgetContracts = require('TFS/Dashboards/WidgetContracts');
import { QueryWidgetSettings, WidgetSettingsHelper } from './WidgetSettings';
import { QueryConfigComponent } from "./QueryConfigComponent";

/** Demonstrates a widget configuration which:
 * 1-Deserializes existing settings
 * 2-Renders config UI with those settings
 * 3-Notifies widget contract of changes in configuration
 */
class WidgetConfiguration {
    private widgetConfigurationContext: WidgetContracts.IWidgetConfigurationContext;
    private settings:QueryWidgetSettings;

    public load(widgetSettings: WidgetContracts.WidgetSettings,
        widgetConfigurationContext: WidgetContracts.IWidgetConfigurationContext): IPromise<WidgetContracts.WidgetStatus> {
        var $reactContainer = $(".react-container");

        this.widgetConfigurationContext = widgetConfigurationContext;
        this.settings = WidgetSettingsHelper.Parse(widgetSettings.customSettings.data);
        

        let container = $reactContainer.eq(0).get()[0];
        ReactDOM.render(<QueryConfigComponent initialConfiguration={this.settings} onChange={(settings: QueryWidgetSettings)=>{ this.settings=settings; this.onChange()}} />, container) as React.Component<any, any>;
        return WidgetHelpers.WidgetStatusHelper.Success();
    }

    // Responsible for packaging up current state for notification to the config context.
    private onChange(): void {
        var eventName = WidgetHelpers.WidgetEvent.ConfigurationChange;
        var eventArgs = WidgetHelpers.WidgetEvent.Args(this.getCustomSettings());
        this.widgetConfigurationContext.notify(eventName, eventArgs);
    }

    /** Handles config contract requests to validate the state of the configuration. */
    public onSave(): IPromise<WidgetContracts.SaveStatus> {
        return WidgetHelpers.WidgetConfigurationSave.Valid(this.getCustomSettings());
    }

    /** Handles Config contract requests for configuration.  */
    public getCustomSettings(): WidgetContracts.CustomSettings {
        return {
            data: WidgetSettingsHelper.Serialize<QueryWidgetSettings>(this.settings)
        };
    }
}

VSS.register("BoilerplateConfigurationWidget.Configuration", function () {
    let widgetConfiguration = new WidgetConfiguration();
    return widgetConfiguration;
});