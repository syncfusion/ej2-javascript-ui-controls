import { DropDownButton, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { EditorDialog } from '../../base/renderer/editor-dialog';
import { addClass, createElement, isNullOrUndefined as isNOU, L10n } from '@syncfusion/ej2-base';
import { ServiceLocator } from '../../base/service/service-locator';
import { RichTextEditorUI } from '../richtexteditor-ui';
import { LinkEventArgs } from '../../base/renderer/toolbar-action-handler';
import * as events from '../../common/constant';
import { EditorCommandExecutor } from '../../base/renderer/editor-integration';
import { ExecuteLinkAttributes } from '../../core';
import { LinkSettingsModel } from '../model/link-settings-model';
import { BaseQuickToolbar } from '../../base/renderer/base-quick-toolbar';
import { CheckBox } from '@syncfusion/ej2-buttons';

export class LinkModule {

    public serviceLocator: ServiceLocator;
    private i10n: L10n;
    public parent: RichTextEditorUI;
    private rteUIID: string;
    public dialogModel: EditorDialog;
    private controller: EditorCommandExecutor;
    private linkSettings: LinkSettingsModel;
    private protocolDropdown: DropDownButton | null;
    private selectedProtocol: string | null;
    /** The link element currently being edited, if any. Used to pick the controller operation. */
    private editingLinkElement: HTMLAnchorElement | null;
    /** Flag to prevent duplicate dialog openings from keyboard shortcut. */
    private isLinkDialogOpen: boolean;
    /** Saved selection range for restoration after dialog closes. */
    private savedSelectionRange: Range | null;
    private isProtocolPrepended: boolean = false;
    /** Set to `true` when `linkSettings` is mutated while the dialog is open. */
    private linkSettingsDirty: boolean;
    private checkBoxObj: CheckBox;

    /**
     * Creates a new LinkModule bound to the parent editor.
     *
     * @param {RichTextEditorUI}parent - The host RichTextEditorUI instance. Must have a valid `element.id`.
     * @param {ServiceLocator}serviceLocator - Service locator used to resolve the `rteLocale` L10n service.
     */
    constructor(parent?: RichTextEditorUI, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.rteUIID = parent.element.id;
        this.serviceLocator = serviceLocator;
        this.i10n = this.serviceLocator.getService<L10n>('rteLocale');
        this.linkSettings = this.getLinkSettingsOrDefaults();
        this.selectedProtocol = this.linkSettings.defaultProtocol;
        this.isLinkDialogOpen = false;
        this.savedSelectionRange = null;
        this.linkSettingsDirty = false;
        this.addEventListener();
    }

    /**
     * Resolves link configuration with safe defaults and validates the relationship
     * between `defaultProtocol` and `allowedProtocols`.
     *
     * @returns {LinkSettingsModel} A fully-populated `LinkSettingsModel`.
     */
    private getLinkSettingsOrDefaults(): LinkSettingsModel {
        const allowedProtocols: string[] =
            this.parent.linkSettings.allowedProtocols;
        const configuredDefault: string =
            this.parent.linkSettings.defaultProtocol;

        // Validate that defaultProtocol is part of allowedProtocols (case-insensitive).
        const isAllowed: boolean = allowedProtocols.some(
            (proto: string): boolean => proto.toLowerCase() === configuredDefault.toLowerCase()
        );
        if (!isAllowed) {
            console.warn(
                `[RichTextEditorUI] linkSettings.defaultProtocol ("${configuredDefault}") ` +
                `is not present in linkSettings.allowedProtocols (${JSON.stringify(allowedProtocols)}). ` +
                `Falling back to "${allowedProtocols[0]}". ` +
                `Add "${configuredDefault}" to allowedProtocols or change defaultProtocol.`
            );
        }
        const effectiveDefault: string = isAllowed ? configuredDefault : allowedProtocols[0];
        return {
            linkOnPaste: this.parent.linkSettings.linkOnPaste,
            defaultTarget: this.parent.linkSettings.defaultTarget,
            autoPrependProtocol: this.parent.linkSettings.autoPrependProtocol,
            defaultProtocol: effectiveDefault,
            allowedProtocols: allowedProtocols
        };
    }

    private addEventListener(): void {
        this.parent.on(events.insertLink, this.renderLinkDialog, this);
        this.parent.on(events.insertCompleted, this.insertCompletedHandler, this);
        this.parent.on(events.editorMouseup, this.editorMouseUpHandler, this);
        this.parent.on(events.linkOperations, this.handleLinkQuickToolbarCommand, this);
        this.parent.on(events.editorKeydown, this.onKeyboardShortcut, this);
        this.parent.on(events.linkModelChanged, this.applyLinkSettings, this);
        this.parent.inputElement.addEventListener('paste', this.pasteHandler, true);
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.closeLinkDialog, this.closeLinkDialog, this);
    }

    private removeEventListener(): void {
        this.parent.off(events.insertLink, this.renderLinkDialog);
        this.parent.off(events.insertCompleted, this.insertCompletedHandler);
        this.parent.off(events.editorMouseup, this.editorMouseUpHandler);
        this.parent.off(events.editorKeydown, this.onKeyboardShortcut);
        this.parent.off(events.linkModelChanged, this.applyLinkSettings);
        this.parent.off(events.destroy, this.destroy);
        this.parent.inputElement.removeEventListener('paste', this.pasteHandler, true);
        this.parent.off(events.closeLinkDialog, this.closeLinkDialog);
    }

    private pasteHandler: (e: ClipboardEvent) => void = (e: ClipboardEvent): void => {
        const inputEle: HTMLElement = this.parent.inputElement;
        const target: Node | null = e.target as Node;
        if (!inputEle || !target || !inputEle.contains(target) || !this.parent.isSelectionInRTE()) {
            return;
        }
        const clipboardData: DataTransfer | null = e.clipboardData;
        const url: string = clipboardData.getData('text/plain').trim();
        if (!this.isUrlLike(url)) {
            return; // not a URL paste -> do nothing; normal handling proceeds untouched
        }
        const selection: Selection = inputEle.ownerDocument.getSelection();
        const range: Range | null = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
        if (!range) {
            return;
        }
        e.preventDefault();
        e.stopImmediatePropagation();
        if (this.linkSettings.linkOnPaste && this.validateProtocol(url).valid) {
            this.parent.editorController.process(this.parent, 'link', e as unknown as MouseEvent, {
                operation: 'insert',
                href: this.normalizeUrlForLink(url),
                displayText: range.collapsed ? url : range.toString(),
                target: this.linkSettings.defaultTarget,
                title: ''
            } as ExecuteLinkAttributes);
            return;
        }
        // linkOnPaste false (or protocol not allowed) -> plain text replaces selection, never a link
        this.parent.baseEditorCore.editor.commands.insertText({ text: url });
    };

    // Returns true when the entire pasted payload is URL-like.
    private isUrlLike(text: string): boolean {
        if (!text || /\s/.test(text)) {
            return false; // empty or a sentence containing a URL is not "a URL paste"
        }
        /* eslint-disable */
        return /^[a-z][a-z0-9+.-]*:/i.test(text)
            || /^www\./i.test(text)
            || /^[/?#]/.test(text)
            || /^([\w-]+\.)+[a-z]{2,}([/?#].*)?$/i.test(text);
    }

    /** Normalizes a protocol-less URL to a usable href, mirroring `autoPrependProtocol`. */
    private normalizeUrlForLink(url: string): string {
        if (/^[a-z][a-z0-9+.-]*:/i.test(url) || /^[/?#]/.test(url) || !this.linkSettings.autoPrependProtocol) {
            return url;
        }
        return this.linkSettings.defaultProtocol + '://' + url;
    }

    private destroyLinkDialog(): void {
        if (this.dialogModel) {
            this.dialogModel.hide();
            this.dialogModel.destroy();
        }
        if (this.checkBoxObj) {
            this.checkBoxObj.destroy();
            this.checkBoxObj = null;
        }
        this.dialogModel = null;
        this.isLinkDialogOpen = false;
        this.editingLinkElement = null;
    }

    private editorMouseUpHandler(args: { originalEvent?: MouseEvent }): void {
        this.showLinkQuickToolbar(args && args.originalEvent);
        if (this.dialogModel && this.dialogModel.element && this.parent.inputElement &&
            this.parent.inputElement.ownerDocument.contains(this.dialogModel.element)) {
            this.destroyLinkDialog();
        }
    }

    private insertCompletedHandler(args: {
        args?: { action?: string };
        value?: { operation?: string };
        event?: MouseEvent | KeyboardEvent
    }): void {
        if (!args || !args.args || args.args.action !== 'link') {
            return;
        }
        const linkElement: HTMLAnchorElement | null = this.selectedLinkElement();
        if (this.parent.quickToolbarSettings && this.parent.quickToolbarSettings.link && this.parent.quickToolbarSettings.link.length > 0) {
            this.showLinkQuickToolbar(args.event, linkElement);
        }
    }

    private showLinkQuickToolbar(originalEvent?: MouseEvent | KeyboardEvent, linkElement?: HTMLAnchorElement): void {
        if (!this.parent.toolbarSettings.enable) {
            return;
        }
        const targetElement: HTMLAnchorElement | null = !isNOU(linkElement) ? linkElement
            : this.detectLinkAtCursor(originalEvent);
        const linkToolbar: BaseQuickToolbar | null = this.parent.quickToolbarModule.getToolbar('Link');
        if (linkToolbar && document.body.contains(linkToolbar.element)) {
            linkToolbar.hidePopup();
        } else if (targetElement) {
            linkToolbar.showPopup(targetElement, originalEvent);
        }
    }

    private detectLinkAtCursor(originalEvent?: MouseEvent | KeyboardEvent): HTMLAnchorElement | null {
        if (!this.parent.inputElement || !this.parent.isSelectionInRTE() ||
            !this.parent.quickToolbarSettings.enable || !this.parent.quickToolbarSettings.link ||
            this.parent.quickToolbarSettings.link.length === 0) {
            return null;
        }
        const eventTarget: EventTarget = originalEvent && originalEvent.target;
        if (eventTarget instanceof Element) {
            const eventLink: HTMLAnchorElement | null = eventTarget.closest('a');
            if (eventLink) {
                return eventLink;
            }
        }
        return this.selectedLinkElement();
    }

    private selectedLinkElement(selection?: Selection): HTMLAnchorElement | null {
        const inputElement: HTMLElement = this.parent.inputElement;
        const currentSelection: Selection = selection ? selection : inputElement.ownerDocument.getSelection();
        if (!currentSelection || currentSelection.rangeCount === 0) {
            return null;
        }
        const range: Range = currentSelection.getRangeAt(0);
        const getAnchor: (node: Node) => HTMLAnchorElement = (node: Node | null): HTMLAnchorElement | null => {
            const element: Element | null = node.nodeType === Node.TEXT_NODE ? node.parentElement : node as Element;
            const anchor: HTMLAnchorElement | null = element && element.closest('a') as HTMLAnchorElement;
            return anchor && inputElement.contains(anchor) ? anchor : null;
        };
        const startLink: HTMLAnchorElement | null = getAnchor(range.startContainer);
        if (range.collapsed) {
            return startLink;
        }
        const endLink: HTMLAnchorElement | null = getAnchor(range.endContainer);
        return startLink && startLink === endLink ? startLink : null;
    }

    /**
     * Pre-populates dialog fields from an existing link element when editing.
     *
     * @param {HTMLAnchorElement} linkElement - The link element to extract data from.
     * @returns {void}
     * @private
     */
    private preFillDialogFromLink(linkElement: HTMLAnchorElement): void {
        if (!linkElement || !this.dialogModel) {
            return;
        }
        const href: string = linkElement.getAttribute('href');
        const title: string = linkElement.getAttribute('title') || '';
        const text: string = linkElement.textContent;
        const target: string = linkElement.getAttribute('target') || '';

        const dialogEle: HTMLElement = this.dialogModel.element as HTMLElement;
        const urlInput: HTMLInputElement = dialogEle.querySelector('.e-rte-ui-linkurl') as HTMLInputElement;
        const textInput: HTMLInputElement = dialogEle.querySelector('.e-rte-ui-linkText') as HTMLInputElement;
        const titleInput: HTMLInputElement = dialogEle.querySelector('.e-rte-ui-linkTitle') as HTMLInputElement;
        if (urlInput) {
            urlInput.value = href;
        }
        if (textInput) {
            textInput.value = text;
        }
        if (titleInput) {
            titleInput.value = title;
        }
        if (this.checkBoxObj) {
            this.checkBoxObj.checked = target === '_blank';
        }
    }

    private renderLinkDialog(_args?: LinkEventArgs): void {
        if (this.linkSettingsDirty) {
            this.linkSettings = this.getLinkSettingsOrDefaults();
            this.selectedProtocol = this.linkSettings.defaultProtocol;
            this.linkSettingsDirty = false;
        }
        this.isProtocolPrepended = false;
        if (this.isLinkDialogOpen && this.dialogModel && this.dialogModel.element && this.parent.inputElement &&
            this.parent.inputElement.ownerDocument.contains(this.dialogModel.element)) {
            this.destroyLinkDialog();
            return;
        }
        this.isLinkDialogOpen = false;
        const linkElement: HTMLAnchorElement | null = this.selectedLinkElement(_args.selection);
        _args.element = linkElement;
        this.editingLinkElement = linkElement;
        const linkWebAddress: string = this.i10n.getConstant('linkWebUrl');
        const linkDisplayText: string = this.i10n.getConstant('linkText');
        const linkTooltip: string = this.i10n.getConstant('linkTooltipLabel');
        const urlPlace: string = this.i10n.getConstant('linkurl');
        const textPlace: string = this.i10n.getConstant('textPlaceholder');
        const title: string = this.i10n.getConstant('linkTitle');
        const linkInsert: string = this.i10n.getConstant('dialogInsert');
        const linkUpdate: string = this.i10n.getConstant('dialogUpdate');
        const linkCancel: string = this.i10n.getConstant('dialogCancel');
        const linkOpenLabel: string = this.i10n.getConstant('linkOpenInNewWindow');
        // Inline the protocol dropdown next to the URL input when autoPrependProtocol is enabled.
        const protocolDropdownInline: string = this.linkSettings.autoPrependProtocol
            ? '<div class="e-rte-ui-protocol-dropdown-slot" id="protocolDropdownSlot"></div>'
            : '';
        const htmlTextbox: string = '<label>' + linkTooltip +
            '</label></div><div class="e-rte-ui-field' + this.parent.getCssClass(true) + '">' +
            '<input type="text" data-role ="none" spellcheck="false" placeholder = "' + title + '" aria-label="' + this.i10n.getConstant('linkTitle') + '" class="e-input e-rte-ui-linkTitle' + this.parent.getCssClass(true) + '"></div>' +
            '<div class="e-rte-ui-label' + this.parent.getCssClass(true) + '"></div>' +
            '<div class="e-rte-ui-field' + this.parent.getCssClass(true) + '">' +
            '<input type="checkbox" class="e-rte-ui-linkTarget' + this.parent.getCssClass(true) + '" data-role="none"></div>';
        const content: string = '<div class="e-rte-ui-label' + this.parent.getCssClass(true) + '"><label>' + linkWebAddress + '</label></div>' +
            '<div class="e-rte-ui-field' + this.parent.getCssClass(true) + '">' +
            protocolDropdownInline +
            '<input type="text" data-role ="none" spellcheck="false" placeholder="' + urlPlace + '"aria-label="' + this.i10n.getConstant('linkWebUrl') + '" class="e-input e-rte-ui-linkurl' + this.parent.getCssClass(true) + '"/>' +
            '</div>' +
            '<div class="e-rte-ui-label' + this.parent.getCssClass(true) + '">' + '<label>' + linkDisplayText + '</label></div><div class="e-rte-ui-field' + this.parent.getCssClass(true) + '"> ' +
            '<input type="text" data-role ="none" spellcheck="false" class="e-input e-rte-ui-linkText' + this.parent.getCssClass(true) + '"aria-label="' + this.i10n.getConstant('linkText') + '" placeholder="' + textPlace + '">' +
            '</div><div class="e-rte-ui-label' + this.parent.getCssClass(true) + '">' + htmlTextbox;
        const linkContent: string =
            '<div class="e-rte-ui-linkcontent' + this.parent.getCssClass(true) +
            '" id="' + this.rteUIID + '_linkContent">' + content + '</div>';
        const id: string = this.parent.element.id + 'Link_Dialog';
        const isTesting: boolean = this.parent.element && this.parent.element.dataset && this.parent.element.dataset.rteUnitTesting === 'true';
        this.dialogModel = new EditorDialog(this.parent, id, this.parent.element, {
            header: this.i10n.getConstant('linkHeader'),
            content: linkContent,
            cssClass: 'e-rte-ui-link-dialog',
            width: '310px',
            animationSettings: isTesting ? { effect: 'None', duration: 0 } : { effect : 'None' },
            buttons: [{
                click: this.insertlink.bind(this, _args),
                buttonModel: {
                    content: linkElement ? linkUpdate : linkInsert,
                    cssClass: 'e-flat e-insertLink' + this.parent.getCssClass(true), isPrimary: true
                }
            },
            {
                click: this.cancelDialog.bind(this),
                buttonModel: { cssClass: 'e-flat' + this.parent.getCssClass(true), content: linkCancel }
            }]
        });
        this.dialogModel.show();
        this.checkBoxObj = new CheckBox({
            label: linkOpenLabel, checked: false, enableRtl: this.parent.enableRtl,
            cssClass: this.parent.getCssClass()
        });
        this.checkBoxObj.isStringTemplate = true;
        this.checkBoxObj.createElement = this.parent.createElement;
        const targetCheckbox: HTMLElement = this.dialogModel.element.querySelector('.e-rte-ui-linkTarget');
        if (targetCheckbox) {
            this.checkBoxObj.appendTo(targetCheckbox);
        }
        this.isLinkDialogOpen = true;
        this.dialogModel.element.style.maxHeight = 'inherit';
        // Pre-fill dialog with existing link data if provided in args
        if (linkElement) {
            this.preFillDialogFromLink(linkElement);
        }
        // Initialize DropdownButton for protocol selection if enabled
        if (this.linkSettings.autoPrependProtocol) {
            this.initializeProtocolDropdown();
            this.syncDropdownToUrl();
        }
    }

    /**
     * Aligns the protocol DropdownButton to the URL that is already present in the input.
     *
     * @returns {void}
     */
    private syncDropdownToUrl(): void {
        const dialogEle: HTMLElement = this.dialogModel.element;
        const urlInput: HTMLInputElement = dialogEle.querySelector('.e-rte-ui-linkurl') as HTMLInputElement;
        if (!urlInput || !this.protocolDropdown) {
            return;
        }
        const url: string = urlInput.value.trim();
        const detected: string | null = this.detectProtocol(url);
        if (!detected) {
            return;
        }
        this.selectedProtocol = detected;
        this.protocolDropdown.content = this.wrapDropdownText(this.getProtocolLabel(detected));
    }

    /**
     * Initializes the protocol DropdownButton and mounts it inside the dialog's slot.
     *
     * @returns {void}
     */
    private initializeProtocolDropdown(): void {
        const dialogEle: HTMLElement = this.dialogModel.element;
        const slotEl: HTMLElement = dialogEle.querySelector('#protocolDropdownSlot') as HTMLElement;
        if (!slotEl) {
            return;
        }
        const allowedProtocols: string[] = this.linkSettings.allowedProtocols;
        const protocolItems: { id: string; text: string; value: string; }[] = allowedProtocols.map((proto: string) => ({
            id: proto,
            text: isNOU(this.getProtocolLabel(proto)) ? proto : this.getProtocolLabel(proto),
            value: proto
        }));
        if (protocolItems.length === 0) {
            return;
        }
        // Create button container for DropdownButton
        const btn: HTMLElement = createElement('button');
        btn.id = this.rteUIID + '_protocol_btn';
        slotEl.appendChild(btn);
        /* eslint-disable */
        const content: string = isNOU(this.getProtocolLabel(this.selectedProtocol)) ? this.selectedProtocol : this.getProtocolLabel(this.selectedProtocol);
        const self: LinkModule = this;
        const isTesting: boolean = this.parent.element && this.parent.element.dataset && this.parent.element.dataset.rteUnitTesting === 'true';
        this.protocolDropdown = new DropDownButton({
            cssClass: 'e-rte-ui-link-protocol-drodpown e-rte-ui-elements',
            content: this.wrapDropdownText(content),
            items: protocolItems,
            beforeItemRender: (args: MenuEventArgs) => {
                addClass([args.element], ['e-rte-ui-elements']);
            },
            animationSettings: isTesting ? { effect: 'None', duration: 0 } : { effect : 'None', duration: 400, easing: 'ease'},
            select: (args: MenuEventArgs): void => { self.onProtocolSelected(args); }
        });
        this.protocolDropdown.appendTo(btn);
        // Single input listener handles both validation and auto-prepending
        const urlInput: HTMLInputElement = dialogEle.querySelector('.e-rte-ui-linkurl') as HTMLInputElement;
        if (urlInput) {
            urlInput.addEventListener('input', (): void => {
                self.validateUrl();
                self.prependSelectedProtocolIfNeeded();
            });
        }
    }

    private getProtocolLabel(protocol: string): string {
        const labels: { [key: string]: string } = {
            'http': this.i10n.getConstant('protocolHttp'),
            'https': this.i10n.getConstant('protocolHttps'),
            'mailto': this.i10n.getConstant('protocolMailto'),
            'tel': this.i10n.getConstant('protocolTel'),
        };
        return labels[protocol.toLowerCase()];
    }

    private wrapDropdownText(label: string): string {
        return '<span class="e-rte-ui-protocol-dropdown-text">' + label + '</span>';
    }

    /**
     * Handles protocol selection from the DropdownButton.
     */
    private onProtocolSelected(args: MenuEventArgs): void {
        if (!args || !args.item) {
            return;
        }
        const newProtocol: string = (args.item as { value?: string }).value;
        this.selectedProtocol = newProtocol;
        if (this.protocolDropdown) {
            const content: string = isNOU(this.getProtocolLabel(newProtocol)) ? newProtocol : this.getProtocolLabel(newProtocol);
            this.protocolDropdown.content = this.wrapDropdownText(content);
        }
        const dialogEle: HTMLElement = this.dialogModel.element;
        const urlInput: HTMLInputElement = dialogEle.querySelector('.e-rte-ui-linkurl') as HTMLInputElement;
        const currentUrl: string = urlInput.value.trim();
        if (currentUrl.startsWith('/') || currentUrl.startsWith('?') || currentUrl.startsWith('#')) {
            return;
        }
        if (currentUrl.startsWith('www.')) {
            urlInput.value = 'https://' + currentUrl;
            this.validateUrl();
            return;
        }
        if (!currentUrl) {
            return;
        }
        const protocolMatch: RegExpMatchArray = currentUrl.match(/^([a-z][a-z0-9+.-]*):(?:\/\/)?(.*)$/i);
        urlInput.value = protocolMatch
            ? newProtocol + '://' + protocolMatch[2]
            : newProtocol + '://' + currentUrl;
        this.validateUrl();
    }

    /**
     * prepends the currently selected protocol from the dropdown to the URL input.
     */
    private prependSelectedProtocolIfNeeded(): void {
        const dialogEle: HTMLElement = this.dialogModel.element;
        const urlInput: HTMLInputElement = dialogEle.querySelector('.e-rte-ui-linkurl') as HTMLInputElement;
        const url: string = urlInput.value;
        if (!url) {
            this.isProtocolPrepended = false;
            return;
        }
        // already contains protocol
        if (/^[a-z][a-z0-9+.-]*:/i.test(url)) {
            return;
        }
        // relative urls
        if (url.startsWith('/') || url.startsWith('?') ||
            url.startsWith('#')) {
            return;
        }
        // prepend only once
        if (!this.isProtocolPrepended) {
            urlInput.value = this.selectedProtocol + '://' + url;
            this.isProtocolPrepended = true;
        }
    }

    /**
     * Validates the URL input and reflects the result via the `e-error` CSS class.
     */
    private validateUrl(): boolean {
        const dialogEle: HTMLElement = this.dialogModel.element;
        const urlInput: HTMLInputElement = dialogEle.querySelector('.e-rte-ui-linkurl') as HTMLInputElement;
        const url: string = urlInput.value.trim();
        const isValid: boolean = !!url && this.validateProtocol(url).valid;
        urlInput.classList.toggle('e-error', !isValid);
        return isValid;
    }


    /** Handler bound to the dialog's Insert button. */
    private insertlink(e: LinkEventArgs): void {
        const linkEle: HTMLElement = this.dialogModel.element as HTMLElement;
        const linkUrl: string = (linkEle.querySelector('.e-rte-ui-linkurl') as HTMLInputElement).value.trim();
        // Block submission when URL is empty or invalid; keep dialog open and mark via e-error.
        if (!this.validateUrl() || !linkUrl) {
            return;
        }
        const linkText: string = (linkEle.querySelector('.e-rte-ui-linkText') as HTMLInputElement).value;
        const linkTitle: string = (linkEle.querySelector('.e-rte-ui-linkTitle') as HTMLInputElement).value;
        const target: string = this.checkBoxObj && this.checkBoxObj.checked
            ? '_blank'
            : this.linkSettings.defaultTarget;
        // Choose controller operation based on whether the dialog opened on an existing <a>.
        const operation: 'insert' | 'edit' = this.editingLinkElement ? 'edit' : 'insert';
        const value: ExecuteLinkAttributes = {
            target: target,
            title: linkTitle,
            operation: operation,
            displayText: linkText.trim() !== '' ? linkText : linkUrl,
            href: linkUrl
        };
        (this.parent.inputElement as HTMLElement).focus();
        this.parent.editorController.process(this.parent, 'link', e.originalEvent, value);
        this.isProtocolPrepended = false;
        this.destroyLinkDialog();
    }

    /** Handler bound to the dialog's Cancel button. */
    private cancelDialog(e: LinkEventArgs): void {
        this.destroyLinkDialog();
        // Return focus to editor
        (this.parent.inputElement as HTMLElement).focus();
    }

    /**
     * Detects the protocol of a URL string and verifies it against `allowedProtocols`.
     *
     */
    private detectProtocol(url: string): string | null {
        if (!url) {
            return null;
        }
        // Regex to extract protocol from URL: /^([a-z][a-z0-9+.-]*):(?:\/\/)?/i
        const protocolMatch: RegExpMatchArray = url.match(/^([a-z][a-z0-9+.-]*):(?:\/\/)?/i);
        if (!protocolMatch) {
            return null;
        }
        const detectedProtocol: string = protocolMatch[1].toLowerCase();
        // Compare against allowedProtocols (case-insensitive)
        const allowedProtocols: string[] = this.linkSettings.allowedProtocols;
        const isAllowed: boolean = allowedProtocols.some((proto: string) => proto.toLowerCase() === detectedProtocol);
        return isAllowed ? detectedProtocol : null;
    }

    /**
     * Validates a URL against the configured `allowedProtocols`.
     */
    private validateProtocol(url: string): { valid: boolean; error?: string } {
        if (!url) {
            return { valid: true };
        }
        // Allow relative URLs (starting with /, ?, or #)
        if (url.startsWith('/') || url.startsWith('?') || url.startsWith('#')) {
            return { valid: true };
        }
        // Check for protocol
        const protocolMatch: RegExpMatchArray = url.match(/^([a-z][a-z0-9+.-]*):(?:\/\/)?/i);
        if (!protocolMatch) {
            // No protocol, will be auto-prepended if autoPrependProtocol is enabled
            return { valid: true };
        }
        const protocol: string = protocolMatch[1].toLowerCase();
        const allowedProtocols: string[] = this.linkSettings.allowedProtocols;
        const isAllowed: boolean = allowedProtocols.some((proto: string) => proto.toLowerCase() === protocol);
        if (!isAllowed) {
            return {
                valid: false,
                error: this.i10n.getConstant('protocolNotAllowed')
            };
        }
        return { valid: true };
    }

    /**
     * Routes Quick Toolbar command execution to the appropriate action handler.
     */
    private handleLinkQuickToolbarCommand(args: LinkEventArgs): void {
        const linkElement = this.selectedLinkElement();
        if (!linkElement) {
            return;
        }
        const href: string = linkElement.getAttribute('href');
        const target: string = linkElement.getAttribute('target') || this.linkSettings.defaultTarget;
        const operation: 'open' | 'copy' | 'remove' = args.item.command as 'open' | 'copy' | 'remove';
        const value: ExecuteLinkAttributes = {
            operation: operation,
            href: href,
            target: target,
            title: linkElement.getAttribute('title') || '',
            displayText: linkElement.textContent,
        };
        switch (args.item.command) {
            case 'openLink':
                value.operation = 'open';
                break;
            case 'copyLink':
                value.operation = 'copy';
                break;
            case 'removeLink':
                value.operation = 'remove';
                break;
        }
        this.parent.editorController.process(this.parent, 'link', args.originalEvent, value);
        if (value.operation === 'remove') {
            this.parent.inputElement.focus();
        }
    }

    /**
     * Handles the Ctrl+K (Cmd+K on macOS) keyboard shortcut to open the link dialog.
     */
    private onKeyboardShortcut(args: { originalEvent?: KeyboardEvent; action?: string }): void {
        if (!this.parent.enable) {
            return;
        }
        if (this.parent.readonly) {
            return;
        }
        if (!this.parent.isSelectionInRTE()) {
            return;
        }
        if (!args || args.action !== 'link') {
            return;
        }
        const event: KeyboardEvent | undefined = args.originalEvent;
        if (!event) {
            return;
        }
        if (typeof event.preventDefault === 'function') {
            event.preventDefault();
        }
        // Trigger the link dialog with keyboard source
        this.renderLinkDialog({
            itemId: '',
            item: {} as any,
            originalEvent: event
        } as LinkEventArgs);
    }

    /**
     * Handles the `linkModelChanged` event emitted by `RichTextEditorUI`.
     *
     */
    public applyLinkSettings(args?: LinkSettingsModel): void {
        if (!args) {
            return;
        }
        this.linkSettings = this.getLinkSettingsOrDefaults();
        this.selectedProtocol = this.linkSettings.defaultProtocol;
        this.linkSettingsDirty = true;
        this.isProtocolPrepended = false;
        if (this.isLinkDialogOpen && this.dialogModel && this.dialogModel.element) {
            this.validateUrl();
        }
    }

    private closeLinkDialog(): void {
        if (this.isLinkDialogOpen && this.dialogModel && this.dialogModel.element && this.parent.inputElement &&
            this.parent.inputElement.ownerDocument.contains(this.dialogModel.element)) {
            this.destroyLinkDialog();
        }
    }

    /**     
     * Destroys the protocol DropdownButton and Quick Toolbar instances (if created)
     *
     * @returns {void}
     */
    public destroy(): void {
        if (this.protocolDropdown) {
            this.protocolDropdown.destroy();
            this.protocolDropdown = null;
        }
        this.destroyLinkDialog();
        this.removeEventListener();
    }
}
