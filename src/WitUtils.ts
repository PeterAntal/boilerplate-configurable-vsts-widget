/// <reference types="vss-web-extension-sdk" />

import * as Q from 'q';

import { QueryExpand, QueryHierarchyItem, WorkItemQueryResult, QueryType } from "TFS/WorkItemTracking/Contracts";
import { getClient } from "TFS/WorkItemTracking/RestClient";

// Facade code for encapsulating handling interation details with WIT.

/** Enumerates out 2-layer hierarchy of WIT Queries */
export class WitQueryEnumerator {
    project: string;

    constructor(project: string) {
        this.project = project;
    }

    public getResults(): IPromise<QueryHierarchyItem[]> {
        let client = getClient();
        let expandQueryResults = QueryExpand.None;
        let includeDeleted = false;
        let queryDepth = 2;

        return client.getQueries(this.project, expandQueryResults, queryDepth, includeDeleted);
    }
}

/** Reads metadata about a query */
export class WitQueryReader {
    project: string;    
    queryId: string;

    constructor(project: string, queryId: string) {
        this.project = project;
        this.queryId = queryId;

    }

    public getResults(): IPromise<QueryHierarchyItem> {
        return getClient().getQuery(this.project, this.queryId);
    }
}

/** Collects results from a single query */
export class WitQueryRunner {
    project: string;
    team: string;
    query: QueryHierarchyItem;

    constructor(query: QueryHierarchyItem, project: string, team: string) {
        this.project = project;
        this.query = query;
        this.team = team;

    }

    public getResults(): IPromise<WorkItemQueryResult> {
        return getClient().queryById(this.query.id, this.project, this.team, true);
    }
}


export class QueryHierarchyUtilities {
    /**
     * Flattens a query hierarchy into a list for a non-hierarchical selection views.
     */
    public static flattenHierarchy(items: QueryHierarchyItem[]) {
        let flatResults = [];
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            flatResults.push(item);
            if (item.children != null && item.children.length > 0) {
                flatResults.push.apply(flatResults, QueryHierarchyUtilities.flattenHierarchy(item.children));
            }
        }
        return flatResults;
    }

    /**
     * Omit queries which are not for shared use.
     */
    public static selectPublicQueries(items: QueryHierarchyItem[]) {
        return items.filter(o => o.isPublic == true);
    }

    /**
     * Focus on concrete query items.
     */
    public static ignoreFolders(items: QueryHierarchyItem[]) {
        return items.filter(o => !o.isFolder);
    }
}
