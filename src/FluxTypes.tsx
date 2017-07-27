/// <reference types="vss-web-extension-sdk" />

import * as Q from 'q';
import * as React from 'react';

import { WitQueryEnumerator } from "./WitUtils";
import { QueryExpand, QueryHierarchyItem } from "TFS/WorkItemTracking/Contracts";
import * as FluxTypes from "./FluxTypes";

import { Store } from "VSS/Flux/Store";
import { Action } from "VSS/Flux/Action";

//A quick and dirty implementation of flux boilerplate types.

export interface Props { }
export interface State { }

export class BaseStore<T> extends Store {
    private state: T;
    private actions: Actions;

    constructor(actions: Actions, initialState: T) {
        super();
        this.actions = actions;
        this.state = initialState;
        this.actions.provideData.addListener((data: T) => { this.recieveAndNotify(data) });
    }

    public getState(): T {
        return this.state
    }
    public setState(state: T) {
        this.state = state;
    }

    private recieveAndNotify(state: T) {
        this.setState(state);
        this.emitChanged();
    }
}


export class Actions {
    public provideData: Action<State>;

    constructor() {
        this.provideData = new Action<State>();
    }
}

export class DataManager<T extends State>{
    public getInitialState(): T {
        return {} as T;
    }

    public requestData(): IPromise<T> {
        return Q({} as T);
    }
}

export class ComponentBase<P extends Props,S extends State> extends React.Component<P, S> {
    protected dataManager: DataManager<S>;
    protected store: BaseStore<S>;
    protected actions: Actions;

    private setStoreStateDelegate = () => this.setStoreState();


    //Set the stage for initial rendering
    public componentWillMount(): void {
        this.dataManager = this.createDataManager();
        this.actions = this.createActions();
        this.store = this.createStore();

        this.initiateRequest();
    }

    protected initiateRequest(): void{
        this.dataManager.requestData().then((state) => {
            this.actions.provideData.invoke(state);
            this.setState(state);
        });
    }

    //Note: store handling with base is awkward. This part needs to be revisited.
    private setStoreState(): void {
        this.setState(this.getStoreState());
    }

    public getStoreState() {
        return this.store.getState();
    }

    protected createDataManager(): DataManager<S> {
        return new DataManager<S>();
    }

    protected createActions(): Actions {
        return new Actions();
    }

    protected createStore(): BaseStore<S> {
        return new BaseStore<S>(this.actions, this.dataManager.getInitialState() as S);
    }

    public componentDidMount(): void {
        this.store && this.store.addChangedListener(this.setStoreStateDelegate);
    }

    public componentWillUnmount(): void {
        this.store && this.store.removeChangedListener(this.setStoreStateDelegate);
    }
}