import { Component, Property, INotifyPropertyChanged, NotifyPropertyChanges, ModuleDeclaration, L10n, Complex, isNullOrUndefined, formatUnit } from '@syncfusion/ej2-base';import { Event, EmitType } from '@syncfusion/ej2-base';import { Toolbar } from './tool-bar/tool-bar';import { DocumentEditor, DocumentEditorSettings } from '../document-editor/document-editor';import { TextProperties } from './properties-pane/text-properties-pane';import { HeaderFooterProperties } from './properties-pane/header-footer-pane';import { ImageProperties } from './properties-pane/image-properties-pane';import { TocProperties } from './properties-pane/table-of-content-pane';import { TableProperties } from './properties-pane/table-properties-pane';import { StatusBar } from './properties-pane/status-bar';import { ViewChangeEventArgs, RequestNavigateEventArgs, ContainerContentChangeEventArgs, ContainerSelectionChangeEventArgs, ContainerDocumentChangeEventArgs, CustomContentMenuEventArgs, BeforeOpenCloseCustomContentMenuEventArgs, BeforePaneSwitchEventArgs, LayoutType, CommentDeleteEventArgs, ServiceFailureArgs, CommentActionEventArgs, XmlHttpRequestEventArgs } from '../document-editor/base';import { createSpinner } from '@syncfusion/ej2-popups';import { ContainerServerActionSettingsModel, DocumentEditorSettingsModel, FormFieldSettingsModel } from '../document-editor/document-editor-model';import { CharacterFormatProperties, ParagraphFormatProperties, SectionFormatProperties } from '../document-editor/implementation';import { ToolbarItem } from '../document-editor/base/types';import { CustomToolbarItemModel, TrackChangeEventArgs } from '../document-editor/base/events-helper';import { ClickEventArgs } from '@syncfusion/ej2-navigations';import { internalZoomFactorChange, beforeCommentActionEvent, commentDeleteEvent, contentChangeEvent, trackChangeEvent, beforePaneSwitchEvent, serviceFailureEvent, documentChangeEvent, selectionChangeEvent, customContextMenuSelectEvent, customContextMenuBeforeOpenEvent, internalviewChangeEvent, beforeXmlHttpRequestSend } from '../document-editor/base/constants';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class DocumentEditorContainer
 */
export interface DocumentEditorContainerModel extends ComponentModel{

    /**
     * Show or hide properties pane.
     *
     * @default true
     */
    showPropertiesPane?: boolean;

    /**
     * Enable or disable toolbar in document editor container.
     *
     * @default true
     */
    enableToolbar?: boolean;

    /**
     * Restrict editing operation.
     *
     * @default false
     */
    restrictEditing?: boolean;

    /**
     * Enable or disable spell checker in document editor container.
     *
     * @default false
     */
    enableSpellCheck?: boolean;

    /**
     * Enable or disable track changes in document editor container.
     *
     * @default false
     */
    enableTrackChanges?: boolean;

    /**
     * Layout Type
     *
     * @default Pages
     */
    layoutType?: LayoutType;

    /**
     * Gets or sets the current user.
     *
     * @default ''
     */
    currentUser?: string;

    /**
     * Gets or sets the color used for highlighting the editable ranges or regions of the `currentUser` in Document Editor. The default value is "#FFFF00".
     * Remarks: If the visibility of text affected due this highlight color matching with random color applied for the track changes, then modify the color value of this property to resolve text visibility problem.
     *
     * @default '#FFFF00'
     */
    userColor?: string;

    /**
     * Enable local paste
     *
     * @default false
     */
    enableLocalPaste?: boolean;

    /**
     * Sfdt service URL.
     *
     * @default ''
     */
    serviceUrl?: string;

    /**
     * Specifies the z-order for rendering that determines whether the dialog is displayed in front or behind of another component.
     *
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
     *
     * @default true
     */
    enableComment?: boolean;

    /**
     * Defines the width of the DocumentEditorContainer component
     *
     * @default '100%'
     */
    width?: string;

    /**
     * Defines the height of the DocumentEditorContainer component
     *
     * @default '320px'
     */
    height?: string;

    /**
     * Enable partial lock and edit module.
     *
     * @default false
     */
    enableLockAndEdit?: boolean;

    /**
     * Triggers when the component is created
     *
     * @event created
     */
    created?: EmitType<Object>;

    /**
     * Triggers when the component is destroyed.
     *
     * @event destroyed
     */
    destroyed?: EmitType<Object>;

    /**
     * Triggers whenever the content changes in the document editor container.
     *
     * @event contentChange
     */
    contentChange?: EmitType<ContainerContentChangeEventArgs>;

    /**
     * Triggers whenever selection changes in the document editor container.
     *
     * @event selectionChange
     */
    selectionChange?: EmitType<ContainerSelectionChangeEventArgs>;

    /**
     * Triggers whenever document changes in the document editor container.
     *
     * @event documentChange
     */
    documentChange?: EmitType<ContainerDocumentChangeEventArgs>;

    /**
     * Triggers when toolbar item is clicked.
     *
     * @event toolbarClick
     */
    toolbarClick?: EmitType<ClickEventArgs>;

    /**
     * Triggers while selecting the custom context-menu option.
     *
     * @event customContextMenuSelect
     */
    customContextMenuSelect?: EmitType<CustomContentMenuEventArgs>;

    /**
     * Triggers before opening the custom context-menu option.
     *
     * @event customContextMenuBeforeOpen
     */
    customContextMenuBeforeOpen?: EmitType<BeforeOpenCloseCustomContentMenuEventArgs>;

    /**
     * Trigger before switching panes in DocumentEditor.
     *
     * @event beforePaneSwitch
     */
    beforePaneSwitch?: EmitType<BeforePaneSwitchEventArgs>;

    /**
     * Triggers on deleting a comment.
     *
     * @event commentDelete
     */
    commentDelete?: EmitType<CommentDeleteEventArgs>;

    /**
     * Triggers on comment actions(Post, edit, reply, resolve, reopen).
     *
     * @event beforeCommentAction
     */
    beforeCommentAction?: EmitType<CommentActionEventArgs>;

    /**
     * Triggers when the server action fails.
     *
     * @event serviceFailure
     */
    serviceFailure?: EmitType<ServiceFailureArgs>;

    /**
     * Triggers Keyboard shortcut of TrackChanges.
     *
     * @event trackChange
     */
    trackChange?: EmitType<TrackChangeEventArgs>;

    /**
     * Triggers when user interaction prevented in content control.
     *
     * @event contentControl
     */
    contentControl?: EmitType<Object>;

    /**
     * This event is triggered before a server request is started, allows you to modify the XMLHttpRequest object (setting additional headers, if needed).
     */
    beforeXmlHttpRequestSend?: EmitType<XmlHttpRequestEventArgs>;

    /**
     * Defines the settings for DocumentEditor customization.
     *
     * @default {}
     */
    documentEditorSettings?: DocumentEditorSettingsModel;

    /**
     * Defines the settings of the DocumentEditorContainer service.
     */
    serverActionSettings?: ContainerServerActionSettingsModel;

    /**
     * Defines toolbar items for DocumentEditorContainer.
     *
     * @default ['New','Open','Separator','Undo','Redo','Separator','Image','Table','Hyperlink','Bookmark','TableOfContents','Separator','Header','Footer','PageSetup','PageNumber','Break','InsertFootnote','InsertEndnote','Separator','Find','Separator','Comments','TrackChanges','LocalClipboard','RestrictEditing','Separator','FormFields','UpdateFields']
     */
    toolbarItems?: (CustomToolbarItemModel | ToolbarItem)[];

    /**
     * Add custom headers to XMLHttpRequest.
     *
     * @default []
     */
    headers?: object[];

}