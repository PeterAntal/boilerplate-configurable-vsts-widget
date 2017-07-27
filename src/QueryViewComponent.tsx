import { Widget } from './Widget';
import { QueryWidgetSettings, WidgetSettings } from './WidgetSettings';
/// <reference types="vss-web-extension-sdk" />

import * as Q from 'q';
import * as React from 'react';

import { QueryHierarchyUtilities, WitQueryEnumerator, WitQueryReader, WitQueryRunner } from './WitUtils';
import { QueryExpand, WorkItemQueryResult, QueryHierarchyItem } from "TFS/WorkItemTracking/Contracts";
import { Props, State, ComponentBase, DataManager } from "./FluxTypes";

import { Store } from "VSS/Flux/Store";
import { Picker, PickerProps } from "./Picker";

export interface QueryViewProps extends Props {
    initialConfiguration: QueryWidgetSettings;
}

export interface QueryViewState extends State {
    isLoading: boolean;

    errorMessage: string;
    queryInfo: QueryHierarchyItem;
    queryResults: WorkItemQueryResult;
}

export class QueryViewDataManager extends DataManager<QueryViewState>{
    private configuration: QueryWidgetSettings;
    private results: QueryViewState;
    constructor(configuration: QueryWidgetSettings) {
        super();
        this.setInitialState(configuration);        
    }

    public getInitialState(): QueryViewState {
        return this.results;
    }

    public requestData(): IPromise<QueryViewState> {
        let context = VSS.getWebContext();

        if (!this.configuration.queryId) {
            return this.packErrorMessage("No query has been selected.");
        }
        // Get a WIT client to make REST calls to VSTS
        let promise = new WitQueryReader(context.project.id, this.configuration.queryId).getResults().then(
            (queryInfo) => {
                this.results.queryInfo = queryInfo;
                // Get a WIT client to make REST calls to VSTS
                return new WitQueryRunner(queryInfo, context.project.id, context.team.id).getResults().then(
                    (results) => {
                        this.results.queryResults = results;
                        this.results.isLoading = false;
                        return this.results;
                    });
            });
        //promise.then(null,(error) => { return this.packErrorMessage(error.errorMessage); });
        return promise;
    }

    private packErrorMessage(error: string): IPromise<QueryViewState> {
        this.results = { isLoading: false, errorMessage: error, queryInfo: null, queryResults: null };
        return Q(this.results);
    }

    public getConfiguration(){
        return this.configuration;
    }

    public setInitialState(configuration: QueryWidgetSettings){
        //Establish initial state;
        this.configuration = configuration;
        this.results = {
            isLoading: true,
            queryInfo: null,
            queryResults: null,
            errorMessage: null
        } as QueryViewState;
    }
}


export class QueryViewComponent extends ComponentBase<QueryViewProps, QueryViewState> {
    private queryDataManager: QueryViewDataManager;

    //Unlike the config scenario, the view will be repainted with new props repeatedly. Here we update the data manager with new context, and request new data on each change.
    public componentWillReceiveProps(props: QueryViewProps){
        this.queryDataManager.setInitialState(props.initialConfiguration);
        this.initiateRequest();
    }

    public render(): JSX.Element {                
        let content = this.loading();
        if (!this.getStoreState().isLoading) {
            if (!this.getStoreState().errorMessage) {
                content = this.renderSuccess();
            } else {
                content = this.renderFail();
            }
        }
        return content;
    }

    public loading(){
        return <div className="empty-loading-state">Widget is running query. Please stand by.</div>;
    }

    public renderSuccess() {
        let count = this.getStoreState().queryResults.workItems.length;
        return (
            <div className="widget-component">
                <h2 className="title">{this.getStoreState().queryInfo.name}</h2>
                <div className="query-count">{count}</div>
            </div>
        );
    }

    public renderFail() {        
        return (
            <div className="widget-component">
                <h2 className="title">Failed</h2>
                <div className="error-message">{this.getStoreState().errorMessage}</div>
            </div>);
    }

    protected createDataManager(): DataManager<QueryViewState> {
        this.queryDataManager= new QueryViewDataManager(this.props.initialConfiguration);
        return this.queryDataManager;
    }
}

