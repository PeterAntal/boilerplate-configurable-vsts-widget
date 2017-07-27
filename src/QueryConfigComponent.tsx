import { Widget } from './Widget';
import { QueryWidgetSettings, WidgetSettings } from './WidgetSettings';
/// <reference types="vss-web-extension-sdk" />

import * as Q from 'q';
import * as React from 'react';

import { WitQueryEnumerator, QueryHierarchyUtilities } from "./WitUtils";
import { QueryExpand, QueryHierarchyItem } from "TFS/WorkItemTracking/Contracts";
import { Props, State, ComponentBase, DataManager} from "./FluxTypes";

import { Store } from "VSS/Flux/Store";
import { Picker, PickerProps } from "./Picker";

export interface QueryConfigProps extends Props {    
    onChange: (WidgetSettings)=> void;
    initialConfiguration: QueryWidgetSettings;
}

export interface QueryConfigState extends State{
    queries: PickerProps<QueryHierarchyItem>;
    configuration: QueryWidgetSettings;
}

export class QueryConfigDataManager extends DataManager<QueryConfigState>{
    private results: QueryConfigState;
    constructor(configuration: WidgetSettings) {
        super();
        this.results = {
            queries: {
                itemValues: []                
            },
            configuration: configuration
        } as QueryConfigState;
    }
    public getInitialState(): QueryConfigState {
        return this.results;
    }

    public requestData(): IPromise<QueryConfigState> {
        let project = VSS.getWebContext().project.id;
        let enumerator = new WitQueryEnumerator(project);

        return enumerator.getResults().then((results) => {
            let flatResults = QueryHierarchyUtilities.flattenHierarchy(results);
            this.results.queries.itemValues = QueryHierarchyUtilities.ignoreFolders(QueryHierarchyUtilities.selectPublicQueries(flatResults));
            return this.results;
        });
    }
}


export class QueryConfigComponent extends ComponentBase<QueryConfigProps, QueryConfigState> {
    public render(): JSX.Element {
        let storeState = this.getStoreState().queries;

        return <div className="widget-component">
            <Picker
                itemValues={storeState.itemValues}
                initialSelectionId={this.getStoreState().configuration.queryId}
                getItemId= {(item: QueryHierarchyItem) => item.id}
                getItemText={ (item: QueryHierarchyItem) => item.path}
                onChange={ (item: QueryHierarchyItem)=>{ 
                        this.getStoreState().configuration.queryId = item.path;
                        this.props.onChange(this.getStoreState().configuration);
                    }
                }
            >
            </Picker>
        </div>;
    }

    protected createDataManager(): DataManager<QueryConfigState> {
        return new QueryConfigDataManager(this.props.initialConfiguration);
    }
}

