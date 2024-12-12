import { Component, Property, INotifyPropertyChanged, NotifyPropertyChanges, ModuleDeclaration, L10n, Complex, isNullOrUndefined, formatUnit } from '@syncfusion/ej2-base';import { Event, EmitType } from '@syncfusion/ej2-base';import { Toolbar } from './tool-bar/tool-bar';import { DocumentEditor, DocumentEditorSettings, DocumentSettings } from '../document-editor/document-editor';import { HeaderFooterProperties } from './properties-pane/header-footer-pane';import { ImageProperties } from './properties-pane/image-properties-pane';import { TocProperties } from './properties-pane/table-of-content-pane';import { TableProperties } from './properties-pane/table-properties-pane';import { StatusBar } from './properties-pane/status-bar';import { ViewChangeEventArgs, RequestNavigateEventArgs, ContainerContentChangeEventArgs, ContainerSelectionChangeEventArgs, ContainerDocumentChangeEventArgs, CustomContentMenuEventArgs, BeforeOpenCloseCustomContentMenuEventArgs, BeforePaneSwitchEventArgs, LayoutType, CommentDeleteEventArgs, RevisionActionEventArgs, ServiceFailureArgs, CommentActionEventArgs, XmlHttpRequestEventArgs } from '../document-editor/base';import { createSpinner } from '@syncfusion/ej2-popups';import { ContainerServerActionSettingsModel, DocumentEditorModel, DocumentEditorSettingsModel, DocumentSettingsModel, FormFieldSettingsModel } from '../document-editor/document-editor-model';import { CharacterFormatProperties, ParagraphFormatProperties, SectionFormatProperties } from '../document-editor/implementation';import { ToolbarItem } from '../document-editor/base/types';import { CustomToolbarItemModel, TrackChangeEventArgs, AutoResizeEventArgs, ContentChangeEventArgs } from '../document-editor/base/events-helper';import { ClickEventArgs } from '@syncfusion/ej2-navigations';import { beforeAutoResize, internalAutoResize, internalZoomFactorChange, beforeCommentActionEvent, commentDeleteEvent, contentChangeEvent, trackChangeEvent, beforePaneSwitchEvent, serviceFailureEvent, documentChangeEvent, selectionChangeEvent, customContextMenuSelectEvent, customContextMenuBeforeOpenEvent, internalviewChangeEvent, beforeXmlHttpRequestSend, protectionTypeChangeEvent, internalDocumentEditorSettingsChange, internalStyleCollectionChange, revisionActionEvent, trackChanges, internalOptionPaneChange } from '../document-editor/base/constants';import { HelperMethods } from '../index';import { SanitizeHtmlHelper } from '@syncfusion/ej2-base';import { DialogUtility } from '@syncfusion/ej2-popups';import { Text } from './properties-pane/text-properties';
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
     * Enable or disable the toolbar in document editor container.
     *
     * @default true
     */
    enableToolbar?: boolean;

    /**
     * Specifies the restrict editing operation.
     *
     * @default false
     */
    restrictEditing?: boolean;

    /**
     * Enable or disable the spell checker in document editor container.
     *
     * @default false
     */
    enableSpellCheck?: boolean;

    /**
     * Enable or disable the track changes in document editor container.
     *
     * @default false
     */
    enableTrackChanges?: boolean;

    /**
     * Gets or sets the Layout Type.
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
     * > If the visibility of text affected due this highlight color matching with random color applied for the track changes, then modify the color value of this property to resolve text visibility problem.
     *
     * @default '#FFFF00'
     */
    userColor?: string;

    /**
     * Enables the local paste.
     *
     * @default false
     */
    enableLocalPaste?: boolean;

    /**
     * Gets or sets the Sfdt service URL.
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
     * Enables the rendering with strict Content Security policy.
     */
    enableCsp?: boolean;

    /**
     * Gets or sets a value indicating whether comment is enabled or not
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
     * Gets or sets a value indicating whether the automatic focus behavior is enabled for Document editor or not.
     *
     * > By default, the Document editor gets focused automatically when the page loads. If you want the Document editor not to be focused automatically, then set this property to false.
     *
     * @returns {boolean}
     * @aspType bool
     * @default true
     */
    enableAutoFocus?: boolean;

    /**
     * Enables the partial lock and edit module.
     *
     * @default false
     */
    enableLockAndEdit?: boolean;

    /**
     * Gets or sets a value indicating whether to start automatic resize with the specified time interval and iteration count.
     *
     * > * Resize action triggers automatically for the specified number of iterations, or till the parent element's height and width is non-zero.
     *
     * > * If the parent element's height and width is zero even in the last iteration, then the default height and width (200) is allocated for the Document editor.
     *
     * @default false
     * @returns {boolean}
     */
    autoResizeOnVisibilityChange?: boolean;

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
     * Triggers before accepting or rejecting changes.
     *
     * @event beforeAcceptRejectChanges
     */
    beforeAcceptRejectChanges?: EmitType<RevisionActionEventArgs>;

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
     * Triggers before a server request is started, allows you to modify the XMLHttpRequest object (setting additional headers, if needed).
     */
    beforeXmlHttpRequestSend?: EmitType<XmlHttpRequestEventArgs>;

    /**
     * Defines the settings for DocumentEditor customization.
     *
     * @default {}
     */
    documentEditorSettings?: DocumentEditorSettingsModel;

    /**
     * Gets the settings and properties of the document that is opened in Document editor component.
     *
     * @default {}
     */
    documentSettings?: DocumentSettingsModel;

    /**
     * Defines the settings of the DocumentEditorContainer service.
     */
    serverActionSettings?: ContainerServerActionSettingsModel;

    /**
     * Defines toolbar items for DocumentEditorContainer.
     *
     * @default ['New','Open','Separator','Undo','Redo','Separator','Image','Table','Hyperlink','Bookmark','TableOfContents','Separator','Header','Footer','PageSetup','PageNumber','Break','InsertFootnote','InsertEndnote','Separator','Find','Separator','Comments','TrackChanges','LocalClipboard','RestrictEditing','Separator','FormFields','UpdateFields','ContentControl','XML Mapping']
     */
    toolbarItems?: (CustomToolbarItemModel | ToolbarItem)[];

    /**
     * Adds the custom headers to XMLHttpRequest.
     *
     * @default []
     */
    headers?: object[];

}