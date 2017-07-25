/// <reference types="vss-web-extension-sdk" />

import WidgetHelpers = require("TFS/Dashboards/WidgetHelpers");
import WidgetContracts = require("TFS/Dashboards/WidgetContracts");
import TFS_Wit_WebApi = require("TFS/WorkItemTracking/RestClient");

class Widget {    
    load(widgetSettings: WidgetContracts.WidgetSettings){
        var $title = $('h2.title');
        $title.text('Hello World');

        return this.getQueryInfo(widgetSettings);
    }

    reload(widgetSettings: WidgetContracts.WidgetSettings) {
        return this.getQueryInfo(widgetSettings);
    }

    render(queryInfo) : IPromise<WidgetContracts.WidgetStatus> {
        // Create a list with query details
        var $list = $('<ul>');
        $list.append($('<li>').text("Query Id: " + queryInfo.id));
        $list.append($('<li>').text("Query Name: " + queryInfo.name));
        $list.append($('<li>').text("Created By: " + (queryInfo.createdBy ? queryInfo.createdBy.displayName:"<unknown>") ));

        // Append the list to the query-info-container
        var $container = $('#query-info-container');
        $container.empty();
        $container.append($list);

        // Use the widget helper and return success as Widget Status
        return WidgetHelpers.WidgetStatusHelper.Success();
    }

    renderEmpty(): IPromise<WidgetContracts.WidgetStatus>{
        var $container = $('#query-info-container');
        $container.empty();
        $container.text("Sorry nothing to show, please configure a query path");

        return WidgetHelpers.WidgetStatusHelper.Success();
    }

    getQueryInfo(widgetSettings: WidgetContracts.WidgetSettings) : IPromise<WidgetContracts.WidgetStatus> {
        // Extract query path from widgetSettings.customSettings and ask user to configure one if none is found
        var settings = JSON.parse(widgetSettings.customSettings.data);
        if (!settings || !settings.queryPath) {
            return this.renderEmpty();
        }

        // Get a WIT client to make REST calls to VSTS
        return TFS_Wit_WebApi.getClient().getQuery(VSS.getWebContext().project.id, settings.queryPath)
            .then(
                (queryInfo) => this.render(queryInfo),
                (error) => { return  WidgetHelpers.WidgetStatusHelper.Failure(error.message); }
            );
    }

}

WidgetHelpers.IncludeWidgetStyles();
VSS.register("BoilerplateConfigurationWidget.Widget", function () {
    return new Widget();
});
