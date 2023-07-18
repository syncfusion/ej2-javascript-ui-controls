import { CommentAction, HyperlinkType, ServerActionType, RevisionType, RevisionActionType } from './types';
import { DocumentEditor } from '../document-editor';
import { DocumentEditorContainer } from '../../document-editor-container';

/**
 * ServiceFailureArgs
 */
export interface ServiceFailureArgs {
    /** Status code of the service failure. */
    status: string
    /** Status text of the service failure. */
    statusText: string
    /** Service failed URL. */
    url: string
}
/**
 * @private
 */
export interface AutoResizeEventArgs {
    /**
     * Element to resize
     */
    element?: HTMLElement
    /**
     * Specifies whether event is canceled or not.
     */
    cancel?: boolean

}

/**
 * This event arguments provides the necessary information about form field fill event.
 */
export interface FormFieldFillEventArgs {
    /**
     * Specifies form field name.
     */
    fieldName?: string
    /**
     * Specifies form field value.
     */
    value?: string | boolean | number
    /**
     * Specifies whether form fill action is canceled or not.
     */
    isCanceled?: boolean
}

/**
 * Specified form field data
 */
export interface FormFieldData {
    /**
     * Specifies form field name.
     */
    fieldName: string
    /**
     * Specifies form field data.
     */
    value: string | boolean | number

}
/**
 * This event arguments provides the necessary information about documentChange event.
 */
export interface DocumentChangeEventArgs {
    /**
     * Specifies the source DocumentEditor instance which triggers this documentChange event.
     *
     * @deprecated
     */
    source: DocumentEditor
}
/**
 * This event arguments provides the necessary information about viewChange event.
 */
export interface ViewChangeEventArgs {
    /**
     * Specifies the page number that starts in the view port.
     */
    startPage: number
    /**
     * Specifies the page number that ends in the view port.
     */
    endPage: number
    /**
     * Specifies the source DocumentEditor instance which triggers this viewChange event.
     *
     * @deprecated
     */
    source: DocumentEditor
}
/**
 * This event arguments provides the necessary information about zoomFactorChange event.
 */
export interface ZoomFactorChangeEventArgs {
    /**
     * Specifies the source DocumentEditor instance which triggers this zoomFactorChange event.
     *
     * @deprecated
     */
    source: DocumentEditor
}
/**
 * This event arguments provides the necessary information about selectionChange event.
 */
export interface SelectionChangeEventArgs {
    /**
     * Specifies the source DocumentEditor instance which triggers this selectionChange event.
     *
     * @deprecated
     */
    source: DocumentEditor
    /**
     * Indicates whether the selection has been completed or not.
     */
    isCompleted: boolean
}
/**
 * This event arguments provides the necessary information about requestNavigate event.
 */
export interface RequestNavigateEventArgs {
    /**
     * Specifies the navigation link.
     */
    navigationLink: string
    /**
     * Specifies the link type.
     */
    linkType: HyperlinkType
    /**
     * Specifies the local reference if any.
     */
    localReference: string
    /**
     * Specifies whether the event is handled or not.
     */
    isHandled: boolean
    /**
     * Specifies the source DocumentEditor instance which triggers this requestNavigate event.
     *
     * @deprecated
     */
    source: DocumentEditor
}
/**
 * This event arguments provides the necessary information about contentChange event.
 */
export interface ContentChangeEventArgs {
    /**
     * Specifies the source DocumentEditor instance which triggers this contentChange event.
     *
     * @deprecated
     */
    source: DocumentEditor
}
/**
 * This event arguments provides the necessary information about key down event.
 */
export interface DocumentEditorKeyDownEventArgs {
    /**
     * Key down event argument
     */
    event: KeyboardEvent
    /**
     * Specifies whether the event is handled or not
     */
    isHandled: boolean
    /**
     * Specifies the source DocumentEditor instance which triggers this key down event.
     *
     * @deprecated
     */
    source: DocumentEditor
}

/**
 * This event arguments provides the necessary information about searchResultsChange event.
 */
export interface SearchResultsChangeEventArgs {
    /**
     * Specifies the source DocumentEditor instance which triggers this searchResultsChange event.
     *
     * @deprecated
     */
    source: DocumentEditor
}

/**
 * This event arguments provides the necessary information about customContentMenu event.
 */
export interface CustomContentMenuEventArgs {
    /**
     * Specifies the id of selected custom context menu item.
     */
    id: string
}
/**
 * This event arguments provides the necessary information about BeforeOpenCloseCustomContentMenu event.
 */
export interface BeforeOpenCloseCustomContentMenuEventArgs {
    /**
     * Specifies the array of added custom context menu item ids.
     */
    ids: string[]
}
/**
 * This event args provides the necessary information about comment delete.
 */
export interface CommentDeleteEventArgs {
    /**
     * Comment author.
     */
    author: string
    /**
     * Specifies whether the event is canceled or not.
     */
    cancel: boolean
}
/**
 * This event args provides the necessary information about the revision action.
 */
export interface RevisionActionEventArgs  {
    /**
     * Specifies the author of the revision.
     */
    author: string
    /**
     * Specifies whether the action is canceled or not.
     */
    cancel: boolean
    /**
     * Specifies the revision type.
     */
    revisionType: RevisionType
    /**
     * Specifies the current action type.
     */
    actionType: RevisionActionType
}
/**
 * This event args provides the necessary information about comment actions.
 */
export interface CommentActionEventArgs {
    /**
     * Comment author.
     */
    author: string
    /**
     * Specifies whether the event is canceled or not.
     */
    cancel: boolean
    /**
     * Specifies the comment action type.
     */
    type: CommentAction
}
export interface BeforeFileOpenArgs {
    /**
     * The size of opened file in bytes.
     */
    fileSize: number
    /**
     * Specifies file open is canceled.
     */
    isCanceled?: boolean
}
/**
 * This event args provides the necessary information about track change.
 */
export interface TrackChangeEventArgs {
    /**
     * Specifies whether the track changes enabled or not.
     */
    isTrackChangesEnabled: boolean
}




/**
 * This event arguments provides the necessary information about onBeforePane switch.
 */
export interface BeforePaneSwitchEventArgs {
    /**
     * Specifies current pane type.
     */
    type: string
}

/**
 * This event arguments provides the necessary information about DocumentEditorContainer's contentChange event.
 */
export interface ContainerContentChangeEventArgs {
    /**
     * Specifies the source DocumentEditorContainer instance which triggers this contentChange event.
     *
     * @deprecated
     */
    source: DocumentEditorContainer
}

/**
 * This event arguments provides the necessary information about DocumentEditorContainer's selectionChange event.
 */
export interface ContainerSelectionChangeEventArgs {
    /**
     * Specifies the source DocumentEditorContainer instance which triggers this selectionChange event.
     *
     * @deprecated
     */
    source: DocumentEditorContainer
    /**
     * Indicates whether the selection has been completed or not.
     */
    isCompleted: boolean
}
/**
 * This event arguments provides the necessary information about DocumentEditorContainer's documentChange event.
 */
export interface ContainerDocumentChangeEventArgs {
    /**
     * Specifies the source DocumentEditorContainer instance which triggers this documentChange event.
     *
     * @deprecated
     */
    source: DocumentEditorContainer
}
/**
 * Defines customized toolbar items.
 */
export interface CustomToolbarItemModel {
    /**
     * Defines single/multiple classes separated by space used to specify an icon for the button.
     * The icon will be positioned before the text content if text is available, otherwise the icon alone will be rendered.
     *
     * @default ""
     */
    prefixIcon?: string
    /**
     * Specifies the text to be displayed on the Toolbar button.
     *
     * @default ""
     */
    tooltipText?: string
    /**
     * Specifies the unique ID to be used with button or input element of Toolbar items.
     *
     * @default ""
     */
    id?: string
    /**
     * Specifies the text to be displayed on the Toolbar button.
     *
     * @default ""
     */
    text?: string
    /**
     * Defines single/multiple classes (separated by space) to be used for customization of commands.
     *
     * @default ""
     */
    cssClass?: string
}
/**
 * Defines the XMLHttpRequest customization properties
 */
export interface XmlHttpRequestEventArgs {
    /**
     * Gets the type of server action that is to be triggered.
     *
     * @default undefined
     * @returns {ServerActionType}
     */
    serverActionType: ServerActionType
    /**
     * Gets or sets a value indicating whether to enable or disable withCredentials property of XMLHttpRequest object.
     *
     * @default false
     * @returns {boolean}
     */
    withCredentials: boolean
    /**
     * Gets or sets the collection of custom headers to set in the XMLHttpRequest object.
     *
     * @default undefined
     * @returns {object[]}
     */
    headers: object[]
    /**
     * Gets or sets the timeout to set in the XMLHttpRequest object. It denotes number of milliseconds a request can take before automatically being terminated. The default value is 0, which means there is no timeout.
     *
     * @default 0
     * @returns {number}
     */
    timeout: number
    /**
     * Gets or sets a value indicating whether this server request has been canceled.
     *
     * @default false
     * @returns {boolean}
     */
    cancel: boolean
    /**
     * Gets the clipboard data which is to be converted as SFDT in the server-side.
     *
     * @default undefined
     * @returns {object}
     */
    clipboardData?: object
}
