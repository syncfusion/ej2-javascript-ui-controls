import { HyperlinkType } from './types';
import { DocumentEditor } from '../document-editor';

/** 
 * This event arguments provides the necessary information about documentChange event.
 */
export interface DocumentChangeEventArgs {
    /**
     * Specifies the source DocumentEditor instance which triggers this documentChange event.
     */
    source: DocumentEditor;
}
/**
 * This event arguments provides the necessary information about viewChange event.
 */
export interface ViewChangeEventArgs {
    /**
     * Specifies the page number that starts in the view port.
     */
    startPage: number;
    /**
     * Specifies the page number that ends in the view port.
     */
    endPage: number;
    /**
     * Specifies the source DocumentEditor instance which triggers this viewChange event.
     */
    source: DocumentEditor;
}
/** 
 * This event arguments provides the necessary information about zoomFactorChange event.
 */
export interface ZoomFactorChangeEventArgs {
    /**
     * Specifies the source DocumentEditor instance which triggers this zoomFactorChange event.
     */
    source: DocumentEditor;
}
/** 
 * This event arguments provides the necessary information about selectionChange event.
 */
export interface SelectionChangeEventArgs {
    /**
     * Specifies the source DocumentEditor instance which triggers this selectionChange event.
     */
    source: DocumentEditor;
}
/** 
 * This event arguments provides the necessary information about requestNavigate event.
 */
export interface RequestNavigateEventArgs {
    /**
     * Specifies the navigation link.
     */
    navigationLink: string;
    /**
     * Specifies the link type.
     */
    linkType: HyperlinkType;
    /**
     * Specifies the local reference if any.
     */
    localReference: string;
    /**
     * Specifies whether the event is handled or not.
     */
    isHandled: boolean;
    /**
     * Specifies the source DocumentEditor instance which triggers this requestNavigate event.
     */
    source: DocumentEditor;
}
/** 
 * This event arguments provides the necessary information about contentChange event.
 */
export interface ContentChangeEventArgs {
    /**
     * Specifies the source DocumentEditor instance which triggers this contentChange event.
     */
    source: DocumentEditor;
}
/** 
 * This event arguments provides the necessary information about key down event.
 */
export interface DocumentEditorKeyDownEventArgs {
    /**
     * Key down event argument 
     */
    event: KeyboardEvent;
    /**
     * Specifies whether the event is handled or not
     */
    isHandled: boolean;
    /**
     * Specifies the source DocumentEditor instance which triggers this key down event.
     */
    source: DocumentEditor;
}

/**
 * This event arguments provides the necessary information about searchResultsChange event.
 */
export interface SearchResultsChangeEventArgs {
    /**
     * Specifies the source DocumentEditor instance which triggers this searchResultsChange event.
     */
    source: DocumentEditor;
}