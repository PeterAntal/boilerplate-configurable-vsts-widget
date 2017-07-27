/// <reference types="vss-web-extension-sdk" />

import * as Q from 'q';
import * as React from 'react';

import { WitQueryEnumerator } from "./WitUtils";
import { QueryExpand, QueryHierarchyItem } from "TFS/WorkItemTracking/Contracts";
import * as FluxTypes from "./FluxTypes";

import { Store } from "VSS/Flux/Store";

export interface PickerProps<T> {
    itemValues: T[];
    initialSelectionId: string;

    getItemText: (T) => string;
    getItemId: (T) => string;
    onChange(item: T);
}

/** Facade for combo box implementation. */
export class Picker<T> extends React.Component<PickerProps<T>, {}> {
    selectedItem: T;
    public render(): JSX.Element {
        return (<select id="queryPicker" defaultValue={this.props.initialSelectionId} onChange={(event: React.FormEvent<HTMLSelectElement>) => this.onselected((event.target as any).selectedIndex)}>{this.getOptions()}</select>);
    }

    private getOptions() {
        let values = [];
        for (let i = 0; i < this.props.itemValues.length; i++) {
            let item = this.props.itemValues[i];
            let isSelected = false;
            values.push(<option key={i} value={this.props.getItemId(item)}>{this.props.getItemText(item)}</option>);
        }
        return values;
    }

    private onselected(index: number) {
        this.selectedItem = this.props.itemValues[index];
        if (this.props.onChange) {
            this.props.onChange(this.selectedItem);
        }
    }
}