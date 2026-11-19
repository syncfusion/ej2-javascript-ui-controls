/**
 * Collaborative Editing Handler for PDF Viewer
 *
 * This module encapsulates all collaboration logic at the source level,
 * following the same pattern as Spreadsheet's collaborativeEditingModule.
 *
 * Responsibilities:
 * - Manage room information and version tracking
 * - Route local operations (annotations, form fields, page organizer)
 * - Send operations to collaboration service
 * - Apply remote operations from other collaborators
 * - Handle echo detection for sent operations
 * - Delegate to appropriate viewer modules for apply/export
 */

import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { PdfViewer } from '../pdfviewer';
import { FormFieldModel } from '../pdfviewer-model';

interface CollaborationBounds {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    X?: number;
    Y?: number;
    Width?: number;
    Height?: number;
}

/**
 * Custom data of a form field. It holds the user-defined properties and the collaboration id.
 */
interface CustomData {
    collaborationId?: string;
    [key: string]: unknown;
}

/**
 * Form field properties used to build the collaboration id.
 */
interface CollaborationField extends FormFieldModel {
    pageIndex?: number;
    formFieldAnnotationType?: string;
}

/**
 * Synchronous SHA-256. crypto.subtle.digest is async and unavailable under the
 * ES5 compile target, but collaboration ids are assigned on the render path.
 * The constants and rounds match FIPS 180-4 so every client gets the same digest.
 *
 * @param {string} value - UTF-8 input
 * @returns {string} Lowercase hex digest
 * @hidden
 */
export function sha256(value: string): string {
    const k: number[] = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];
    const bytes: number[] = utf8Bytes(value);
    const bitLength: number = bytes.length * 8;
    bytes.push(0x80);
    while ((bytes.length % 64) !== 56) {
        bytes.push(0);
    }
    for (let shift: number = 56; shift >= 0; shift -= 8) {
        bytes.push((Math.floor(bitLength / Math.pow(2, shift))) & 0xff);
    }
    const h: number[] = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    const w: number[] = [];
    for (let offset: number = 0; offset < bytes.length; offset += 64) {
        for (let i: number = 0; i < 16; i++) {
            const index: number = offset + i * 4;
            // eslint-disable-next-line security/detect-object-injection
            w[i] = ((bytes[index] << 24) | (bytes[index + 1] << 16) | (bytes[index + 2] << 8) | bytes[index + 3]) >>> 0;
        }
        for (let i: number = 16; i < 64; i++) {
            const s0: number = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
            const s1: number = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
            // eslint-disable-next-line security/detect-object-injection
            w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
        }
        let a: number = h[0];
        let b: number = h[1];
        let c: number = h[2];
        let d: number = h[3];
        let e: number = h[4];
        let f: number = h[5];
        let g: number = h[6];
        let hh: number = h[7];
        for (let i: number = 0; i < 64; i++) {
            const s1: number = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
            const ch: number = (e & f) ^ (~e & g);
            // eslint-disable-next-line security/detect-object-injection
            const temp1: number = (hh + s1 + ch + k[i] + w[i]) >>> 0;
            const s0: number = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
            const maj: number = (a & b) ^ (a & c) ^ (b & c);
            const temp2: number = (s0 + maj) >>> 0;
            hh = g;
            g = f;
            f = e;
            e = (d + temp1) >>> 0;
            d = c;
            c = b;
            b = a;
            a = (temp1 + temp2) >>> 0;
        }
        h[0] = (h[0] + a) >>> 0;
        h[1] = (h[1] + b) >>> 0;
        h[2] = (h[2] + c) >>> 0;
        h[3] = (h[3] + d) >>> 0;
        h[4] = (h[4] + e) >>> 0;
        h[5] = (h[5] + f) >>> 0;
        h[6] = (h[6] + g) >>> 0;
        h[7] = (h[7] + hh) >>> 0;
    }
    let hex: string = '';
    for (let i: number = 0; i < h.length; i++) {
        // eslint-disable-next-line security/detect-object-injection
        hex += toHex(h[i]);
    }
    return hex;
}

/**
 * @param {number} value - 32-bit value
 * @param {number} bits - Rotation count
 * @returns {number} Rotated value
 * @hidden
 */
function rotr(value: number, bits: number): number {
    return (value >>> bits) | (value << (32 - bits));
}

/**
 * Encodes a string as UTF-8 bytes without TextEncoder.
 *
 * @param {string} value - Input string
 * @returns {number[]} Byte values
 * @hidden
 */
function utf8Bytes(value: string): number[] {
    const bytes: number[] = [];
    for (let i: number = 0; i < value.length; i++) {
        let code: number = value.charCodeAt(i);
        if (code >= 0xD800 && code <= 0xDBFF && i + 1 < value.length) {
            const next: number = value.charCodeAt(i + 1);
            if (next >= 0xDC00 && next <= 0xDFFF) {
                code = 0x10000 + ((code - 0xD800) << 10) + (next - 0xDC00);
                i++;
            }
        }
        if (code < 0x80) {
            bytes.push(code);
        } else if (code < 0x800) {
            bytes.push(0xC0 | (code >> 6), 0x80 | (code & 0x3F));
        } else if (code < 0x10000) {
            bytes.push(0xE0 | (code >> 12), 0x80 | ((code >> 6) & 0x3F), 0x80 | (code & 0x3F));
        } else {
            bytes.push(0xF0 | (code >> 18), 0x80 | ((code >> 12) & 0x3F), 0x80 | ((code >> 6) & 0x3F), 0x80 | (code & 0x3F));
        }
    }
    return bytes;
}

/**
 * Converts a 32-bit number to an 8-character hex string without Number.toString radix,
 * which is unavailable in the ES5 library used by this project.
 *
 * @param {number} value - 32-bit value
 * @returns {string} Hex string
 * @hidden
 */
function toHex(value: number): string {
    const digits: string = '0123456789abcdef';
    let hex: string = '';
    let current: number = value >>> 0;
    for (let i: number = 0; i < 8; i++) {
        hex = digits.charAt(current & 15) + hex;
        current = Math.floor(current / 16);
    }
    return hex;
}

/**
 * Reads a numeric bound, accepting both camelCase and PascalCase payloads.
 *
 * @param {CollaborationBounds} bounds - Field bounds
 * @param {string} lower - Lower-case property name
 * @param {string} upper - PascalCase property name
 * @returns {number} Rounded coordinate
 * @hidden
 */
function roundedBound(bounds: CollaborationBounds, lower: string, upper: string): number {
    if (!bounds) {
        return 0;
    }
    const record: { [key: string]: number } = bounds as { [key: string]: number };
    // eslint-disable-next-line security/detect-object-injection
    const value: number = !isNullOrUndefined(record[lower]) ? record[lower] : record[upper];
    return isNullOrUndefined(value) ? 0 : Math.round(value);
}

/**
 * Builds a deterministic collaboration id from stable field properties.
 * An existing collaborationId is left unchanged.
 *
 * @param {FormFieldModel} field - Form field to identify
 * @returns {string} SHA-256 collaboration id
 * @hidden
 */
export function generateCollaborationId(field: FormFieldModel): string {
    const customData: { collaborationId?: string } = field && field.customData as { collaborationId?: string };
    if (customData && !isNullOrUndefined(customData.collaborationId) && customData.collaborationId !== '') {
        return customData.collaborationId;
    }
    const source: CollaborationField = field as CollaborationField;
    const bounds: CollaborationBounds = source && source.bounds as CollaborationBounds;
    const pageIndex: number = source && !isNullOrUndefined(source.pageIndex) ? source.pageIndex :
        (source && source.pageNumber ? source.pageNumber - 1 : 0);
    const fieldType: string = source && (source.formFieldAnnotationType || source.type) ?
        (source.formFieldAnnotationType || source.type) : '';
    const fieldName: string = source && source.name ? source.name : '';
    const key: string = [
        fieldName,
        pageIndex,
        fieldType,
        roundedBound(bounds, 'x', 'X'),
        roundedBound(bounds, 'y', 'Y'),
        roundedBound(bounds, 'width', 'Width'),
        roundedBound(bounds, 'height', 'Height')
    ].join('|');
    return sha256(key);
}

/**
 * Ensures customData.collaborationId is present. Existing user-defined customData is
 * preserved, so only the collaborationId property is added to it. The user data is
 * copied instead of being updated in place, so the caller's object is not modified.
 *
 * @param {FormFieldModel} field - Form field to update
 * @returns {string} collaboration id
 * @hidden
 */
export function ensureCollaborationId(field: FormFieldModel): string {
    if (!field) {
        return '';
    }
    const existingCustomData: CustomData = toCustomDataRecord(field.customData);
    const customData: CustomData = {};
    for (const key in existingCustomData) {
        if (Object.prototype.hasOwnProperty.call(existingCustomData, key)) {
            // eslint-disable-next-line security/detect-object-injection
            customData[key] = existingCustomData[key];
        }
    }
    if (!customData['collaborationId']) {
        customData['collaborationId'] = generateCollaborationId(field);
    }
    field.customData = customData;
    return customData['collaborationId'];
}

/**
 * Applies incoming custom data to a form field and keeps the user-defined properties
 * intact. When `collaborativeEditing` is true the collaboration id is carried over from
 * the previous custom data if the incoming data does not carry one; otherwise the merged
 * result contains only the incoming and existing user keys.
 *
 * @param {FormFieldModel} field - Form field whose customData is updated
 * @param {object} incomingCustomData - Custom data received from an update or a collaborator
 * @param {boolean} [collaborativeEditing] - Whether the viewer has collaborative editing enabled
 * @returns {object} The applied custom data
 * @hidden
 */
export function applyCustomData(
    field: FormFieldModel,
    incomingCustomData: object,
    collaborativeEditing?: boolean
): object {
    if (!field) {
        return incomingCustomData;
    }
    const keepCollaborationId: boolean = !!collaborativeEditing;
    const existingCustomData: CustomData = toCustomDataRecord(field.customData);
    const incoming: CustomData = toCustomDataRecord(incomingCustomData);
    const incomingText: string = typeof incomingCustomData === 'string' ? (incomingCustomData as unknown as string) : '';
    if (!incomingCustomData || typeof incomingCustomData !== 'object') {
        if (incomingText.trim() !== '') {
            const applied: CustomData = {};
            for (const key in existingCustomData) {
                if (Object.prototype.hasOwnProperty.call(existingCustomData, key)) {
                    // eslint-disable-next-line security/detect-object-injection
                    applied[key] = existingCustomData[key];
                }
            }
            for (const key in incoming) {
                if (Object.prototype.hasOwnProperty.call(incoming, key)) {
                    // eslint-disable-next-line security/detect-object-injection
                    applied[key] = incoming[key];
                }
            }
            if (keepCollaborationId) {
                applied['collaborationId'] = existingCustomData['collaborationId'] || incoming['collaborationId'] || '';
            }
            field.customData = applied;
            return applied;
        }
        field.customData = incomingCustomData;
        return incomingCustomData;
    }
    const applied: CustomData = {};
    for (const key in incoming) {
        if (Object.prototype.hasOwnProperty.call(incoming, key)) {
            // eslint-disable-next-line security/detect-object-injection
            applied[key] = incoming[key];
        }
    }
    if (keepCollaborationId && !applied['collaborationId']) {
        const existingId: string = existingCustomData['collaborationId'];
        const incomingId: string = incoming['collaborationId'];
        applied['collaborationId'] = existingId ? existingId : (incomingId ? incomingId : '');
    }
    field.customData = applied;
    return applied;
}

/**
 * Converts custom data into a plain record. Custom data may arrive as an object or as a
 * JSON string depending on the source, and non-object values are ignored.
 *
 * @param {object} customData - Custom data to normalize
 * @returns {object} Custom data as a record
 * @hidden
 */
function toCustomDataRecord(customData: object): CustomData {
    if (!customData) {
        return {};
    }
    if (typeof customData === 'object') {
        return customData as CustomData;
    }
    if (typeof customData === 'string') {
        const text: string = (customData as unknown as string).trim();
        if (text !== '') {
            try {
                const parsed: unknown = JSON.parse(text);
                if (parsed && typeof parsed === 'object') {
                    return parsed as CustomData;
                }
            } catch (error) {
                return {};
            }
        }
    }
    return {};
}


/**
 * CollaborativeEditingHandler - Source-level collaboration module for PDF Viewer
 *
 * @hidden
 */
export class CollaborativeEditingHandler {
    private currentRoomName: string = '';
    private currentVersion: number = 0;
    private version: number = 0;
    private serviceUrl: string = '';
    private connectionId: string = '';
    private currentUser: string = '';
    private clientVersion: number = 0;
    private viewer: PdfViewer;

    /**
     * Initializes the collaborative editing handler
     *
     * @param {PdfViewer} viewer - Reference to the PdfViewer instance
     * @param {string} currentUser - Current user name for collaboration tracking
     */
    constructor(
        viewer: PdfViewer,
        currentUser: string
    ) {
        this.currentUser = currentUser;
        this.viewer = viewer;
    }

    /**
     * This function updates the room information and server url of the collaborative editing session.
     *
     * @param {string} roomName - Specifies the current collaborative editing room name.
     * @param {number} version - Specifies the current version of the document.
     * @param {string} serviceUrl - Specifies the base url of the collaborative editing service.
     * @returns {void}
     */
    public updateRoomInfo(roomName: string, version: number, serviceUrl: string): void {
        this.currentRoomName = roomName;
        this.serviceUrl = serviceUrl;
        this.version = version;
        this.clientVersion = version;
    }

    /**
     * Increments and returns the next version number
     * Should be called before sending each operation to the server
     *
     * @returns {number} The new incremented version number
     */
    private incrementVersion(): number {
        this.currentVersion++;
        return this.currentVersion;
    }

    /**
     * Routes local operations to appropriate handlers based on operation type
     * Sends each operation to the collaboration service
     *
     * @param {any} operations - Array of local operations to send
     * @returns {Promise<void>} Resolves once all operations have been sent
     */
    public async sendActionToServer(operations: any): Promise<void> {
        if (!operations || operations.length === 0) {
            return;
        }

        for (const operation of operations) {
            if (!isNullOrUndefined(operation.type)) {
                if (operation.type === 'annotation' && this.viewer.annotationModule) {
                    await this.sendAnnotationUpdate(operation);
                }
                else if (operation.type === 'formField') {
                    if (this.viewer.formDesignerModule) {
                        await this.sendFormDesignerUpdate(operation);
                    } else if (this.viewer.formFieldsModule) {
                        await this.sendFormFieldUpdate(operation);
                    }
                }
                else if (operation.type === 'pageOrganizer') {
                    if (this.viewer.pageOrganizer) {
                        await this.sendPageOrganizerUpdate(operation);
                    }
                }
                else if (operation.type === 'removeUser') {
                    await this.leaveRoomLocally(operation);
                }
            }
        }
    }

    /**
     * Applies remote operations received from other collaborators
     * Implements echo detection to skip operations from this client
     * Delegates to appropriate import methods based on action type
     *
     * @param {string} action - Type of action being applied (e.g., 'annotationUpdate', 'formFieldUpdate')
     * @param {Object} obj - Action-specific data containing changes and connectionId for echo detection
     * @returns {void}
     */
    public applyRemoteAction(action: string, obj: Object): void {
        const data: any = (obj as any).data ? (obj as any).data : obj;
        if (!isNullOrUndefined(data)) {
            if (action === 'connectionId') {
                this.connectionId = data.payload;
            }
            // Echo detection: skip if this operation was sent by this client
            else if ((obj as any).connectionId === this.connectionId) {
                const receivedVersion: number = this.getActionVersion(obj);
                if (receivedVersion <= 0) {
                    return;
                } else if (receivedVersion > this.version) {
                    this.version = receivedVersion;
                    this.clientVersion = receivedVersion;
                }
                return;
            }
            else if ((obj as any) && (obj as any).type === 'annotation') {
                // Apply remote annotation changes
                // eslint-disable-next-line no-console
                console.log('[CollaborativeEditingHandler] Applying remote annotation update');
                this.applyRemoteAnnotations(obj);
            }
            else if ((obj as any) && ((obj as any).type === 'formFieldAction' || (obj as any).type === 'formField')) {
                // Apply remote form field changes
                this.applyRemoteFormFields(obj);
            }
            else if ((obj as any) && (obj as any).data && (obj as any).type === 'pageOrganizer') {
                // Apply remote page organizer changes
                this.viewer.applyPageOrganizerActions((obj as any).data);
            }
            else if (action === 'removeUser' || action === 'addUser') {
                // Handle user presence changes
                this.handleUserPresence(action, obj);
            }
        }
    }

    private getActionVersion(action: any): number {
        return !isNullOrUndefined(action.version) ? action.version : (!isNullOrUndefined(action.Version) ? action.Version : 0);
    }

    /**
     * Sends annotation update to collaboration service
     * Exports annotation data in XFDF format and sends to server
     *
     * @param {any} operation - Annotation operation with action and annotation details
     * @returns {Promise<void>} Resolves once the annotation update has been sent
     */
    private async sendAnnotationUpdate(operation: any): Promise<void> {
        const annotationData: string = this.viewer.annotationModule.exportAnnotationById(
            operation.annotation,
            operation.action
        );

        const oldVersion: number = this.currentVersion;
        const newVersion: number = this.incrementVersion();

        const payload: any = {
            roomName: this.currentRoomName,
            connectionId: this.connectionId,
            userName: this.currentUser,
            clientVersion: this.clientVersion,
            version: this.version,
            type: 'annotation',
            data: {
                xfdfData: annotationData,
                action: operation.action,
                isRedacted: operation.isRedacted
            }
        };

        try {
            const response: Response = await fetch(
                this.serviceUrl + 'UpdateAction',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const result: any = await response.json();

        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('[CollaborativeEditingHandler] Failed to send annotation update:', error);
        }
    }

    /**
     * Sends form designer (complex form field) update to collaboration service
     *
     * @param {any} operation - Form designer operation with formField and action
     * @returns {Promise<void>} Resolves once the form designer update has been sent
     */
    private async sendFormDesignerUpdate(operation: any): Promise<void> {
        const fromFieldData: any = this.viewer.formFieldsModule.exportFormField(
            operation.formField,
            operation.action
        );

        const oldVersion: number = this.currentVersion;
        const newVersion: number = this.incrementVersion();

        const payload: any = {
            roomName: this.currentRoomName,
            connectionId: this.connectionId,
            userName: this.currentUser,
            clientVersion: this.clientVersion,
            version: this.version,
            type: 'formFieldAction',
            data: {
                changes: fromFieldData,
                action: operation.action
            }
        };

        try {
            const response: Response = await fetch(
                this.serviceUrl + 'UpdateAction',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const result: any = await response.json();

        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('[CollaborativeEditingHandler] Failed to send form field update:', error);
        }
    }

    /**
     * Sends simple form field (fill) update to collaboration service
     * Used for form field value changes in non-designer mode
     *
     * @param {any} operation - Form field operation with data (JSON string) and action
     * @returns {Promise<void>} Resolves once the form field update has been sent
     */
    private async sendFormFieldUpdate(operation: any): Promise<void> {
        if (!operation.data) {
            return;
        }

        // Export modified field as JSON format for collaborative sync
        const jsonData: string = this.viewer.formFieldsModule.exportFormField(operation.data);

        const payload: any = {
            roomName: this.currentRoomName,
            connectionId: this.connectionId,
            userName: this.currentUser,
            clientVersion: this.clientVersion,
            version: this.version,
            type: 'formField',
            data: {
                action: operation.action,
                jsonData: jsonData
            }
        };

        try {
            const response: Response = await fetch(
                this.serviceUrl + 'UpdateAction',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const result: any = await response.json();

        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('[CollaborativeEditingHandler] Failed to send form field update:', error);
        }
    }

    /**
     * Sends page organizer update to collaboration service
     * Used when pages are reordered, inserted, deleted, or rotated
     *
     * @param {any} operation - Page organizer operation with action and data
     * @returns {Promise<void>} Resolves once the page organizer update has been sent
     */
    private async sendPageOrganizerUpdate(operation: any): Promise<void> {
        const pageOrganizerData: any = operation.data;

        const oldVersion: number = this.currentVersion;
        const newVersion: number = this.incrementVersion();

        const payload: any = {
            roomName: this.currentRoomName,
            connectionId: this.connectionId,
            userName: this.currentUser,
            clientVersion: this.clientVersion,
            version: this.version,
            type: 'pageOrganizer',
            data: pageOrganizerData
        };

        try {
            const response: Response = await fetch(
                this.serviceUrl + 'UpdateAction',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const result: any = await response.json();

        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('[CollaborativeEditingHandler] Failed to send page organizer update:', error);
        }
    }

    /**
     * Handles remote annotation changes
     * Imports XFDF format annotation data into the viewer
     *
     * @param {any} data - Remote annotation data containing xfdfData
     * @returns {void}
     */
    private applyRemoteAnnotations(data: any): void {
        const response: any = data.data;
        if (response.isRedacted) {
            this.redaction(response.isRedacted);
        }
        else {
            this.viewer.annotationModule.importAnnotationData(response.xfdfData);
        }
    }

    /**
     * Handles remote form field changes
     * Delegates to form fields module for import
     *
     * @param {any} jsonData - Remote form field data containing changes
     * @returns {void}
     */
    private applyRemoteFormFields(jsonData: any): void {
        this.viewer.formFieldsModule.importFormField(jsonData.data);
    }

    /**
     * Runs the local leave-room sequence for the pageOrganizer
     * `applyCancelled` flow.
     *
     * Performs local cleanup only:
     * - Clears `viewer.collaborativeUsers` so the toolbar avatar list no
     *   longer shows the local user.
     * - Calls `viewer.updateCollaborationUserList()` to re-render the
     *   toolbar avatars against the now-empty list.
     * - Sets `viewer.enableCollaborativeEditing = false` so the viewer is
     *   no longer marked as participating in the session.
     * - Disconnects `operation.client.connection` when the operation
     *   carries a client, tearing down the local transport.
     *
     * Notes:
     * - The 'left' user-presence broadcast for the local user is emitted
     *   by the pageOrganizer `applyCancelled` flow that invokes this
     *   method; this handler does not publish it itself.
     * - No additional server-side `removeUser` request is issued from
     *   here. The disconnect above is what stops further traffic.
     * - When `operation.client` is missing, only the viewer state is
     *   updated; the connection-disconnect step is skipped.
     *
     * @param {any} operation - Remove user operation. `operation.client`
     *   (when present) is the collaboration client whose
     *   `connection.disconnect()` is invoked to tear down the local
     *   transport.
     * @returns {Promise<void>} A promise that resolves once the local
     *   viewer state has been cleared and the client connection (if any)
     *   has been disconnected.
     */
    private async leaveRoomLocally(operation: any): Promise<void> {
        this.viewer.collaborativeUsers = [];
        this.viewer.isCollaborativeEditing = false;
        this.viewer.toolbarModule.hideCollaborativeUsersToolbar();
        this.viewer.enableCollaborativeEditing = false;
        if (operation.client) {
            operation.client.connection.disconnect();
        }
    }

    /**
     * Handles user presence (joined/left) events
     * Updates the collaboration user list in the viewer
     *
     * @param {string} action - 'addUser' or 'removeUser'
     * @param {any} data - User data or array of user data
     * @returns {void}
     */
    private handleUserPresence(action: string, data: any): void {
        if (action === 'addUser') {
            // Handle both single user and array of users
            const users: any[] = Array.isArray(data) ? data : (data ? [data] : []);
            const localName: string = (this.currentUser || '').toLowerCase();

            users.forEach((user: any) => {
                const incomingName: string = (user.currentUser || '').toLowerCase();
                if (localName && incomingName && incomingName === localName) {
                    return;
                }
                const userDetails: string = JSON.stringify({
                    name: user.currentUser,
                    connectionId: user.connectionId,
                    image: (user as any).image,
                    activity: 'joined'
                });
                this.viewer.handleCollaborationUserActivity(userDetails);
            });
        }
        else if (action === 'removeUser') {
            const userDetails: string = JSON.stringify({
                connectionId: data,
                activity: 'left'
            });
            this.viewer.handleCollaborationUserActivity(userDetails);
        }
    }

    /**
     * Prompts the local viewer to apply redactions initiated by a collaborative
     * peer. When `isRedact` is `true`, the renderer shows a confirmation popup
     * describing the redact action; confirming reload invokes
     * `viewer.annotation.redact()` to mirror the peer's redactions locally, and
     * cancelling just closes the popup.
     *
     * @param {boolean} isRedact - Set to `true` when a peer applies redactions.
     * @returns {void}
     */
    private redaction(isRedact: boolean): void {
        if (isRedact) {
            this.viewer.pdfRendererModule.showApplyActionsConfirmationPopup(null, true);
            this.viewer.annotationModule.isRedactPrevent = isRedact;
        }
    }

}
