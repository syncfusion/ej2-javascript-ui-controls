import { BaseEventArgs, Draggable } from '@syncfusion/ej2-base';
import { SfKanban } from './kanban';
import { SelectionType, SortDirection, SortOrderBy } from './type';

/**
 * Kanban Interfaces
 */

export interface BlazorKanbanElement extends HTMLElement {
    blazor__instance: SfKanban;
}

export interface Instance extends HTMLElement {
    ej2_instances: Object[];
}

export interface Columns {
    keyField: string;
    headerText: string;
    template: string;
    allowToggle: boolean;
    isExpanded: boolean;
    minCount: number;
    maxCount: number;
    showItemCount: boolean;
    showAddButton: boolean;
}

export interface CardSettings {
    showHeader: boolean;
    headerField: string;
    contentField: string;
    tagsField: string;
    grabberField: string;
    footerCssField: string;
    template: string;
    selectionType: SelectionType;
}

export interface SwimlaneSettings {
    keyField: string;
    textField: string;
    showEmptyRow: boolean;
    showItemCount: boolean;
    allowDragAndDrop: boolean;
    template: string;
    sortDirection: SortDirection;
    showUnassignedRow: boolean;
}

export interface SortSettings {
    sortBy: SortOrderBy;
    field: string;
    direction: SortDirection;
}

export interface DragArgs extends BaseEventArgs {
    element?: HTMLElement;
    cloneElement?: HTMLElement;
    targetClone?: HTMLElement;
    draggedClone?: HTMLElement;
    targetCloneMulti?: HTMLElement;
    selectedCards?: HTMLElement | HTMLElement[];
    instance?: Draggable;
    pageX?: number;
    pageY?: number;
    navigationInterval?: number;
    cardDetails?: { [key: string]: Object }[];
    modifiedData?: { [key: string]: Object }[];
}

export interface DragEventArgs extends BaseEventArgs {
    element: HTMLElement | HTMLElement[];
    data: { [key: string]: Object }[];
    event: MouseEvent;
    cancel?: boolean;
}

export interface ScrollPosition {
    content: ScrollOffset;
    column: { [key: string]: ScrollOffset };
}

export interface ScrollOffset {
    left?: number;
    top?: number;
}