import { Component, Property, INotifyPropertyChanged, NotifyPropertyChanges, ModuleDeclaration, L10n, isBlazor } from '@syncfusion/ej2-base';import { Event, EmitType } from '@syncfusion/ej2-base';import { Toolbar } from './tool-bar/tool-bar';import { DocumentEditor } from '../document-editor/document-editor';import { TextProperties } from './properties-pane/text-properties-pane';import { HeaderFooterProperties } from './properties-pane/header-footer-pane';import { ImageProperties } from './properties-pane/image-properties-pane';import { TocProperties } from './properties-pane/table-of-content-pane';import { TableProperties } from './properties-pane/table-properties-pane';import { StatusBar } from './properties-pane/status-bar';import { ViewChangeEventArgs, RequestNavigateEventArgs, ContainerContentChangeEventArgs, ContainerSelectionChangeEventArgs, ContainerDocumentChangeEventArgs, CustomContentMenuEventArgs, BeforeOpenCloseCustomContentMenuEventArgs, BeforePaneSwitchEventArgs } from '../document-editor/base';import { createSpinner } from '@syncfusion/ej2-popups';import { ContainerServerActionSettingsModel } from '../document-editor/document-editor-model';import { CharacterFormatProperties, ParagraphFormatProperties, SectionFormatProperties } from '../document-editor/implementation';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class DocumentEditorContainer
 */
export interface DocumentEditorContainerModel extends ComponentModel{

    /**
     * Show or hide properties pane.
     * @default true
     */
    showPropertiesPane?: boolean;

    /**
     * Enable or disable toolbar in document editor container.
     * @default true
     */
    enableToolbar?: boolean;

    /**
     * Restrict editing operation.
     * @default false
     */
    restrictEditing?: boolean;

    /**
     * Enable or disable spell checker in document editor container.
     * @default false
     */
    enableSpellCheck?: boolean;

    /**
     * Enable local paste
     * @default false
     */
    enableLocalPaste?: boolean;

    /**
     * Sfdt service URL.
     * @default ''
     */
    serviceUrl?: string;

    /**
     * Specifies the z-order for rendering that determines whether the dialog is displayed in front or behind of another component.
     * @default 2000
     * @aspType int
     */
    zIndex?: number;

    /**
     * Enable rendering with strict Content Security policy.
     */
    enableCsp?: boolean;

    /**
     * Gets or set a value indicating whether comment is enabled or not
     * @default false
     */
    enableComment?: boolean;

    /**
     * Triggers when the component is created
     * @event
     * @blazorproperty 'Created'
     */
    created?: EmitType<Object>;

    /**
     * Triggers when the component is destroyed.
     * @event
     * @blazorproperty 'Destroyed'
     */
    destroyed?: EmitType<Object>;

    /**
     * Triggers whenever the content changes in the document editor container.
     * @event
     * @blazorproperty 'ContentChanged'
     */
    contentChange?: EmitType<ContainerContentChangeEventArgs>;

    /**
     * Triggers whenever selection changes in the document editor container.
     * @event
     * @blazorproperty 'SelectionChanged'
     */
    selectionChange?: EmitType<ContainerSelectionChangeEventArgs>;

    /**
     * Triggers whenever document changes in the document editor container.
     * @event
     * @blazorproperty 'DocumentChanged'
     */
    documentChange?: EmitType<ContainerDocumentChangeEventArgs>;

    /**
     * Triggers while selecting the custom context-menu option.
     * @event
     * @blazorproperty 'ContextMenuItemSelected'
     */
    customContextMenuSelect?: EmitType<CustomContentMenuEventArgs>;

    /**
     * Triggers before opening the custom context-menu option.
     * @event
     * @blazorproperty 'OnContextMenuOpen'
     */
    customContextMenuBeforeOpen?: EmitType<BeforeOpenCloseCustomContentMenuEventArgs>;

    /**
     * Trigger before switching panes in DocumentEditor.
     * @event
     * @blazorproperty 'BeforePaneSwitch'
     */
    beforePaneSwitch?: EmitType<BeforePaneSwitchEventArgs>;

    /**
     * Defines the settings of the DocumentEditorContainer service.
     */
    // tslint:disable-next-line:max-line-length
    serverActionSettings?: ContainerServerActionSettingsModel;

    /**
     * Add custom headers to XMLHttpRequest.
     * @default []
     */
    headers?: object[];

}