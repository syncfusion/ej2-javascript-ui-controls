import { ChildProperty, Property } from '@syncfusion/ej2-base';

/**
 * Interface for a class LinkSettings
 */
export interface LinkSettingsModel {

    /**
     * Specifies whether pasting a URL over selected text converts it into a link.
     *
     * @default true
     */
    linkOnPaste?: boolean;

    /**
     * Specifies the default target for newly created links.
     * Possible values: `''`, `'_self'`, `'_blank'`, `'_parent'`, `'_top'`.
     *
     * @default '_blank'
     */
    defaultTarget?: string;

    /**
     * Specifies whether to automatically prepend a protocol (such as `https://`)
     * to URLs that do not contain one.
     *
     * @default true
     */
    autoPrependProtocol?: boolean;

    /**
     * Specifies the protocol to prepend when `autoPrependProtocol` is enabled
     * and the URL lacks a protocol.
     *
     * @default 'https'
     */
    defaultProtocol?: string;

    /**
     * Specifies the list of allowed protocols for link URLs.
     * URLs with a protocol outside this list are rejected.
     * Relative URLs, query strings, and fragments skip this validation.
     *
     * @default ['http', 'https', 'mailto', 'tel']
     */
    allowedProtocols?: string[];

}