/// <reference types="vss-web-extension-sdk" />

import WidgetHelpers = require('TFS/Dashboards/WidgetHelpers');
import WidgetContracts = require('TFS/Dashboards/WidgetContracts');
import TFS_Wit_WebApi = require('TFS/WorkItemTracking/RestClient');
import { QueryWidgetSettings, WidgetSettingsHelper } from './WidgetSettings';

import { QueryHierarchyUtilities, WitQueryRunner } from './WitUtils';
import { QueryExpand, QueryHierarchyItem, WorkItemQueryResult, QueryType } from "TFS/WorkItemTracking/Contracts";

export class Widget {
    public load(widgetSettings: WidgetContracts.WidgetSettings) {
        var $title = $('h2.title');
        $title.text('Hello World');

        return this.getQueryInfo(widgetSettings);
    }

    public reload(widgetSettings: WidgetContracts.WidgetSettings) {
        return this.getQueryInfo(widgetSettings);
    }

    public render(queryInfo: QueryHierarchyItem, results: WorkItemQueryResult): IPromise<WidgetContracts.WidgetStatus> {
        // Create a list with query details
        var $list = $('<ul>');
        $list.append($('<li>').text("Query Name: " + queryInfo.name));
        $list.append($('<li>').text("Query Count : " + results.workItems.length));

        // Append the list to the query-info-container
        var $container = $('#query-info-container');
        $container.empty();
        $container.append($list);

        // Use the widget helper and return success as Widget Status
        return WidgetHelpers.WidgetStatusHelper.Success();
    }

    private renderEmpty(): IPromise<WidgetContracts.WidgetStatus> {
        var $container = $('#query-info-container');
        $container.empty();
        $container.text("Sorry nothing to show, please configure a query path");

        return WidgetHelpers.WidgetStatusHelper.Success();
    }

    private getQueryInfo(widgetSettings: WidgetContracts.WidgetSettings): IPromise<WidgetContracts.WidgetStatus> {
        // Extract query path from widgetSettings.customSettings and ask user to configure one if none is found
        var settings = WidgetSettingsHelper.Parse<QueryWidgetSettings>(widgetSettings.customSettings.data);
        if (!settings || !settings.queryId) {
            return this.renderEmpty();
        }

        // Get a WIT client to make REST calls to VSTS
        return TFS_Wit_WebApi.getClient().getQuery(VSS.getWebContext().project.id, settings.queryId)
            .then(
            (queryInfo) => { return this.runQuery(queryInfo) },
            (error) => { return WidgetHelpers.WidgetStatusHelper.Failure(error.message); }
            );
    }

    private runQuery(queryInfo: QueryHierarchyItem): IPromise<WidgetContracts.WidgetStatus> {
        let context = VSS.getWebContext();
        if (!queryInfo || !queryInfo.id) {
            return WidgetHelpers.WidgetStatusHelper.Failure("Widget Error: Query result was not in expected form");
        }

        // Get a WIT client to make REST calls to VSTS
        return new WitQueryRunner(queryInfo, context.project.id, context.team.id).getResults()
            .then(
            (results) => { return this.render(queryInfo, results); },
            (error) => { return WidgetHelpers.WidgetStatusHelper.Failure(error.message); }
            );
    }

}

WidgetHelpers.IncludeWidgetStyles();
VSS.register("BoilerplateConfigurationWidget.Widget", function () {
    return new Widget();
});
