import { activeCellChanged, beginAction, CellModel, ExtendedSheet, ExtendedThreadedCommentModel, getCell, getCellAddress, getCellIndexes, getRowHeight, getSheetName, importModelUpdate, setCell, SheetModel, Workbook } from '../../workbook/index';
import { initiateComment, completeAction, createCommentIndicator, deleteComment, Spreadsheet, removeCommentContainer, locale, replyToComment, showCommentsPane, refreshCommentsPane, commentUndoRedo, getDPRValue, processSheetComments } from '../index';
import { Browser, closest, detach, enableRipple, EventHandler, getComponent, getUniqueID, isNullOrUndefined, L10n } from '@syncfusion/ej2-base';
import { getUpdateUsingRaf, navigateNextPrevComment, updateNoteContainer } from './../common/index';
import { CommentSaveEventArgs, getRangeAddress, ThreadedCommentModel, updateCell } from '../../workbook/index';
import { Button } from '@syncfusion/ej2-buttons';
import { DropDownButton, ItemModel, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { ListView, SelectEventArgs, Virtualization } from '@syncfusion/ej2-lists';

ListView.Inject(Virtualization);

/**
 * Comment module.
 */
export class SpreadsheetComment {
    private parent: Spreadsheet;
    /** @hidden */
    public isCommentVisible: boolean = false;
    /** @hidden */
    public isCommentVisibleOnTouch: boolean = false;
    /** @hidden */
    public isReviewPaneVisible: boolean = false;
    /** @hidden */
    public activeCommentCell: number[];

    private isEditing: boolean = false;
    private commentListView: ListView;
    private bodyHost: HTMLElement;
    private activeReplyDdb: DropDownButton;
    private editingState: {
        isReply: boolean; replyId?: string; textEl: HTMLElement; editorWrap: HTMLElement;
        originalText: string; tsEle?: HTMLElement; tsValue?: string; container?: HTMLElement;
        textHost?: HTMLElement; addrIdx?: number[];
    };
    private reviewPaneEl: HTMLElement;
    private reviewHeaderEl: HTMLElement;
    private reviewBodyEl: HTMLElement;
    private reviewInstances: Array<{ destroy: () => void }> = [];
    private reviewFilter: string = 'all';
    private reviewFilterDdb: DropDownButton;
    private scheduleMountId: number = 0;

    /**
     * Initializes a new instance of the `SpreadsheetComment` class
     *
     * @param {Spreadsheet} parent - Constructor for SpreadsheetComment module.
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
    }

    private addEventListener(): void {
        this.parent.on(initiateComment, this.initiateComment, this);
        this.parent.on(deleteComment, this.deleteComment, this);
        this.parent.on(createCommentIndicator, this.createCommentIndicator, this);
        this.parent.on(removeCommentContainer, this.removeCommentContainer, this);
        this.parent.on(replyToComment, this.replyToComment, this);
        this.parent.on(importModelUpdate, this.updateCommentsFromSheet, this);
        this.parent.on(showCommentsPane, this.showCommentPane, this);
        this.parent.on(navigateNextPrevComment, this.navigateNextPrevComment, this);
        this.parent.on(refreshCommentsPane, this.refreshCommentsPane, this);
        this.parent.on(processSheetComments, this.processSheetComments, this);
        this.parent.on(commentUndoRedo, this.onCommentUndoRedo, this);
        this.parent.on(activeCellChanged, this.commentHandler, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(initiateComment, this.initiateComment);
            this.parent.off(deleteComment, this.deleteComment);
            this.parent.off(createCommentIndicator, this.createCommentIndicator);
            this.parent.off(removeCommentContainer, this.removeCommentContainer);
            this.parent.off(replyToComment, this.replyToComment);
            this.parent.off(importModelUpdate, this.updateCommentsFromSheet);
            this.parent.off(showCommentsPane, this.showCommentPane);
            this.parent.off(navigateNextPrevComment, this.navigateNextPrevComment);
            this.parent.off(refreshCommentsPane, this.refreshCommentsPane);
            this.parent.off(processSheetComments, this.processSheetComments);
            this.parent.off(commentUndoRedo, this.onCommentUndoRedo);
            this.parent.off(activeCellChanged, this.commentHandler);
        }
    }

    private initiateComment(args?: { rowIndex: number, columnIndex: number, isMouseOver?: boolean, isSelection?: boolean }): void {
        const cellIndexes: number[] = (args && !isNullOrUndefined(args.rowIndex) && !isNullOrUndefined(args.columnIndex)) ?
            [args.rowIndex, args.columnIndex] : getCellIndexes(this.parent.getActiveSheet().activeCell);
        const targetElement: HTMLElement = this.parent.getCell(cellIndexes[0], cellIndexes[1]);
        if (!isNullOrUndefined(targetElement)) {
            if (!targetElement.querySelector('.e-comment-indicator')) {
                this.createCommentIndicator({ targetEle: targetElement, rIdx: cellIndexes[0], cIdx: cellIndexes[1] });
            }
            if (args && args.isMouseOver) {
                this.createCommentContainer(targetElement, cellIndexes[0], cellIndexes[1]);
                this.activeCommentCell = [cellIndexes[0], cellIndexes[1]];
                return;
            }
            if (this.isReviewPaneVisible) {
                const sheet: ExtendedSheet = this.parent.getActiveSheet() as ExtendedSheet;
                const existing: ExtendedThreadedCommentModel = (sheet.comments || []).find(
                    (t: ExtendedThreadedCommentModel) => t.address && t.address[0] === cellIndexes[0] && t.address[1] === cellIndexes[1]);
                if (existing && existing.id) {
                    this.scrollToThreadInPanel(existing.id, args && args.isSelection);
                } else {
                    this.renderNewCommentForPanel(cellIndexes[0], cellIndexes[1]);
                }
            } else {
                this.createCommentContainer(targetElement, cellIndexes[0], cellIndexes[1]);
                this.activeCommentCell = [cellIndexes[0], cellIndexes[1]];
            }
        }
    }

    private createCommentIndicator(args: { targetEle: HTMLElement, rIdx: number, cIdx: number, skipEvent?: boolean }): void {
        const commentIndicator: HTMLElement = this.parent.createElement('div', { className: 'e-comment-indicator' });
        if (args.targetEle.children.length > 0) {
            const rowHeight: number = getRowHeight(this.parent.getActiveSheet(), args.rIdx);
            const defaultFilterButtonHeight: number = 20;
            for (let i: number = 0; i < args.targetEle.childElementCount; i++) {
                const children: Element = args.targetEle.children[i as number];
                if (children.className.indexOf('e-filter-btn') > -1) {
                    if (this.parent.enableRtl) {
                        commentIndicator.style.left = (rowHeight < (defaultFilterButtonHeight + 10) ?
                            (children.getBoundingClientRect().width <= 0 ? defaultFilterButtonHeight :
                                children.getBoundingClientRect().width + 1) : 2) + 'px';
                    } else {
                        commentIndicator.style.right = (rowHeight < (defaultFilterButtonHeight + 10) ?
                            (children.getBoundingClientRect().width <= 0 ? defaultFilterButtonHeight :
                                children.getBoundingClientRect().width + 1) : 2) + 'px';
                    }
                }
                if (children.className.indexOf('e-validation-list') > -1) {
                    if (this.parent.enableRtl) {
                        commentIndicator.style.left = `${(children.getBoundingClientRect().width || 20) + 2}px`;
                    } else {
                        commentIndicator.style.right = `${(children.getBoundingClientRect().width || 20) + 2}px`;
                    }
                }
            }
        }
        if (!commentIndicator.dataset.commentListenersAdded && !args.skipEvent) {
            commentIndicator.dataset.commentRowIndex = args.rIdx.toString();
            commentIndicator.dataset.commentColIndex = args.cIdx.toString();
            EventHandler.add(commentIndicator, 'mouseover', this.mouseOver, this);
            EventHandler.add(commentIndicator, 'mouseout', this.mouseOut, this);
            commentIndicator.dataset.commentListenersAdded = 'true';
        }
        args.targetEle.appendChild(commentIndicator);
    }

    private mouseOver(event: MouseEvent): void {
        const cell: HTMLElement = event.currentTarget as HTMLElement;
        const row: number = parseInt(cell.dataset.commentRowIndex, 10);
        const col: number = parseInt(cell.dataset.commentColIndex, 10);
        if (!isNaN(row) && !isNaN(col)) {
            const containerInDOM: Element = document.getElementsByClassName('e-comment-container')[0];
            if ((this.isCommentVisibleOnTouch && !isNullOrUndefined(containerInDOM)) || isNullOrUndefined(containerInDOM)) {
                if (!isNullOrUndefined(containerInDOM)) {
                    this.removeCommentContainer();
                }
                this.initiateComment({ rowIndex: row, columnIndex: col, isMouseOver: true });
                this.isCommentVisible = true;
            }
        }
    }

    private mouseOut(e: MouseEvent): void {
        const commentContainer: HTMLElement = this.getCommentContainer();
        const relatedTarget: HTMLElement = e.relatedTarget as HTMLElement;
        if (this.isCommentVisible && (!this.isCommentVisibleOnTouch && commentContainer)) {
            if (relatedTarget) {
                const isInsideContainer: boolean = commentContainer.contains(relatedTarget);
                const isInsideIndicator: Element = closest(relatedTarget, '.e-comment-indicator');
                const isInsideDropDownPopup: Element = closest(relatedTarget, '.e-dropdown-popup');
                const isCommentCell: HTMLElement = this.parent.getCell(this.activeCommentCell[0], this.activeCommentCell[1]);
                if (!isInsideContainer && !isInsideIndicator && !isInsideDropDownPopup &&
                    isCommentCell && !isCommentCell.contains(relatedTarget) &&
                    document.activeElement !== commentContainer &&
                    document.activeElement !== commentContainer.querySelector('.e-comment-input')) {
                    this.removeCommentContainer();
                    this.isCommentVisible = false;
                    this.activeCommentCell = null;
                }
            }
        }
    }

    private createCommentContainer(targetEle: HTMLElement, rIdx: number, cIdx: number): void {
        const commentContainer: HTMLDivElement = this.parent.createElement('div', { className: 'e-comment-container' });
        commentContainer.tabIndex = -1;
        this.renderCommentUI(commentContainer, rIdx, cIdx, false);
        commentContainer.style.visibility = 'hidden';
        this.parent.element.appendChild(commentContainer);
        this.setCommentContainerPosition(commentContainer, targetEle.getBoundingClientRect());
        commentContainer.style.visibility = '';
        const cell: CellModel = getCell(rIdx, cIdx, this.parent.getActiveSheet());
        const thread: ThreadedCommentModel = cell && cell.comment;
        if (thread && thread.isResolved) {
            this.handleResolvedThread(commentContainer, rIdx, cIdx, thread);
        }
        const textArea: HTMLTextAreaElement = commentContainer.querySelector('.e-comment-footer .e-comment-input');
        if (textArea && (!cell || (cell && !cell.comment))) {
            textArea.focus();
            textArea.select();
            if (!commentContainer.classList.contains('active')) {
                commentContainer.classList.add('active');
            }
        }
        this.bindContainerEvents(commentContainer);
        EventHandler.add(commentContainer, 'mouseout', this.mouseOut, this);
        EventHandler.add(targetEle, 'mouseout', this.mouseOut, this);
        this.isCommentVisible = true;
    }

    private handleResolvedThread(container: HTMLElement, rIdx: number, cIdx: number, thread: ThreadedCommentModel): void {
        const headerEl: HTMLElement = container.querySelector('.e-comment-header') as HTMLElement;
        if (headerEl) {
            headerEl.replaceWith(this.createheaderContent(false, getCellAddress(rIdx, cIdx), thread));
        }
        const footerEl: HTMLElement = container.querySelector('.e-comment-footer') as HTMLElement;
        if (footerEl) {
            this.unwireFooterEvents(footerEl);
            this.removeFooterButtons(footerEl);
            footerEl.remove();
        }
        container.classList.add('e-thread-resolved');
        this.removeReplyButtons(container.querySelector('.e-comment-body'));
        this.setTextAreaState(container, true);
        this.renderResolvedWrap(container, rIdx, cIdx, thread.author || (this.parent.author || 'Guest User'));
    }

    private renderCommentUI(container: HTMLDivElement, rIdx: number, cIdx: number, inPane: boolean, containerId?: string): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        const cell: CellModel = getCell(rIdx, cIdx, sheet);
        let header: HTMLElement; let body: HTMLElement; let footer: HTMLElement;
        if (cell && cell.comment) {
            const cellAddress: string = getCellAddress(rIdx, cIdx);
            header = this.createheaderContent(false, cellAddress, cell.comment);
            body = this.createBodyContent(cell.comment as ExtendedThreadedCommentModel, true, inPane, containerId);
            footer = this.createFooterContent(rIdx, cIdx, false);
        } else {
            header = this.createheaderContent(true);
            footer = this.createFooterContent(rIdx, cIdx, true);
        }
        if (!inPane) {
            container.dataset.commentRowIndex = rIdx.toString();
            container.dataset.commentColIndex = cIdx.toString();
        }
        container.appendChild(header);
        if (body) {
            container.appendChild(body);
        }
        container.appendChild(footer);
    }

    private createheaderContent(initial: boolean, cellAddress?: string, comment?: ThreadedCommentModel): HTMLElement {
        const header: HTMLDivElement = this.parent.createElement('div', { className: 'e-comment-header' });
        const headerwrap: HTMLDivElement = this.parent.createElement('div', { className: 'e-comment-header-wrap' });
        const titleWrap: HTMLElement = this.parent.createElement('div', { className: 'e-comment-title-wrap' });
        const thread: ThreadedCommentModel = comment;
        if (!initial && thread && thread.isResolved) {
            const l10n: L10n = this.parent.serviceLocator.getService(locale);
            const resolvedWrap: HTMLElement = this.parent.createElement('div', { className: 'e-comment-resolved' });
            const tick: HTMLElement = this.parent.createElement('span', { className: 'e-icons e-check' });
            const label: HTMLElement = this.parent.createElement('div', { className: 'e-resolve-text' });
            label.textContent = l10n.getConstant('Resolved');
            resolvedWrap.appendChild(tick);
            resolvedWrap.appendChild(label);
            headerwrap.appendChild(resolvedWrap);
            this.renderHeaderActions(headerwrap, false, '', thread);
            header.appendChild(headerwrap);
            return header;
        }
        const authorName: string = initial ? (this.parent.author || 'Guest User') : (thread && thread.author);
        const avatar: HTMLElement = this.getAvatar(authorName);
        const title: HTMLElement = this.parent.createElement('div', { className: 'e-comment-title' });
        title.textContent = authorName;
        titleWrap.appendChild(title);
        headerwrap.appendChild(titleWrap);
        this.renderHeaderActions(headerwrap, initial, cellAddress, thread);
        header.appendChild(avatar);
        header.appendChild(headerwrap);
        return header;
    }

    private getAvatar(author: string): HTMLElement {
        const avatar: HTMLElement = this.parent.createElement('div', { className: 'e-comment-avatar' });
        avatar.textContent = this.getAvatarInitials(author);
        const currentUser: string = this.parent.author || 'Guest User';
        if (author === currentUser) {
            avatar.style.backgroundColor = '#b5082e';
        } else {
            avatar.style.backgroundColor = this.getAuthorColor(author);
        }
        return avatar;
    }

    private getAuthorColor(author: string): string {
        const colors: string[] = ['#b5082e', '#2e97d3', '#bb00ff', '#f37e43', '#03a60b', '#881824', '#e09a2b', '#50565e', '#1f7a8c',
            '#7b5ea7', '#2db36c', '#d9480f', '#0a58ca', '#a83279', '#00897b'];
        const authorStr: string = (author ? author : 'Guest User').trim().toLowerCase();
        let hash: number = 5381;
        for (let i: number = 0; i < authorStr.length; i++) {
            const code: number = authorStr.charCodeAt(i as number);
            hash = (hash * 33 + code) % 4294967296;
        }
        const idx: number = Math.abs(hash) % colors.length;
        return colors[idx as number];
    }

    private getAvatarInitials(name: string): string {
        const parts: string[] = (name ? name : 'Guest User').trim().split(' ');
        if (parts && parts.length === 1) {
            return parts[0].charAt(0).toUpperCase();
        }
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }

    private renderHeaderActions(headerWrap: HTMLElement, initial: boolean, address: string, thread?: ExtendedThreadedCommentModel): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const parentHeader: Element = headerWrap.closest('.e-comment-header');
        const existingActions: Element = headerWrap.querySelector('.e-comment-actions');
        if (existingActions) {
            existingActions.remove();
        }
        if (initial) {
            if (parentHeader) {
                const existingCloseBtn: Element = parentHeader.querySelector('.e-comment-cancel');
                if (existingCloseBtn) {
                    existingCloseBtn.remove();
                }
            }
            const cancelBtn: HTMLButtonElement = this.parent.createElement('button', {
                className: 'e-comment-cancel',
                attrs: { 'aria-label': 'Cancel', title: l10n.getConstant('Cancel') }
            });
            const button: Button = new Button({ cssClass: 'e-flat', iconCss: 'e-icons e-close' }, cancelBtn);
            button.createElement = this.parent.createElement;
            EventHandler.add(button.element, 'click', () => this.handleInitialCancel(cancelBtn), this);
            headerWrap.appendChild(cancelBtn);
            return;
        }
        if (parentHeader) {
            const existingCloseBtn: Element = parentHeader.querySelector('.e-comment-cancel');
            if (existingCloseBtn) {
                existingCloseBtn.remove();
            }
        }
        const actionsWrap: HTMLElement = this.parent.createElement('div', { className: 'e-comment-actions' });
        if (this.isEditing) {
            headerWrap.appendChild(actionsWrap);
            return;
        }
        if (thread && thread.isResolved === true) {
            const reopenBtnEl: HTMLButtonElement = this.parent.createElement('button', {
                className: 'e-comment-reopen-btn',
                attrs: { type: 'button', title: l10n.getConstant('Reopen') }
            });
            const reopenBtn: Button = new Button({ cssClass: 'e-flat', iconCss: 'e-icons e-undo' }, reopenBtnEl);
            reopenBtn.createElement = this.parent.createElement;
            EventHandler.add(reopenBtn.element, 'click', () => this.setThreadResolved(false, reopenBtnEl), this);
            const deleteBtnEl: HTMLButtonElement = this.parent.createElement('button', {
                className: 'e-comment-delete',
                attrs: { type: 'button', title: l10n.getConstant('DeleteThread') }
            });
            const deleteBtn: Button = new Button({ cssClass: 'e-flat', iconCss: 'e-icons e-trash' }, deleteBtnEl);
            deleteBtn.createElement = this.parent.createElement;
            EventHandler.add(deleteBtn.element, 'click', () => this.deleteComment({ sourceEl: deleteBtnEl }), this);
            actionsWrap.appendChild(reopenBtnEl);
            actionsWrap.appendChild(deleteBtnEl);
            headerWrap.appendChild(actionsWrap);
            return;
        }
        const cellRef: HTMLElement = this.parent.createElement('span', { className: 'e-comment-cellref' });
        cellRef.textContent = address;
        actionsWrap.appendChild(cellRef);
        const menuBar: HTMLElement = this.parent.createElement('button', {
            className: 'e-comment-menu e-flat', attrs: { type: 'button', title: l10n.getConstant('ThreadAction') }
        });
        const userOption: ItemModel[] = [
            { text: l10n.getConstant('EditComment'), iconCss: 'e-icons e-edit' },
            { text: l10n.getConstant('ResolveThread'), iconCss: 'e-icons e-check' },
            { text: l10n.getConstant('DeleteThread'), iconCss: 'e-icons e-trash' }
        ];
        const menuItem: DropDownButton = new DropDownButton({
            items: userOption,
            iconCss: 'e-icons e-more-horizontal-1',
            cssClass: 'e-caret-hide e-menu-popup',
            enableRtl: this.parent.enableRtl,
            select: (e: MenuEventArgs) => this.onThreadMenuSelect(e, menuBar),
            open: () => this.setPopupPosition(menuItem, menuBar)
        });
        menuItem.createElement = this.parent.createElement;
        menuItem.appendTo(menuBar);
        actionsWrap.appendChild(menuBar);
        headerWrap.appendChild(actionsWrap);
    }

    private setPopupPosition(ddb: DropDownButton, triggerEl: HTMLElement): void {
        if (ddb && ddb.dropDown) {
            const popupEl: HTMLElement = ddb.dropDown.element;
            if (popupEl) {
                const btnRect: ClientRect = triggerEl.getBoundingClientRect();
                const popupRect: ClientRect = popupEl.getBoundingClientRect();
                popupEl.style.left = `${this.parent.enableRtl ? btnRect.left : btnRect.right - popupRect.width}px`;
            }
        }
    }

    private handleInitialCancel(ele: HTMLButtonElement): void {
        if (ele) {
            const container: HTMLElement = this.getContainer(ele);
            const indices: number[] = this.getIndexesFromContainer(container);
            const sheet: ExtendedSheet = this.parent.getActiveSheet() as ExtendedSheet;
            if (indices) {
                const [rowIndex, columnIndex] = indices;
                const cell: CellModel = getCell(rowIndex, columnIndex, sheet);
                if (!cell || !cell.comment) {
                    this.detachCommentIndicator(rowIndex, columnIndex);
                }
            }
            if (container) {
                EventHandler.remove(container, 'mouseout', this.mouseOut);
                this.unbindContainerEvents(container);
                const host: HTMLElement = this.getBodyHost(container);
                if (host) {
                    this.unbindReplyHover(host);
                }
                detach(container);
                if (this.isReviewPaneVisible && container.classList.contains('e-thread-draft')) {
                    if (!sheet.comments || !sheet.comments.length) {
                        this.renderReviewBody();
                    }
                }
            }
            if (this.activeReplyDdb) {
                this.activeReplyDdb.destroy();
                this.activeReplyDdb = null;
            }
            this.isCommentVisible = false;
            this.activeCommentCell = null;
            this.isEditing = false;
        }
    }

    private onThreadMenuSelect(event: MenuEventArgs, sourceEl: HTMLElement): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const text: string = event.item.text;
        if (text === l10n.getConstant('EditComment')) {
            this.beginEdit(false, undefined, sourceEl);
        } else if (text === l10n.getConstant('ResolveThread')) {
            this.setThreadResolved(true, sourceEl);
        } else {
            this.deleteComment({ sourceEl: sourceEl });
        }
    }

    private createBodyContent(thread: ExtendedThreadedCommentModel, rebuild: boolean, inPane: boolean, cId?: string): HTMLElement {
        const dataSource: { [key: string]: Object }[] = thread ? this.convertThreadToListItems(thread) : [];
        if (inPane) {
            const host: HTMLElement = this.parent.createElement('div', { className: 'e-comment-body' });
            if (Browser.isDevice) {
                host.classList.add('e-device-comment');
            }
            this.initListView(host, dataSource, true);
            if (!thread.isResolved && !Browser.isDevice) {
                this.bindReplyHover(host, cId);
            }
            return host;
        }
        if (!this.bodyHost) {
            this.bodyHost = this.parent.createElement('div', { className: 'e-comment-body' });
        }
        if (!this.commentListView) {
            this.commentListView = this.initListView(this.bodyHost, dataSource, false);
        } else if (rebuild) {
            this.commentListView.setProperties({ dataSource }, true);
            this.commentListView.refresh();
        }
        if (!thread.isResolved && !Browser.isDevice) {
            this.bindReplyHover(this.bodyHost);
        }
        return this.bodyHost;
    }

    private initListView(host: HTMLElement, dataSource: { [key: string]: Object }[], registerForCleanup: boolean): ListView {
        const itemTemplate: Function = (data: {
            id: string; type: 'initial' | 'reply'; author: string; text: string; createdTime: string;
        }): Element[] => {
            const l10n: L10n = this.parent.serviceLocator.getService(locale);
            const actionText: string = l10n.getConstant('CommentAction');
            const root: HTMLElement = this.parent.createElement('div', {
                className: `e-comment-item ${data.type}`,
                attrs: { 'data-id': data.id, ...(data.type === 'reply' ? { 'data-reply-id': data.id } : {}) }
            });
            const renderTextAndTimestamp: Function = (text: string, createdTime: string, parent: HTMLElement): void => {
                const textEl: HTMLElement = this.parent.createElement('div', { className: 'e-comment-text' });
                textEl.textContent = text;
                const tsEl: HTMLElement = this.parent.createElement('span', { className: 'e-comment-timestamp' });
                tsEl.textContent = createdTime;
                parent.appendChild(textEl);
                parent.appendChild(tsEl);
            };
            if (data.type === 'initial') {
                renderTextAndTimestamp(data.text, data.createdTime, root);
                return [root];
            }
            const row: HTMLElement = this.parent.createElement('div', { className: 'e-comment-reply-row' });
            const avatarWrap: HTMLElement = this.parent.createElement('div', { className: 'e-comment-avatar-wrap' });
            const authorName: string = data.author;
            const avatarEl: HTMLElement = this.getAvatar(authorName);
            avatarWrap.appendChild(avatarEl);
            const col: HTMLElement = this.parent.createElement('div', { className: 'e-comment-reply-col' });
            const header: HTMLElement = this.parent.createElement('div', { className: 'e-comment-header-wrap' });
            const titleWrap: HTMLElement = this.parent.createElement('div', { className: 'e-comment-title-wrap' });
            const title: HTMLElement = this.parent.createElement('div', { className: 'e-comment-title' });
            title.textContent = authorName;
            titleWrap.appendChild(title);
            const menuBtn: HTMLButtonElement = this.parent.createElement('button', {
                className: 'e-reply-ddb e-flat',
                attrs: { type: 'button', 'data-reply-id': data.id, 'aria-label': actionText }
            });
            if (Browser.isDevice) {
                this.renderReplyDdb(menuBtn);
            }
            header.appendChild(titleWrap);
            header.appendChild(menuBtn);
            const content: HTMLElement = this.parent.createElement('div', { className: 'e-comment-reply-content' });
            renderTextAndTimestamp(data.text, data.createdTime, content);
            col.appendChild(header); col.appendChild(content);
            row.appendChild(avatarWrap); row.appendChild(col);
            root.appendChild(row);
            return [root];
        };
        enableRipple(false);
        const listView: ListView = new ListView({
            dataSource: dataSource,
            template: itemTemplate,
            cssClass: 'e-comment-listview',
            enableRtl: this.parent.enableRtl,
            enableVirtualization: true,
            height: '100%',
            select: (args: SelectEventArgs) => {
                if (this.isReviewPaneVisible) {
                    this.updateCellSelction(args);
                }
            }
        });
        listView.createElement = this.parent.createElement;
        /* eslint-disable */
        (listView as any).isInternalTemplate = true;
        /* eslint-enable */
        listView.appendTo(host);
        if (registerForCleanup) {
            this.reviewInstances.push({ destroy: () => { listView.destroy(); } });
        }
        return listView;
    }

    private renderReplyDdb(btn: HTMLButtonElement): void {
        if (this.isEditing) {
            btn.style.visibility = 'hidden';
            return;
        }
        if (btn.dataset.ddbMounted === 'true') {
            return;
        }
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const items: ItemModel[] = [
            { id: 'edit-reply', text: l10n.getConstant('EditComment'), iconCss: 'e-icons e-edit' },
            { id: 'delete-reply', text: l10n.getConstant('DeleteComment'), iconCss: 'e-icons e-trash' }
        ];
        const ddb: DropDownButton = new DropDownButton({
            items: items,
            iconCss: 'e-icons e-more-horizontal-1',
            cssClass: 'e-caret-hide e-menu-popup',
            enableRtl: this.parent.enableRtl,
            select: (args: MenuEventArgs) => {
                const replyId: string = btn.getAttribute('data-reply-id') || '';
                this.onReplyMenuSelect(args, replyId, btn);
            },
            open: () => this.setPopupPosition(ddb, btn)
        });
        ddb.createElement = this.parent.createElement;
        ddb.appendTo(btn);
        btn.dataset.ddbMounted = 'true';
        this.activeReplyDdb = ddb;
    }

    private onReplyMenuSelect(args: MenuEventArgs, replyId: string, sourceEl: HTMLElement): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const text: string = args.item.text;
        if (text === l10n.getConstant('EditComment')) {
            this.beginEdit(true, replyId, sourceEl);
        } else {
            this.deleteReplyById(replyId, sourceEl);
        }
    }

    private createFooterContent(rowIdx: number, colIdx: number, initial: boolean): HTMLElement {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const footer: HTMLElement = this.parent.createElement('div', { className: 'e-comment-footer' });
        const cell: CellModel = getCell(rowIdx, colIdx, this.parent.getActiveSheet());
        if (cell && cell.comment && cell.comment.isResolved === true) {
            return footer;
        }
        footer.setAttribute('data-mode', initial ? 'initial' : 'reply');
        const textArea: HTMLTextAreaElement = this.parent.createElement('textarea', {
            className: 'e-comment-input',
            attrs: { placeholder: initial ? l10n.getConstant('AddComment') : l10n.getConstant('Reply'), rows: '1', name: 'footerTextArea' }
        });
        textArea.style.height = '32px';
        const btnBar: HTMLElement = this.parent.createElement('div', { className: 'e-comment-btn' });
        footer.appendChild(textArea);
        footer.appendChild(btnBar);
        if (initial) {
            this.ensureFooterButtons(footer, initial);
            this.syncFooterPostState(footer, textArea);
        }
        this.wireFooterEvents(footer);
        return footer;
    }

    private convertThreadToListItems(thread: ExtendedThreadedCommentModel): { [key: string]: Object }[] {
        const items: { [key: string]: Object }[] = [];
        items.push({
            id: thread.id, type: 'initial', author: thread.author || 'Guest User',
            text: thread.text, createdTime: thread.createdTime
        });
        const replies: ExtendedThreadedCommentModel[] = thread.replies || [];
        if (replies.length > 0) {
            replies.forEach((reply: ExtendedThreadedCommentModel) => {
                items.push({
                    id: reply.id || getUniqueID('e_spreadsheet_reply'), type: 'reply',
                    author: reply.author || 'Guest User', text: reply.text, createdTime: reply.createdTime
                });
            });
        }
        return items;
    }

    private postComment(rowIdx: number, colIdx: number, commentText: string, container: HTMLElement): void {
        if (!commentText) {
            return;
        }
        const timeStampValue: string = this.timeStamp();
        const actionFromPanel: boolean = container && container.classList.contains('e-pane-container');
        const cell: CellModel = getCell(rowIdx, colIdx, this.parent.getActiveSheet());
        if (cell && cell.comment) {
            const thread: ExtendedThreadedCommentModel = JSON.parse(JSON.stringify(cell.comment));
            if (!Array.isArray(thread.replies)) {
                thread.replies = [];
            }
            const reply: ExtendedThreadedCommentModel = {
                id: getUniqueID('e_spreadsheet_reply'),
                author: this.parent.author || 'Guest User',
                text: commentText,
                createdTime: timeStampValue
            };
            thread.replies.push(reply);
            this.saveComment(rowIdx, colIdx, thread, 'addReply', actionFromPanel);
            const body: HTMLElement = container.querySelector('.e-comment-body');
            let targetListView: ListView;
            if (body) {
                targetListView = getComponent(body, 'listview') as ListView;
            } else {
                targetListView = this.commentListView;
            }
            if (targetListView) {
                const avatarEl: HTMLElement = this.getAvatar(reply.author);
                targetListView.addItem([{
                    id: reply.id,
                    type: 'reply',
                    author: reply.author,
                    text: reply.text,
                    createdTime: reply.createdTime,
                    avatarHtml: avatarEl.outerHTML
                }]);
                if (body) {
                    body.scrollTop = body.scrollHeight;
                }
            }
            return;
        }
        const id: string = getUniqueID('e_spreadsheet_comment');
        const newThread: ExtendedThreadedCommentModel = {
            id: id,
            author: this.parent.author || 'Guest User',
            text: commentText,
            createdTime: timeStampValue,
            isResolved: false,
            replies: []
        };
        this.saveComment(rowIdx, colIdx, newThread, 'addComment', actionFromPanel);
        const header: HTMLElement = container.querySelector('.e-comment-header');
        if (header && !header.querySelector('.e-comment-actions')) {
            const headerWrap: HTMLElement = header.querySelector('.e-comment-header-wrap');
            if (headerWrap) {
                this.renderHeaderActions(headerWrap, false, getCellAddress(rowIdx, colIdx));
            }
        }
        if (container) {
            const body: HTMLElement = this.createBodyContent(newThread, true, this.isReviewPaneVisible);
            const footer: HTMLElement = container.querySelector('.e-comment-footer');
            if (footer && body && body.parentElement !== container) {
                container.insertBefore(body, footer);
            } else if (footer && body && footer.previousElementSibling !== body) {
                container.insertBefore(body, footer);
            }
        }
        if (this.isReviewPaneVisible) {
            if (container && container.classList.contains('e-thread-draft')) {
                container.remove();
            }
        }
    }

    private beginEdit(isReply: boolean, replyId?: string, sourceEl?: HTMLElement): void {
        const container: HTMLElement = this.getContainer(sourceEl);
        const localBodyHost: HTMLElement = this.getBodyHost(container);
        if (this.isEditing || !container || !localBodyHost) {
            return;
        }
        const idx: number[] = this.getIndexesFromContainer(container);
        if (idx) {
            const cell: CellModel = getCell(idx[0], idx[1], this.parent.getActiveSheet());
            const th: ThreadedCommentModel = cell && cell.comment;
            if (th && th.isResolved) {
                return;
            }
        }
        const itemSelector: string = isReply ? `.e-comment-item.reply[data-reply-id="${replyId}"]` : '.e-comment-item.initial';
        const itemEl: HTMLElement = localBodyHost.querySelector(itemSelector);
        if (!itemEl) {
            return;
        }
        const textEl: HTMLElement = itemEl.querySelector('.e-comment-text');
        if (!textEl) {
            return;
        }
        const originalText: string = textEl.textContent || '';
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const editorWrap: HTMLElement = this.parent.createElement('div', { className: 'e-comment-edit-wrap' });
        const textArea: HTMLTextAreaElement = this.parent.createElement('textarea', {
            className: 'e-comment-input e-comment-edit-input',
            attrs: { rows: '1', name: 'editTextArea' }
        });
        EventHandler.add(textArea, 'focus', () => { textArea.classList.add('active'); }, this);
        EventHandler.add(textArea, 'blur', () => { textArea.classList.remove('active'); }, this);
        textArea.value = originalText;
        this.adjustTextareaHeight(textArea, true);
        const tsEle: HTMLElement = itemEl.querySelector('.e-comment-timestamp');
        let tsValue: string = '';
        if (tsEle) {
            tsValue = tsEle.style.display;
            tsEle.style.display = 'none';
        }
        const btnBar: HTMLElement = this.parent.createElement('div', { className: 'e-comment-btn' });
        const postBtnEl: HTMLButtonElement = this.parent.createElement('button', {
            className: 'e-comment-post',
            attrs: { type: 'button', 'aria-label': 'Post', title: l10n.getConstant('EditComment') }
        });
        const postBtn: Button = new Button({ iconCss: 'e-icons e-send', isPrimary: true }, postBtnEl);
        postBtn.createElement = this.parent.createElement;
        const cancelBtnEl: HTMLButtonElement = this.parent.createElement('button', {
            className: 'e-comment-cancel',
            attrs: { type: 'button', 'aria-label': 'Cancel', title: l10n.getConstant('Cancel') }
        });
        const cancelBtn: Button = new Button({ cssClass: 'e-flat', iconCss: 'e-icons e-close' }, cancelBtnEl);
        cancelBtn.createElement = this.parent.createElement;
        EventHandler.add(textArea, 'input', () => this.adjustTextareaHeight(textArea, true), this);
        EventHandler.add(postBtn.element, 'click', () => {
            this.applyInlineEdit(isReply, textArea.value, textEl, editorWrap, originalText, replyId, container);
        }, this);
        EventHandler.add(cancelBtn.element, 'click', () => {
            textEl.textContent = originalText;
            textEl.style.display = '';
            editorWrap.remove();
            this.endEdit(container);
        }, this);
        btnBar.appendChild(postBtnEl);
        btnBar.appendChild(cancelBtnEl);
        editorWrap.appendChild(textArea);
        editorWrap.appendChild(btnBar);
        textEl.style.display = 'none';
        if (textEl.parentElement) {
            textEl.parentElement.insertBefore(editorWrap, textEl.nextSibling);
        }
        this.editingState = {
            isReply, replyId, textEl, editorWrap, originalText, tsEle, tsValue,
            container, textHost: localBodyHost, addrIdx: idx
        };
        this.isEditing = true;
        this.setTextAreaState(container, true);
        container.classList.add('e-comment-editing');
        const header: HTMLElement = container.querySelector('.e-comment-header');
        if (header) {
            const headerWrap: HTMLElement = header.querySelector('.e-comment-header-wrap');
            if (headerWrap) {
                if (idx && idx.length === 2) {
                    this.renderHeaderActions(headerWrap, false, getCellAddress(idx[0], idx[1]));
                }
            }
        }
        const replyBtns: NodeListOf<HTMLButtonElement> = localBodyHost.querySelectorAll('.e-reply-ddb');
        if (replyBtns) {
            replyBtns.forEach((btn: HTMLButtonElement) => {
                btn.style.visibility = 'hidden';
            });
        }
        getUpdateUsingRaf(() => {
            this.adjustTextareaHeight(textArea, true);
            textArea.focus();
            const len: number = textArea.value.length;
            textArea.setSelectionRange(len, len);
        });
    }

    private applyInlineEdit(
        isReply: boolean, newText: string, textEl: HTMLElement, editorWrap: HTMLElement,
        originalText: string, replyId?: string, container?: HTMLElement
    ): void {
        const finalText: string = newText || originalText;
        textEl.textContent = finalText;
        textEl.style.display = '';
        editorWrap.remove();
        const indices: number[] = this.getIndexesFromContainer(container || null);
        if (indices && indices.length === 2) {
            const [row, col] = indices;
            const cell: CellModel = getCell(row, col, this.parent.getActiveSheet());
            const actionFromPanel: boolean = container && container.classList.contains('e-pane-container');
            if (cell && cell.comment) {
                const thread: ExtendedThreadedCommentModel = JSON.parse(JSON.stringify(cell.comment));
                if (isReply) {
                    if (!replyId || !thread.replies) {
                        this.endEdit(container);
                        return;
                    }
                    const idx: number = thread.replies.findIndex((r: ExtendedThreadedCommentModel) => r.id === replyId);
                    if (idx > -1) {
                        thread.replies[idx as number] = { ...thread.replies[idx as number], text: finalText };
                        this.saveComment(row, col, thread, 'editReply', actionFromPanel);
                    }
                } else {
                    const updatedThread: ExtendedThreadedCommentModel = { ...thread, text: finalText };
                    this.saveComment(row, col, updatedThread, 'editComment', actionFromPanel);
                }
            }
        }
        this.endEdit(container);
    }

    private endEdit(container: HTMLElement): void {
        if (this.editingState && this.editingState.tsEle) {
            this.editingState.tsEle.style.display = isNullOrUndefined(this.editingState.tsValue) ? '' : this.editingState.tsValue;
        }
        const targetContainer: HTMLElement = container || (this.editingState && this.editingState.container);
        if (targetContainer) {
            targetContainer.classList.remove('e-comment-editing');
            this.setTextAreaState(targetContainer, false);
            const header: HTMLElement = targetContainer.querySelector('.e-comment-header');
            if (header) {
                const headerWrap: HTMLElement = header.querySelector('.e-comment-header-wrap');
                if (headerWrap) {
                    const indices: number[] = this.getIndexesFromContainer(targetContainer);
                    if (indices && indices.length === 2) {
                        const prev: boolean = this.isEditing;
                        this.isEditing = false;
                        this.renderHeaderActions(headerWrap, false, getCellAddress(indices[0], indices[1]));
                        this.isEditing = prev;
                    }
                }
            }
            const localBodyHost: HTMLElement = this.getBodyHost(targetContainer);
            if (localBodyHost) {
                const replyBtns: NodeListOf<HTMLButtonElement> = localBodyHost.querySelectorAll('.e-reply-ddb');
                replyBtns.forEach((btn: HTMLButtonElement) => {
                    btn.style.visibility = '';
                });
            }
        }
        this.isEditing = false;
        this.editingState = null;
    }

    private deleteReplyById(replyId: string, sourceEl: HTMLElement): void {
        if (replyId && sourceEl) {
            const container: HTMLElement = this.getContainer(sourceEl);
            const host: HTMLElement = this.getBodyHost(container);
            if (container && host) {
                const indexes: number[] = this.getIndexesFromContainer(container);
                if (indexes && indexes.length === 2) {
                    const [row, col] = indexes;
                    const cell: CellModel = getCell(row, col, this.parent.getActiveSheet());
                    if (cell && cell.comment) {
                        const thread: ExtendedThreadedCommentModel = JSON.parse(JSON.stringify(cell.comment));
                        if (thread.replies) {
                            const idx: number = thread.replies.findIndex((r: ExtendedThreadedCommentModel) => r.id === replyId);
                            if (idx > -1) {
                                thread.replies.splice(idx, 1);
                                this.saveComment(row, col, thread, 'deleteReply', container.classList.contains('e-pane-container'));
                                const targetListView: ListView = getComponent(host, 'listview');
                                if (targetListView) {
                                    targetListView.removeItem({ id: replyId });
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    private setTextAreaState(container: HTMLElement, disabled: boolean): void {
        if (container) {
            const l10n: L10n = this.parent.serviceLocator.getService(locale);
            const textArea: HTMLTextAreaElement = container.querySelector('.e-comment-footer .e-comment-input');
            if (textArea) {
                if (disabled) {
                    textArea.disabled = true;
                    textArea.placeholder = l10n.getConstant('CommentEditingInProgress');
                } else {
                    textArea.disabled = false;
                    textArea.placeholder = l10n.getConstant('Reply');
                    this.adjustTextareaHeight(textArea, false);
                }
            }
        }
    }

    private adjustTextareaHeight(textArea: HTMLTextAreaElement, isEdit: boolean): void {
        if (textArea) {
            const cs: CSSStyleDeclaration = getComputedStyle(textArea);
            let linePx: number = parseFloat(cs.lineHeight);
            if (isNaN(linePx)) {
                const fontSize: number = parseFloat(cs.fontSize) || 14;
                linePx = Math.round(fontSize * 1.2);
            }
            const padTB: number = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
            const borderTB: number = (parseFloat(cs.borderTopWidth) || 0) + (parseFloat(cs.borderBottomWidth) || 0);
            const minLines: number = 1;
            const maxLines: number = 5;
            if (!isEdit && textArea.value.trim().length === 0) {
                textArea.style.height = `${(minLines * linePx) + padTB + borderTB}px`;
                textArea.style.overflowY = 'hidden';
                return;
            }
            textArea.style.height = 'auto';
            const contentHeight: number = Math.max(0, textArea.scrollHeight - padTB);
            const neededLines: number = Math.max(1, Math.ceil(contentHeight / Math.max(1, linePx)));
            const clampedLines: number = Math.max(minLines, Math.min(maxLines, neededLines));
            const finalHeight: number = (clampedLines * linePx) + padTB + borderTB;
            textArea.style.height = `${finalHeight}px`;
            textArea.style.overflowY = 'hidden';
        }
    }


    private saveComment(rIdx: number, cIdx: number, comment: ExtendedThreadedCommentModel, actionName: string, isPanel: boolean): void {
        if (comment && !comment.address) {
            comment.address = [rIdx, cIdx];
        }
        const sheet: ExtendedSheet = this.parent.getActiveSheet() as ExtendedSheet;
        const address: string = getSheetName(this.parent as Workbook, this.parent.activeSheetIndex) + '!' + getRangeAddress([rIdx, cIdx]);
        const eventArgs: CommentSaveEventArgs = { comment: JSON.parse(JSON.stringify(comment)), address: address, cancel: false };
        this.parent.notify(beginAction, { eventArgs: eventArgs, action: actionName });
        if (eventArgs.cancel) {
            return;
        }
        comment = JSON.parse(JSON.stringify(eventArgs.comment));
        this.processSheetComments({ sheet: sheet, comment: comment, isDelete: false });
        updateCell(this.parent, sheet, { rowIdx: rIdx, colIdx: cIdx, preventEvt: true, cell: { comment: comment } });
        const td: HTMLElement = this.parent.getCell(rIdx, cIdx);
        if (td && !td.querySelector('.e-comment-indicator')) {
            this.createCommentIndicator({ targetEle: td, rIdx: rIdx, cIdx: cIdx });
        }
        if (this.isReviewPaneVisible) {
            if (actionName === 'addComment') {
                this.insertThreadIntoPanel(comment);
                this.scrollToThreadInPanel(comment.id);
            } else if (!isPanel && actionName !== 'addComment') {
                this.syncThreadInPanel(comment);
            }
        }
        this.parent.notify(completeAction, { eventArgs: eventArgs, action: actionName });
    }

    private detachCommentIndicator(rowIdx: number, colIdx: number): void {
        const cellElement: HTMLElement = this.parent.getCell(rowIdx, colIdx);
        if (cellElement) {
            const indicator: HTMLElement = cellElement.querySelector('.e-comment-indicator');
            if (indicator) {
                EventHandler.remove(indicator, 'mouseover', this.mouseOver);
                EventHandler.remove(indicator, 'mouseout', this.mouseOut);
                delete indicator.dataset.commentListenersAdded;
                delete indicator.dataset.commentRowIndex;
                delete indicator.dataset.commentColIndex;
                detach(indicator);
            }
        }
    }

    private setCommentContainerPosition(commentContainer: HTMLElement, cellRect: ClientRect): void {
        const selectAllCell: HTMLElement = this.parent.element.getElementsByClassName('e-select-all-cell')[0] as HTMLElement;
        const scroller: HTMLElement = this.parent.element.getElementsByClassName('e-scroller')[0] as HTMLElement;
        const sheetClientRect: ClientRect = this.parent.element.getElementsByClassName('e-sheet')[0].getBoundingClientRect();
        const elementClientRect: ClientRect = this.parent.element.getBoundingClientRect();
        const elementPosition: string = this.parent.element.style.getPropertyValue('position');
        const offsetTop: number = (elementPosition === 'absolute' ? 0 : this.parent.element.offsetTop);
        const offsetLeft: number = (elementPosition === 'absolute' ? 0 : this.parent.element.offsetLeft);
        commentContainer.style.position = 'absolute';
        let containerTop: number = cellRect.top - (elementClientRect.top - offsetTop);
        if (!isNullOrUndefined(selectAllCell) && !isNullOrUndefined(scroller) &&
            cellRect.top < selectAllCell.getBoundingClientRect().bottom) {
            containerTop = selectAllCell.getBoundingClientRect().bottom - (elementClientRect.top - offsetTop) + 5;
        } else if (containerTop < 0) {
            containerTop = 5;
        }
        commentContainer.style.top = `${containerTop}px`;
        let leftPos: number;
        const preferredWidth: number = 244;
        let actualWidth: number = preferredWidth;
        const spaceToRight: number = sheetClientRect.width - (cellRect.left + cellRect.width - sheetClientRect.left);
        if (spaceToRight > preferredWidth + 5) {
            leftPos = cellRect.left + cellRect.width - (elementClientRect.left - offsetLeft);
        } else {
            leftPos = cellRect.left - (elementClientRect.left - offsetLeft) - preferredWidth;
            if (leftPos < 0) {
                leftPos = 5;
                actualWidth = elementClientRect.width - 10;
            }
        }
        commentContainer.style.left = `${leftPos}px`;
        commentContainer.style.width = `${actualWidth}px`;
    }

    private deleteComment(args?: { rowIndex?: number; columnIndex?: number; sourceEl?: HTMLElement }): void {
        let container: HTMLElement;
        if (args && args.sourceEl) {
            container = this.getContainer(args.sourceEl);
        }
        const [rIdx, cIdx] = this.getIndexesFromContainer(container);
        const sheet: ExtendedSheet = this.parent.getActiveSheet() as ExtendedSheet;
        const cell: CellModel = getCell(rIdx, cIdx, sheet);
        if (!isNullOrUndefined(cell) && cell.comment) {
            const address: string = getSheetName(this.parent as Workbook, this.parent.activeSheetIndex) + '!' +
                getRangeAddress([rIdx, cIdx]);
            const eventArgs: CommentSaveEventArgs = { comment: cell.comment, address: address, cancel: false };
            this.parent.notify(beginAction, { eventArgs: eventArgs, action: 'deleteComment' });
            if (eventArgs.cancel) {
                return;
            }
            this.processSheetComments({ sheet: sheet, id: (cell.comment as ExtendedThreadedCommentModel).id, isDelete: true });
            this.detachCommentIndicator(rIdx, cIdx);
            delete cell.comment;
            updateCell(this.parent, sheet, { rowIdx: rIdx, colIdx: cIdx, preventEvt: true, cell: cell });
            if (this.isReviewPaneVisible) {
                this.refreshReviewListFromSheet();
            }
            eventArgs.comment = null;
            this.parent.notify(completeAction, { eventArgs: eventArgs, action: 'deleteComment' });
        }
        if (container) {
            EventHandler.remove(container, 'mouseout', this.mouseOut);
            this.unbindContainerEvents(container);
            const host: HTMLElement = this.getBodyHost(container);
            if (host) {
                this.unbindReplyHover(host);
                const lv: ListView = getComponent(host, 'listview') as ListView;
                if (lv) {
                    lv.destroy();
                }
            }
            const footerEl: HTMLElement = container.querySelector('.e-comment-footer') as HTMLElement;
            if (footerEl) {
                this.unwireFooterEvents(footerEl);
                this.removeFooterButtons(footerEl);
            }
            detach(container);
            if (this.activeReplyDdb) {
                this.activeReplyDdb.destroy();
                this.activeReplyDdb = null;
            }
        }
        if (this.isEditing) {
            this.isEditing = false;
            this.editingState = null;
        }
    }

    private replyToComment(): void {
        this.initiateComment();
        const container: HTMLElement = this.getCommentContainer();
        if (container) {
            const textArea: HTMLTextAreaElement = container.querySelector('.e-comment-footer .e-comment-input');
            if (textArea) {
                textArea.focus();
                textArea.select();
                this.adjustTextareaHeight(textArea, false);
                if (!container.classList.contains('active')) {
                    container.classList.add('active');
                }
            }
        }
    }

    private setThreadResolved(resolved: boolean, sourceEl: HTMLElement): void {
        const container: HTMLElement = this.getContainer(sourceEl);
        const indexes: number[] = this.getIndexesFromContainer(container);
        if (indexes) {
            const [rowIndex, columnIndex] = indexes;
            const cell: CellModel = getCell(rowIndex, columnIndex, this.parent.getActiveSheet());
            if (cell && cell.comment) {
                const thread: ExtendedThreadedCommentModel = JSON.parse(JSON.stringify(cell.comment));
                if (thread.isResolved !== resolved) {
                    const updated: ExtendedThreadedCommentModel = { ...thread, isResolved: resolved };
                    const actionFromPanel: boolean = container && container.classList.contains('e-pane-container');
                    this.saveComment(rowIndex, columnIndex, updated, resolved ? 'resolveComment' : 'reopenComment', actionFromPanel);
                    this.renderThreadContainer(rowIndex, columnIndex, updated, container);
                    if (this.isReviewPaneVisible && this.reviewFilter !== 'all') {
                        if (!this.filterMatches(updated)) {
                            this.removeThreadFromPanel(updated.id);
                        }
                    }
                }
            }
        }
    }

    private renderThreadContainer(rIdx: number, cIdx: number, thread: ExtendedThreadedCommentModel, container: HTMLElement): void {
        if (container) {
            const address: string = getCellAddress(rIdx, cIdx);
            const oldHeader: HTMLElement = container.querySelector('.e-comment-header');
            const newHeader: HTMLElement = this.createheaderContent(false, address, thread);
            if (oldHeader && newHeader) {
                oldHeader.replaceWith(newHeader);
            }
            const bodyEl: HTMLElement = container.querySelector('.e-comment-body');
            const existingFooter: HTMLElement = container.querySelector('.e-comment-footer');
            if (thread.isResolved) {
                if (existingFooter) {
                    this.unwireFooterEvents(existingFooter);
                    this.removeFooterButtons(existingFooter);
                    existingFooter.remove();
                }
                container.classList.add('e-thread-resolved');
                this.removeReplyButtons(bodyEl);
                this.setTextAreaState(container, true);
                this.renderResolvedWrap(container, rIdx, cIdx, thread.author || (this.parent.author || 'Guest User'));
            } else {
                if (!existingFooter) {
                    const newFooter: HTMLElement = this.createFooterContent(rIdx, cIdx, false);
                    if (newFooter) {
                        if (bodyEl && bodyEl.nextSibling) {
                            container.insertBefore(newFooter, bodyEl.nextSibling);
                        } else {
                            container.appendChild(newFooter);
                        }
                    }
                }
                container.classList.remove('e-thread-resolved');
                this.addReplyButtons(bodyEl);
                this.setTextAreaState(container, false);
                ['.e-comment-resolved-wrap', '.e-comment-divider'].forEach((selector: string) => {
                    const element: HTMLElement = container.querySelector(selector);
                    if (element) {
                        element.remove();
                    }
                });
            }
        }
    }

    private renderResolvedContent(address: string, author: string): HTMLElement {
        const resolvedHeader: HTMLElement = this.parent.createElement('div', { className: 'e-comment-resolved-wrap e-comment-header' });
        const avatar: HTMLElement = this.getAvatar(author);
        const headerWrap: HTMLElement = this.parent.createElement('div', { className: 'e-comment-header-wrap' });
        const titleWrap: HTMLElement = this.parent.createElement('div', { className: 'e-comment-title-wrap' });
        const titleEl: HTMLElement = this.parent.createElement('div', { className: 'e-comment-title' });
        titleEl.textContent = author || (this.parent.author || 'Guest User');
        const cellRefEl: HTMLElement = this.parent.createElement('div', { className: 'e-comment-cellref' });
        cellRefEl.textContent = address;
        titleWrap.appendChild(titleEl);
        headerWrap.appendChild(titleWrap);
        headerWrap.appendChild(cellRefEl);
        resolvedHeader.appendChild(avatar);
        resolvedHeader.appendChild(headerWrap);
        return resolvedHeader;
    }

    private renderResolvedWrap(container: HTMLElement, rIdx: number, cIdx: number, author: string): void {
        if (!container || container.querySelector('.e-comment-resolved-wrap')) {
            return;
        }
        const bodyEl: HTMLElement = container.querySelector('.e-comment-body');
        if (bodyEl) {
            const divider: HTMLElement = this.parent.createElement('div', { className: 'e-comment-divider' });
            const wrap: HTMLElement = this.renderResolvedContent(getCellAddress(rIdx, cIdx), author);
            container.insertBefore(divider, bodyEl);
            container.insertBefore(wrap, bodyEl);
        }
    }

    private timeStamp(): string {
        return new Date().toLocaleString(this.parent.locale, {
            month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
        });
    }

    private getContainer(sourceEl: HTMLElement): HTMLElement {
        return sourceEl && sourceEl.closest('.e-comment-container, .e-pane-container') as HTMLElement;
    }

    private getBodyHost(container: HTMLElement): HTMLElement {
        return container && container.querySelector('.e-comment-body') as HTMLElement;
    }

    private getCommentContainer(): HTMLElement {
        return this.parent.element.querySelector('.e-comment-container') as HTMLElement;
    }

    private getIndexesFromContainer(container: HTMLElement): number[] {
        let index: number[];
        if (container) {
            const cellRefEl: HTMLElement = container.querySelector('.e-comment-cellref');
            const refText: string = cellRefEl && cellRefEl.textContent ? cellRefEl.textContent.trim() : '';
            if (refText) {
                index = getCellIndexes(refText);
            } else if (this.editingState && this.editingState.container === container && Array.isArray(this.editingState.addrIdx)) {
                index = this.editingState.addrIdx.slice();
            }
        }
        if (!index && this.activeCommentCell && this.activeCommentCell.length === 2) {
            index = [this.activeCommentCell[0], this.activeCommentCell[1]];
        } else if (!index) {
            index = getCellIndexes(this.parent.getActiveSheet().activeCell);
        }
        return index;
    }

    // Events handling for comment containers
    private bindContainerEvents(container: HTMLElement): void {
        if (container) {
            EventHandler.remove(container, 'focusin', this.onContainerFocusIn);
            EventHandler.add(container, 'focusin', this.onContainerFocusIn, this);
            EventHandler.remove(container, 'focusout', this.onContainerFocusOut);
            EventHandler.add(container, 'focusout', this.onContainerFocusOut, this);
        }
    }

    private unbindContainerEvents(container: HTMLElement): void {
        if (container) {
            EventHandler.remove(container, 'focusin', this.onContainerFocusIn);
            EventHandler.remove(container, 'focusout', this.onContainerFocusOut);
        }
    }

    private onContainerFocusIn(evt: FocusEvent): void {
        const container: HTMLElement = evt.currentTarget as HTMLElement;
        if (container && !container.classList.contains('active')) {
            container.classList.add('active');
        }
    }

    private onContainerFocusOut(evt: FocusEvent): void {
        const container: HTMLElement = evt.currentTarget as HTMLElement;
        const related: HTMLElement = evt.relatedTarget as HTMLElement;
        if (container) {
            if (!related || !container.contains(related)) {
                if (container.classList.contains('active')) {
                    container.classList.remove('active');
                }
            }
        }
    }

    private bindReplyHover(host: HTMLElement, containerId?: string): void {
        if (host) {
            if (containerId) {
                host.setAttribute('data-reply-container-id', containerId);
            }
            EventHandler.remove(host, 'mouseover', this.onReplyHoverMouseOver);
            EventHandler.add(host, 'mouseover', this.onReplyHoverMouseOver, this);
            EventHandler.remove(host, 'focusin', this.onReplyHoverFocusIn);
            EventHandler.add(host, 'focusin', this.onReplyHoverFocusIn, this);
        }
    }

    private unbindReplyHover(host: HTMLElement): void {
        if (host) {
            EventHandler.remove(host, 'mouseover', this.onReplyHoverMouseOver);
            EventHandler.remove(host, 'focusin', this.onReplyHoverFocusIn);
        }
    }

    private onReplyHoverMouseOver(evt: MouseEvent): void {
        this.handleReplyHover(evt.target as EventTarget);
    }

    private onReplyHoverFocusIn(evt: FocusEvent): void {
        this.handleReplyHover(evt.target as EventTarget);
    }

    private handleReplyHover(target: EventTarget): void {
        if (this.isEditing) {
            return;
        }
        const targetEl: HTMLElement = target as HTMLElement;
        if (!targetEl) {
            return;
        }
        let container: HTMLElement;
        if (this.isReviewPaneVisible) {
            const bodyHost: Element = targetEl.closest('.e-comment-body');
            if (bodyHost) {
                const id: string = bodyHost.getAttribute('data-reply-container-id');
                if (id) {
                    container = this.parent.element.querySelector('.' + id);
                }
            }
        } else {
            container = this.getCommentContainer();
        }
        if (container && container.classList.contains('e-thread-resolved')) {
            return;
        }
        const btn: HTMLButtonElement = (targetEl.querySelector('.e-reply-ddb') as HTMLButtonElement);
        if (btn) {
            this.renderReplyDdb(btn);
        }
    }

    private removeReplyButtons(bodyEl: HTMLElement): void {
        const buttons: NodeListOf<HTMLButtonElement> = bodyEl.querySelectorAll('.e-reply-ddb');
        buttons.forEach((btn: HTMLButtonElement) => {
            const ddb: { destroy: Function } = getComponent(btn, 'dropdown-btn') as DropDownButton;
            if (ddb) {
                ddb.destroy();
            }
            btn.remove();
        });
    }

    private addReplyButtons(bodyEl: HTMLElement): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const actionText: string = l10n.getConstant('CommentAction');
        const replyItems: NodeListOf<HTMLElement> = bodyEl.querySelectorAll('.e-comment-item.reply');
        replyItems.forEach((item: HTMLElement) => {
            const replyId: string = item.getAttribute('data-reply-id') || item.getAttribute('data-id') || '';
            const headerWrap: HTMLElement = item.querySelector('.e-comment-header-wrap') as HTMLElement;
            if (headerWrap) {
                if (headerWrap.querySelector('.e-reply-ddb')) {
                    return;
                }
                const menuBtn: HTMLButtonElement = this.parent.createElement('button', {
                    className: 'e-reply-ddb e-flat',
                    attrs: { type: 'button', 'data-reply-id': replyId, 'aria-label': actionText }
                });
                headerWrap.appendChild(menuBtn);
                this.renderReplyDdb(menuBtn);
            }
        });
    }

    private onFooterInput(e: Event): void {
        const textArea: HTMLTextAreaElement = e.currentTarget as HTMLTextAreaElement;
        const footer: HTMLElement = textArea.closest('.e-comment-footer') as HTMLElement;
        if (footer) {
            if (textArea.value.trim().length > 0) {
                this.ensureFooterButtons(footer, footer.getAttribute('data-mode') === 'initial');
            } else if (document.activeElement !== textArea) {
                this.removeFooterButtons(footer);
            }
            this.adjustTextareaHeight(textArea, false);
            this.syncFooterPostState(footer, textArea);
        }
    }

    private onFooterFocus(e: FocusEvent): void {
        const textArea: HTMLTextAreaElement = e.currentTarget as HTMLTextAreaElement;
        textArea.classList.add('active');
        const footer: HTMLElement = textArea.closest('.e-comment-footer') as HTMLElement;
        if (footer) {
            this.ensureFooterButtons(footer, footer.getAttribute('data-mode') === 'initial');
            this.syncFooterPostState(footer, textArea);
        }
    }

    private onFooterBlur(e: FocusEvent): void {
        const textArea: HTMLTextAreaElement = e.currentTarget as HTMLTextAreaElement;
        textArea.classList.remove('active');
        const footer: HTMLElement = textArea.closest('.e-comment-footer') as HTMLElement;
        if (footer) {
            if (textArea.value.trim().length === 0) {
                this.removeFooterButtons(footer);
                textArea.style.height = '32px';
            }
        }
    }

    private onFooterClick(e: MouseEvent): void {
        const target: HTMLElement = e.target as HTMLElement;
        const btn: HTMLButtonElement = target.closest('.e-comment-post, .e-comment-cancel') as HTMLButtonElement;
        if (btn) {
            const footer: HTMLElement = btn.closest('.e-comment-footer') as HTMLElement;
            const container: HTMLElement = btn.closest('.e-comment-container, .e-pane-container') as HTMLElement;
            if (!footer || !container) {
                return;
            }
            const textArea: HTMLTextAreaElement = footer.querySelector('.e-comment-input') as HTMLTextAreaElement;
            if (!textArea) {
                return;
            }
            this.isEditing = false;
            if (btn.classList.contains('e-comment-post')) {
                if (btn.hasAttribute('disabled') || btn.getAttribute('aria-disabled') === 'true') {
                    return;
                }
                const idx: number[] = this.getIndexesFromContainer(container);
                if (!Array.isArray(idx) || idx.length !== 2) {
                    return;
                }
                const [rIdx, cIdx] = idx;
                const text: string = (textArea.value || '');
                if (text.length === 0) {
                    return;
                }
                this.postComment(rIdx, cIdx, text, container);
                textArea.value = '';
                this.adjustTextareaHeight(textArea, false);
                this.syncFooterPostState(footer, textArea);
                if (footer.getAttribute('data-mode') === 'initial') {
                    footer.setAttribute('data-mode', 'reply');
                    const l10n: L10n = this.parent.serviceLocator.getService(locale);
                    textArea.placeholder = l10n.getConstant('Reply');
                }
                this.removeFooterButtons(footer);
            } else if (btn.classList.contains('e-comment-cancel')) {
                textArea.value = '';
                this.adjustTextareaHeight(textArea, false);
                this.removeFooterButtons(footer);
                this.syncFooterPostState(footer, textArea);
            }
        }
    }

    private ensureFooterButtons(footer: HTMLElement, initial: boolean): void {
        const btnBar: HTMLElement = footer.querySelector('.e-comment-btn') as HTMLElement;
        if (btnBar) {
            const l10n: L10n = this.parent.serviceLocator.getService(locale);
            if (!btnBar.querySelector('.e-comment-post')) {
                const postBtnEl: HTMLButtonElement = this.parent.createElement('button', {
                    className: 'e-comment-post',
                    attrs: { type: 'button', 'aria-label': 'Post', title: l10n.getConstant('Post') }
                }) as HTMLButtonElement;
                const postInstance: Button = new Button({ iconCss: 'e-icons e-send', disabled: true }, postBtnEl);
                postInstance.createElement = this.parent.createElement;
                btnBar.appendChild(postBtnEl);
            }
            if (!initial && !btnBar.querySelector('.e-comment-cancel')) {
                const cancelBtnEl: HTMLButtonElement = this.parent.createElement('button', {
                    className: 'e-comment-cancel',
                    attrs: { type: 'button', 'aria-label': 'Cancel', title: l10n.getConstant('Cancel') }
                }) as HTMLButtonElement;
                const cancelInstance: Button = new Button({ cssClass: 'e-flat', iconCss: 'e-icons e-close' }, cancelBtnEl);
                cancelInstance.createElement = this.parent.createElement;
                btnBar.appendChild(cancelBtnEl);
            }
        }
    }

    private removeFooterButtons(footer: HTMLElement): void {
        const btnBar: HTMLElement = footer.querySelector('.e-comment-btn') as HTMLElement;
        if (btnBar) {
            const post: HTMLElement = btnBar.querySelector('.e-comment-post') as HTMLElement;
            const cancel: HTMLElement = btnBar.querySelector('.e-comment-cancel') as HTMLElement;
            const destroyButton: (ele: HTMLElement) => void = (ele: HTMLElement): void => {
                requestAnimationFrame(() => {
                    const inst: { destroy: Function } = getComponent(ele, 'btn') as Button;
                    if (inst) {
                        inst.destroy();
                    }
                    ele.remove();
                });
            };
            if (post) {
                destroyButton(post);
            }
            if (cancel) {
                destroyButton(cancel);
            }
        }
    }

    private syncFooterPostState(footer: HTMLElement, textArea: HTMLTextAreaElement): void {
        const btnBar: HTMLElement = footer.querySelector('.e-comment-btn') as HTMLElement;
        if (btnBar) {
            const postBtn: HTMLButtonElement = btnBar.querySelector('.e-comment-post') as HTMLButtonElement;
            const hasContent: boolean = textArea.value.trim().length > 0;
            this.isEditing = hasContent;
            if (postBtn) {
                const inst: Button = getComponent(postBtn, 'btn') as Button;
                if (inst) {
                    inst.disabled = !hasContent;
                    inst.isPrimary = hasContent;
                    inst.dataBind();
                    inst.element.style.opacity = hasContent ? '1' : '0.5';
                }
            }
        }
    }

    private wireFooterEvents(footer: HTMLElement): void {
        if (!footer || footer.dataset.footerWired === '1') {
            return;
        }
        const textArea: HTMLTextAreaElement = footer.querySelector('.e-comment-input') as HTMLTextAreaElement;
        const btnBar: HTMLElement = footer.querySelector('.e-comment-btn') as HTMLElement;
        if (textArea) {
            EventHandler.add(textArea, 'input', this.onFooterInput, this);
            EventHandler.add(textArea, 'focus', this.onFooterFocus, this);
            EventHandler.add(textArea, 'blur', this.onFooterBlur, this);
        }
        if (btnBar) {
            EventHandler.add(btnBar, 'click', this.onFooterClick, this);
        }
        footer.dataset.footerWired = '1';
    }

    private unwireFooterEvents(footer: HTMLElement): void {
        if (!footer || footer.dataset.footerWired !== '1') {
            return;
        }
        const textArea: HTMLTextAreaElement = footer.querySelector('.e-comment-input') as HTMLTextAreaElement;
        const btnBar: HTMLElement = footer.querySelector('.e-comment-btn') as HTMLElement;
        if (textArea) {
            EventHandler.remove(textArea, 'input', this.onFooterInput);
            EventHandler.remove(textArea, 'focus', this.onFooterFocus);
            EventHandler.remove(textArea, 'blur', this.onFooterBlur);
        }
        if (btnBar) {
            EventHandler.remove(btnBar, 'click', this.onFooterClick);
        }
        delete footer.dataset.footerWired;
    }

    private commentHandler(): void {
        if (this.isReviewPaneVisible && this.parent.element.querySelector('.e-review-panel')) {
            const sheet: SheetModel = this.parent.getActiveSheet();
            const indexes: number[] = getCellIndexes(sheet.activeCell);
            const cell: CellModel = getCell(indexes[0], indexes[1], sheet);
            const reviewHeaderNewBtn: HTMLElement = this.parent.element.querySelector('.e-review-new');
            if (reviewHeaderNewBtn) {
                const newBtnObj: Button = getComponent(reviewHeaderNewBtn, 'btn') as Button;
                if (newBtnObj) {
                    newBtnObj.disabled = !!(cell && cell.notes);
                    newBtnObj.dataBind();
                }
            }
            if (cell && cell.comment) {
                this.initiateComment({ rowIndex: indexes[0], columnIndex: indexes[1], isSelection: true });
            }
        }
    }

    private removeCommentContainer(): void {
        const container: HTMLElement = this.parent.element.querySelector('.e-comment-container');
        let rIdx: number; let cIdx: number;
        if (container) {
            if (container.dataset && container.dataset.commentRowIndex && container.dataset.commentColIndex) {
                rIdx = parseInt(container.dataset.commentRowIndex, 10);
                cIdx = parseInt(container.dataset.commentColIndex, 10);
            }
            const cellEle: HTMLElement = this.parent.getCell(rIdx, cIdx);
            if (cellEle) {
                EventHandler.remove(cellEle, 'mouseout', this.mouseOut);
            }
            EventHandler.remove(container, 'mouseout', this.mouseOut);
            this.unbindContainerEvents(container);
            const host: HTMLElement = this.getBodyHost(container);
            if (host) {
                this.unbindReplyHover(host);
            }
            const footerEl: HTMLElement = container.querySelector('.e-comment-footer') as HTMLElement;
            if (footerEl) {
                this.unwireFooterEvents(footerEl);
                this.removeFooterButtons(footerEl);
            }
            detach(container);
            if (!isNullOrUndefined(rIdx) && !isNullOrUndefined(cIdx)) {
                const cell: CellModel = getCell(rIdx, cIdx, this.parent.getActiveSheet());
                if (!cell || (cell && !cell.comment)) {
                    this.detachCommentIndicator(rIdx, cIdx);
                }
            }
            this.isCommentVisible = false;
            this.activeCommentCell = null;
            if (this.commentListView) {
                this.commentListView.destroy();
                this.commentListView = null;
            }
            this.bodyHost = null;
            this.isEditing = false;
        }
    }

    private processSheetComments(args: {
        sheet: ExtendedSheet, isDelete: boolean, id?: string,
        comment?: ExtendedThreadedCommentModel, isRefresh?: boolean, sheetIdx?: number
    }): void {
        const sheet: ExtendedSheet = args.sheet;
        const id: string = args.id;
        const comment: ExtendedThreadedCommentModel = args.comment;
        const isDelete: boolean = args.isDelete;
        if (!sheet.comments) {
            sheet.comments = [];
        }
        if (isDelete) {
            if (id) {
                const index: number = sheet.comments.findIndex((c: ExtendedThreadedCommentModel) => c.id === id);
                if (index !== -1) {
                    sheet.comments.splice(index, 1);
                }
            }
        } else {
            if (comment) {
                if (!comment.id) {
                    comment.id = getUniqueID('e_spreadsheet_comment');
                }
                if (comment.replies && comment.replies.length > 0) {
                    comment.replies.forEach((reply: ExtendedThreadedCommentModel) => {
                        if (!reply.id) {
                            reply.id = getUniqueID('e_spreadsheet_reply');
                        }
                    });
                }
                const existingIdx: number = sheet.comments.findIndex((c: ExtendedThreadedCommentModel) => c.id === comment.id);
                if (existingIdx > -1) {
                    sheet.comments[existingIdx as number] = comment;
                } else {
                    const idx: number = this.lowerBoundByAddress(sheet.comments, this.getThreadAddr(comment));
                    sheet.comments.splice(idx, 0, comment);
                }
            }
        }
        if (args.isRefresh && !isNullOrUndefined(args.sheetIdx)) {
            this.refreshCommentsPane({ sheetIdx: args.sheetIdx });
        }
    }

    private updateCommentsFromSheet(): void {
        this.parent.sheets.forEach((sheet: ExtendedSheet) => {
            if (sheet.comments) {
                sheet.comments.forEach((model: ExtendedThreadedCommentModel) => {
                    if (!model.isResolved) {
                        model.isResolved = false;
                    }
                    const threadModel: ExtendedThreadedCommentModel = model;
                    threadModel.id = getUniqueID('e_spreadsheet_comment');
                    if (threadModel.replies) {
                        threadModel.replies.forEach((reply: ExtendedThreadedCommentModel) => {
                            reply.id = getUniqueID('e_spreadsheet_reply');
                        });
                    }
                    const indexes: number[] = threadModel.address;
                    setCell(indexes[0], indexes[1], sheet, { comment: threadModel }, true);
                });
            }
        });
    }

    private showCommentPane(args: { show: boolean }): void {
        const host: HTMLElement = this.parent.element;
        const id: string = host.id;
        const sheetPanel: HTMLElement = host.querySelector(`#${id}_sheet_panel`);
        const sheetEl: HTMLElement = host.querySelector(`#${id}_sheet`);
        const sheetTabPanel: HTMLElement = host.querySelector(`#${id}_sheet_tab_panel`);
        if (!sheetPanel || !sheetEl || !sheetTabPanel) {
            return;
        }
        this.parent.setProperties({ showCommentsPane: args.show }, true);
        let reviewPanel: HTMLElement = sheetPanel.querySelector(`#${id}_review_panel`);
        if (!args.show) {
            if (this.reviewInstances && this.reviewInstances.length) {
                this.reviewInstances.forEach((inst: { destroy: () => void; }) => inst.destroy());
                this.reviewInstances = [];
            }
            this.reviewHeaderEl = this.reviewBodyEl = null;
            if (this.scheduleMountId) {
                cancelAnimationFrame(this.scheduleMountId);
                this.scheduleMountId = 0;
            }
            if (reviewPanel && reviewPanel.parentElement) {
                reviewPanel.parentElement.removeChild(reviewPanel);
            }
            sheetEl.classList.remove('e-sheet-with-review-panel');
            sheetTabPanel.classList.remove('e-sheet-panel-with-review-panel');
            this.isReviewPaneVisible = false;
        } else {
            if (!reviewPanel) {
                reviewPanel = this.parent.createElement('div', { id: `${id}_review_panel`, className: 'e-review-panel' });
                sheetPanel.appendChild(reviewPanel);
            }
            sheetEl.classList.add('e-sheet-with-review-panel');
            sheetTabPanel.classList.add('e-sheet-panel-with-review-panel');
            reviewPanel.style.height = `calc(100% + ${getDPRValue(sheetTabPanel.getBoundingClientRect().height)}px)`;
            this.isReviewPaneVisible = true;
            this.buildReviewPanelUI(reviewPanel);
        }
        if (this.parent.element.getElementsByClassName('e-addNoteContainer').length) {
            this.parent.notify(updateNoteContainer, null);
        }
    }

    private buildReviewPanelUI(reviewPanel: HTMLElement): void {
        reviewPanel.innerHTML = '';
        const wrap: HTMLElement = this.parent.createElement('div', { className: 'e-review-wrap' });
        this.reviewHeaderEl = this.renderReviewHeader();
        wrap.appendChild(this.reviewHeaderEl);
        reviewPanel.appendChild(wrap);
        this.renderReviewBody();
    }

    private renderReviewHeader(): HTMLElement {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const header: HTMLElement = this.parent.createElement('div', { className: 'e-review-header' });
        const wrap1: HTMLElement = this.parent.createElement('div', { className: 'e-review-header-wrap1' });
        const title: HTMLElement = this.parent.createElement('div', { className: 'e-review-title' });
        title.textContent = l10n.getConstant('Comments');
        const closeBtnEl: HTMLButtonElement = this.parent.createElement('button', {
            className: 'e-review-close',
            attrs: { 'aria-label': 'Close', title: l10n.getConstant('Close') }
        });
        const closeBtn: Button = new Button({ cssClass: 'e-flat', iconCss: 'e-icons e-close' }, closeBtnEl);
        closeBtn.createElement = this.parent.createElement;
        EventHandler.add(closeBtn.element, 'click', () => this.showCommentPane({ show: false }), this);
        this.reviewInstances.push(closeBtn);
        wrap1.appendChild(title);
        wrap1.appendChild(closeBtn.element);
        const wrap2: HTMLElement = this.parent.createElement('div', { className: 'e-review-header-wrap2' });
        const newBtnEl: HTMLButtonElement = this.parent.createElement('button', {
            className: 'e-review-new',
            attrs: { 'aria-label': 'New', title: l10n.getConstant('New') }
        });
        const newBtn: Button = new Button({
            content: l10n.getConstant('New'), iconCss: 'e-icons e-comment-add',
            enableRtl: this.parent.enableRtl
        }, newBtnEl);
        newBtn.createElement = this.parent.createElement;
        EventHandler.add(newBtn.element, 'click', () => this.renderNewCommentForPanel(), this);
        this.reviewInstances.push(newBtn);
        const filterBtn: HTMLButtonElement = this.parent.createElement('button', {
            className: 'e-review-filter',
            attrs: { 'aria-label': 'Filter', title: l10n.getConstant('Filter') }
        });
        this.reviewFilterDdb = new DropDownButton({
            iconCss: this.getFilterIconCss(),
            enableRtl: this.parent.enableRtl,
            items: this.getFilterMenuItems(l10n),
            select: (e: MenuEventArgs) => this.onFilterMenuSelect(e),
            beforeOpen: (): void => { this.reviewFilterDdb.setProperties({ items: this.getFilterMenuItems(l10n) }, true); },
            open: (): void => this.setPopupPosition(this.reviewFilterDdb, filterBtn)
        }, filterBtn);
        this.reviewFilterDdb.createElement = this.parent.createElement;
        this.refreshFilterButton();
        this.reviewInstances.push(this.reviewFilterDdb);
        wrap2.appendChild(newBtn.element);
        wrap2.appendChild(this.reviewFilterDdb.element);
        header.appendChild(wrap1);
        header.appendChild(wrap2);
        return header;
    }

    private getFilterIconCss(): string {
        return this.reviewFilter === 'all' ? 'e-icons e-filter' : 'e-icons e-filter-active';
    }

    private getFilterMenuItems(l10n: L10n): ItemModel[] {
        const selectedIcon: string = 'e-icons e-selected-icon';
        const items: ItemModel[] = [
            { id: 'all', text: l10n.getConstant('All'), iconCss: this.reviewFilter === 'all' ? selectedIcon : '' },
            { id: 'active', text: l10n.getConstant('Active'), iconCss: this.reviewFilter === 'active' ? selectedIcon : '' },
            { id: 'resolved', text: l10n.getConstant('Resolved'), iconCss: this.reviewFilter === 'resolved' ? selectedIcon : '' }
        ];
        return items;
    }

    private onFilterMenuSelect(event: MenuEventArgs): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        let value: string = '';
        if (event && event.item) {
            if (event.item.id) {
                value = event.item.id;
            } else if (event.item.text) {
                value = event.item.text.toLowerCase();
            }
        }
        const validFilters: string[] = ['all', 'active', 'resolved'];
        if (validFilters.indexOf(value) !== -1) {
            this.reviewFilter = value;
        }
        if (this.reviewFilterDdb) {
            this.reviewFilterDdb.setProperties({ items: this.getFilterMenuItems(l10n) }, true);
            this.refreshFilterButton();
        }
        this.renderReviewBody();
    }

    private refreshFilterButton(): void {
        if (this.reviewFilterDdb && this.reviewFilterDdb.element) {
            const iconCss: string = this.getFilterIconCss();
            this.reviewFilterDdb.iconCss = iconCss;
            this.reviewFilterDdb.dataBind();
        }
    }

    private filterMatches(thread: ExtendedThreadedCommentModel): boolean {
        if (this.reviewFilter === 'active') {
            return thread.isResolved !== true;
        } else if (this.reviewFilter === 'resolved') {
            return thread.isResolved === true;
        } else {
            return true;
        }
    }

    private getReviewListHost(): HTMLElement {
        let element: HTMLElement;
        if (this.reviewBodyEl) {
            if (this.reviewBodyEl.classList.contains('e-review-thread-list')) {
                element = this.reviewBodyEl;
            } else {
                element = this.reviewBodyEl.querySelector('.e-review-thread-list') as HTMLElement;
            }
        }
        return element;
    }

    private getReviewListView(): ListView {
        const host: HTMLElement = this.getReviewListHost();
        return host ? (getComponent(host, 'listview') as ListView) : null;
    }

    private removeThreadFromPanel(threadId: string): void {
        const lv: ListView = this.getReviewListView();
        if (lv) {
            lv.removeItem({ id: threadId });
            this.ensureEmptyStateIfNoItems();
            this.scheduleMount();
        } else {
            this.showEmptyReviewBody();
        }
    }

    private insertThreadIntoPanel(thread: ExtendedThreadedCommentModel): void {
        if (this.reviewBodyEl && this.filterMatches(thread)) {
            let lv: ListView = this.getReviewListView();
            if (!lv) {
                this.renderReviewBody();
                lv = this.getReviewListView();
                if (!lv) {
                    return;
                }
            }
            const sheet: ExtendedSheet = this.parent.getActiveSheet() as ExtendedSheet;
            const allThreads: ExtendedThreadedCommentModel[] = (sheet && sheet.comments) ? sheet.comments : [];
            const filtered: ExtendedThreadedCommentModel[] = allThreads.filter(
                (t: ExtendedThreadedCommentModel) => this.filterMatches(t)
            );
            const insertIdx: number = filtered.findIndex((t: ExtendedThreadedCommentModel) => t.id === thread.id);
            if (insertIdx === -1) {
                return;
            }
            const hostExist: HTMLElement = this.reviewBodyEl.querySelector(`.e-review-thread-host[data-thread-id="${thread.id}"]`);
            if (!hostExist) {
                lv.addItem([{ id: thread.id }], undefined, insertIdx);
                this.scheduleMount();
            }
        }
    }

    private showEmptyReviewBody(): void {
        this.destroyReviewBodyListView();
        if (this.reviewBodyEl) {
            this.reviewBodyEl.innerHTML = '';
            this.renderEmptyReviewBody();
        }
    }

    private ensureEmptyStateIfNoItems(): void {
        const lv: ListView = this.getReviewListView();
        if (lv) {
            const ds: { [key: string]: Object }[] = lv.dataSource as { [key: string]: Object }[] || [];
            if (!Array.isArray(ds) || ds.length === 0) {
                this.showEmptyReviewBody();
            }
        }
    }

    private renderReviewBody(): void {
        this.renderReviewBodyForSheetIdx(this.parent.activeSheetIndex);
    }

    private renderReviewBodyForSheetIdx(sheetIdx: number): void {
        this.ensureReviewBodyHost();
        if (this.reviewBodyEl) {
            this.destroyReviewBodyListView();
            this.reviewBodyEl.innerHTML = '';
            const sheet: ExtendedSheet = this.parent.sheets[sheetIdx as number] as ExtendedSheet;
            const allThreads: ExtendedThreadedCommentModel[] = (sheet && sheet.comments) ? sheet.comments : [];
            const threads: ExtendedThreadedCommentModel[] = allThreads.filter(
                (t: ExtendedThreadedCommentModel): boolean => {
                    if (this.reviewFilter === 'active') {
                        return t.isResolved !== true;
                    } else if (this.reviewFilter === 'resolved') {
                        return t.isResolved === true;
                    }
                    return true;
                }
            );
            if (threads.length === 0) {
                this.renderEmptyReviewBody();
                return;
            }
            this.renderThreadsList(threads);
        }
    }

    private ensureReviewBodyHost(): void {
        const reviewPanel: HTMLElement = this.parent.element.querySelector(`#${this.parent.element.id}_review_panel`);
        if (reviewPanel) {
            if (!this.reviewBodyEl) {
                this.reviewBodyEl = this.parent.createElement('div', { className: 'e-review-body' });
                const wrap: HTMLElement = reviewPanel.querySelector('.e-review-wrap');
                if (wrap) {
                    wrap.appendChild(this.reviewBodyEl);
                }
            }
        }
    }

    private destroyReviewBodyListView(): void {
        const lv: ListView = this.getReviewListView();
        if (lv) {
            lv.destroy();
        }
    }

    private renderEmptyReviewBody(): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const empty: HTMLElement = this.parent.createElement('div', { className: 'e-review-empty' });
        empty.textContent = l10n.getConstant(this.reviewFilter !== 'all' ? 'EmptyFilterComment' : 'EmptyComment');
        this.reviewBodyEl.appendChild(empty);
    }

    private renderThreadsList(threads: ExtendedThreadedCommentModel[]): void {
        const dataSource: { id: string; }[] = threads.map((t: ExtendedThreadedCommentModel) => ({ id: t.id }));
        const itemTemplate: Function = (data: { id: string }): Element[] => {
            const item: HTMLElement = this.parent.createElement('div', { className: 'e-review-thread', attrs: { id: data.id } });
            const host: HTMLElement = this.parent.createElement('div', { className: 'e-review-thread-host', attrs: { 'data-thread-id': data.id } });
            item.appendChild(host);
            return [item];
        };
        enableRipple(false);
        const listView: ListView = new ListView({
            dataSource: dataSource,
            template: itemTemplate,
            cssClass: 'e-review-thread-list',
            enableVirtualization: true,
            height: '100%',
            enableRtl: this.parent.enableRtl,
            select: (args: SelectEventArgs): void => this.updateCellSelction(args),
            actionComplete: (): void => this.scheduleMount(),
            scroll: (): void => this.scheduleMount()
        });
        listView.createElement = this.parent.createElement;
        /* eslint-disable */
        (listView as any).isInternalTemplate = true;
        /* eslint-enable */
        listView.appendTo(this.reviewBodyEl);
        this.reviewInstances.push({ destroy: () => listView.destroy() });
        this.scheduleMount();
    }

    private scheduleMount(): void {
        if (this.scheduleMountId) {
            cancelAnimationFrame(this.scheduleMountId);
        }
        this.scheduleMountId = requestAnimationFrame((): void => {
            this.mountVisibleReviewItems();
            this.scheduleMountId = 0;
        });
    }

    private mountVisibleReviewItems(): void {
        if (this.reviewBodyEl) {
            const hosts: NodeListOf<HTMLElement> = this.reviewBodyEl.querySelectorAll('.e-review-thread-host');
            hosts.forEach((host: HTMLElement, index: number) => {
                if (host.getAttribute('data-mounted') !== 'true') {
                    const threadId: string = host.getAttribute('data-thread-id');
                    if (threadId) {
                        const pos: { row: number, col: number } = this.findThreadPositionById(threadId);
                        if (pos) {
                            const container: HTMLElement = this.buildPaneThreadContainer(pos.row, pos.col, index);
                            host.appendChild(container);
                            host.setAttribute('data-mounted', 'true');
                        }
                    }
                }
            });
        }
    }

    private buildPaneThreadContainer(rIdx: number, cIdx: number, index: number): HTMLElement {
        const container: HTMLDivElement = this.parent.createElement('div', { className: `e-pane-container e-thread-${index}` });
        container.tabIndex = -1;
        this.renderCommentUI(container, rIdx, cIdx, true, `e-thread-${index}`);
        EventHandler.remove(container, 'mouseout', this.mouseOut);
        const cell: CellModel = getCell(rIdx, cIdx, this.parent.getActiveSheet());
        const thread: ThreadedCommentModel = cell && cell.comment;
        if (thread && thread.isResolved) {
            this.handleResolvedThread(container, rIdx, cIdx, thread);
        }
        this.bindContainerEvents(container);
        return container;
    }

    private findThreadPositionById(threadId: string): { row: number, col: number } {
        const sheet: ExtendedSheet = this.parent.getActiveSheet() as ExtendedSheet;
        const coll: ExtendedThreadedCommentModel[] = sheet.comments || [];
        const thread: ExtendedThreadedCommentModel = coll.find((t: ExtendedThreadedCommentModel) => t.id === threadId);
        let row: number; let col: number;
        if (thread && thread.address && Array.isArray(thread.address)) {
            row = thread.address[0]; col = thread.address[1];
        }
        return { row, col };
    }

    private refreshCommentsPane(args: { sheetIdx: number }): void {
        if (this.isReviewPaneVisible) {
            const reviewPanel: HTMLElement = this.parent.element.querySelector(`#${this.parent.element.id}_review_panel`);
            if (reviewPanel) {
                this.renderReviewBodyForSheetIdx(args.sheetIdx);
            }
        }
    }

    private renderNewCommentForPanel(rIdx?: number, cIdx?: number): void {
        let row: number = rIdx; let col: number = cIdx;
        if (isNullOrUndefined(row) || isNullOrUndefined(col)) {
            const activeAddress: number[] = getCellIndexes(this.parent.getActiveSheet().activeCell);
            row = activeAddress[0]; col = activeAddress[1];
        }
        const sheet: ExtendedSheet = this.parent.getActiveSheet() as ExtendedSheet;
        if (!this.reviewBodyEl || (sheet.comments && sheet.comments.length === 0)) {
            this.renderReviewBody();
        }
        const existing: ExtendedThreadedCommentModel = (sheet.comments || []).find(
            (t: ExtendedThreadedCommentModel) => Array.isArray(t.address) && t.address[0] === row && t.address[1] === col
        );
        if (existing && existing.id) {
            this.updateThreadSelection(existing.id);
            this.scrollToThreadInPanel(existing.id);
            return;
        }
        const emptyEl: HTMLElement = this.reviewBodyEl.querySelector('.e-review-empty');
        if (emptyEl) {
            emptyEl.remove();
        }
        const oldDraft: HTMLElement = this.reviewBodyEl.querySelector('.e-pane-container.e-thread-draft');
        if (oldDraft) {
            const host: HTMLElement = this.getBodyHost(oldDraft);
            if (host) {
                this.unbindReplyHover(host);
            }
            this.unbindContainerEvents(oldDraft);
            oldDraft.remove();
        }
        const draft: HTMLDivElement = this.parent.createElement('div', { className: 'e-pane-container e-thread-draft' });
        draft.tabIndex = -1;
        const targetElement: HTMLElement = this.parent.getCell(row, col);
        if (targetElement && !targetElement.querySelector('.e-comment-indicator')) {
            this.createCommentIndicator({ targetEle: targetElement, rIdx: row, cIdx: col });
        }
        this.renderCommentUI(draft, row, col, true);
        const cell: CellModel = getCell(row, col, this.parent.getActiveSheet());
        const thread: ThreadedCommentModel = cell && cell.comment;
        if (thread && thread.isResolved) {
            this.handleResolvedThread(draft, row, col, thread);
        }
        this.bindContainerEvents(draft);
        this.reviewBodyEl.insertBefore(draft, this.reviewBodyEl.firstChild);
        const input: HTMLTextAreaElement = draft.querySelector('.e-comment-footer .e-comment-input');
        if (input) {
            input.focus();
            input.select();
            this.adjustTextareaHeight(input, false);
        }
    }

    private updateThreadSelection(threadId: string): void {
        if (!this.reviewBodyEl) {
            this.renderReviewBody();
        }
        if (!this.reviewBodyEl.querySelector(`.e-review-thread-host[data-thread-id="${threadId}"]`)) {
            this.renderReviewBody();
        }
        getUpdateUsingRaf(() => {
            const host: HTMLElement = this.reviewBodyEl.querySelector(`.e-review-thread-host[data-thread-id="${threadId}"]`);
            if (host) {
                const container: HTMLElement = host.querySelector('.e-pane-container');
                if (container) {
                    container.focus();
                    host.scrollIntoView({ block: 'nearest' });
                }
            }
        });
    }

    private updateCellSelction(args: SelectEventArgs): void {
        if (args && args.item) {
            const host: HTMLElement = args.item.querySelector('.e-review-thread-host') as HTMLElement;
            let container: HTMLElement;
            if (host) {
                container = host.querySelector('.e-pane-container') as HTMLElement;
            } else {
                container = closest(args.item as HTMLElement, '.e-pane-container') as HTMLElement;
            }
            if (container) {
                const idx: number[] = this.getIndexesFromContainer(container);
                if (idx && idx.length === 2) {
                    this.parent.goTo(getSheetName(this.parent, this.parent.activeSheetIndex) + '!' + getCellAddress(idx[0], idx[1]));
                }
            }
        }
    }

    private lowerBoundByAddress(coll: ExtendedThreadedCommentModel[], addr: number[]): number {
        let low: number = 0;
        let high: number = coll.length;
        while (low < high) {
            const mid: number = Math.floor((low + high) / 2);
            const [midRow, midCol] = this.getThreadAddr(coll[mid as number]);
            if (midRow < addr[0] || (midRow === addr[0] && midCol < addr[1])) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }
        return low;
    }

    private getThreadAddr(thread: ExtendedThreadedCommentModel): number[] {
        return [thread.address[0], thread.address[1]];
    }

    private refreshReviewListFromSheet(): void {
        if (!this.isReviewPaneVisible || !this.reviewBodyEl) {
            return;
        }
        const sheet: ExtendedSheet = this.parent.getActiveSheet() as ExtendedSheet;
        const allThreads: ExtendedThreadedCommentModel[] = sheet.comments || [];
        const filtered: ExtendedThreadedCommentModel[] = allThreads.filter((t: ExtendedThreadedCommentModel) => this.filterMatches(t));
        const dataSource: Array<{ id: string }> = filtered.map((t: ExtendedThreadedCommentModel) => ({ id: t.id }));
        if (dataSource.length === 0) {
            this.showEmptyReviewBody();
            return;
        }
        const listView: ListView = this.getReviewListView();
        if (listView) {
            listView.setProperties({ dataSource }, true);
            listView.refresh();
            this.scheduleMount();
        } else {
            this.renderReviewBody();
        }
    }

    private syncThreadInPanel(thread: ExtendedThreadedCommentModel): void {
        if (!this.isReviewPaneVisible || !this.reviewBodyEl || !thread || !thread.id) {
            return;
        }
        if (this.reviewFilter !== 'all') {
            const shouldShow: boolean = this.filterMatches(thread);
            const hostExist: HTMLElement = this.reviewBodyEl.querySelector(`.e-review-thread-host[data-thread-id="${thread.id}"]`);
            if (shouldShow && !hostExist) {
                this.insertThreadIntoPanel(thread);
            } else if (!shouldShow && hostExist) {
                this.removeThreadFromPanel(thread.id);
            }
        }
        const host: HTMLElement = this.reviewBodyEl.querySelector(`.e-review-thread-host[data-thread-id="${thread.id}"]`);
        if (host) {
            const container: HTMLElement = host.querySelector('.e-pane-container');
            if (!container) {
                this.refreshReviewListFromSheet();
                return;
            }
            const rIdx: number = thread.address[0];
            const cIdx: number = thread.address[1];
            if (typeof rIdx === 'number' && typeof cIdx === 'number') {
                this.renderThreadContainer(rIdx, cIdx, thread, container);
            }
            const body: HTMLElement = container.querySelector('.e-comment-body');
            if (body) {
                const lv: ListView = getComponent(body, 'listview') as ListView;
                if (lv) {
                    const data: { [key: string]: Object }[] = thread ? this.convertThreadToListItems(thread) : [];
                    lv.setProperties({ dataSource: data }, true);
                    lv.refresh();
                } else {
                    const newBody: HTMLElement = this.createBodyContent(thread, true, true);
                    const footer: HTMLElement = container.querySelector('.e-comment-footer');
                    if (newBody && footer) {
                        container.insertBefore(newBody, footer);
                    }
                }
            }
        } else {
            this.refreshReviewListFromSheet();
        }
    }

    private getFilteredThreadsForActiveSheet(): ExtendedThreadedCommentModel[] {
        const sheet: ExtendedSheet = this.parent.getActiveSheet() as ExtendedSheet;
        const all: ExtendedThreadedCommentModel[] = sheet.comments || [];
        const result: ExtendedThreadedCommentModel[] = [];
        for (let i: number = 0; i < all.length; i++) {
            const t: ExtendedThreadedCommentModel = all[i as number];
            if (this.filterMatches(t)) {
                result.push(t);
            }
        }
        return result;
    }

    private getThreadIndexInFiltered(threadId: string): number {
        const list: ExtendedThreadedCommentModel[] = this.getFilteredThreadsForActiveSheet();
        for (let i: number = 0; i < list.length; i++) {
            if (list[i as number].id === threadId) {
                return i;
            }
        }
        return -1;
    }

    private scrollToThreadInPanel(threadId: string, isSelection?: boolean): void {
        if (!this.isReviewPaneVisible || !this.reviewBodyEl || !threadId) { return; }
        const lv: ListView = this.getReviewListView();
        if (!lv) { return; }
        const filteredIndex: number = this.getThreadIndexInFiltered(threadId);
        if (filteredIndex < 0) { return; }
        lv.selectItem({ id: threadId } as { [key: string]: Object });
        this.scheduleMount();
        getUpdateUsingRaf((): void => {
            this.mountVisibleReviewItems();
            const selector: string = '.e-review-thread-host[data-thread-id="' + threadId + '"]';
            const host: HTMLElement = this.reviewBodyEl.querySelector(selector) as HTMLElement;
            if (host) {
                host.scrollIntoView({ block: 'nearest' });
                const container: HTMLElement = host.querySelector('.e-pane-container') as HTMLElement;
                if (container) {
                    container.focus();
                    const input: HTMLTextAreaElement = container.querySelector('.e-comment-footer .e-comment-input') as HTMLTextAreaElement;
                    if (input && !isSelection) {
                        input.focus();
                        input.select();
                    }
                }
            }
        });
    }

    private onCommentUndoRedo(args: { cellIdx: number[], sheetIdx: number }): void {
        if (args && args.cellIdx && !isNullOrUndefined(args.sheetIdx)) {
            const sheet: ExtendedSheet = this.parent.sheets[args.sheetIdx as number] as ExtendedSheet;
            const row: number = args.cellIdx[0];
            const col: number = args.cellIdx[1];
            const cell: CellModel = getCell(row, col, sheet);
            const model: ExtendedThreadedCommentModel = cell && (cell.comment as ExtendedThreadedCommentModel);
            const existing: ExtendedThreadedCommentModel = sheet.comments.find(
                (t: ExtendedThreadedCommentModel) => t.address && t.address[0] === row && t.address[1] === col);
            if (model) {
                if (!Array.isArray(model.address)) {
                    model.address = [row, col];
                }
                this.processSheetComments({ sheet: sheet, comment: model, isDelete: false });
                if (this.parent.activeSheetIndex === args.sheetIdx) {
                    const td: HTMLElement = this.parent.getCell(row, col);
                    if (td && !td.querySelector('.e-comment-indicator')) {
                        this.createCommentIndicator({ targetEle: td, rIdx: row, cIdx: col });
                    }
                    const cont: HTMLElement = this.getCommentContainer();
                    if (cont) {
                        const indices: number[] = this.getIndexesFromContainer(cont);
                        if (indices && indices[0] === row && indices[1] === col) {
                            this.renderThreadContainer(row, col, model, cont);
                            const body: HTMLElement = cont.querySelector('.e-comment-body');
                            if (body) {
                                const lv: ListView = getComponent(body, 'listview') as ListView;
                                if (lv) {
                                    lv.setProperties({ dataSource: this.convertThreadToListItems(model) }, true);
                                    lv.refresh();
                                }
                            }
                        }
                    }
                }
            } else {
                if (existing) {
                    this.processSheetComments({ sheet: sheet, id: existing.id, isDelete: true });
                }
                this.detachCommentIndicator(row, col);
                const cont: HTMLElement = this.getCommentContainer();
                if (cont) {
                    const indices: number[] = this.getIndexesFromContainer(cont);
                    if (indices && indices[0] === row && indices[1] === col) {
                        this.removeCommentContainer();
                    }
                }
            }
            if (this.isReviewPaneVisible) {
                this.refreshCommentsPane({ sheetIdx: args.sheetIdx });
            }
        }
    }

    private navigateNextPrevComment(args: { isNext: boolean }): void {
        const startSheetIdx: number = this.parent.activeSheetIndex;
        const activeSheet: ExtendedSheet = this.parent.getActiveSheet() as ExtendedSheet;
        const address: number[] = getCellIndexes(activeSheet.activeCell);
        const currentColl: ExtendedThreadedCommentModel[] = activeSheet.comments ? activeSheet.comments : [];
        const navigate: Function = (sheetIdx: number, address: number[]) => {
            this.parent.goTo(`${getSheetName(this.parent as Workbook, sheetIdx)}!${getRangeAddress(address)}`);
        };
        const crossSheetNavigate: Function = (startIdx: number): boolean => {
            const sheetCount: number = this.parent.sheets.length;
            for (let step: number = 1; step < sheetCount; step++) {
                const index: number = (startIdx + (args.isNext ? step : -step) + sheetCount) % sheetCount;
                const edge: ExtendedThreadedCommentModel = this.getEdgeThreadFromSheet(
                    this.parent.sheets[index as number] as ExtendedSheet, !args.isNext
                );
                if (edge && edge.address) {
                    navigate(index, edge.address);
                    return true;
                }
            }
            return false;
        };
        if (currentColl.length > 0) { // Try within the current sheet first
            const pos: number = this.lowerBoundByAddress(currentColl, [address[0], address[1]]);
            let exactIdx: number = -1;
            if (pos < currentColl.length) {
                const comment: ExtendedThreadedCommentModel = currentColl[pos as number];
                if (comment && comment.address && comment.address[0] === address[0] && comment.address[1] === address[1]) {
                    exactIdx = pos;
                }
            }
            if (exactIdx === -1 && pos > 0) {
                const prevComment: ExtendedThreadedCommentModel = currentColl[(pos - 1) as number];
                if (prevComment && prevComment.address && prevComment.address[0] === address[0] && prevComment.address[1] === address[1]) {
                    exactIdx = pos - 1;
                }
            }
            let idx: number = args.isNext ? (exactIdx > -1 ? exactIdx + 1 : pos) : (exactIdx > -1 ? exactIdx - 1 : pos - 1);
            if (idx < 0 || idx >= currentColl.length) { // If out of bounds within current sheet, try cross-sheet.
                const navigated: boolean = crossSheetNavigate(startSheetIdx);
                if (navigated) {
                    return;
                }
                idx = args.isNext ? 0 : currentColl.length - 1;
            }
            const comment: ExtendedThreadedCommentModel = currentColl[idx as number];
            if (comment && comment.address) { // Next/Prev within the same sheet
                navigate(startSheetIdx, comment.address);
                return;
            }
        }
        // Cross-sheet fallback: move forward/backward to the next sheet that has comments
        crossSheetNavigate(startSheetIdx);
    }

    private getEdgeThreadFromSheet(sheet: ExtendedSheet, fromEnd: boolean): ExtendedThreadedCommentModel | undefined {
        const coll: ExtendedThreadedCommentModel[] = sheet.comments ? sheet.comments : [];
        if (coll.length === 0) {
            return undefined;
        }
        return fromEnd ? coll[coll.length - 1] : coll[0]; // Next => take first comment; Prev => take last comment
    }

    /**
     * Destroy SpreadsheetComment Module.
     *
     * @returns {void} - Destroy SpreadsheetComment module.
     */
    public destroy(): void {
        this.removeEventListener();
        if (!this.parent.isDestroyed && !(this.parent as unknown as { refreshing?: boolean }).refreshing) {
            const commentIndicators: HTMLCollectionOf<Element> = this.parent.element.getElementsByClassName('e-comment-indicator');
            while (commentIndicators.length) {
                const indicator: HTMLElement = commentIndicators[0] as HTMLElement;
                if (indicator) {
                    EventHandler.remove(indicator, 'mouseover', this.mouseOver);
                    EventHandler.remove(indicator, 'mouseout', this.mouseOut);
                    delete indicator.dataset.commentListenersAdded;
                    delete indicator.dataset.commentRowIndex;
                    delete indicator.dataset.commentColIndex;
                    detach(indicator);
                }
            }
            this.removeCommentContainer();
        }
        if (this.reviewPaneEl && this.reviewPaneEl.parentElement) {
            this.reviewPaneEl.parentElement.removeChild(this.reviewPaneEl);
        }
        this.reviewPaneEl = null;
        this.isReviewPaneVisible = null;
        this.isCommentVisible = null;
        this.editingState = null;
        this.parent = null;
    }

    /**
     * Get the SpreadsheetComment Module Name.
     *
     * @returns {string} - Get the spreadsheetComment module name.
     */
    public getModuleName(): string {
        return 'spreadsheetComment';
    }

}
