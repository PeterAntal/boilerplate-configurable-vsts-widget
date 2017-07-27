/// <reference types="vss-web-extension-sdk" />

import * as Q from 'q';
import * as React from 'react';
import ReactDOM = require('react-dom');

import WidgetHelpers = require('TFS/Dashboards/WidgetHelpers');
import WidgetContracts = require('TFS/Dashboards/WidgetContracts');
import TFS_Wit_WebApi = require('TFS/WorkItemTracking/RestClient');
import { QueryWidgetSettings, WidgetSettingsHelper } from './WidgetSettings';
import { QueryViewComponent } from "./QueryViewComponent";

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
/*
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
    }*/

    private getQueryInfo(widgetSettings: WidgetContracts.WidgetSettings): IPromise<WidgetContracts.WidgetStatus> {
        let querySettings = WidgetSettingsHelper.Parse<QueryWidgetSettings>(widgetSettings.customSettings.data);
        
        var $reactContainer = $(".react-container");
        let container = $reactContainer.eq(0).get()[0];
        ReactDOM.render(<QueryViewComponent initialConfiguration={querySettings} />, container) as React.Component<any, any>;
        return WidgetHelpers.WidgetStatusHelper.Success();
    }
}

WidgetHelpers.IncludeWidgetStyles();
VSS.register("BoilerplateConfigurationWidget.Widget", function () {
    return new Widget();
});
