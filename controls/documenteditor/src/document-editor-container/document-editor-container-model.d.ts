import { Component, Property, INotifyPropertyChanged, NotifyPropertyChanges, ModuleDeclaration, L10n } from '@syncfusion/ej2-base';import { Event, EmitType } from '@syncfusion/ej2-base';import { Toolbar } from './tool-bar/tool-bar';import { DocumentEditor } from '../document-editor/document-editor';import { TextProperties } from './properties-pane/text-properties-pane';import { HeaderFooterProperties } from './properties-pane/header-footer-pane';import { ImageProperties } from './properties-pane/image-properties-pane';import { TocProperties } from './properties-pane/table-of-content-pane';import { TableProperties } from './properties-pane/table-properties-pane';import { StatusBar } from './properties-pane/status-bar';import { ViewChangeEventArgs, RequestNavigateEventArgs } from '../document-editor/base';import { createSpinner } from '@syncfusion/ej2-popups';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class DocumentEditorContainer
 */
export interface DocumentEditorContainerModel extends ComponentModel{

    /**
     * Show or hide properties pane.
     */
    showPropertiesPane?: boolean;

    /**
     * Enable or disable toolbar in document editor container.
     */
    enableToolbar?: boolean;

    /**
     * Restrict editing operation.
     */
    restrictEditing?: boolean;

    /**
     * Enable local paste
     */
    enableLocalPaste?: boolean;

    /**
     * Sfdt service URL.
     */
    serviceUrl?: string;

    /**
     * Triggers when the component is created
     * @event
     */
    created?: EmitType<Object>;

    /**
     * Triggers when the component is destroyed.
     * @event
     */
    destroyed?: EmitType<Object>;

}