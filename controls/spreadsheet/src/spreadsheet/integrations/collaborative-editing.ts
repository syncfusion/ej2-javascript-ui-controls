import { CellStyleModel, ChartModel, ConditionalFormatModel } from '../../workbook/common/class-model';
import { cellValidation, clearCFRule, deleteModel, hideShow, initiateSort, insertModel, protectsheetHandler, refreshChartSize, refreshRibbonIcons, replace, replaceAll, setAutoFill, setCellFormat, setCFRule, setChart, setLinkModel, setMerge, updateSortCollection, workbookFormulaOperation } from '../../workbook/common/event';
import { EventHandler, isNullOrUndefined } from '@syncfusion/ej2-base';
import { BeforeSortEventArgs, CFArgs, CollaboratorSelection, ExtendedChartModel, MergeArgs, SortEventArgs } from '../../workbook/common/interface';
import { Spreadsheet } from '../base';
import { applyProtect, chartDesignTab, clearRange, clearViewer, CollaborativeEditArgs, CollaborativeEditingEventArgs, collaborativeEditPresence, commentUndoRedo, copy, createImageElement, cut, deleteChart, deleteImage, goToSheet, hideSheet, ICellRenderer, initiateFilterUI, invalidData, IRenderer, mouseUpAfterSelection, noteUndoRedo, paste, performUndoRedo, refreshChartCellObj, refreshImgCellObj, removeDataValidation, removeHyperlink, removeSheetTab, removeWorkbookProtection, setProtectWorkbook, sheetNameUpdate, showSheet } from '../common/index';
import { activeSheetChanged, cellNavigate, colWidthChanged, contentLoaded, rowHeightChanged, virtualContentLoaded } from '../common/index';
import { setPosition } from '../common/index';
import { CellModel, duplicateSheet, getCell, getCellAddress, getIndexesFromAddress, getRangeIndexes, getSheet, getSheetIndex, getSheetIndexFromId, getSheetNameFromAddress, isImported, moveSheet, RowModel, SheetModel, updateCell, Workbook, wrap, getSheetName } from '../../workbook/index';
import { Tooltip } from '@syncfusion/ej2-popups';
import { ImageModel } from './../../workbook/common/index';
import { PredicateModel } from '@syncfusion/ej2-grids';
import { Predicate } from '@syncfusion/ej2-data';

/**
 * Spreadsheet CollaborativeEditing orchestration.
 */
export class CollaborativeEditingHandler {
    private parent: Spreadsheet;
    private version: number = 0;
    private clientVersion: number = 0;
    private roomName: string = '';
    private serviceUrl: string = '';
    private connectionId: string = '';
    private acknowledgmentPending: any = null;
    private pendingActions: any[] = [];
    private isSyncServerChanges: boolean = false;
    private hasConnected: boolean = false;
    // Selection presence state
    private selectionTimer: number | null = null;
    private userName: string = '';
    private isEditing: boolean = false;
    private lastPresenceKey: string = '';
    private refreshTimer: number | null = null;
    private scrollElement: HTMLElement | null = null;
    private localColor: string = '';
    private remoteUsers: Map<string, CollaboratorSelection> = new Map<string, CollaboratorSelection>();
    private remoteSelectionElements: {[connectionId: string]: HTMLElement[]} = {};
    private ribbonAvatarElements: Map<string, HTMLSpanElement> = new Map<string, HTMLSpanElement>();
    private ribbonGroupAvatar: HTMLSpanElement | null = null;
    private ribbonAvatarTooltips: Map<string, Tooltip> = new Map<string, Tooltip>();
    private ribbonGroupTooltip: Tooltip | null = null;
    private ribbonHost: HTMLElement | null = null;
    private avatarInitialText: Map<HTMLElement, string> = new Map<HTMLElement, string>();
    private avatarExpandedText: Map<HTMLElement, string> = new Map<HTMLElement, string>();
    private pendingUserNames: Map<string, string> = new Map<string, string>();
    // Keep disconnected latest IDs as tombstones: older connections must not revive stale cursors.
    private latestUserSelections: Map<string, string> = new Map<string, string>();
    // Invalidate snapshots only when the handler lifecycle or local identity changes.
    private presenceRevision: number = 0;
    private disconnectedSelectionIds: Set<string> = new Set<string>();

    /** Buffered remote structural actions while a local structural ack is pending. */
    private bufferedStructuralActions: any[] = [];

    /**
     * Constructor for the Spreadsheet CollaborativeEditing module.
     *
     * @param {Spreadsheet} parent - Constructor for the Spreadsheet Chart module.
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.parent.on(mouseUpAfterSelection, this.selectedRangeHandler, this);
        this.parent.on(cellNavigate, this.keyboardSelectionHandler, this);
        this.parent.on(collaborativeEditPresence, this.editPresenceHandler, this);
        this.parent.on(rowHeightChanged, this.scheduleReposition, this);
        this.parent.on(colWidthChanged, this.scheduleReposition, this);
        this.parent.on(activeSheetChanged, this.activeSheetChangedHandler, this);
        this.parent.on(virtualContentLoaded, this.scheduleReposition, this);
        this.parent.on(contentLoaded, this.contentLoadedHandler, this);
        const preserved: any = (parent as any).__collabPreservedState;
        if (preserved) {
            this.roomName      = preserved.roomName;
            this.serviceUrl    = preserved.serviceUrl;
            this.version       = preserved.version;
            this.clientVersion = preserved.clientVersion;
            this.connectionId  = preserved.connectionId;
            this.userName      = preserved.userName;
            this.localColor    = preserved.localColor;
            this.hasConnected  = preserved.hasConnected;
            this.remoteUsers   = preserved.remoteUsers;
            this.latestUserSelections = preserved.latestUserSelections || new Map<string, string>();
            this.disconnectedSelectionIds = preserved.disconnectedSelectionIds || new Set<string>();
            delete (parent as any).__collabPreservedState;
        }
    }

    /**
     * This function updates the room information and server url of the collaborative editing session.
     *
     * @param {string} roomName - Specifies the current collaborative editing room name.
     * @param {number} version - Specifies the current version of the document.
     * @param {string} serviceUrl - Specifies the base url of the collaborative editing service.
     * @returns {void} - Returns void.
     */
    public updateRoomInfo(roomName: string, version: number, serviceUrl: string): void {
        this.roomName = roomName;
        this.serviceUrl = serviceUrl;
        this.version = version;
        this.clientVersion = version;
        this.updateConnectionInfo(roomName, serviceUrl, this.connectionId, this.userName);
    }

    private activeSheetChangedHandler(): void {
        this.scheduleRefresh();
        this.sendSelectionToServer(undefined, undefined, true);
    }

    private contentLoadedHandler(): void {
        this.wireScrollEvent();
        this.scheduleRefresh();
        if (this.roomName && this.serviceUrl && this.connectionId) {
            this.fetchAndApplyRoomSelections();
        }
    }

    private wireScrollEvent(): void {
        if (!this.parent) { return; }
        const mainContent: Element = this.parent.getMainContent();
        const scrollElement: HTMLElement = mainContent && mainContent.parentElement as HTMLElement;
        if (this.scrollElement === scrollElement) { return; }
        if (this.scrollElement) {
            EventHandler.remove(this.scrollElement, 'scroll', this.scheduleReposition);
        }
        this.scrollElement = scrollElement;
        if (this.scrollElement) {
            EventHandler.add(this.scrollElement, 'scroll', this.scheduleReposition, this);
        }
    }

    private scheduleRefresh(): void {
        if (this.refreshTimer) { window.clearTimeout(this.refreshTimer); }
        this.refreshTimer = window.setTimeout((): void => {
            if (!this.parent || this.parent.isDestroyed) { return; }
            this.refreshRemoteSelections();
        });
    }

    private scheduleReposition(): void {
        if (this.refreshTimer) { window.clearTimeout(this.refreshTimer); }
        this.refreshTimer = window.setTimeout((): void => {
            if (!this.parent || this.parent.isDestroyed) { return; }
            this.repositionRemoteSelections();
        });
    }

    private repositionRemoteSelections(): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        const needsRebuild: boolean = !!(sheet && (sheet.frozenRows || sheet.frozenColumns));
        const connectionIds: string[] = Object.keys(this.remoteSelectionElements);
        if (needsRebuild) {
            this.refreshRemoteSelections();
            return;
        }
        connectionIds.forEach((connectionId: string): void => {
            const elements: HTMLElement[] = this.remoteSelectionElements[connectionId as string];
            if (!elements || !elements.length) { return; }
            elements.forEach((el: HTMLElement, rangeIdx: number): void => {
                const cls: string = 'e-collaborative-selection-' + connectionId + '-' + rangeIdx;
                setPosition(this.parent, el, getRangeIndexes(el.getAttribute('data-range') || 'A1'), cls);
            });
        });
        this.bringLocalActiveCellToFront();
    }

    public updateConnectionInfo(roomName: string, serviceUrl: string, connectionId: string, userName?: string): void {
        this.presenceRevision++;
        this.roomName = roomName;
        this.serviceUrl = serviceUrl;
        this.connectionId = connectionId;
        if (userName !== undefined) { this.userName = userName; }
        this.localColor = this.getSelectionColor(this.userName || connectionId);
        this.refreshRemoteSelections();
        this.renderCollaboratorRibbon();
    }

    public setLocalUser(userName: string): void {
        if (!userName || this.userName === userName) { return; }
        this.presenceRevision++;
        this.userName = userName;
        this.localColor = this.getSelectionColor(this.userName || this.connectionId);
        this.lastPresenceKey = '';
        this.refreshRemoteSelections();
        this.renderCollaboratorRibbon();
        if (this.connectionId) {
            this.sendSelectionToServer(undefined, undefined, true);
        }
    }

    private sendSelectionToServer(selectedRange?: string, sheetIndex?: number, forceSend: boolean = false): void {
        if (!this.roomName || !this.serviceUrl || !this.connectionId || !this.parent) { return; }
        const sheet: SheetModel = this.parent.getActiveSheet();
        selectedRange = selectedRange || sheet.selectedRange;
        sheetIndex = sheetIndex === null || sheetIndex === undefined ? this.parent.activeSheetIndex : sheetIndex;
        const presenceKey: string = [sheetIndex, selectedRange, this.isEditing, this.userName].join(':');
        if (!forceSend && presenceKey === this.lastPresenceKey) { return; }
        this.lastPresenceKey = presenceKey;
        if (this.selectionTimer) { window.clearTimeout(this.selectionTimer); }
        const currentSelectedRange: string = selectedRange as string;
        const currentSheetIndex: number = sheetIndex;
        this.selectionTimer = window.setTimeout((): void => {
            const requestUrl: string = this.serviceUrl.replace(/\/?$/, '/') + 'UpdateSelection';
            fetch(requestUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    roomName: this.roomName,
                    connectionId: this.connectionId,
                    userName: this.userName,
                    sheetIndex: currentSheetIndex,
                    selectedRange: currentSelectedRange,
                    isEditing: this.isEditing,
                    color: this.localColor,
                    action: 'selection'
                })
            })
                .then((response: Response) => {
                    if (!response.ok) { throw new Error('Presence request failed: ' + response.status); }
                    return response.json();
                })
                .catch((error: Error) => { console.error('[Collaborative Selection] Error', error); });
        }, 50);
    }

    public updateRemoteSelection(selection: CollaboratorSelection): void {
        if (!selection || !selection.connectionId || selection.connectionId === this.connectionId || !this.parent) { return; }
        this.removeRemoteSelectionElement(selection.connectionId);
        if ((selection.userName && (selection.userName === this.userName ||
            (this.latestUserSelections.has(selection.userName) &&
             this.latestUserSelections.get(selection.userName) !== selection.connectionId))) ||
            selection.sheetIndex !== this.parent.activeSheetIndex) { return; }
        const ranges: string[] = selection.selectedRange.trim().split(' ');
        const color: string = selection.userName ? this.getSelectionColor(selection.userName) : selection.color || '';
        const indicators: HTMLElement[] = [];
        ranges.forEach((range: string, rangeIdx: number): void => {
            const rangeIndexes: number[] = getRangeIndexes(range);
            const indicator: HTMLElement = document.createElement('div');
            const indicatorCls: string = 'e-collaborative-selection-' + selection.connectionId + '-' + rangeIdx;
            indicator.className = 'e-collaborative-active-cell ' + indicatorCls;
            indicator.setAttribute('data-connection-id', selection.connectionId);
            indicator.setAttribute('data-range', range);
            indicator.style.borderColor = color;
            let avatar: HTMLElement | null = null;
            if (rangeIdx === 0) {
                avatar = document.createElement('div');
                avatar.className = 'e-collaborative-user-avatar';
                avatar.style.backgroundColor = color;
                avatar.setAttribute('title', selection.userName || 'Guest User');
                avatar.setAttribute('data-name', selection.userName || 'Guest User');
                const initials: string = this.getInitials(selection.userName);
                const fullName: string = selection.userName || 'Guest User';
                this.avatarInitialText.set(avatar, initials);
                this.avatarExpandedText.set(avatar, fullName);
                avatar.setAttribute('data-is-editing', selection.isEditing ? 'true' : 'false');
                this.renderCollapsedAvatar(avatar);
                indicator.appendChild(avatar);
                EventHandler.add(avatar, 'mouseenter', this.onAvatarMouseEnter, this);
                EventHandler.add(avatar, 'mouseleave', this.onAvatarMouseLeave, this);
            }
            setPosition(this.parent, indicator, rangeIndexes, indicatorCls);
            if (rangeIndexes[0] === 0 && avatar) {
                this.resolveAvatarCollision(indicator, avatar, rangeIndexes);
            }
            indicators.push(indicator);
        });
        this.bringLocalActiveCellToFront();
        if (indicators.length > 0) {
            this.remoteSelectionElements[selection.connectionId] = indicators;
        }
    }

    private renderCollapsedAvatar(avatar: HTMLElement): void {
        avatar.textContent = '';
        const isEditing: boolean = avatar.getAttribute('data-is-editing') === 'true';
        if (isEditing) {
            const editingIndicator: HTMLElement = document.createElement('span');
            editingIndicator.className = 'e-collaborative-editing-indicator';
            for (let i: number = 0; i < 3; i++) {
                editingIndicator.appendChild(document.createElement('span'));
            }
            avatar.appendChild(editingIndicator);
            return;
        }
        avatar.textContent = this.avatarInitialText.get(avatar) || '';
    }

    private onAvatarMouseEnter(e: Event): void {
        const avatar: HTMLElement = e.currentTarget as HTMLElement;
        if (!avatar) {
            return;
        }
        const initialText: string = this.avatarInitialText.get(avatar) || '';
        const fullName: string = this.avatarExpandedText.get(avatar) || initialText;
        avatar.classList.add('e-collaborative-avatar-expanded');
        avatar.textContent = fullName;
        avatar.setAttribute('data-name', fullName);
    }

    private onAvatarMouseLeave(e: Event): void {
        const avatar: HTMLElement = e.currentTarget as HTMLElement;
        if (!avatar) {
            return;
        }
        avatar.classList.remove('e-collaborative-avatar-expanded');
        this.renderCollapsedAvatar(avatar);
    }

    private resolveAvatarCollision(indicator: HTMLElement, avatar: HTMLElement, rangeIndexes: number[]): void {
        if (!this.parent || !indicator || !avatar) { return; }
        const columnHeader: HTMLElement = this.parent.getColumnHeaderContent();
        if (!columnHeader) { return; }
        const indicatorRect: DOMRect = indicator.getBoundingClientRect() as DOMRect;
        const columnHeaderBottom: number = columnHeader.getBoundingClientRect().bottom;
        if (rangeIndexes[0] === 0 || indicatorRect.top < columnHeaderBottom) {
            avatar.style.top = '-2px';
            avatar.style.bottom = 'auto';
        }
    }

    private bringLocalActiveCellToFront(): void {
        if (!this.parent) { return; }
        const mainContent: Element = this.parent.getMainContent();
        if (mainContent) {
            const activeCell: Element | null = mainContent.querySelector('.e-active-cell');
            if (activeCell) { mainContent.appendChild(activeCell); }
        }
    }

    private getInitials(userName?: string): string {
        const parts: string[] = (userName || 'Guest User').trim().split(/\s+/);
        if (parts.length === 1) { return parts[0].charAt(0).toUpperCase(); }
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }

    public refreshRemoteSelections(): void {
        if (!this.parent) { return; }
        Object.keys(this.remoteSelectionElements).forEach((connectionId: string): void => {
            this.removeRemoteSelectionElement(connectionId);
        });
        this.remoteUsers.forEach((record: CollaboratorSelection): void => {
            this.updateRemoteSelection(record);
        });
        this.bringLocalActiveCellToFront();
    }

    public removeRemoteSelectionElement(connectionId: string): void {
        const elements: HTMLElement[] = this.remoteSelectionElements[connectionId as string];
        if (elements) {
            elements.forEach((el: HTMLElement): void => {
                const avatar: HTMLElement = el.querySelector('.e-collaborative-user-avatar') as HTMLElement;
                if (avatar) {
                    EventHandler.remove(avatar, 'mouseenter', this.onAvatarMouseEnter);
                    EventHandler.remove(avatar, 'mouseleave', this.onAvatarMouseLeave);
                    this.avatarInitialText.delete(avatar);
                    this.avatarExpandedText.delete(avatar);
                }
                if (el && el.parentElement) { el.parentElement.removeChild(el); }
            });
        }
        delete this.remoteSelectionElements[connectionId as string];
    }

    public removeRemoteSelection(connectionId: string): void {
        this.disconnectedSelectionIds.add(connectionId);
        this.pendingUserNames.delete(connectionId);
        this.remoteUsers.delete(connectionId);
        this.removeRemoteSelectionElement(connectionId);
        this.renderCollaboratorRibbon();
    }

    public getSelectionColor(connectionId: string): string {
        const key: string = (connectionId || 'guest').trim().toLowerCase();
        let hash: number = 5381;
        for (let i: number = 0; i < key.length; i++) {
            hash = (hash * 33 + key.charCodeAt(i)) % 4294967296;
        }
        const toHex: Function = (n: number): string => { const h: string = n.toString(16); return h.length < 2 ? '0' + h : h; };
        const r: number = 60 + (Math.abs(hash)        & 0xFF) % 140;
        const g: number = 60 + (Math.abs(hash >> 8)   & 0xFF) % 140;
        const b: number = 60 + (Math.abs(hash >> 16)  & 0xFF) % 140;
        return '#' + toHex(r) + toHex(g) + toHex(b);
    }

    public updateEditingState(isEditing: boolean): void {
        if (this.isEditing === isEditing) { return; }
        this.isEditing = isEditing;
        if (!this.parent || this.parent.isDestroyed) { return; }
        const sheet: SheetModel = this.parent.getActiveSheet();
        this.sendSelectionToServer(sheet.selectedRange, this.parent.activeSheetIndex, true);
    }

    public updateCollaboratorPresence(record: CollaboratorSelection, updateSelection: boolean = true): void {
        if (!record.userName) {
            record.userName = this.pendingUserNames.get(record.connectionId) ||
                (this.remoteUsers.get(record.connectionId) || {} as CollaboratorSelection).userName;
        }
        this.pendingUserNames.delete(record.connectionId);
        this.disconnectedSelectionIds.delete(record.connectionId);
        if (record.userName && updateSelection) {
            const previousId: string = this.latestUserSelections.get(record.userName);
            const previousRecord: CollaboratorSelection = this.remoteUsers.get(previousId);
            // A renamed connection retains an old-name tombstone, but its new cursor is unrelated.
            if (previousId && previousId !== record.connectionId && previousRecord &&
                previousRecord.userName === record.userName) {
                this.removeRemoteSelectionElement(previousId);
            }
            this.latestUserSelections.set(record.userName, record.connectionId);
        }
        this.remoteUsers.set(record.connectionId, record);
    }

    private ensureRibbonHost(tabHeader: HTMLElement): HTMLElement {
        if (this.ribbonHost && tabHeader.contains(this.ribbonHost)) {
            return this.ribbonHost;
        }
        const existing: HTMLElement | null = tabHeader.querySelector('.e-collaborative-ribbon-avatar');
        if (existing) {
            this.ribbonHost = existing;
            return existing;
        }
        const host: HTMLElement = document.createElement('div');
        host.className = 'e-collaborative-ribbon-avatar';
        this.ribbonHost = host;
        return host;
    }

    private createCollaboratorTooltipContent( userName: string, initials: string, bgColor: string, selectedRange: string ): HTMLElement {
        const tooltipContent: HTMLElement = document.createElement('div');
        tooltipContent.className = 'e-collaborator-tooltip';
        const textContainer: HTMLElement = document.createElement('div');
        textContainer.className = 'e-collaborator-tooltip-text';
        const collaboratorName: HTMLElement = document.createElement('div');
        collaboratorName.className = 'e-collaborator-name';
        collaboratorName.textContent = userName;
        const collaboratorStatus: HTMLElement = document.createElement('div');
        collaboratorStatus.className = 'e-collaborator-status';
        collaboratorStatus.textContent = `Editing ${selectedRange}`;
        textContainer.appendChild(collaboratorName);
        textContainer.appendChild(collaboratorStatus);
        tooltipContent.appendChild(textContainer);
        return tooltipContent;
    }

    private createOrUpdateRibbonAvatar(user: CollaboratorSelection): HTMLSpanElement {
        let avatar: HTMLSpanElement | undefined = this.ribbonAvatarElements.get(user.connectionId);
        if (!avatar) {
            avatar = document.createElement('span');
            avatar.className = 'e-avatar e-avatar-small e-avatar-circle ' + 'e-collaborative-ribbon-avatar-individual';
            avatar.setAttribute('role', 'img');
            this.ribbonAvatarElements.set(user.connectionId, avatar);
        }
        const bgColor: string = user.userName ? this.getSelectionColor(user.userName) :
            user.color || this.getSelectionColor(user.connectionId);
        const initials: string = this.getInitials(user.userName);
        const userName: string = user.userName;
        let selectedRange: string = user.selectedRange;
        if (!selectedRange.includes(' ')) {
            const parts: string[] = selectedRange.split(':');
            if (parts.length === 2 && parts[0] === parts[1]) {
                selectedRange = parts[0];
            }
        }
        if (user.sheetIndex > 0 && user.sheetIndex < this.parent.sheets.length) {
            selectedRange = `${getSheetName(this.parent, user.sheetIndex)} ${selectedRange}`;
        }
        const presenceKey: string = JSON.stringify([userName, selectedRange, bgColor]);
        if (avatar.getAttribute('data-presence-key') === presenceKey) { return avatar; }
        avatar.setAttribute('data-presence-key', presenceKey);
        avatar.style.setProperty('--collab-user-color', bgColor);
        avatar.style.backgroundColor = bgColor;
        avatar.textContent = initials;
        avatar.setAttribute('aria-label', `${userName}, editing ${selectedRange}`);
        const tooltipContent: HTMLElement = this.createCollaboratorTooltipContent(userName, initials, bgColor, selectedRange);
        const existingTooltip: Tooltip | undefined = this.ribbonAvatarTooltips.get(user.connectionId);
        if (existingTooltip) {
            existingTooltip.content = tooltipContent;
        } else {
            const tooltip: Tooltip = new Tooltip({ opensOn: 'Hover', content: tooltipContent,
                position: 'BottomCenter', cssClass: 'e-custom-tooltip' });
            tooltip.appendTo(avatar);
            this.ribbonAvatarTooltips.set(user.connectionId, tooltip);
        }
        return avatar;
    }

    private syncRibbonGroupAvatar(extraUsers: CollaboratorSelection[]): HTMLSpanElement | null {
        if (!extraUsers.length) {
            if (this.ribbonGroupTooltip) {
                this.ribbonGroupTooltip.destroy();
                this.ribbonGroupTooltip = null;
            }
            if (this.ribbonGroupAvatar && this.ribbonGroupAvatar.parentElement) {
                this.ribbonGroupAvatar.parentElement.removeChild(this.ribbonGroupAvatar);
            }
            this.ribbonGroupAvatar = null;
            return null;
        }
        if (!this.ribbonGroupAvatar) {
            this.ribbonGroupAvatar = document.createElement('span');
            this.ribbonGroupAvatar.className =
                'e-avatar e-avatar-small e-avatar-circle ' +
                'e-collaborative-ribbon-avatar-individual ' +
                'e-collaborative-user-avatar-group';
            this.ribbonGroupAvatar.style.setProperty('--collab-user-color', '#000');
            this.ribbonGroupAvatar.setAttribute('role', 'img');
        }
        this.ribbonGroupAvatar.textContent = `+${extraUsers.length}`;
        this.ribbonGroupAvatar.setAttribute('aria-label', `${extraUsers.length} more collaborators`);
        let tooltipContent: HTMLElement | null = null;
        const shouldRebuildTooltip: boolean = !this.ribbonGroupTooltip || !this.ribbonGroupAvatar.dataset.tooltipCount ||
            this.ribbonGroupAvatar.dataset.tooltipCount !== extraUsers.length.toString();
        if (shouldRebuildTooltip) {
            tooltipContent = document.createElement('div');
            tooltipContent.className = 'e-group-collaborator-tooltip';
            tooltipContent.setAttribute('role', 'list');
            extraUsers.forEach((user: CollaboratorSelection): void => {
                const collaboratorRow: HTMLElement = document.createElement('div');
                collaboratorRow.className = 'e-group-collaborator-row';
                collaboratorRow.setAttribute('role', 'listitem');
                const bgColor: string = user.userName ? this.getSelectionColor(user.userName) :
                    user.color || this.getSelectionColor(user.connectionId);
                const initials: string = this.getInitials(user.userName);
                const userName: string = user.userName;
                let selectedRange: string = user.selectedRange;
                if (!selectedRange.includes(' ')) {
                    const parts: string[] = selectedRange.split(':');
                    if (parts.length === 2 && parts[0] === parts[1]) {
                        selectedRange = parts[0];
                    }
                }
                if (user.sheetIndex > 0 && user.sheetIndex < this.parent.sheets.length) {
                    selectedRange = `${getSheetName(this.parent, user.sheetIndex)} ${selectedRange}`;
                }
                const textContainer: HTMLElement = document.createElement('div');
                textContainer.className = 'e-collaborator-tooltip-text';
                const collaboratorName: HTMLElement = document.createElement('div');
                collaboratorName.className = 'e-collaborator-name';
                collaboratorName.textContent = userName;
                const collaboratorStatus: HTMLElement = document.createElement('div');
                collaboratorStatus.className = 'e-collaborator-status';
                collaboratorStatus.textContent = `Editing ${selectedRange}`;
                textContainer.appendChild(collaboratorName);
                textContainer.appendChild(collaboratorStatus);
                collaboratorRow.appendChild(textContainer);
                if (tooltipContent) {
                    tooltipContent.appendChild(collaboratorRow);
                }
            });
            this.ribbonGroupAvatar.dataset.tooltipCount = extraUsers.length.toString();
            if (this.ribbonGroupTooltip) {
                this.ribbonGroupTooltip.content = tooltipContent;
            } else {
                this.ribbonGroupTooltip = new Tooltip({ opensOn: 'Hover', content: tooltipContent, position: 'BottomCenter',
                    cssClass: 'e-custom-tooltip e-collaborator-ribbon-tooltip' });
                this.ribbonGroupTooltip.appendTo(this.ribbonGroupAvatar);
            }
        }
        return this.ribbonGroupAvatar;
    }

    private removeStaleRibbonAvatars(activeIds: Set<string>): void {
        this.ribbonAvatarElements.forEach((avatar: HTMLSpanElement, connectionId: string): void => {
            if (activeIds.has(connectionId)) {
                return;
            }
            const tooltip: Tooltip | undefined = this.ribbonAvatarTooltips.get(connectionId);
            if (tooltip) {
                tooltip.destroy();
                this.ribbonAvatarTooltips.delete(connectionId);
            }
            if (avatar.parentElement) {
                avatar.parentElement.removeChild(avatar);
            }
            this.ribbonAvatarElements.delete(connectionId);
        });
    }

    public renderCollaboratorRibbon(): void {
        const ribbonEle: HTMLElement = this.parent.element.querySelector('.e-ribbon') as HTMLElement;
        if (!ribbonEle) {
            return;
        }
        const ribbonHeader: HTMLElement = this.parent.element.querySelector('.e-ribbon-action') as HTMLElement;
        if (!ribbonHeader) {
            return;
        }
        const userNames: Set<string> = new Set<string>();
        const users: CollaboratorSelection[] = Array.from(this.remoteUsers.values())
            .filter((user: CollaboratorSelection): boolean => {
                if (user.connectionId === this.connectionId ||
                    (user.userName && (user.userName === this.userName || userNames.has(user.userName)))) {
                    return false;
                }
                if (user.userName) { userNames.add(user.userName); }
                return true;
            });
        const visibleUsers: CollaboratorSelection[] = users.length > 3 ? users.slice(0, 3) : users;
        const extraUsers: CollaboratorSelection[] = users.length > 3 ? users.slice(3) : [];
        const host: HTMLElement = this.ensureRibbonHost(ribbonHeader);
        const aiBtn: HTMLElement | null = ribbonHeader.querySelector('.e-spreadsheet-ai-btn');
        if (!ribbonEle.classList.contains('e-collaborative-ribbon')) {
            ribbonEle.classList.add('e-collaborative-ribbon');
        }
        if (aiBtn && !ribbonHeader.classList.contains('e-collaborative-ribbon-extended')) {
            ribbonHeader.classList.add('e-collaborative-ribbon-extended');
        }
        if (host.parentElement !== ribbonHeader) {
            if (aiBtn && aiBtn.parentElement === ribbonHeader) {
                aiBtn.before(host);
            } else {
                ribbonHeader.appendChild(host);
            }
        } else if (aiBtn && host.nextElementSibling !== aiBtn) {
            aiBtn.before(host);
        }
        const activeIds: Set<string> = new Set<string>();
        visibleUsers.forEach((user: CollaboratorSelection): void => {
            activeIds.add(user.connectionId);
            const avatar: HTMLSpanElement = this.createOrUpdateRibbonAvatar(user);
            if (avatar.parentElement !== host) {
                host.insertBefore(avatar, this.ribbonGroupAvatar);
            }
        });
        this.removeStaleRibbonAvatars(activeIds);
        const groupAvatar: HTMLSpanElement | null = this.syncRibbonGroupAvatar(extraUsers);
        if (groupAvatar && groupAvatar.parentElement !== host) {
            host.appendChild(groupAvatar);
        }
    }

    private updateCollaboratorsAfterSheetDelete(deletedSheetIndex: number): void {
        const affectedConnectionIds: string[] = [];

        this.remoteUsers.forEach(
            (selection: CollaboratorSelection, connectionId: string): void => {
                if (selection.sheetIndex === deletedSheetIndex) {
                    affectedConnectionIds.push(connectionId);
                } else if (selection.sheetIndex > deletedSheetIndex) {
                    selection.sheetIndex--;
                }
            }
        );

        affectedConnectionIds.forEach((connectionId: string): void => {
            this.remoteUsers.delete(connectionId);
            this.removeRemoteSelectionElement(connectionId);
        });

        this.renderCollaboratorRibbon();
    }

    public onUserJoined(user: any): void {
        return;
    }
    public onUserLeft(user: any): void {
        return;
    }

    private fetchAndApplyRoomSelections(): void {
        if (!this.serviceUrl || !this.roomName) {
            return;
        }
        const requestUrl: string = this.serviceUrl.replace(/\/?$/, '/') + 'GetRoomSelections/' + encodeURIComponent(this.roomName);
        const revision: number = this.presenceRevision;
        const knownNames: Set<string> = new Set<string>(Array.from(this.latestUserSelections.keys()));
        fetch(requestUrl)
            .then((response: Response): Promise<any[]> => {
                if (!response.ok) {
                    throw new Error('Failed to fetch room selections: ' + response.status + ' ' + response.statusText);
                }
                return response.text().then((responseText: string) => {
                    if (!responseText) {
                        return [];
                    }
                    const parsed: any = JSON.parse(responseText);
                    return Array.isArray(parsed) ? parsed : [];
                });
            })
            .then((selections: any[]): void => {
                // Only lifecycle/local identity changes invalidate the whole response.
                if (!this.parent || revision !== this.presenceRevision || !Array.isArray(selections)) {
                    return;
                }
                const latestNames: Set<string> = new Set<string>(Array.from(this.latestUserSelections.keys()));
                selections.forEach((item: any): void => {
                    const selection: CollaboratorSelection = {
                        connectionId: item.connectionId,
                        userName: item.userName,
                        sheetIndex: item.sheetIndex,
                        selectedRange: item.selectedRange,
                        isEditing: item.isEditing,
                        color: item.color
                    };
                    if (!selection.connectionId || !selection.selectedRange || selection.connectionId === this.connectionId) {
                        return;
                    }
                    if (this.remoteUsers.has(selection.connectionId) ||
                        this.disconnectedSelectionIds.has(selection.connectionId)) { return; }
                    const userName: string = selection.userName || this.pendingUserNames.get(selection.connectionId);
                    // Names learned while fetching belong to live presence, not this unordered snapshot.
                    if (userName && latestNames.has(userName) && !knownNames.has(userName)) { return; }
                    if (userName && knownNames.has(userName) &&
                        this.latestUserSelections.get(userName) === selection.connectionId) { return; }
                    // Initial snapshots use array order (last entry wins); known users keep their live cursor.
                    this.updateCollaboratorPresence(selection, !userName || !knownNames.has(userName));
                    this.updateRemoteSelection(selection);
                });
                this.renderCollaboratorRibbon();
            })
            .catch((error: Error): void => {
                console.error('[Collaborative Selection] Failed to fetch room selections', error);
            });
    }

    public fetchAndApplyPendingActions(): void {
        if (!this.serviceUrl || !this.roomName || this.isSyncServerChanges || this.hasPendingStructuralAction()) {
            return;
        }
        this.isSyncServerChanges = true;
        const requestVersion: number = this.version;
        const requestUrl: string = this.serviceUrl.replace(/\/?$/, '/') + 'GetActionsFromServer';
        const requestData: any = {
            roomName: this.roomName,
            version: requestVersion,
            clientVersion: requestVersion,
            connectionId: this.connectionId,
            operations: []
        };
        fetch(requestUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
            .then((response: Response): Promise<any[]> => {
                if (!response.ok) {
                    throw new Error('Failed to fetch pending actions: ' + response.status + ' ' + response.statusText);
                }
                return response.text().then((responseText: string) => {
                    if (!responseText) {
                        return [];
                    }
                    return JSON.parse(responseText);
                });
            })
            .then((actions: any[]): void => {
                actions.sort((firstAction: any, secondAction: any): number => {
                    return this.getActionVersion(firstAction) - this.getActionVersion(secondAction);
                });

                actions.forEach((actionInfo: any): void => {
                    if (!actionInfo) {
                        return;
                    }

                    const actionVersion: number = this.getActionVersion(actionInfo);
                    if (actionVersion <= this.version) {
                        return;
                    }

                    const actionConnectionId: string = actionInfo.connectionId;

                    if (actionConnectionId !== this.connectionId) {
                        const operations: any[] = actionInfo.operations;
                        const normalizedOperations: any[] = operations
                            .map((operation: any): any =>
                                this.normalizeOperation(operation)
                            )
                            .filter(
                                (operation: any): boolean =>
                                    !!operation
                            );
                        const containsStructuralOperation: boolean =
                            normalizedOperations.some(
                                (operation: any): boolean =>
                                    this.isStructuralRowColumnOperation(
                                        operation
                                    )
                            );

                        let wasBuffered: boolean = false;

                        if (
                            containsStructuralOperation &&
                            this.hasPendingStructuralAction()
                        ) {
                            this.bufferedStructuralActions.push({
                                version: actionVersion,
                                connectionId: actionConnectionId,
                                operations: normalizedOperations
                            });

                            wasBuffered = true;
                        }

                        if (wasBuffered) {
                            return;
                        }

                        normalizedOperations.forEach(
                            (operation: any): void => {
                                this.updateActions(operation);
                            }
                        );
                    }

                    this.version = actionVersion;
                    this.clientVersion = actionVersion;
                });

                this.isSyncServerChanges = false;
                if (!this.acknowledgmentPending) {
                    this.sendNextPendingAction();
                }
            })
            .catch((error: Error): void => {
                this.isSyncServerChanges = false;
            });
    }

    private normalizeOperation(operation: any): any {
        if (!operation) {
            return null;
        }
        const normalizedOperation: any = {};
        Object.keys(operation).forEach((propertyName: string): void => {
            const normalizedName: string =
                propertyName.charAt(0).toLowerCase() +
                propertyName.slice(1);
            const value: any = operation[propertyName as string];
            if (value === null || value === undefined) {
                normalizedOperation[normalizedName as string] = value;
                return;
            }
            // Recursively normalize nested objects and arrays
            if (Array.isArray(value)) {
                normalizedOperation[normalizedName as string] = value.map((item: any) =>
                    typeof item === 'object' && item !== null
                        ? this.normalizeNestedObject(item)
                        : item
                );
            } else if (typeof value === 'object' && value !== null) {
                normalizedOperation[normalizedName as string] = this.normalizeNestedObject(value);
            } else {
                normalizedOperation[normalizedName as string] = value;
            }
        });
        return normalizedOperation;
    }


    private normalizeNestedObject(obj: any): any {
        if (obj === null || obj === undefined || typeof obj !== 'object') {
            return obj;
        }

        if (Array.isArray(obj)) {
            return obj.map((item: any) => this.normalizeNestedObject(item));
        }

        const normalized: any = {};

        Object.keys(obj).forEach((propertyName: string) => {
            const normalizedName: string = propertyName.charAt(0).toLowerCase() + propertyName.slice(1);
            const value: any = obj[propertyName as string];

            if (value === null || value === undefined) {
                normalized[normalizedName as string] = value;
                return;
            }

            if (Array.isArray(value) || typeof value === 'object') {
                normalized[normalizedName as string] = this.normalizeNestedObject(value);
            } else {
                normalized[normalizedName as string] = value;
            }
        });

        return normalized;
    }

    private getActionVersion(action: any): number {
        return action.version;
    }

    private isStructuralRowColumnOperation(operation: any): boolean {
        if (!operation) {
            return false;
        }
        return (
            (operation.action === 'insert' || operation.action === 'delete') &&
            (operation.modelType === 'Row' || operation.modelType === 'Column')
        );
    }

    private hasPendingStructuralAction(): boolean {
        if (!this.acknowledgmentPending || !this.acknowledgmentPending.operations || !this.acknowledgmentPending.operations.length) {
            return false;
        }
        return this.isStructuralRowColumnOperation(this.acknowledgmentPending.operations[0]);
    }

    public applyRemoteAction(action: string, data: any): void {
        if (action === 'connectionId') {
            const isReconnection: boolean = this.hasConnected;
            this.connectionId = data;
            this.hasConnected = true;
            this.updateConnectionInfo(this.roomName, this.serviceUrl, this.connectionId, this.userName);
            if (isReconnection) {
                this.fetchAndApplyPendingActions();
            }
            this.fetchAndApplyRoomSelections();
            this.sendSelectionToServer(undefined, undefined, true);
            this.refreshRemoteSelections();
            return;
        }
        if (action === 'addUser') {
            if (data && data.connectionId && data.connectionId !== this.connectionId && data.userName) {
                this.pendingUserNames.set(data.connectionId, data.userName);
            }
            this.sendSelectionToServer(undefined, undefined, true);
            this.fetchAndApplyRoomSelections();
            return;
        }
        if (action === 'removeUser') {
            if (!data) { return; }
            const connectionId: string = typeof data === 'string' ? data : data.connectionId;
            if (!connectionId) { return; }
            this.removeRemoteSelection(connectionId);
            if (!this.serviceUrl || !this.roomName) { return; }
            fetch(this.serviceUrl.replace(/\/?$/, '/') + 'RemoveUserSelection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    roomName: this.roomName,
                    connectionId: connectionId
                })
            }).catch(() => {
                // The connection may already be closed.
            });
            return;
        }
        if (action !== 'action' || !data) {
            return;
        }
        data = typeof data === 'string' ? JSON.parse(data) : data;
        const dataAction: string = data.action;
        const dataConnectionId: string = data.connectionId;
        if (dataAction === 'selection') {
            if (!dataConnectionId || dataConnectionId === this.connectionId) {
                return;
            }
            const selection: CollaboratorSelection = {
                connectionId: dataConnectionId,
                userName: data.userName,
                sheetIndex: data.sheetIndex,
                selectedRange: data.selectedRange,
                isEditing: data.isEditing,
                color: data.color
            };
            if (!selection.selectedRange) {
                return;
            }
            this.updateCollaboratorPresence(selection);
            this.updateRemoteSelection(selection);
            this.renderCollaboratorRibbon();
            return;
        }
        const receivedVersion: number = this.getActionVersion(data);
        if (receivedVersion <= 0) {
            return;
        }
        if (dataConnectionId === this.connectionId) {
            if (receivedVersion > this.version && !this.acknowledgmentPending) {
                this.version = receivedVersion;
                this.clientVersion = receivedVersion;
            }
            return;
        }
        // Account for buffered structural actions that have not updated
        // this.version so a valid sequence of buffered versions is not
        // mistaken for a missing-version gap.
        const effectiveVersion: number = this.version + this.bufferedStructuralActions.length;
        const versionDifference: number = receivedVersion - effectiveVersion;
        if (versionDifference <= 0) {
            return;
        }
        if (versionDifference > 1) {
            this.fetchAndApplyPendingActions();
            return;
        }
        const operations: any[] = data.operations;
        const normalizedOperations: any[] = operations
            .map((operation: any) => this.normalizeOperation(operation))
            .filter((operation: any) => !!operation);
        const containsStructuralOperation: boolean = normalizedOperations.some((operation: any) =>
            this.isStructuralRowColumnOperation(operation)
        );
        if (containsStructuralOperation && this.hasPendingStructuralAction()) {
            this.bufferedStructuralActions.push({
                version: receivedVersion,
                connectionId: dataConnectionId,
                operations: normalizedOperations
            });
            // Do not update this.version yet because the action
            // has not been applied to the local workbook.
            return;
        }
        normalizedOperations.forEach((operation: any) => this.updateActions(operation));
        this.version = receivedVersion;
        this.clientVersion = receivedVersion;
    }

    public sendActionToServer(data: any): void {
        if (!this.roomName || !this.serviceUrl || !this.connectionId) {
            return;
        }
        const operation: any = this.getOperationInfo(data);
        if (!operation) {
            return;
        }
        if (operation.action === 'removeSheet') {
            const deletedSheetIndex: number = operation.sheetIndex !== undefined ? operation.sheetIndex : operation.index;
            if (deletedSheetIndex !== undefined && deletedSheetIndex !== null) {
                this.updateCollaboratorsAfterSheetDelete(deletedSheetIndex);
            }
        }
        const pendingAction: any = {
            roomName: this.roomName,
            version: this.version,
            clientVersion: this.version,
            connectionId: this.connectionId,
            operations: [operation]
        };
        this.pendingActions.push(pendingAction);
        this.sendNextPendingAction();
    }

    private sendNextPendingAction(): void {
        if (!this.serviceUrl || !this.roomName || !this.connectionId || this.acknowledgmentPending || this.pendingActions.length === 0
            || this.isSyncServerChanges) {
            return;
        }
        const pendingAction: any = this.pendingActions.shift();
        pendingAction.version = this.version;
        pendingAction.clientVersion = this.version;
        pendingAction.connectionId = this.connectionId;
        this.acknowledgmentPending = pendingAction;
        const serverAction: any = {
            roomName: pendingAction.roomName,
            version: pendingAction.version,
            clientVersion: pendingAction.clientVersion,
            connectionId: pendingAction.connectionId,
            operations: pendingAction.operations
        };
        fetch(this.serviceUrl.replace(/\/?$/, '/') + 'UpdateAction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(serverAction)
        })
            .then((response: Response): Promise<any> => {
                if (!response.ok) {
                    throw new Error('UpdateAction failed: ' + response.status + ' ' + response.statusText);
                }
                return response.text().then((responseText: string) => {
                    return JSON.parse(responseText);
                });
            })
            .then((updatedAction: any): void => {
                if (!updatedAction) {
                    throw new Error('UpdateAction returned an empty response.');
                }
                const serverVersion: number = this.getActionVersion(updatedAction);
                if (serverVersion <= 0) {
                    throw new Error('UpdateAction returned an invalid version.');
                }
                const previousVersion: number = this.version;
                const versionDifference: number = serverVersion - previousVersion;

                // Capture sentAction BEFORE clearing acknowledgmentPending.
                const sentAction: any = this.acknowledgmentPending;
                const sentOperation: any =
                    sentAction &&
                    sentAction.operations &&
                    sentAction.operations.length
                        ? sentAction.operations[0]
                        : null;
                const isTransformed: boolean = !!(updatedAction.isTransformed);
                const operations: any[] = updatedAction.operations;
                const isTransformedStructuralDelete: boolean =
                    !!sentOperation &&
                    sentOperation.action === 'delete' &&
                    (sentOperation.modelType === 'Row' ||
                        sentOperation.modelType === 'Column') &&
                    isTransformed;

                const isTransformedHideShow: boolean =
                    !!sentOperation &&
                    sentOperation.action === 'hideShow' &&
                    isTransformed;

                // Handle transformed structural delete reconciliation BEFORE
                // the generic version-gap check.  Otherwise a buffered version
                // gap (e.g. serverVersion=2, previousVersion=0) would always
                // trigger fetchAndApplyPendingActions and skip reconciliation.
                if (isTransformedStructuralDelete) {
                    const authoritativeOperations: any[] = operations
                        .map((operation: any): any =>
                            this.normalizeOperation(operation)
                        )
                        .filter((operation: any): boolean =>
                            !!operation
                        );

                    this.acknowledgmentPending = null;

                    this.reconcileTransformedStructuralDelete(
                        sentOperation,
                        authoritativeOperations,
                        serverVersion
                    );

                    return;
                }

                if (isTransformedHideShow) {
                    const authoritativeOperations: any[] = operations
                        .map((operation: any): any =>
                            this.normalizeOperation(operation)
                        )
                        .filter((operation: any): boolean =>
                            !!operation
                        );

                    this.acknowledgmentPending = null;

                    this.reconcileTransformedHideShow(
                        sentOperation,
                        authoritativeOperations,
                        serverVersion
                    );

                    return;
                }

                this.acknowledgmentPending = null;

                // Account for buffered structural actions that have not
                // updated this.version.  Each buffered action represents
                // one acknowledged server version.
                const effectivePreviousVersion: number =
                    this.version + this.bufferedStructuralActions.length;

                if (serverVersion > effectivePreviousVersion + 1) {
                    this.fetchAndApplyPendingActions();
                    return;
                }
                const sentVersion: number = sentAction &&
                    sentAction.clientVersion !== undefined
                    ? sentAction.clientVersion
                    : previousVersion;
                const isSheet: boolean = this.isSheetOperation(sentOperation);
                // Filter transformations require authoritative reconstruction.
                // The optimistic filter state cannot be cleanly replaced by
                // overlaying a new range because filtering mutates multiple
                // metadata stores (filter collection, hidden rows, isFiltered flags).
                // The filter must be removed through clearFilter before the
                // authoritative range is applied.
                const transformedFilterOperation: any = sentOperation && sentOperation.action === 'filter' && operations.length > 0 ? this.normalizeOperation(operations[0]) : null;
                const isFilterToggle: boolean = !!sentOperation && sentOperation.action === 'filter' && !Array.isArray(sentOperation.predicates);
                const filterRangeChanged: boolean = !!transformedFilterOperation &&
                    (sentOperation.range !== transformedFilterOperation.range
                        || sentOperation.sheetIndex !== transformedFilterOperation.sheetIndex);
                if (sentOperation && sentOperation.action === 'filter' && isTransformed && !isFilterToggle && filterRangeChanged) {
                    const transformedOperation: any = operations.length > 0
                        ? this.normalizeOperation(operations[0])
                        : null;
                    if (!transformedOperation) {
                        if (serverVersion > this.version) {
                            this.version = serverVersion;
                            this.clientVersion = serverVersion;
                        }
                        this.sendNextPendingAction();
                        return;
                    }
                    this.reapplyTransformedFilter(sentOperation, transformedOperation)
                        .then((): void => {
                            if (serverVersion > this.version) {
                                this.version = serverVersion;
                                this.clientVersion = serverVersion;
                            }
                            this.sendNextPendingAction();
                        })
                        .catch((error: Error): void => {
                            if (serverVersion > this.version) {
                                this.version = serverVersion;
                                this.clientVersion = serverVersion;
                            }
                            this.sendNextPendingAction();
                        });
                    return;
                }
                if (sentOperation && sentOperation.action === 'sorting' && isTransformed) {
                    if (operations.length) {
                        operations.forEach((operation: any) => {
                            const normalizedOperation: any = this.normalizeOperation(operation);
                            if (normalizedOperation) {
                                this.updateActions(normalizedOperation);
                            }
                        });
                    }
                    if (serverVersion > this.version) {
                        this.version = serverVersion;
                        this.clientVersion = serverVersion;
                    }
                    this.sendNextPendingAction();
                    return;
                }
                // const isTransformedStructuralDelete: boolean =
                //     !!sentOperation &&
                //     sentOperation.action === 'delete' &&
                //     (sentOperation.modelType === 'Row' || sentOperation.modelType === 'Column') &&
                //     isTransformed;
                if (isTransformedStructuralDelete) {
                    const authoritativeOperations: any[] = operations
                        .map((operation: any) => this.normalizeOperation(operation))
                        .filter((operation: any) => !!operation);

                    this.reconcileTransformedStructuralDelete(sentOperation, authoritativeOperations, serverVersion);
                    return;
                }
                if (isSheet && isTransformed) {
                    // Server modified or cancelled the sheet operation.
                    // The optimistic local state is no longer authoritative.
                    if (operations.length === 0) {
                        // Roll back cancelled optimistic sheet mutations.
                        this.rollbackCancelledSheetOperation(sentOperation);
                    } else if (sentOperation && this.canReapplySheetOperation(sentOperation.action)) {
                        // Safe to reapply: these operations are idempotent.
                        operations.forEach((operation: any) => {
                            const normalizedOperation: any = this.normalizeOperation(operation);
                            if (normalizedOperation) {
                                this.updateActions(normalizedOperation);
                            }
                        });
                    } else if (sentOperation) {
                        // For insert/duplicateSheet: reconcile by stable ID rather
                        // than creating another entity. Fall back to re-fetch so
                        // the remote state eventually converges.
                        if (serverVersion > this.version) {
                            this.version = serverVersion;
                            this.clientVersion = serverVersion;
                        }
                        this.fetchAndApplyPendingActions();
                        return;
                    }
                    // Update version tracking before resuming.
                    if (serverVersion > this.version) {
                        this.version = serverVersion;
                        this.clientVersion = serverVersion;
                    }
                    this.sendNextPendingAction();
                    return;
                }
                if (previousVersion > sentVersion) {
                    if (isSheet && sentOperation && this.canReapplySheetOperation(sentOperation.action)) {
                        // Reapply all authoritative operations the server returned.
                        operations.forEach((operation: any): void => {
                            const normalizedOperation: any =
                                this.normalizeOperation(operation);
                            if (normalizedOperation) {
                                this.updateActions(normalizedOperation);
                            }
                        });
                    } else {
                        operations.forEach((operation: any): void => {
                            const normalizedOperation: any =
                                this.normalizeOperation(operation);
                            if (!normalizedOperation) {
                                return;
                            }
                            if (normalizedOperation.action === 'deleteNote' ||
                                normalizedOperation.action === 'deleteComment') {
                                this.updateActions(normalizedOperation);
                            }
                        });
                    }
                }
                if (serverVersion > this.version) {
                    this.version = serverVersion;
                    this.clientVersion = serverVersion;
                }
                this.sendNextPendingAction();
            })
            .catch((error: Error): void => {
                if (this.acknowledgmentPending) {
                    this.pendingActions.unshift(this.acknowledgmentPending);
                }
                this.acknowledgmentPending = null;
            });
    }

    private selectedRangeHandler(): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        this.sendSelectionToServer(sheet.selectedRange, this.parent.activeSheetIndex);
    }

    private keyboardSelectionHandler(): void {
        if (!this.parent || this.parent.isDestroyed) { return; }
        const sheet: SheetModel = this.parent.getActiveSheet();
        this.sendSelectionToServer(sheet.selectedRange, this.parent.activeSheetIndex);
    }

    private editPresenceHandler(args: { isEditing: boolean }): void {
        if (!args) { return; }
        this.updateEditingState(args.isEditing);
    }

    private updateActions(operation: any): void {
        switch (operation.action) {
        case 'cellSave': {
            const cellSaveArgs: any = {
                value: operation.value,
                oldValue: operation.oldValue,
                address: operation.address,
                displayText: operation.displayText,
                formula: operation.formula,
                richText: operation.richText
            };
            const cellValue: any = cellSaveArgs.formula ? { formula: cellSaveArgs.formula, richText: cellSaveArgs.richText }
                : { value: cellSaveArgs.value, richText: cellSaveArgs.richText };
            this.parent.updateCellInfo(cellValue, cellSaveArgs.address);
            break;
        }
        case 'format': {
            const sheetIndex: number = !isNullOrUndefined(operation.sheetIndex) ? operation.sheetIndex : this.parent.activeSheetIndex;
            const range: string = operation.range.indexOf('!') > -1 ? operation.range : getSheetName(this.parent, sheetIndex) + '!' + operation.range;
            if (operation.style && operation.style.border && !isNullOrUndefined(operation.borderType)) {
                const style: CellStyleModel = {};
                Object.assign(style, operation.style);
                operation.style.border = undefined;
                this.parent.notify(setCellFormat, {
                    style: operation.style,
                    refreshRibbon: sheetIndex === this.parent.activeSheetIndex,
                    range: range, onActionUpdate: true, isUndoRedo: true
                });
                operation.style.border = style.border;
                this.parent.setBorder(operation.style, range, operation.borderType);
                operation.style = style;
            } else {
                this.parent.notify(setCellFormat, {
                    style: operation.style,
                    refreshRibbon: sheetIndex === this.parent.activeSheetIndex,
                    range: range, onActionUpdate: true, isUndoRedo: true
                });
            }
            break;
        }
        case 'numberFormat':
            this.parent.numberFormat(operation.format, operation.range);
            break;
        case 'conditionalFormat': {
            const conditionalFormat: ConditionalFormatModel = operation.conditionalFormat;
            this.parent.notify(setCFRule, <CFArgs>{
                cfModel: {
                    type: conditionalFormat.type,
                    cFColor: conditionalFormat.cFColor,
                    value: conditionalFormat.value,
                    range: conditionalFormat.range
                },
                sheetIdx: operation.sheetIdx
            });
            break;
        }
        case 'clearCF':
            this.parent.notify(clearCFRule, <CFArgs>{
                oldCFModel: operation.previousConditionalFormats,
                updatedCFModel: operation.conditionalFormats,
                range: operation.selectedRange,
                sheetIdx: operation.sheetIdx
            });
            break;
        case 'merge':
            if (operation.mergeCollection && operation.mergeCollection.length) {
                operation.mergeCollection.forEach((range: number[]) => {
                    this.parent.notify(setMerge, <MergeArgs>{
                        range: range,
                        merge: operation.merge,
                        type: operation.mergeType,
                        mergeCollection: operation.mergeCollection,
                        sheetIndex: operation.sheetIdx
                    });
                });
            } else {
                this.parent.notify(setMerge, <MergeArgs>{
                    range: operation.mergeRange,
                    merge: operation.merge,
                    type: operation.mergeType,
                    sheetIndex: operation.sheetIdx
                });
            }
            break;
        case 'wrap':
            wrap(operation.address, operation.wrap, this.parent as Workbook);
            break;
        case 'gridLines':
            this.parent.setSheetPropertyOnMute(this.parent.sheets[operation.sheetIdx], 'showGridLines', operation.isShow);
            (this.parent.serviceLocator.getService('sheet') as IRenderer).toggleGridlines();
            this.parent.notify(refreshRibbonIcons, null);
            break;
        case 'headers':
            this.parent.setSheetPropertyOnMute(this.parent.sheets[operation.sheetIdx], 'showHeaders', operation.isShow);
            (this.parent.serviceLocator.getService('sheet') as IRenderer).showHideHeaders();
            this.parent.notify(refreshRibbonIcons, null);
            break;
        case 'freezePanes':
        {
            const targetSheet: SheetModel = getSheet(this.parent, operation.sheetIdx);
            if (targetSheet && operation.topLeftCell && operation.paneTopLeftCell) {
                this.parent.setSheetPropertyOnMute(targetSheet, 'topLeftCell', operation.topLeftCell);
                this.parent.setSheetPropertyOnMute(targetSheet, 'paneTopLeftCell', operation.paneTopLeftCell);
            }
            this.parent.freezePanes(operation.row, operation.column, operation.sheetIdx);
            break;
        }
        case 'hyperlink':
            this.parent.notify(setLinkModel, {
                hyperlink: operation.hyperlink,
                cell: operation.address,
                displayText: operation.displayText
            });
            this.parent.serviceLocator.getService<ICellRenderer>('cell').refreshRange(
                getIndexesFromAddress(operation.address), false, false, false, true, isImported(this.parent));
            break;
        case 'removeHyperlink':
            this.parent.notify(removeHyperlink, { range: operation.address, preventEventTrigger: true });
            break;
        case 'protectSheet':
            if (operation.protectSheetArgs.isProtected) {
                this.parent.notify(protectsheetHandler, operation.protectSheetArgs);
            } else {
                this.parent.setSheetPropertyOnMute(getSheet(this.parent, operation.protectSheetArgs.sheetIndex), 'password', '');
                this.parent.notify(applyProtect, { isActive: true, sheetIndex: operation.protectSheetArgs.sheetIndex });
            }
            break;
        case 'protectWorkbook':
            if (operation.isProtected) {
                this.parent.notify(setProtectWorkbook, { isProtected: operation.isProtected, password: operation.password });
            } else {
                this.parent.notify(removeWorkbookProtection, null);
            }
            break;
        // case 'lockCells':
        //     this.parent.notify(setLockCells, { range: operation.range, isLocked: operation.isLocked });
        //     break;
        case 'validation':
            this.parent.notify(
                cellValidation, {
                    rules: {
                        type: operation.validation.type, operator: operation.validation.operator, value1: operation.validation.value1,
                        value2: operation.validation.value2, ignoreBlank: operation.validation.ignoreBlank,
                        inCellDropDown: operation.validation.inCellDropDown
                    },
                    range: operation.range
                });
            break;
        case 'removeValidation':
            this.parent.notify(removeDataValidation, { range: operation.range, isCol: operation.isColSelected });
            break;
        case 'addHighlight':
        case 'removeHighlight':
            this.parent.notify(invalidData, { isRemoveHighlight: operation.action === 'removeHighlight', isPublic: true });
            break;
        case 'sorting': {
            const sortEventArgs: BeforeSortEventArgs = {
                range: operation.range,
                sortOptions: operation.sortOptions,
                cancel: false
            };
            const promise: Promise<any> = Promise.resolve();
            const sortArgs: { args: BeforeSortEventArgs; promise: Promise<any> } = {
                args: sortEventArgs,
                promise: promise
            };
            this.parent.notify(initiateSort, sortArgs);
            sortArgs.promise.then((args: SortEventArgs | BeforeSortEventArgs) => {
                const range: string = args && args.range ? args.range : operation.range;
                const rangeIndexes: number[] = getIndexesFromAddress(range as string);
                rangeIndexes[0] = Math.max(0, rangeIndexes[0] - 1);
                this.parent.sortCollection = [];
                this.parent.notify(updateSortCollection, {
                    sortOptions: operation.sortOptions,
                    sheetIndex: operation.sheetIndex || operation.sheetIdx,
                    range: range
                });
                this.parent.serviceLocator.getService<ICellRenderer>('cell').refreshRange(rangeIndexes);
            });
            break;
        }
        case 'addNote':
        case 'editNote':
        case 'deleteNote': {
            const sheetIndex: number = getSheetIndex(
                this.parent as Workbook,
                operation.address.split('!')[0]
            );
            const cellIndexes: number[] = getIndexesFromAddress(
                operation.address.split('!')[1]
            );
            const cell: CellModel = getCell(cellIndexes[0], cellIndexes[1], this.parent.sheets[sheetIndex as number], false, true);
            updateCell(this.parent as Workbook, this.parent.sheets[sheetIndex as number],
                       {
                           rowIdx: cellIndexes[0], colIdx: cellIndexes[1], preventEvt: true, pvtExtend: true,
                           cell: { ...cell, notes: operation.action === 'deleteNote' ? null : operation.notes }
                       });
            this.parent.notify(noteUndoRedo, { cellIdx: cellIndexes, sheetIdx: sheetIndex });
            break;
        }
        case 'addComment':
        case 'editComment':
        case 'deleteComment':
        case 'resolveComment':
        case 'reopenComment':
        case 'addReply':
        case 'editReply':
        case 'deleteReply': {
            const sheetIndex: number = getSheetIndex(this.parent as Workbook, operation.address.split('!')[0]);
            const cellIndexes: number[] = getIndexesFromAddress(operation.address.split('!')[1]);
            const cell: CellModel = getCell(cellIndexes[0], cellIndexes[1], this.parent.sheets[sheetIndex as number], false, true);
            updateCell(this.parent as Workbook, this.parent.sheets[sheetIndex as number], {
                rowIdx: cellIndexes[0],
                colIdx: cellIndexes[1],
                preventEvt: true,
                pvtExtend: true,
                cell: { ...cell, comment: operation.action === 'deleteComment' ? null : operation.comment }
            });
            this.parent.notify(commentUndoRedo, { cellIdx: cellIndexes, sheetIdx: sheetIndex });
            break;
        }
        case 'cellDelete': {
            const addressInfo: { indices: number[]; sheetIndex: number } = this.parent.getAddressInfo(operation.address);
            clearRange(this.parent, addressInfo.indices, addressInfo.sheetIndex);
            break;
        }
        case 'clipboard': {
            if (operation.isExternalPaste) {
                if (!operation.pastedCellDetails || !operation.pastedCellDetails.length || !operation.pastedRange) { break; }
                const sheetName: string = getSheetNameFromAddress(operation.pastedRange);
                operation.pastedCellDetails.forEach((cell: any) => {
                    const address: string = sheetName + '!' + getCellAddress(cell.rowIndex, cell.colIndex);
                    const cellValue: CellModel = operation.pasteType === 'Values' ? { value: cell.value } : { value: cell.value, formula: cell.formula, format: cell.format, style: cell.style };
                    Object.keys(cellValue).forEach((key: string) => {
                        if (cellValue[key as string] === null || cellValue[key as string] === undefined) {
                            delete cellValue[key as string];
                        }
                    });
                    this.parent.updateCellInfo(cellValue, address);
                });
                break;
            }
            if (!operation.copiedRange || !operation.copiedInfo || !operation.pastedRange) { break; }
            const clipboardModule: {
                getCopiedInfo(): {
                    range: number[];
                    sId: number;
                    isCut: boolean;
                };
                restoreCopiedInfo(copiedInfo: {
                    range: number[];
                    sId: number;
                    isCut: boolean;
                } | null): void;
            } | undefined = (this.parent as unknown as {
                clipboardModule?: {
                    getCopiedInfo(): { range: number[]; sId: number; isCut: boolean; };
                    restoreCopiedInfo(copiedInfo: { range: number[]; sId: number; isCut: boolean; } | null): void;
                };
            }).clipboardModule;
            if (!clipboardModule) { break; }
            const localCopiedInfo: { range: number[]; sId: number; isCut: boolean } = clipboardModule.getCopiedInfo();
            const copiedAddressInfo: { indices: number[]; sheetIndex: number } = this.parent.getAddressInfo(operation.copiedRange);
            const clipboardPromise: Promise<void> = Promise.resolve();
            this.parent.notify(operation.copiedInfo.isCut ? cut : copy, {
                range: copiedAddressInfo.indices,
                sId: getSheet(this.parent, copiedAddressInfo.sheetIndex).id,
                promise: clipboardPromise,
                invokeCopy: true,
                isPublic: true,
                isFromUpdateAction: true
            });
            clipboardPromise.then((): void => {
                this.parent.notify(paste, {
                    range: getIndexesFromAddress(operation.pastedRange), sIdx: getSheetIndex(
                        this.parent, getSheetNameFromAddress(operation.pastedRange)),
                    type: operation.pasteType,
                    isAction: false,
                    isInternal: true,
                    isFromUpdateAction: true
                });
                clipboardModule.restoreCopiedInfo(localCopiedInfo);
            });
            break;
        }
        case 'resize':
        case 'resizeToFit':
            if (operation.isCol) {
                if (operation.hide === null || operation.hide === undefined) {
                    this.parent.setColWidth(parseFloat(operation.width), operation.index, operation.sheetIndex);
                } else {
                    this.parent.hideColumn(operation.index, operation.index, operation.hide);
                }
            } else {
                if (operation.hide === null || operation.hide === undefined) {
                    this.parent.setRowHeight(parseFloat(operation.height), operation.index, operation.sheetIndex);
                } else {
                    this.parent.hideRow(operation.index, operation.index, operation.hide);
                }
            }
            break;
        case 'renameSheet': {
            const sheetIndex: number = this.getSheetIndexById(
                operation.sheetId,
                operation.sheetIndex !== undefined ? operation.sheetIndex : operation.index
            );
            if (sheetIndex < 0 || sheetIndex >= this.parent.sheets.length) {
                break;
            }
            this.parent.setSheetPropertyOnMute(this.parent.sheets[sheetIndex as number], 'name', operation.value);
            this.parent.notify(sheetNameUpdate, {
                items: this.parent.element.querySelector('.e-sheet-tabs-items'),
                value: operation.value,
                idx: sheetIndex
            });
            break;
        }
        case 'hideSheet': {
            const sheetIndex: number = this.getSheetIndexById(operation.sheetId, operation.sheetIndex);
            if (sheetIndex < 0 || sheetIndex >= this.parent.sheets.length) {
                break;
            }
            this.parent.notify(hideSheet, { sheetIndex: sheetIndex, index: sheetIndex });
            break;
        }
        case 'showSheet': {
            const sheetIndex: number = this.getSheetIndexById(operation.sheetId, operation.sheetIndex);
            if (sheetIndex < 0 || sheetIndex >= this.parent.sheets.length) {
                break;
            }
            this.parent.notify(showSheet, { sheetIndex: sheetIndex, index: sheetIndex });
            break;
        }
        case 'removeSheet': {
            const deletedSheetIndex: number = this.getSheetIndexById(
                operation.sheetId, operation.sheetIndex !== undefined ? operation.sheetIndex : operation.index);
            if (deletedSheetIndex < 0 || deletedSheetIndex >= this.parent.sheets.length) { break; }
            const wasActiveSheetDeleted: boolean = this.parent.activeSheetIndex === deletedSheetIndex;
            this.parent.notify(removeSheetTab, {
                index: deletedSheetIndex,
                count: operation.sheetCount,
                clicked: true, isAction: true,
                isFromUpdateAction: true
            });
            this.updateCollaboratorsAfterSheetDelete(deletedSheetIndex);
            if (wasActiveSheetDeleted) {
                const activeSheet: SheetModel = this.parent.getActiveSheet();
                this.lastPresenceKey = '';
                this.sendSelectionToServer(activeSheet.selectedRange, this.parent.activeSheetIndex, true);
            }
            this.refreshRemoteSelections();
            this.renderCollaboratorRibbon();
            break;
        }
        case 'moveSheet': {
            const sourceIndex: number = this.getSheetIndexById(operation.sheetId, operation.sheetIndex);
            if (sourceIndex < 0 || sourceIndex >= this.parent.sheets.length) {
                break;
            }
            const targetIndex: number = isNullOrUndefined(operation.targetSheetId) ? operation.position :
                this.getSheetIndexById(operation.targetSheetId, -1);
            if (targetIndex < 0 || targetIndex >= this.parent.sheets.length || targetIndex === sourceIndex) {
                break;
            }
            const position: number = this.getMovePosition(sourceIndex, targetIndex, operation.placeAfter === true);
            moveSheet(this.parent, position, [sourceIndex], null, true);
            break;
        }
        case 'hideShow':
            this.parent.notify(hideShow, {
                startIndex:
                    operation.startIndex,
                endIndex:
                    operation.endIndex,
                isCol:
                    operation.isCol,
                hide:
                    operation.hide,
                sheetIndex:
                    operation.sheetIndex,
                hiddenIndexes:
                    operation.hiddenIndexes,
                isFromUpdateAction: true
            });
            break;
        case 'replace':
            this.parent.notify(replace, {
                value: operation.compareValue,
                replaceValue: operation.replaceValue,
                sheetIndex: operation.sheetIndex,
                address: operation.address
            });
            break;
        case 'replaceAll':
            this.parent.notify(replaceAll, operation.replaceArgs);
            break;
        case 'filter':
            if (operation.isFilterRemoved) {
                this.removeCollaborativeFilter(operation.sheetIndex);
            } else {
                this.applyAuthoritativeRemoteFilter(operation);
            }
            break;
        case 'insert': {
            if (operation.modelType === 'Sheet') {
                const insertedSheetModel:
                SheetModel & {
                    index?: number;
                } = {
                    id: operation.sheetId,
                    name: operation.sheetName,
                    index: operation.index
                } as SheetModel & {
                    index?: number;
                };
                this.parent.notify(insertModel, {
                    model: this.parent,
                    start: [insertedSheetModel],
                    modelType: 'Sheet',
                    activeSheetIndex:
                        operation.activeSheetIndex,
                    isUndoRedo: true,
                    isFromUpdateAction: true,
                    isRedo: operation.isRedo
                });
                break;
            }
            const sheet: SheetModel = getSheet(
                this.parent,
                operation.activeSheetIndex
            );
            if (!sheet) {
                break;
            }
            const modelCount: number =
                operation.modelCount &&
                    operation.modelCount > 0
                    ? operation.modelCount
                    : 1;
            this.parent.notify(insertModel, {
                model: sheet,
                start: operation.index,
                end:
                    operation.index +
                    modelCount -
                    1,
                modelType:
                    operation.modelType,
                activeSheetIndex:
                    operation.activeSheetIndex,
                insertType:
                    operation.insertType,
                isFromUpdateAction: true
            });
            break;
        }
        case 'delete': {
            const sheet: SheetModel = getSheet(
                this.parent,
                operation.activeSheetIndex
            );

            if (!sheet) {
                break;
            }

            this.parent.notify(deleteModel, {
                model: sheet,
                start:
                    operation.startIndex,
                end:
                    operation.endIndex,
                modelType:
                    operation.modelType,
                insertType:
                    operation.insertType,
                isFromUpdateAction: true
            });

            break;
        }
        case 'clear':
            this.parent.notify(clearViewer, { options: { range: operation.range, sheetIndex: operation.sheetIndex,
                type: operation.clearType, isSelectAll: operation.isSelectAll }, isFromUpdateAction: true });
            break;
        case 'insertImage':
            this.parent.notify(createImageElement, {
                options: {
                    src: operation.imageData,
                    height: operation.imageHeight,
                    width: operation.imageWidth,
                    id: operation.id
                },
                range: operation.range,
                isPublic: false,
                isUndoRedo: true
            });
            break;
        case 'deleteImage': {
            const imageLocation: {
                image: ImageModel;
                sheetIndex: number;
                rowIndex: number;
                columnIndex: number;
            } | null = this.getImageLocationForDelete(operation);
            if (!imageLocation) {
                break;
            }
            const runtimeImageId: string = imageLocation.image.id;
            const localAddress: string = getSheetName(this.parent, imageLocation.sheetIndex) + '!' +
                getCellAddress(imageLocation.rowIndex, imageLocation.columnIndex);
            this.parent.notify(deleteImage, {
                id: runtimeImageId,
                range: localAddress,
                preventEventTrigger: true,
                isFromUpdateAction: true
            });
            const sheet: SheetModel = getSheet(this.parent, imageLocation.sheetIndex);
            const cell: CellModel = getCell(imageLocation.rowIndex, imageLocation.columnIndex, sheet, false, false);
            if (cell && cell.image) {
                const imageIndex: number = cell.image.indexOf(imageLocation.image);
                if (imageIndex > -1) {
                    cell.image.splice(imageIndex, 1);
                }
            }
            const imageElement: HTMLElement = document.getElementById(runtimeImageId) as HTMLElement;
            if (imageElement && imageElement.parentElement) {
                imageElement.parentElement.removeChild(imageElement);
            }
            break;
        }
        case 'imageRefresh': {
            const imageArgs: any = operation.imageArgs;
            if (!imageArgs) {
                break;
            }
            const sheetIndex: number =
                operation.sheetIndex !== undefined && operation.sheetIndex !== null
                    ? operation.sheetIndex
                    : imageArgs.sheetIdx;
            const isResizeOnly: boolean =
                imageArgs.prevRowIdx === imageArgs.currentRowIdx &&
                imageArgs.prevColIdx === imageArgs.currentColIdx;
            let imageLocation: {
                image: ImageModel;
                rowIndex: number;
                columnIndex: number;
                sheetIndex: number;
            } | null = this.getImageLocation(
                imageArgs.id,
                sheetIndex,
                isResizeOnly ? imageArgs.currentRowIdx : imageArgs.prevRowIdx,
                isResizeOnly ? imageArgs.currentColIdx : imageArgs.prevColIdx,
                imageArgs.prevTop,
                imageArgs.prevLeft,
                imageArgs.prevHeight,
                imageArgs.prevWidth
            );
            if (!imageLocation) {
                imageLocation = this.getImageLocation(
                    imageArgs.id,
                    sheetIndex,
                    imageArgs.currentRowIdx,
                    imageArgs.currentColIdx,
                    imageArgs.currentTop,
                    imageArgs.currentLeft,
                    imageArgs.currentHeight,
                    imageArgs.currentWidth
                );
            }
            if (!imageLocation) {
                break;
            }
            const runtimeImageId: string = imageLocation.image.id;
            const currentHeight: number = imageArgs.currentHeight;
            const currentWidth: number = imageArgs.currentWidth;
            if (isResizeOnly) {
                if (currentHeight !== undefined && currentHeight !== null) {
                    imageLocation.image.height = currentHeight;
                }
                if (currentWidth !== undefined && currentWidth !== null) {
                    imageLocation.image.width = currentWidth;
                }
                (imageLocation.image as any).preservePos = true;
                const imageElement: HTMLElement = document.getElementById(runtimeImageId) as HTMLElement;
                if (imageElement) {
                    if (currentHeight !== undefined && currentHeight !== null) {
                        imageElement.style.height = currentHeight + 'px';
                    }
                    if (currentWidth !== undefined && currentWidth !== null) {
                        imageElement.style.width = currentWidth + 'px';
                    }
                    imageElement.style.top = imageLocation.image.top + 'px';
                    imageElement.style.left = imageLocation.image.left + 'px';
                }
                break;
            }
            const targetRowIndex: number = imageArgs.currentRowIdx;
            const targetColumnIndex: number = imageArgs.currentColIdx;
            const structuralTopOffset: number =
                imageArgs.prevTop !== undefined && imageArgs.prevTop !== null
                    ? imageLocation.image.top - imageArgs.prevTop
                    : 0;
            const structuralLeftOffset: number =
                imageArgs.prevLeft !== undefined && imageArgs.prevLeft !== null
                    ? imageLocation.image.left - imageArgs.prevLeft
                    : 0;
            const transformedTop: number =
                imageArgs.currentTop !== undefined && imageArgs.currentTop !== null
                    ? imageArgs.currentTop + structuralTopOffset
                    : imageLocation.image.top;
            const transformedLeft: number =
                imageArgs.currentLeft !== undefined && imageArgs.currentLeft !== null
                    ? imageArgs.currentLeft + structuralLeftOffset
                    : imageLocation.image.left;
            this.parent.notify(refreshImgCellObj, {
                id: runtimeImageId,
                requestType: 'imageRefresh',
                sheetIdx: imageLocation.sheetIndex,
                prevRowIdx: imageLocation.rowIndex,
                prevColIdx: imageLocation.columnIndex,
                currentRowIdx: targetRowIndex,
                currentColIdx: targetColumnIndex,
                prevTop: imageLocation.image.top,
                prevLeft: imageLocation.image.left,
                currentTop: transformedTop,
                currentLeft: transformedLeft,
                prevHeight: imageLocation.image.height,
                prevWidth: imageLocation.image.width,
                currentHeight,
                currentWidth,
                isUndoRedo: true,
                isFromUpdateAction: true
            });
            const updatedImageLocation: {
                image: ImageModel;
                rowIndex: number;
                columnIndex: number;
                sheetIndex: number;
            } | null = this.getImageLocationById(runtimeImageId);
            if (updatedImageLocation) {
                updatedImageLocation.image.top = transformedTop;
                updatedImageLocation.image.left = transformedLeft;
                if (currentHeight !== undefined && currentHeight !== null) {
                    updatedImageLocation.image.height = currentHeight;
                }
                if (currentWidth !== undefined && currentWidth !== null) {
                    updatedImageLocation.image.width = currentWidth;
                }
                (updatedImageLocation.image as any).preservePos = true;
            }
            const imageElement: HTMLElement = document.getElementById(runtimeImageId) as HTMLElement;
            if (imageElement) {
                imageElement.style.top = transformedTop + 'px';
                imageElement.style.left = transformedLeft + 'px';
                if (currentHeight !== undefined && currentHeight !== null) {
                    imageElement.style.height = currentHeight + 'px';
                }
                if (currentWidth !== undefined && currentWidth !== null) {
                    imageElement.style.width = currentWidth + 'px';
                }
            }
            break;
        }
        case 'insertChart': {
            const chartArgs: any = operation.chartArgs;
            if (!chartArgs || !chartArgs.id || !chartArgs.posRange) {
                break;
            }
            const chartOptions: ExtendedChartModel[] = [
                {
                    type: chartArgs.type,
                    theme: chartArgs.theme,
                    markerSettings: chartArgs.markerSettings,
                    dataLabelSettings: chartArgs.dataLabelSettings,
                    legendSettings: chartArgs.legendSettings,
                    primaryXAxis: chartArgs.primaryXAxis,
                    primaryYAxis: chartArgs.primaryYAxis,
                    isSeriesInRows: chartArgs.isSeriesInRows,
                    range: chartArgs.range,
                    id: chartArgs.id,
                    height: chartArgs.height,
                    width: chartArgs.width,
                    top: chartArgs.top,
                    left: chartArgs.left,
                    enableCanvas: chartArgs.enableCanvas,
                    skipDateInterpolation: chartArgs.skipDateInterpolation,
                    title: chartArgs.title
                }
            ];
            this.parent.notify(setChart, {
                chart: chartOptions,
                range: chartArgs.posRange,
                isInitCell: false,
                isFromUpdateAction: true
            });
            break;
        }
        case 'deleteChart': {
            const chartLocation: {
                chart: ExtendedChartModel;
                sheetIndex: number;
                rowIndex: number;
                columnIndex: number;
            } | null = this.getChartLocationForDelete(operation);
            if (!chartLocation) {
                break;
            }
            const runtimeChartId: string = chartLocation.chart.id;
            const localPositionRange: string = getSheetName(this.parent, chartLocation.sheetIndex) + '!' +
                getCellAddress(chartLocation.rowIndex, chartLocation.columnIndex);
            this.parent.notify(deleteChart, {
                id: runtimeChartId,
                range: localPositionRange,
                isUndoRedo: true
            });
            const sheet: SheetModel = getSheet(this.parent, chartLocation.sheetIndex);
            const cell: CellModel = getCell(chartLocation.rowIndex, chartLocation.columnIndex, sheet, false, false);
            if (cell && cell.chart) {
                for (let index: number = cell.chart.length - 1; index >= 0; index--) {
                    const chart: ExtendedChartModel = cell.chart[index as number];
                    if (chart && this.getChartModelId(chart.id) === this.getChartModelId(runtimeChartId)) {
                        cell.chart.splice(index, 1);
                    }
                }
            }
            for (let index: number = this.parent.chartColl.length - 1; index >= 0; index--) {
                const chart: ExtendedChartModel = this.parent.chartColl[index as number];
                if (chart && this.getChartModelId(chart.id) === this.getChartModelId(runtimeChartId)) {
                    this.parent.chartColl.splice(index, 1);
                }
            }
            const chartModelId: string = this.getChartModelId(runtimeChartId);
            const chartElement: HTMLElement = (
                document.getElementById(chartModelId + '_overlay') ||
                document.getElementById(chartModelId)
            ) as HTMLElement;
            if (chartElement && chartElement.parentElement) {
                chartElement.parentElement.removeChild(chartElement);
            }
            break;
        }
        case 'chartRefresh': {
            const chartArgs: any = operation.chartRefreshArgs;
            if (!chartArgs) {
                break;
            }
            const sheetIndex: number = operation.sheetIndex !== undefined && operation.sheetIndex !== null
                ? operation.sheetIndex
                : chartArgs.sheetIdx;
            const chartLocation: {
                chart: ExtendedChartModel;
                sheetIndex: number;
                rowIndex: number;
                columnIndex: number;
            } | null = this.getChartLocation(
                chartArgs.id,
                sheetIndex,
                chartArgs.prevRowIdx,
                chartArgs.prevColIdx
            );
            if (!chartLocation) {
                break;
            }
            const runtimeChartId: string = this.getChartModelId(chartLocation.chart.id);
            const runtimeOverlayId: string = runtimeChartId + '_overlay';
            const refreshArgs: any = {
                id: runtimeOverlayId,
                requestType: chartArgs.requestType,
                sheetIdx: chartLocation.sheetIndex,
                currentRowIdx: chartArgs.currentRowIdx,
                currentColIdx: chartArgs.currentColIdx,
                currentTop: chartArgs.currentTop,
                currentLeft: chartArgs.currentLeft,
                currentHeight: chartArgs.currentHeight,
                currentWidth: chartArgs.currentWidth,
                prevRowIdx: chartLocation.rowIndex,
                prevColIdx: chartLocation.columnIndex,
                prevTop: chartLocation.chart.top,
                prevLeft: chartLocation.chart.left,
                prevHeight: chartLocation.chart.height,
                prevWidth: chartLocation.chart.width,
                isUndoRedo: true
            };
            const isUndo: boolean = operation.isRedo === false;
            if (isUndo) {
                const undoArgs: any = {
                    id: runtimeOverlayId,
                    requestType: refreshArgs.requestType,
                    sheetIdx: refreshArgs.sheetIdx,
                    currentColIdx: refreshArgs.prevColIdx,
                    currentHeight: refreshArgs.prevHeight,
                    currentLeft: refreshArgs.prevLeft,
                    currentRowIdx: refreshArgs.prevRowIdx,
                    currentTop: refreshArgs.prevTop,
                    currentWidth: refreshArgs.prevWidth,
                    prevColIdx: refreshArgs.currentColIdx,
                    prevHeight: refreshArgs.currentHeight,
                    prevLeft: refreshArgs.currentLeft,
                    prevRowIdx: refreshArgs.currentRowIdx,
                    prevTop: refreshArgs.currentTop,
                    prevWidth: refreshArgs.currentWidth,
                    isUndoRedo: true
                };
                this.parent.notify(refreshChartCellObj, undoArgs);
                const chartElement: HTMLElement = (
                    document.getElementById(runtimeOverlayId) ||
                    document.getElementById(runtimeChartId)
                ) as HTMLElement;
                if (chartElement && undoArgs.currentHeight !== undefined && undoArgs.currentWidth !== undefined) {
                    this.parent.notify(refreshChartSize, {
                        height: undoArgs.currentHeight.toString(),
                        width: undoArgs.currentWidth.toString(),
                        overlayEle: chartElement
                    });
                }
            } else {
                this.parent.notify(refreshChartCellObj, refreshArgs);
                const chartElement: HTMLElement = (
                    document.getElementById(runtimeOverlayId) ||
                    document.getElementById(runtimeChartId)
                ) as HTMLElement;
                if (chartElement && refreshArgs.currentHeight !== undefined && refreshArgs.currentWidth !== undefined) {
                    this.parent.notify(refreshChartSize, {
                        height: refreshArgs.currentHeight.toString(),
                        width: refreshArgs.currentWidth.toString(),
                        overlayEle: chartElement
                    });
                }
            }
            break;
        }
        case 'chartDesign': {
            const chartDesignArgs: any = operation.chartDesignArgs;
            if (!chartDesignArgs) {
                break;
            }
            const sheetIndex: number = operation.sheetIndex !== undefined && operation.sheetIndex !== null
                ? operation.sheetIndex
                : this.parent.activeSheetIndex;
            let rowIndex: number | undefined;
            let columnIndex: number | undefined;
            if (chartDesignArgs.address) {
                const addressInfo: { indices: number[]; sheetIndex: number; } = this.parent.getAddressInfo(chartDesignArgs.address);
                rowIndex = addressInfo.indices[0];
                columnIndex = addressInfo.indices[1];
            }
            const chartLocation: {
                chart: ExtendedChartModel;
                sheetIndex: number;
                rowIndex: number;
                columnIndex: number;
            } | null = this.getChartLocation(
                this.getChartModelId(chartDesignArgs.id),
                sheetIndex,
                rowIndex,
                columnIndex
            );
            if (!chartLocation) {
                break;
            }
            const runtimeChartId: string = this.getChartModelId(chartLocation.chart.id);
            const runtimeOverlayId: string = runtimeChartId + '_overlay';
            const normalizedArgs: any = {
                id: document.getElementById(runtimeOverlayId) ? runtimeOverlayId : runtimeChartId,
                address: getSheetName(this.parent, chartLocation.sheetIndex) + '!' +
                    getCellAddress(chartLocation.rowIndex, chartLocation.columnIndex),
                chartType: chartDesignArgs.chartType,
                chartTheme: chartDesignArgs.chartTheme,
                addChartEle: chartDesignArgs.addChartEle,
                title: chartDesignArgs.title,
                switchRowColumn: chartDesignArgs.switchRowColumn,
                markerVisible: chartDesignArgs.markerVisible,
                triggerEvent: false,
                pXAxisLSize: chartDesignArgs.pXAxisLSize,
                pYAxisLSize: chartDesignArgs.pYAxisLSize
            };
            this.parent.notify(chartDesignTab, normalizedArgs);
            break;
        }
        case 'autofill': {
            if (operation.undoArgs) {
                const undoArgs: any = JSON.parse(operation.undoArgs);
                undoArgs.isFromUpdateAction =
                    undoArgs.isUndo =
                    undoArgs.preventEvt = true;
                undoArgs.isPublic = true;
                this.parent.notify(performUndoRedo, undoArgs);
            }
            this.parent.notify(setAutoFill, {
                fillRange: operation.fillRange,
                dataRange: operation.dataRange,
                fillType: operation.fillType,
                direction: operation.direction,
                cells: operation.beforeActionData
            });
            break;
        }
        case 'addDefinedName':
            this.parent.notify(workbookFormulaOperation, {
                action: 'addDefinedName',
                isAdded: false,
                definedName: operation.definedName,
                isEventTrigger: true
            });
            break;
        case 'duplicateSheet': {
            const activeSheetIndex: number = this.parent.activeSheetIndex;
            const sheetIndex: number = this.getSheetIndexById(operation.sheetId, operation.sheetIndex);
            if (sheetIndex < 0 || sheetIndex >= this.parent.sheets.length) {
                break;
            }
            // Pass the originator's duplicatedSheetId so the new
            // sheet receives the correct stable identity before
            // createSheet and formula registration.
            duplicateSheet(
                this.parent,
                sheetIndex,
                null,
                true,
                operation.duplicatedSheetId
            );
            if (this.parent.activeSheetIndex !== activeSheetIndex) {
                this.parent.notify(goToSheet, { selectedIndex: activeSheetIndex, previousIndex: this.parent.activeSheetIndex });
            }
            break;
        }
        }
    }

    /**
     * Resolves the stable sheet id for a given zero-based sheet index.
     * Returns null when the index is out of range or the sheet has no id.
     *
     * @param {number} sheetIndex - Zero-based sheet index.
     * @returns {number | null} The sheet id, or null when unavailable.
     */
    private getSheetId(sheetIndex: number): number | null {
        const sheet: SheetModel = getSheet(this.parent, sheetIndex);
        if (!sheet || sheet.id === undefined || sheet.id === null) {
            return null;
        }
        return sheet.id;
    }

    /**
     * Resolves the current zero-based sheet index from a stable sheet id.
     * Returns the legacy positional index only when no stable id was supplied.
     * When a stable id is supplied but cannot be resolved, returns -1 so the
     * caller can skip the action rather than misapply it to a different sheet.
     *
     * @param {number} sheetId - Stable sheet id.
     * @param {number} fallbackIndex - Legacy positional index to use when no id is supplied.
     * @returns {number} The resolved zero-based sheet index, or -1 when unresolved.
     */
    private getSheetIndexById(sheetId: number, fallbackIndex: number): number {
        if (!sheetId) {
            return typeof fallbackIndex === 'number'
                ? fallbackIndex
                : -1;
        }
        const sheetIndex: number = getSheetIndexFromId(this.parent, sheetId);
        return typeof sheetIndex === 'number' ? sheetIndex : -1;
    }

    /**
     * Returns true when the action is a sheet-tab-level operation whose
     * optimistic application must be reconciled against the server ACK.
     *
     * @param {any} operation - The operation to check.
     * @returns {boolean} True if this is a sheet-tab operation.
     */
    private isSheetOperation(operation: any): boolean {
        if (!operation) {
            return false;
        }
        switch (operation.action) {
        case 'insert':
            return operation.modelType === 'Sheet';
        case 'removeSheet':
        case 'renameSheet':
        case 'hideSheet':
        case 'showSheet':
        case 'moveSheet':
        case 'duplicateSheet':
            return true;
        default:
            return false;
        }
    }

    /**
     * Rolls back optimistic sheet-tab mutations that the server cancelled.
     *
     * @param {any} sentOperation - The original optimistic operation that was cancelled.
     * @returns {void} Does not return a value.
     */
    private rollbackCancelledSheetOperation(sentOperation: any): void {
        if (!sentOperation) {
            return;
        }
        switch (sentOperation.action) {
        case 'duplicateSheet': {
            const duplicatedSheetId: number = sentOperation.duplicatedSheetId;
            if (duplicatedSheetId !== undefined && duplicatedSheetId !== null) {
                const dupIndex: number = getSheetIndexFromId(this.parent, duplicatedSheetId);
                if (dupIndex >= 0) {
                    // `count` is the number of sheets being removed, NOT the
                    // total sheet count. Passing `sheets.length` here would
                    // trip the removeSheetTab guard that protects the last
                    // sheet and the duplicate would never be removed.
                    // `isAction: true` marks this as an internal correction
                    // so removeSheetTab does not fire `completeAction`,
                    // which would otherwise re-broadcast a removeSheet op
                    // and create a sendActionToServer feedback loop.
                    this.parent.notify(removeSheetTab, {
                        index: dupIndex,
                        count: 1,
                        clicked: true,
                        isAction: true
                    });
                }
            }
            break;
        }
        case 'moveSheet': {
            const sourceId: number = sentOperation.sheetId;
            if (sourceId === undefined || sourceId === null) {
                break;
            }
            const sourceIdx: number = getSheetIndexFromId(this.parent, sourceId);
            if (sourceIdx < 0) {
                // Source was already removed by a concurrent operation — nothing to undo.
                break;
            }
            // Attempt to restore the source to its original position using neighbour anchors.
            const prevId: number = sentOperation.previousSheetId;
            const nextId: number = sentOperation.nextSheetId;
            let restoreTargetIdx: number = -1;
            let restoreAfter: boolean = false;
            if (prevId !== undefined && prevId !== null) {
                restoreTargetIdx = getSheetIndexFromId(this.parent, prevId);
                if (restoreTargetIdx >= 0) {
                    restoreAfter = true; // place after previous neighbour
                }
            }
            if (restoreTargetIdx < 0 && nextId !== undefined && nextId !== null) {
                restoreTargetIdx = getSheetIndexFromId(this.parent, nextId);
                if (restoreTargetIdx >= 0) {
                    restoreAfter = false; // place before next neighbour
                }
            }
            if (restoreTargetIdx >= 0 && restoreTargetIdx !== sourceIdx) {
                const position: number = this.getMovePosition(sourceIdx, restoreTargetIdx, restoreAfter);
                moveSheet(this.parent, position, [sourceIdx], null, true);
            }
            break;
        }
        // insert, removeSheet, renameSheet, hideSheet, showSheet
        // rollbacks are not yet implemented — they require stored before-state.
        // The safest fallback for these is to reload the authoritative workbook.
        default:
            break;
        }
    }

    /**
     * Rolls back an optimistic delete by re-inserting the captured
     * deletedModel rows/columns at their original position.
     *
     * Uses the pre-captured deletedModel, deletedCellsModel,
     * conditionalFormats, comments, notesCol, and definedNames from
     * the delete operation to restore the workbook exactly as it was
     * before the optimistic deletion.
     *
     * @param {any} operation - The optimistic delete operation with
     *    captured deletedModel data.
     * @returns {void} Does not return a value.
     */
    private rollbackOptimisticDelete(operation: any): void {
        if (!operation || !operation.deletedModel || !operation.deletedModel.length) {
            throw new Error('Deleted model is unavailable for rollback.');
        }
        const sheet: SheetModel = getSheet(this.parent, operation.activeSheetIndex);
        if (!sheet) {
            throw new Error('Unable to resolve structural rollback sheet.');
        }
        this.parent.notify(insertModel, {
            model: sheet,
            start: operation.deletedModel,
            modelType: operation.modelType,
            activeSheetIndex: operation.activeSheetIndex,
            isUndoRedo: true,
            isRedo: false,
            prevAction: 'delete',
            columnCellsModel: operation.deletedCellsModel,
            conditionalFormats: operation.conditionalFormats || [],
            comments: operation.comments || [],
            notes: operation.notesCol || [],
            definedNames: operation.definedNames || [],
            isFromUpdateAction: true
        });
    }

    /**
     * Reconciles a transformed structural delete acknowledgement.
     *
     * 1. Rolls back Browser B's optimistic deletion.
     * 2. Applies buffered Browser A structural action.
     * 3. Applies the authoritative transformed Browser B operations.
     *
     * @param {any} sentOperation - The optimistic delete that was sent.
     * @param {any[]} authoritativeOperations - Normalized ops from the ack.
     * @param {number} serverVersion - Version from the server response.
     * @returns {void} Does not return a value.
     */
    private reconcileTransformedStructuralDelete(sentOperation: any, authoritativeOperations: any[], serverVersion: number): void {
        try {
            // Restore the optimistic local deletion.
            this.rollbackOptimisticDelete(sentOperation);

            // Apply remote structural actions that arrived while the local
            // deletion was pending.
            this.bufferedStructuralActions.sort(
                (firstAction: any, secondAction: any): number =>
                    firstAction.version - secondAction.version
            );

            this.bufferedStructuralActions.forEach(
                (actionInfo: any): void => {
                    actionInfo.operations.forEach(
                        (operation: any): void => {
                            this.updateActions(operation);
                        }
                    );
                }
            );

            // Apply the authoritative transformed local deletion without
            // the stale sheetCount guard so the deletion is not blocked.
            authoritativeOperations.forEach(
                (operation: any): void => {
                    if (
                        this.isStructuralRowColumnOperation(
                            operation
                        )
                    ) {
                        this.updateActions({
                            ...operation,
                            sheetCount: undefined
                        });

                        return;
                    }

                    this.updateActions(operation);
                }
            );

            this.bufferedStructuralActions = [];

            this.version = serverVersion;
            this.clientVersion = serverVersion;

            this.sendNextPendingAction();
        } catch (error) {
            this.bufferedStructuralActions = [];
            // Fall back to the authoritative workbook reload path.
            this.fetchAndApplyPendingActions();
        }
    }

    /**
     * Reconciles a transformed hideShow acknowledgement.
     *
     * 1. Undoes Browser B's optimistic hide/show.
     * 2. Applies the authoritative transformed hideShow.
     * 3. Updates the version.
     *
     * @param {any} sentOperation - The optimistic hideShow that was sent.
     * @param {any[]} authoritativeOperations - Normalized ops from the ack.
     * @param {number} serverVersion - Version from the server response.
     * @returns {void} Does not return a value.
     */
    private reconcileTransformedHideShow(
        sentOperation: any,
        authoritativeOperations: any[],
        serverVersion: number
    ): void {
        try {
            // Undo the optimistic hide/show operation.
            // Omit hiddenIndexes from the rollback — passing the
            // original optimistic indexes may interfere with unhide
            // processing.
            this.parent.notify(hideShow, {
                startIndex:
                    sentOperation.startIndex,
                endIndex:
                    sentOperation.endIndex,
                isCol:
                    sentOperation.isCol,
                hide:
                    !sentOperation.hide,
                sheetIndex:
                    sentOperation.sheetIndex,
                isFromUpdateAction: true
            });

            // Apply the authoritative transformed operation.
            authoritativeOperations.forEach(
                (operation: any): void => {
                    this.updateActions(operation);
                }
            );

            this.version = serverVersion;
            this.clientVersion = serverVersion;

            this.sendNextPendingAction();
        } catch (error) {
            this.fetchAndApplyPendingActions();
        }
    }

    /**
     * Returns true for sheet operations that are safe to reapply from an
     * authoritative server response without creating duplicates. Operations
     * like insert and duplicateSheet create new entities and should be
     * reconciled by stable ID rather than blindly reapplied.
     *
     * @param {string} action - The action name to check.
     * @returns {boolean} True if the action is safe to reapply.
     */
    private canReapplySheetOperation(action: string): boolean {
        switch (action) {
        case 'renameSheet':
        case 'hideSheet':
        case 'showSheet':
        case 'moveSheet':
            return true;
        default:
            return false;
        }
    }

    /**
     * Replaces a stale optimistic filter with the authoritative
     * transformed filter returned by the server.
     *
     * Two-step process:
     * 1. Remove the old optimistic filter through the supported
     *    clearFilter event (cleans filter collection, range, icons,
     *    predicate state, and row flags).
     * 2. Apply the authoritative transformed filter.
     *
     * @param {any} sentOperation - The optimistic filter operation the
     *    browser originally sent (contains the stale range).
     * @param {any} transformedOperation - The authoritative filter
     *    operation returned by the server (contains the new range).
     * @returns {Promise<void>} Resolves when the filter reconciliation
     *    completes.
     */
    private reapplyTransformedFilter(sentOperation: any, transformedOperation: any): Promise<void> {
        const sheetIndex: number = transformedOperation.sheetIndex !== undefined && transformedOperation.sheetIndex !== null
            ? transformedOperation.sheetIndex
            : sentOperation.sheetIndex;
        const sheet: SheetModel = getSheet(this.parent, sheetIndex);
        if (!sheet) {
            return Promise.reject(new Error('Unable to resolve the filter sheet.'));
        }
        return this.removeCollaborativeFilter(sheetIndex).then(() =>
            this.applyCollaborativeFilter(transformedOperation)
        );
    }

    /**
     * Removes any existing filter on the specified sheet through the
     * supported clearFilter event.  This cleans the filter collection,
     * filter range, filter icons, predicate state, and filtered row flags.
     *
     * @param {number} sheetIndex - Index of the sheet whose filter to remove.
     * @returns {Promise<void>} Resolves when removal completes.
     */
    private removeCollaborativeFilter(sheetIndex: number): Promise<void> {
        return new Promise<void>((resolve: () => void, reject: (reason?: any) => void): void => {
            const filterArgs: any = {
                predicates: undefined,
                sIdx: sheetIndex,
                isInternal: true,
                isFromUpdateAction: true,
                promise: Promise.resolve()
            };
            this.parent.notify(initiateFilterUI, filterArgs);
            const removalPromise: any = filterArgs.promise;
            if (removalPromise && typeof removalPromise.then === 'function') {
                removalPromise
                    .then((): void => resolve())
                    .catch((error: Error): void => reject(error));
                return;
            }
            resolve();
        });
    }

    /**
     * Applies a filter operation through the standard initiateFilterUI
     * event. Used for both local acknowledgements and remote filter
     * application, ensuring consistent arguments in both paths.
     *
     * @param {any} operation - The normalized filter operation to apply.
     * @returns {Promise<void>} Resolves when the filter is applied.
     */
    private applyCollaborativeFilter(operation: any): Promise<void> {
        return new Promise<void>((resolve: (value?: void | PromiseLike<void>) => void, reject: (reason?: any) => void): void => {
            const filterArgs: any = {
                predicates: operation.predicates,
                range: operation.range,
                sIdx: operation.sheetIndex,
                sheetIndex: operation.sheetIndex,
                isInternal: true,
                isFromUpdateAction: true,
                useFilterRange: operation.useFilterRange,
                allowHeaderFilter: operation.allowHeaderFilter,
                promise: Promise.resolve()
            };
            this.parent.notify(initiateFilterUI, filterArgs);
            const applicationPromise: any = filterArgs.promise;
            if (applicationPromise && typeof applicationPromise.then === 'function') {
                applicationPromise
                    .then(() => resolve())
                    .catch((error: Error) => reject(error));
                return;
            }
            resolve();
        });
    }

    /**
     * Applies a remote filter operation with stale-filter guard.
     *
     * Before applying a remote filter, checks whether the target sheet
     * already has a filter whose range differs from the incoming range.
     * If so, removes the stale filter through clearFilter first. This
     * protects Browser A (the row inserter) from receiving a
     * remote filter that conflicts with an existing state filter.
     *
     * @param {any} operation - The normalized filter operation to apply.
     * @returns {Promise<void>} Resolves when the filter is applied.
     */
    private applyAuthoritativeRemoteFilter(operation: any): Promise<void> {
        const sheetIndex: number = operation.sheetIndex;
        const existingFilter: any = this.getFilterCollection(sheetIndex);
        if (existingFilter && existingFilter.hasFilter && existingFilter.filterRange && existingFilter.filterRange !== operation.range) {
            return this.removeCollaborativeFilter(sheetIndex).then(() =>
                this.applyCollaborativeFilter(operation)
            );
        }
        return this.applyCollaborativeFilter(operation);
    }

    /**
     * Returns the filter collection entry for the given sheet index.
     *
     * @param {number} sheetIndex - The sheet to look up.
     * @returns {any} The filter collection object or undefined.
     */
    private getFilterCollection(sheetIndex: number): any {
        const collections: any[] = (this.parent as any).filterCollection || [];
        return collections.find((collection: any) => collection && collection.sheetIndex === sheetIndex);
    }

    /**
     * Returns the positional insertion index for a single-sheet move,
     * accounting for the shift caused by removing the source before insertion.
     *
     * @param {number} sourceIndex - Current index of the sheet to move.
     * @param {number} targetIndex - Current index of the destination anchor.
     * @param {boolean} placeAfter - True to place source after the anchor.
     * @returns {number} The insertion position to pass to moveSheet.
     */
    private getMovePosition(sourceIndex: number, targetIndex: number, placeAfter: boolean): number {
        let position: number = placeAfter ? targetIndex + 1 : targetIndex;
        if (sourceIndex < position) {
            position--;
        }
        return position;
    }

    private getOperationInfo(data: CollaborativeEditArgs): object | null {
        switch (data.action) {
        case 'cellSave':
            return {
                action: 'cellSave',
                address: data.eventArgs.address,
                sheetIndex: this.parent.activeSheetIndex,
                value: data.eventArgs.value,
                oldValue: data.eventArgs.oldValue,
                displayText: data.eventArgs.displayText,
                formula: data.eventArgs.formula,
                richText: data.eventArgs.richText
            };
        case 'format':
            if (data.eventArgs.requestType === 'CellFormat') {
                return {
                    action: 'format',
                    range: data.eventArgs.range,
                    sheetIndex: this.parent.activeSheetIndex,
                    style: data.eventArgs.style,
                    borderType: data.eventArgs.borderType
                };
            } else {
                return {
                    action: 'numberFormat',
                    range: data.eventArgs.range,
                    sheetIndex: this.parent.activeSheetIndex,
                    format: data.eventArgs.format
                };
            }
        case 'conditionalFormat':
            return {
                action: 'conditionalFormat',
                sheetIdx: data.eventArgs.sheetIdx,
                sheetIndex: this.parent.activeSheetIndex,
                conditionalFormat: {
                    type: data.eventArgs.type,
                    cFColor: data.eventArgs.cFColor,
                    value: data.eventArgs.value,
                    range: data.eventArgs.range
                }
            };
        // case 'clearCF':
        //     return {
        //         action: 'clearCF',
        //         previousConditionalFormats: data.eventArgs.previousConditionalFormats,
        //         conditionalFormats: data.eventArgs.conditionalFormats,
        //         selectedRange: data.eventArgs.selectedRange,
        //         sheetIdx: data.eventArgs.sheetIdx
        //     };
        case 'clearCF':
            return {
                action: 'clearCF',
                previousConditionalFormats: this.getConditionalFormatModels(
                    data.eventArgs.previousConditionalFormats
                ),
                conditionalFormats: this.getConditionalFormatModels(
                    data.eventArgs.conditionalFormats
                ),
                selectedRange: data.eventArgs.selectedRange,
                sheetIdx: data.eventArgs.sheetIdx,
                sheetIndex: this.parent.activeSheetIndex
            };
        case 'merge':
            return {
                action: 'merge',
                mergeRange: data.eventArgs.range,
                merge: data.eventArgs.merge,
                mergeType: data.eventArgs.type,
                mergeCollection: data.eventArgs.mergeCollection,
                sheetIdx: data.eventArgs.sheetIndex
            };
        case 'wrap':
            return {
                action: 'wrap',
                address: data.eventArgs.address,
                sheetIndex: this.parent.activeSheetIndex,
                wrap: data.eventArgs.wrap
            };
        case 'gridLines':
            return {
                action: 'gridLines',
                sheetIdx: data.eventArgs.sheetIdx,
                isShow: data.eventArgs.isShow
            };
        case 'headers':
            return {
                action: 'headers',
                sheetIdx: data.eventArgs.sheetIdx,
                isShow: data.eventArgs.isShow
            };
        case 'freezePanes':
        {
            const sheet: SheetModel = getSheet(this.parent, data.eventArgs.sheetIndex);
            return {
                action: 'freezePanes',
                row: data.eventArgs.row,
                column: data.eventArgs.column,
                sheetIdx: data.eventArgs.sheetIndex,
                topLeftCell: sheet ? sheet.topLeftCell : 'A1',
                paneTopLeftCell: sheet ? sheet.paneTopLeftCell : 'A1'
            };
        }
        case 'hyperlink':
            return {
                action: 'hyperlink',
                address: data.eventArgs.address,
                sheetIndex: this.parent.activeSheetIndex,
                hyperlink: data.eventArgs.hyperlink,
                displayText: data.eventArgs.displayText
            };
        case 'removeHyperlink':
            return {
                action: 'removeHyperlink',
                address: data.eventArgs.address,
                sheetIndex: this.parent.activeSheetIndex,
                preventEventTrigger: data.eventArgs.preventEventTrigger
            };
        case 'protectSheet':
            return {
                action: 'protectSheet',
                protectSheetArgs: data.eventArgs
            };
        case 'protectWorkbook':
            return {
                action: 'protectWorkbook',
                isProtected: data.eventArgs.isProtected,
                password: data.eventArgs.password
            };
        // case 'lockCells':
        //     return {
        //         action: 'lockCells',
        //         range: data.eventArgs.range,
        //         isLocked: data.eventArgs.isLocked
        //     };
        case 'validation':
            return {
                action: 'validation',
                range: data.eventArgs.range,
                sheetIndex: this.parent.activeSheetIndex,
                validation: {
                    type: data.eventArgs.type,
                    operator: data.eventArgs.operator,
                    value1: data.eventArgs.value1,
                    value2: data.eventArgs.value2,
                    ignoreBlank: data.eventArgs.ignoreBlank,
                    inCellDropDown: data.eventArgs.inCellDropDown
                }
            };
        case 'removeValidation':
            return {
                action: 'removeValidation',
                range: data.eventArgs.range,
                sheetIndex: this.parent.activeSheetIndex,
                isColSelected: data.eventArgs.isColSelected
            };
        case 'addHighlight':
        case 'removeHighlight':
            return {
                action: data.action
            };
        case 'sorting': {
            const sortOptions: any = data.eventArgs.sortOptions;
            const sortDescriptors: any[] = Array.isArray(sortOptions.sortDescriptors)
                ? sortOptions.sortDescriptors
                : [sortOptions.sortDescriptors];
            const addressInfo: { indices: number[]; sheetIndex: number } = this.parent.getAddressInfo(data.eventArgs.range);
            return {
                action: 'sorting',
                range: data.eventArgs.range,
                sheetIndex: addressInfo.sheetIndex,
                sortOptions: {
                    sortDescriptors: sortDescriptors,
                    containsHeader: sortOptions.containsHeader,
                    caseSensitive: sortOptions.caseSensitive
                }
            };
        }
        case 'addNote':
        case 'editNote':
        case 'deleteNote':
            return {
                action: data.action,
                address: data.eventArgs.address,
                sheetIndex: this.parent.activeSheetIndex,
                notes: data.eventArgs.notes
            };
        case 'addComment':
        case 'editComment':
        case 'deleteComment':
        case 'resolveComment':
        case 'reopenComment':
        case 'addReply':
        case 'editReply':
        case 'deleteReply':
            return {
                action: data.action,
                address: data.eventArgs.address,
                sheetIndex: this.parent.activeSheetIndex,
                comment: data.eventArgs.comment
            };
        case 'cellDelete':
            return {
                action: 'cellDelete',
                address: data.eventArgs.address,
                sheetIndex: this.parent.activeSheetIndex
            };
        case 'clipboard': {
            const eventArgs: any = data.eventArgs;
            const copiedInfo: any = eventArgs.copiedInfo;
            const isExternalPaste: boolean = !!(copiedInfo && copiedInfo.isExternal);
            const externalTypes: string[] = isExternalPaste && copiedInfo.isExternal.types
                ? Array.prototype.slice.call(copiedInfo.isExternal.types)
                : [];
            const isPlainTextPaste: boolean = externalTypes.indexOf('text/plain') > -1 && externalTypes.indexOf('text/html') === -1;
            const cellDetails: any[] = eventArgs.pastedCellDetails && eventArgs.pastedCellDetails.length
                ? eventArgs.pastedCellDetails
                : eventArgs.beforeActionData && eventArgs.beforeActionData.cellDetails
                    ? eventArgs.beforeActionData.cellDetails
                    : [];
            const copiedAddressInfo: { indices: number[]; sheetIndex: number } | null = eventArgs.copiedRange
                ? this.parent.getAddressInfo(eventArgs.copiedRange)
                : null;
            const copySheetIndex: number | null = copiedAddressInfo ? copiedAddressInfo.sheetIndex : null;
            const pasteSheetIndex: number = this.parent.activeSheetIndex;
            return {
                action: 'clipboard',
                copiedRange: eventArgs.copiedRange,
                pastedRange: eventArgs.pastedRange,
                copiedInfo: isExternalPaste ? null : copiedInfo,
                copySheetIndex: copySheetIndex,
                pasteSheetIndex: pasteSheetIndex,
                sheetIndex: pasteSheetIndex, // Destination sheet fallback for existing paths.
                pasteType: isPlainTextPaste ? 'Values' : eventArgs.type,
                isExternalPaste: isExternalPaste,
                pastedCellDetails: cellDetails.map((cell: any) => ({
                    rowIndex: cell.rowIndex,
                    colIndex: cell.colIndex,
                    value: cell.value,
                    formula: cell.formula,
                    format: cell.format,
                    formattedText: cell.formattedText,
                    style: cell.style,
                    hyperlink: cell.hyperlink,
                    richText: cell.richText
                }))
            };
        }
        case 'resize':
        case 'resizeToFit':
            return {
                action: data.action,
                index: data.eventArgs.index,
                oldWidth: data.eventArgs.oldWidth,
                width: data.eventArgs.width,
                oldHeight: data.eventArgs.oldHeight,
                height: data.eventArgs.height,
                hide: data.eventArgs.hide,
                isCol: data.eventArgs.isCol,
                sheetIndex: data.eventArgs.sheetIndex
            };
        case 'renameSheet': {
            const sheetId: number = (data.eventArgs as any).sheetId !== undefined
                ? (data.eventArgs as any).sheetId
                : data.eventArgs.index;
            const sheetIndex: number = getSheetIndexFromId(this.parent, sheetId);
            return {
                action: 'renameSheet',
                sheetId: sheetId,
                sheetIndex: sheetIndex,
                value: data.eventArgs.value
            };
        }
        case 'hideSheet':
        case 'showSheet':
            return {
                action: data.action,
                sheetId: this.getSheetId(data.eventArgs.sheetIndex),
                sheetIndex: data.eventArgs.sheetIndex,
                index: data.eventArgs.index
            };
        case 'removeSheet': {
            const sheetId: number = (data.eventArgs as any).sheetId !== undefined
                ? (data.eventArgs as any).sheetId
                : (data.eventArgs.beforeActionData && data.eventArgs.beforeActionData.sheetId !== undefined
                    ? data.eventArgs.beforeActionData.sheetId
                    : null);
            return {
                action: 'removeSheet',
                sheetId: sheetId,
                sheetIndex: data.eventArgs.index,
                index: data.eventArgs.index,
                sheetCount: data.eventArgs.sheetCount
            };
        }
        case 'moveSheet': {
            // Use pre-captured stable identities — never resolve index post-move.
            const sheetId: number = (data.eventArgs as any).sheetId !== undefined
                ? (data.eventArgs as any).sheetId
                : null;
            const sheetIndex: number = Array.isArray(data.eventArgs.sheetIndexes) && data.eventArgs.sheetIndexes.length
                ? data.eventArgs.sheetIndexes[0]
                : data.eventArgs.index;
            const targetSheetId: number = (data.eventArgs as any).targetSheetId !== undefined
                ? (data.eventArgs as any).targetSheetId
                : null;
            const placeAfter: boolean = (data.eventArgs as any).placeAfter !== undefined
                ? (data.eventArgs as any).placeAfter
                : false;
            const previousSheetId: number = (data.eventArgs as any).previousSheetId !== undefined
                ? (data.eventArgs as any).previousSheetId
                : null;
            const nextSheetId: number = (data.eventArgs as any).nextSheetId !== undefined
                ? (data.eventArgs as any).nextSheetId
                : null;
            return {
                action: 'moveSheet',
                sheetId: sheetId,
                sheetIndex: sheetIndex,
                position: data.eventArgs.position,
                targetSheetId: targetSheetId,
                placeAfter: placeAfter,
                previousSheetId: previousSheetId,
                nextSheetId: nextSheetId
            };
        }

        case 'hideShow':
            return {
                action: 'hideShow',
                startIndex: data.eventArgs.startIndex,
                endIndex: data.eventArgs.endIndex,
                isCol: data.eventArgs.isCol,
                hide: data.eventArgs.hide,
                sheetIndex: data.eventArgs.sheetIndex,
                hiddenIndexes: data.eventArgs.hiddenIndexes
            };

        case 'replace':
            return {
                action: 'replace',
                address: data.eventArgs.address,
                sheetIndex:
                    data.eventArgs.sheetIndex !== undefined
                        ? data.eventArgs.sheetIndex
                        : this.parent.activeSheetIndex,
                compareValue: data.eventArgs.compareValue,
                replaceValue: data.eventArgs.replaceValue
            };
        case 'replaceAll': {
            const addressCollection: string[] = data.eventArgs.addressCollection;
            const addressSheetIndexes: number[] = addressCollection.map(
                (address: string): number => this.parent.getAddressInfo(address).sheetIndex
            );
            const sheetIndex: number = data.eventArgs.sheetIndex !== undefined
                ? data.eventArgs.sheetIndex
                : this.parent.activeSheetIndex;
            return {
                action: 'replaceAll',
                sheetIndex: sheetIndex,
                replaceArgs: {
                    value: data.eventArgs.value,
                    replaceValue: data.eventArgs.replaceValue,
                    isCSen: data.eventArgs.isCSen,
                    isEMatch: data.eventArgs.isEMatch,
                    mode: data.eventArgs.mode,
                    searchBy: data.eventArgs.searchBy,
                    findOpt: data.eventArgs.findOpt,
                    sheetIndex: sheetIndex,
                    replaceBy: data.eventArgs.replaceBy,
                    addressCollection: addressCollection,
                    addressSheetIndexes: addressSheetIndexes,
                    isAction: data.eventArgs.isAction,
                    cancel: data.eventArgs.cancel
                }
            };
        }
        case 'filter': {
            const eventArgs: CollaborativeEditingEventArgs = data.eventArgs;
            const sheetIndex: number | undefined = !isNullOrUndefined(eventArgs.sheetIndex) ? eventArgs.sheetIndex
                : this.parent.activeSheetIndex;
            const predicates: PredicateModel[] | Predicate[] | undefined = Array.isArray(eventArgs.predicates) ? eventArgs.predicates
                : eventArgs.filterOptions && Array.isArray(eventArgs.filterOptions.predicates)
                    ? eventArgs.filterOptions.predicates : undefined;
            const isFilterRemoved: boolean = !eventArgs.filterOptions && !Array.isArray(eventArgs.predicates);
            return {
                action: 'filter',
                range: eventArgs.range,
                sheetIndex: sheetIndex,
                predicates: predicates,
                isFilterRemoved: isFilterRemoved,
                useFilterRange: eventArgs.useFilterRange,
                allowHeaderFilter: eventArgs.allowHeaderFilter
            };
        }
        case 'insert':
            return {
                action: 'insert',
                modelType: data.eventArgs.modelType,
                index: data.eventArgs.index,
                modelCount:
                    data.eventArgs.model && data.eventArgs.model.length || 1,
                activeSheetIndex: data.eventArgs.activeSheetIndex,
                sheetCount: data.eventArgs.sheetCount,
                insertType: data.eventArgs.insertType,
                sheetId: data.eventArgs.model && data.eventArgs.model.length
                    ? (data.eventArgs.model as any)[0].id
                    : null,
                sheetName: data.eventArgs.model && data.eventArgs.model.length
                    ? (data.eventArgs.model as any)[0].name
                    : null
            };
        case 'delete':
            return {
                action: 'delete',
                modelType: data.eventArgs.modelType,
                startIndex: data.eventArgs.startIndex,
                endIndex: data.eventArgs.endIndex,
                activeSheetIndex: data.eventArgs.activeSheetIndex,
                sheetCount: data.eventArgs.sheetCount,
                insertType: data.eventArgs.insertType,
                deletedModel:
                    data.eventArgs.deletedModel,
                deletedCellsModel:
                    data.eventArgs.deletedCellsModel,
                conditionalFormats:
                    data.eventArgs.conditionalFormats,
                comments:
                    data.eventArgs.comments,
                notesCol:
                    data.eventArgs.notesCol,
                definedNames:
                    data.eventArgs.definedNames
            };
        case 'clear':
            return {
                action: 'clear',
                range: data.eventArgs.range,
                sheetIndex: data.eventArgs.sheetIndex,
                clearType: data.eventArgs.type,
                isSelectAll: data.eventArgs.isSelectAll
            };
        case 'insertImage': {
            const addressInfo: { indices: number[]; sheetIndex: number; } = this.parent.getAddressInfo(data.eventArgs.range);
            return {
                action: 'insertImage',
                id: data.eventArgs.id,
                range: data.eventArgs.range,
                sheetIndex: addressInfo.sheetIndex,
                imageData: data.eventArgs.imageData,
                imageHeight: data.eventArgs.imageHeight,
                imageWidth: data.eventArgs.imageWidth,
                imageTop: data.eventArgs.imageTop,
                imageLeft: data.eventArgs.imageLeft
            };
        }
        case 'deleteImage': {
            const addressInfo: { indices: number[]; sheetIndex: number; } = this.parent.getAddressInfo(data.eventArgs.address);
            return {
                action: 'deleteImage',
                id: data.eventArgs.id,
                address: data.eventArgs.address,
                sheetIndex: addressInfo.sheetIndex,
                imageHeight: data.eventArgs.imageHeight,
                imageWidth: data.eventArgs.imageWidth,
                imageTop: data.eventArgs.imageTop,
                imageLeft: data.eventArgs.imageLeft
            };
        }
        case 'imageRefresh': {
            const imageArgs: any = data.eventArgs;
            const positionTolerance: number = 1;
            const previousTop: number = imageArgs.prevTop !== undefined ? imageArgs.prevTop : 0;
            const previousLeft: number = imageArgs.prevLeft !== undefined ? imageArgs.prevLeft : 0;
            const currentTop: number = imageArgs.currentTop !== undefined ? imageArgs.currentTop : previousTop;
            const currentLeft: number = imageArgs.currentLeft !== undefined ? imageArgs.currentLeft : previousLeft;
            const hasMoved: boolean = Math.abs(currentTop - previousTop) > positionTolerance
                || Math.abs(currentLeft - previousLeft) > positionTolerance;
            return {
                action: 'imageRefresh',
                sheetIndex: imageArgs.sheetIdx,
                isRedo: imageArgs.isRedo,
                imageArgs: {
                    id: imageArgs.id,
                    requestType: imageArgs.requestType,
                    sheetIdx: imageArgs.sheetIdx,
                    prevRowIdx: imageArgs.prevRowIdx,
                    prevColIdx: imageArgs.prevColIdx,
                    prevTop: imageArgs.prevTop,
                    prevLeft: imageArgs.prevLeft,
                    prevHeight: imageArgs.prevHeight,
                    prevWidth: imageArgs.prevWidth,
                    currentRowIdx: hasMoved ? imageArgs.currentRowIdx : imageArgs.prevRowIdx,
                    currentColIdx: hasMoved ? imageArgs.currentColIdx : imageArgs.prevColIdx,
                    currentTop: imageArgs.currentTop,
                    currentLeft: imageArgs.currentLeft,
                    currentHeight: imageArgs.currentHeight,
                    currentWidth: imageArgs.currentWidth,
                    isRedo: imageArgs.isRedo,
                    isUndoRedo: imageArgs.isUndoRedo
                }
            };
        }
        case 'insertChart': {
            const eventArgs: any = data.eventArgs;
            if (!eventArgs.id || !eventArgs.posRange) {
                return null;
            }
            const addressInfo: { indices: number[]; sheetIndex: number; } = this.parent.getAddressInfo(eventArgs.posRange);
            return {
                action: 'insertChart',
                sheetIndex: addressInfo.sheetIndex,
                chartArgs: {
                    type: eventArgs.type,
                    theme: eventArgs.theme,
                    markerSettings: eventArgs.markerSettings,
                    dataLabelSettings: eventArgs.dataLabelSettings,
                    legendSettings: eventArgs.legendSettings,
                    primaryXAxis: eventArgs.primaryXAxis,
                    primaryYAxis: eventArgs.primaryYAxis,
                    isSeriesInRows: eventArgs.isSeriesInRows,
                    range: eventArgs.range,
                    posRange: eventArgs.posRange,
                    id: eventArgs.id,
                    height: eventArgs.height,
                    width: eventArgs.width,
                    top: eventArgs.top,
                    left: eventArgs.left,
                    enableCanvas: eventArgs.enableCanvas,
                    skipDateInterpolation: eventArgs.skipDateInterpolation,
                    title: eventArgs.title
                }
            };
        }
        case 'deleteChart': {
            const eventArgs: any = data.eventArgs;
            if (!eventArgs.id) {
                return null;
            }
            const chartPosition: {
                range: string;
                sheetIndex: number;
            } | null = this.getChartPositionById(eventArgs.id);
            const positionRange: string = eventArgs.posRange || (chartPosition ? chartPosition.range : null);
            const sheetIndex: number = chartPosition ? chartPosition.sheetIndex : this.parent.activeSheetIndex;
            if (!positionRange) {
                return null;
            }
            return {
                action: 'deleteChart',
                sheetIndex: sheetIndex,
                chartArgs: {
                    id: eventArgs.id,
                    range: eventArgs.range,
                    posRange: positionRange,
                    height: eventArgs.height,
                    width: eventArgs.width,
                    top: eventArgs.top,
                    left: eventArgs.left
                }
            };
        }
        case 'chartRefresh': {
            const eventArgs: any = data.eventArgs;
            const sheetIndex: number = eventArgs.sheetIdx !== undefined
                && eventArgs.sheetIdx !== null ? eventArgs.sheetIdx : this.parent.activeSheetIndex;
            return {
                action: 'chartRefresh',
                sheetIndex: sheetIndex,
                isRedo: eventArgs.isRedo,
                chartRefreshArgs: {
                    id: this.getChartModelId(eventArgs.id),
                    sheetIdx: sheetIndex,
                    requestType: eventArgs.requestType,
                    currentTop: eventArgs.currentTop,
                    currentLeft: eventArgs.currentLeft,
                    currentHeight: eventArgs.currentHeight,
                    currentWidth: eventArgs.currentWidth,
                    currentRowIdx: eventArgs.currentRowIdx,
                    currentColIdx: eventArgs.currentColIdx,
                    prevTop: eventArgs.prevTop,
                    prevLeft: eventArgs.prevLeft,
                    prevHeight: eventArgs.prevHeight,
                    prevWidth: eventArgs.prevWidth,
                    prevRowIdx: eventArgs.prevRowIdx,
                    prevColIdx: eventArgs.prevColIdx,
                    isUndoRedo: eventArgs.isUndoRedo
                }
            };
        }
        case 'chartDesign': {
            const eventArgs: any = data.eventArgs;
            let sheetIndex: number = this.parent.activeSheetIndex;
            let address: string = eventArgs.address;
            if (address) {
                const addressInfo: { indices: number[]; sheetIndex: number; } = this.parent.getAddressInfo(address);
                sheetIndex = addressInfo.sheetIndex;
            } else {
                const chartLocation: {
                    chart: ExtendedChartModel;
                    sheetIndex: number;
                    rowIndex: number;
                    columnIndex: number;
                } | null = this.getChartLocation(this.getChartModelId(eventArgs.id), sheetIndex);
                if (chartLocation) {
                    sheetIndex = chartLocation.sheetIndex;
                    address = getSheetName(this.parent, chartLocation.sheetIndex) + '!' + getCellAddress(chartLocation.rowIndex, chartLocation.columnIndex);
                }
            }
            if (!eventArgs.id || !address) {
                return null;
            }
            return {
                action: 'chartDesign',
                sheetIndex: sheetIndex,
                chartDesignArgs: {
                    id: this.getChartModelId(eventArgs.id),
                    address: address,
                    chartType: eventArgs.chartType,
                    chartTheme: eventArgs.chartTheme,
                    addChartEle: eventArgs.addChartEle,
                    title: eventArgs.title,
                    switchRowColumn: eventArgs.switchRowColumn,
                    markerVisible: eventArgs.markerVisible,
                    pXAxisLSize: eventArgs.pXAxisLSize,
                    pYAxisLSize: eventArgs.pYAxisLSize
                }
            };
        }
        case 'autofill': {
            const undoEventArgs: CollaborativeEditingEventArgs | null = data.eventArgs.undoArgs && data.eventArgs.undoArgs.eventArgs ?
                data.eventArgs.undoArgs.eventArgs : null;
            const previousCellDetails: any[] =
                undoEventArgs &&
                    undoEventArgs.beforeActionData &&
                    undoEventArgs.beforeActionData.cellDetails
                    ? undoEventArgs.beforeActionData.cellDetails
                    : [];
            const dataAddressInfo: { indices: number[]; sheetIndex: number } =
                this.parent.getAddressInfo(data.eventArgs.dataRange);
            return {
                action: 'autofill',
                fillRange: data.eventArgs.fillRange,
                dataRange: data.eventArgs.dataRange,
                fillType: data.eventArgs.fillType,
                direction: data.eventArgs.direction,
                sheetIndex: dataAddressInfo.sheetIndex,
                previousCellDetails: previousCellDetails.map(
                    (cell: any) => ({
                        rowIndex: cell.rowIndex,
                        colIndex: cell.colIndex,
                        value: cell.value,
                        formula: cell.formula,
                        style: cell.style,
                        format: cell.format,
                        formattedText: cell.formattedText,
                        hyperlink: cell.hyperlink,
                        richText: cell.richText
                    })
                ),
                undoArgs: data.eventArgs.undoArgs
                    ? JSON.stringify(data.eventArgs.undoArgs)
                    : null
            };
        }
        case 'addDefinedName':
            return {
                action: 'addDefinedName',
                definedName: {
                    name: data.eventArgs.name,
                    refersTo: data.eventArgs.refersTo,
                    scope: data.eventArgs.scope,
                    comment: data.eventArgs.comment
                }
            };
        case 'duplicateSheet':
            return {
                action: 'duplicateSheet',
                sheetId: (data.eventArgs as any).sheetId !== undefined
                    ? (data.eventArgs as any).sheetId
                    : this.getSheetId(data.eventArgs.sheetIndex),
                duplicatedSheetId: (data.eventArgs as any).duplicatedSheetId !== undefined
                    ? (data.eventArgs as any).duplicatedSheetId
                    : null,
                sheetIndex: data.eventArgs.sheetIndex
            };
        default:
            return null;
        }
    }

    private getConditionalFormatModels(conditionalFormats: ConditionalFormatModel[]): object[] {
        if (!conditionalFormats || !conditionalFormats.length) {
            return [];
        }

        return conditionalFormats.map(
            (conditionalFormat: ConditionalFormatModel): object => ({
                type: conditionalFormat.type,
                cFColor: conditionalFormat.cFColor,
                value: conditionalFormat.value,
                range: conditionalFormat.range
            })
        );
    }

    private getChartModelId(chartId: string): string {
        if (!chartId) {
            return chartId;
        }
        return chartId.endsWith('_overlay') ? chartId.substring(0, chartId.length - '_overlay'.length) : chartId;
    }
    private getChartLocation(
        chartId: string,
        sheetIndex: number,
        rowIndex?: number,
        columnIndex?: number
    ): { chart: ExtendedChartModel; sheetIndex: number; rowIndex: number; columnIndex: number } | null {
        const chartModelId: string = this.getChartModelId(chartId);
        if (chartId) {
            for (let currentSheetIndex: number = 0; currentSheetIndex < this.parent.sheets.length; currentSheetIndex++) {
                const sheet: SheetModel = this.parent.sheets[currentSheetIndex as number];
                const rows: RowModel[] = sheet && sheet.rows ? sheet.rows : [];
                for (let currentRowIndex: number = 0; currentRowIndex < rows.length; currentRowIndex++) {
                    const cells: CellModel[] | undefined = rows[currentRowIndex as number]
                        && rows[currentRowIndex as number].cells ? rows[currentRowIndex as number].cells : [];
                    for (let currentColumnIndex: number = 0; currentColumnIndex < cells.length; currentColumnIndex++) {
                        const charts: ChartModel[] | undefined = cells[currentColumnIndex as number]
                            && cells[currentColumnIndex as number].chart ? cells[currentColumnIndex as number].chart : [];
                        const chart: ChartModel | undefined = charts.find((c: ChartModel) => !!c
                            && this.getChartModelId(c.id) === chartModelId);
                        if (chart) {
                            return { chart, sheetIndex: currentSheetIndex, rowIndex: currentRowIndex, columnIndex: currentColumnIndex };
                        }
                    }
                }
            }
        }
        if (
            sheetIndex === undefined || sheetIndex === null ||
            rowIndex === undefined || rowIndex === null ||
            columnIndex === undefined || columnIndex === null
        ) {
            return null;
        }
        const sheet: SheetModel = getSheet(this.parent, sheetIndex);
        if (!sheet) {
            return null;
        }
        const cell: CellModel = getCell(rowIndex, columnIndex, sheet, false, false);
        const charts: ChartModel[] = cell && cell.chart ? cell.chart : [];
        if (charts.length === 1) {
            return { chart: charts[0], sheetIndex, rowIndex, columnIndex };
        }
        return null;
    }
    private getChartPositionById(chartId: string): { range: string; sheetIndex: number } | null {
        const chartLocation: {
            chart: ExtendedChartModel;
            sheetIndex: number;
            rowIndex: number;
            columnIndex: number;
        } | null = this.getChartLocation(chartId, this.parent.activeSheetIndex);
        if (!chartLocation) {
            return null;
        }
        return {
            range: getSheetName(this.parent, chartLocation.sheetIndex) + '!' + getCellAddress(chartLocation.rowIndex, chartLocation.columnIndex),
            sheetIndex: chartLocation.sheetIndex
        };
    }


    private getChartLocationForDelete(operation: any): {
        chart: ExtendedChartModel;
        sheetIndex: number;
        rowIndex: number;
        columnIndex: number;
    } | null {
        const chartArgs: any = operation.chartArgs;
        if (!chartArgs) {
            return null;
        }
        if (chartArgs.id) {
            for (let sheetIndex: number = 0; sheetIndex < this.parent.sheets.length; sheetIndex++) {
                const sheet: SheetModel = this.parent.sheets[sheetIndex as number];
                const rows: RowModel[] = sheet && sheet.rows ? sheet.rows : [];
                for (let rowIndex: number = 0; rowIndex < rows.length; rowIndex++) {
                    const cells: CellModel[] = rows[rowIndex as number]
                        && rows[rowIndex as number].cells ? rows[rowIndex as number].cells : [];
                    for (let columnIndex: number = 0; columnIndex < cells.length; columnIndex++) {
                        const cellsObj: CellModel = cells[columnIndex as number];
                        const charts: ExtendedChartModel[] = cellsObj && cellsObj.chart ? cellsObj.chart : [];
                        const chart: ExtendedChartModel = charts.find((currentChart: ExtendedChartModel): boolean =>
                            !!currentChart &&
                            this.getChartModelId(currentChart.id) === this.getChartModelId(chartArgs.id)
                        );
                        if (chart) {
                            return {
                                chart: chart,
                                sheetIndex: sheetIndex,
                                rowIndex: rowIndex,
                                columnIndex: columnIndex
                            };
                        }
                    }
                }
            }
        }
        if (!chartArgs.posRange) {
            return null;
        }
        const addressInfo: {
            indices: number[];
            sheetIndex: number;
        } = this.parent.getAddressInfo(chartArgs.posRange);
        const sheetIndex: number = operation.sheetIndex !== undefined && operation.sheetIndex !== null
            ? operation.sheetIndex
            : addressInfo.sheetIndex;
        const rowIndex: number = addressInfo.indices[0];
        const columnIndex: number = addressInfo.indices[1];
        const sheet: SheetModel = getSheet(this.parent, sheetIndex);
        if (!sheet) {
            return null;
        }
        const cell: CellModel = getCell(rowIndex, columnIndex, sheet, false, false);
        const charts: ExtendedChartModel[] = cell && cell.chart ? cell.chart : [];
        if (charts.length === 1) {
            return {
                chart: charts[0],
                sheetIndex: sheetIndex,
                rowIndex: rowIndex,
                columnIndex: columnIndex
            };
        }
        if (charts.length > 1) {
            let matchedChart: ExtendedChartModel = null;
            let smallestDifference: number = Number.MAX_VALUE;
            charts.forEach((chart: ExtendedChartModel): void => {
                let difference: number = 0;
                if (chartArgs.top !== undefined && chart.top !== undefined) {
                    difference += Math.abs(chart.top - chartArgs.top);
                }
                if (chartArgs.left !== undefined && chart.left !== undefined) {
                    difference += Math.abs(chart.left - chartArgs.left);
                }
                if (chartArgs.height !== undefined && chart.height !== undefined) {
                    difference += Math.abs(chart.height - chartArgs.height);
                }
                if (chartArgs.width !== undefined && chart.width !== undefined) {
                    difference += Math.abs(chart.width - chartArgs.width);
                }
                if (difference < smallestDifference) {
                    smallestDifference = difference;
                    matchedChart = chart;
                }
            });
            if (matchedChart) {
                return {
                    chart: matchedChart,
                    sheetIndex: sheetIndex,
                    rowIndex: rowIndex,
                    columnIndex: columnIndex
                };
            }
        }
        return null;
    }

    private getImageLocationForDelete(operation: any): {
        image: ImageModel; sheetIndex: number; rowIndex: number; columnIndex: number;
    } | null {
        const senderImageId: string = operation.id;
        if (senderImageId) {
            const senderImageLocation: {
                image: ImageModel; rowIndex: number; columnIndex: number; sheetIndex: number;
            } | null = this.getImageLocationById(senderImageId);
            if (senderImageLocation) {
                return senderImageLocation;
            }
        }
        if (!operation.address) {
            return null;
        }
        const addressInfo: { sheetIndex: number; indices: number[] } = this.parent.getAddressInfo(operation.address);
        const sheetIndex: number = operation.sheetIndex !== undefined && operation.sheetIndex !== null
            ? operation.sheetIndex : addressInfo.sheetIndex;
        const rowIndex: number = addressInfo.indices[0];
        const columnIndex: number = addressInfo.indices[1];
        const sheet: SheetModel = getSheet(this.parent, sheetIndex);
        if (!sheet) {
            return null;
        }
        const cell: CellModel = getCell(rowIndex, columnIndex, sheet, false, false);
        const images: ImageModel[] = cell && cell.image ? cell.image : [];
        if (images.length === 1) {
            return { image: images[0], sheetIndex, rowIndex, columnIndex };
        }
        if (images.length > 1) {
            let matchedImage: ImageModel = null;
            let smallestDifference: number = Number.MAX_VALUE;
            images.forEach((image: ImageModel): void => {
                if (!image) {
                    return;
                }
                let difference: number = 0;
                if (operation.imageTop !== undefined && image.top !== undefined) {
                    difference += Math.abs(image.top - operation.imageTop);
                }
                if (operation.imageLeft !== undefined && image.left !== undefined) {
                    difference += Math.abs(image.left - operation.imageLeft);
                }
                if (operation.imageHeight !== undefined && image.height !== undefined) {
                    difference += Math.abs(image.height - operation.imageHeight);
                }
                if (operation.imageWidth !== undefined && image.width !== undefined) {
                    difference += Math.abs(image.width - operation.imageWidth);
                }
                if (difference < smallestDifference) {
                    smallestDifference = difference;
                    matchedImage = image;
                }
            });
            if (matchedImage) {
                return { image: matchedImage, sheetIndex, rowIndex, columnIndex };
            }
        }
        return null;
    }

    private getImageLocation(
        imageId: string,
        sheetIndex: number,
        rowIndex?: number,
        columnIndex?: number,
        top?: number,
        left?: number,
        height?: number,
        width?: number
    ): { image: ImageModel; rowIndex: number; columnIndex: number; sheetIndex: number } | null {
        const imageLocationById: {
            image: ImageModel;
            rowIndex: number;
            columnIndex: number;
            sheetIndex: number;
        } | null = this.getImageLocationById(imageId);
        if (imageLocationById) {
            return imageLocationById;
        }
        if (
            sheetIndex === undefined || sheetIndex === null ||
            rowIndex === undefined || rowIndex === null ||
            columnIndex === undefined || columnIndex === null
        ) {
            return null;
        }
        const sheet: SheetModel = getSheet(this.parent, sheetIndex);
        if (!sheet) {
            return null;
        }
        const cell: CellModel = getCell(rowIndex, columnIndex, sheet, false, false);
        const images: ImageModel[] = cell && cell.image ? cell.image : [];
        if (images.length === 1) {
            return { image: images[0], rowIndex, columnIndex, sheetIndex };
        }
        if (images.length > 1) {
            let matchedImage: ImageModel = null;
            let smallestDifference: number = Number.MAX_VALUE;
            for (let index: number = 0; index < images.length; index++) {
                const image: ImageModel = images[index as number];
                if (!image) {
                    continue;
                }
                let difference: number = 0;
                let comparisonCount: number = 0;
                if (top !== undefined && top !== null && image.top !== undefined && image.top !== null) {
                    difference += Math.abs(image.top - top);
                    comparisonCount++;
                }
                if (left !== undefined && left !== null && image.left !== undefined && image.left !== null) {
                    difference += Math.abs(image.left - left);
                    comparisonCount++;
                }
                if (height !== undefined && height !== null && image.height !== undefined && image.height !== null) {
                    difference += Math.abs(image.height - height);
                    comparisonCount++;
                }
                if (width !== undefined && width !== null && image.width !== undefined && image.width !== null) {
                    difference += Math.abs(image.width - width);
                    comparisonCount++;
                }
                if (comparisonCount === 0) {
                    continue;
                }
                if (difference < smallestDifference) {
                    smallestDifference = difference;
                    matchedImage = image;
                }
            }
            if (matchedImage && smallestDifference <= 12) {
                return { image: matchedImage, rowIndex, columnIndex, sheetIndex };
            }
        }
        return null;
    }

    private getImageLocationById(imageId: string): { image: ImageModel; rowIndex: number; columnIndex: number; sheetIndex: number } | null {
        if (!imageId) {
            return null;
        }
        for (let sheetIndex: number = 0; sheetIndex < this.parent.sheets.length; sheetIndex++) {
            const sheet: SheetModel = this.parent.sheets[sheetIndex as number];
            const rows: RowModel[] = sheet && sheet.rows ? sheet.rows : [];
            for (let rowIndex: number = 0; rowIndex < rows.length; rowIndex++) {
                const cells: CellModel[] = rows[rowIndex as number] && rows[rowIndex as number].cells ?
                    rows[rowIndex as number].cells : [];
                for (let columnIndex: number = 0; columnIndex < cells.length; columnIndex++) {
                    const images: ImageModel[] = cells[columnIndex as number] && cells[columnIndex as number].image ?
                        cells[columnIndex as number].image : [];
                    for (let imageIndex: number = 0; imageIndex < images.length; imageIndex++) {
                        const image: ImageModel = images[imageIndex as number];
                        if (image && image.id === imageId) {
                            return {
                                image: image,
                                rowIndex: rowIndex,
                                columnIndex: columnIndex,
                                sheetIndex: sheetIndex
                            };
                        }
                    }
                }
            }
        }
        return null;
    }

    public getUserName(): string {
        return this.parent.collaborativeEditingModule && this.parent.collaborativeEditingModule.userName;
    }

    public getConnectionId(): string {
        return this.parent.collaborativeEditingModule.connectionId;
    }

    public destroy(): void {
        if (!this.parent.isDestroyed) {
            if (this.parent && this.roomName && this.serviceUrl) {
                (this.parent as any).__collabPreservedState = {
                    roomName: this.roomName,
                    serviceUrl: this.serviceUrl,
                    version: this.version,
                    clientVersion: this.clientVersion,
                    connectionId: this.connectionId,
                    userName: this.userName,
                    localColor: this.localColor,
                    hasConnected: this.hasConnected,
                    remoteUsers: new Map(this.remoteUsers),
                    latestUserSelections: new Map(this.latestUserSelections),
                    disconnectedSelectionIds: new Set(this.disconnectedSelectionIds)
                };
            }
            this.parent.off(mouseUpAfterSelection, this.selectedRangeHandler);
            this.parent.off(cellNavigate, this.keyboardSelectionHandler);
            this.parent.off(collaborativeEditPresence, this.editPresenceHandler);
            this.parent.off(rowHeightChanged, this.scheduleReposition);
            this.parent.off(colWidthChanged, this.scheduleReposition);
            this.parent.off(activeSheetChanged, this.activeSheetChangedHandler);
            this.parent.off(virtualContentLoaded, this.scheduleReposition);
            this.parent.off(contentLoaded, this.contentLoadedHandler);
        }
        this.pendingUserNames.clear();
        if (this.scrollElement) {
            EventHandler.remove(this.scrollElement, 'scroll', this.scheduleReposition);
            this.scrollElement = null;
        }
        if (this.selectionTimer) {
            window.clearTimeout(this.selectionTimer);
            this.selectionTimer = null;
        }
        if (this.refreshTimer) {
            window.clearTimeout(this.refreshTimer);
            this.refreshTimer = null;
        }
        Object.keys(this.remoteSelectionElements).forEach((connectionId: string): void => {
            this.removeRemoteSelectionElement(connectionId);
        });
        this.ribbonAvatarTooltips.forEach((tooltip: Tooltip): void => {
            tooltip.destroy();
        });
        this.ribbonAvatarTooltips.clear();
        if (this.ribbonGroupTooltip) {
            this.ribbonGroupTooltip.destroy();
            this.ribbonGroupTooltip = null;
        }
        this.presenceRevision++;
        this.latestUserSelections.clear();
        this.disconnectedSelectionIds.clear();
        this.remoteUsers.clear();
        this.remoteSelectionElements = {};
        this.ribbonAvatarElements.clear();
        this.ribbonGroupAvatar = null;
        this.ribbonHost = null;
        this.avatarInitialText.clear();
        this.avatarExpandedText.clear();
        this.acknowledgmentPending = null;
        this.pendingActions = [];
        this.bufferedStructuralActions = [];
        this.isSyncServerChanges = false;
        this.hasConnected = false;
        this.version = 0;
        this.clientVersion = 0;
        this.connectionId = '';
        this.roomName = '';
        this.serviceUrl = '';
        this.lastPresenceKey = '';
        this.localColor = '';
        this.userName = '';
        this.isEditing = false;
        this.parent = null;
    }

    /**
     * Get the sheet chart module name.
     *
     * @returns {string} - Get the module name.
     */
    public getModuleName(): string {
        return 'collaborativeEditing';
    }
}
