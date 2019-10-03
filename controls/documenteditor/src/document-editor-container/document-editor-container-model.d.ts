import { Component, Property, INotifyPropertyChanged, NotifyPropertyChanges, ModuleDeclaration, L10n, isBlazor } from '@syncfusion/ej2-base';import { Event, EmitType } from '@syncfusion/ej2-base';import { Toolbar } from './tool-bar/tool-bar';import { DocumentEditor } from '../document-editor/document-editor';import { TextProperties } from './properties-pane/text-properties-pane';import { HeaderFooterProperties } from './properties-pane/header-footer-pane';import { ImageProperties } from './properties-pane/image-properties-pane';import { TocProperties } from './properties-pane/table-of-content-pane';import { TableProperties } from './properties-pane/table-properties-pane';import { StatusBar } from './properties-pane/status-bar';import { ViewChangeEventArgs, RequestNavigateEventArgs, ContainerContentChangeEventArgs, ContainerSelectionChangeEventArgs, ContainerDocumentChangeEventArgs, CustomContentMenuEventArgs, BeforeOpenCloseCustomContentMenuEventArgs } from '../document-editor/base';import { createSpinner } from '@syncfusion/ej2-popups';import { ContainerServerActionSettingsModel } from '../document-editor/document-editor-model';import { CharacterFormatProperties, ParagraphFormatProperties } from '../document-editor/implementation';
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
     * Enable or disable spell checker in document editor container.

     */
    enableSpellCheck?: boolean;

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

    /**
     * Triggers whenever the content changes in the document editor container.
     * @event

     */
    contentChange?: EmitType<ContainerContentChangeEventArgs>;

    /**
     * Triggers whenever selection changes in the document editor container.
     * @event

     */
    selectionChange?: EmitType<ContainerSelectionChangeEventArgs>;

    /**
     * Triggers whenever document changes in the document editor container.
     * @event

     */
    documentChange?: EmitType<ContainerDocumentChangeEventArgs>;

    /**
     * Triggers while selecting the custom context-menu option.
     * @event

     */
    customContextMenuSelect?: EmitType<CustomContentMenuEventArgs>;

    /**
     * Triggers before opening the custom context-menu option.
     * @event

     */
    customContextMenuBeforeOpen?: EmitType<BeforeOpenCloseCustomContentMenuEventArgs>;

    /**
     * Defines the settings of the DocumentEditorContainer service.
     */
    // tslint:disable-next-line:max-line-length
    serverActionSettings?: ContainerServerActionSettingsModel;

}