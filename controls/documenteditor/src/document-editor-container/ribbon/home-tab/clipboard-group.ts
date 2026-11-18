import { RibbonGroupBase, IRibbonGroup } from '../ribbon-interfaces';
import { RibbonGroupModel, Ribbon, RibbonItemSize, ItemOrientation, DisplayMode } from '@syncfusion/ej2-ribbon';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

// Clipboard group constants
export const CLIPBOARD_GROUP_ID: string = '_clipboard_group';
export const CUT_ID: string = '_cut';
export const COPY_ID: string = '_copy';
export const LOCAL_CLIPBOARD_ID: string = '_local_clipboard';
// Simplified-ribbon variant of the same Local Clipboard command; see
// getGroupModel() for why it carries a distinct item id.
export const LOCAL_CLIPBOARD_SIMPLIFIED_ID: string = '_local_clipboard_simplified';
export const FORMAT_PAINTER_ID: string = '_format_painter';

/**
 * ClipboardGroup class for handling clipboard operations in Document Editor ribbon
 *
 * @private
 */
export class ClipboardGroup extends RibbonGroupBase implements IRibbonGroup {
    private formatPainterClickTimer: number;
    private formatPainterDblClickHandler: EventListener;
    /**
     * Get the Ribbon group model for Clipboard
     *
     * @returns {RibbonGroupModel} - The ribbon group model for Clipboard
     * @private
     */
    public getGroupModel(): RibbonGroupModel {
        const id: string = this.ribbonId;

        return {
            id: id + CLIPBOARD_GROUP_ID,
            cssClass: 'e-clipboard-group',
            header: this.localObj.getConstant('Clipboard'),
            enableGroupOverflow: true,
            overflowHeader: this.localObj.getConstant('Clipboard'),
            // Classic layout matches Word's Clipboard group: the existing Local
            // Clipboard button is the primary large item on the left, with the
            // remaining commands (Cut, Copy, Format Painter) as small icons in
            // the column beside it. The Local Clipboard button itself — id, key
            // tip, icon, toggle behavior, and tooltip — is unchanged.
            // The Simplified ("Normal") ribbon shows a separate icon-only
            // variant of the same button after Format Painter, so that layout
            // reads Cut, Copy, Format Painter, Local Clipboard.
            orientation: ItemOrientation.Column,
            groupIconCss: 'e-icons e-de-ctnr-paste',
            collections: [
                {
                    items: [{
                        type: 'Button',
                        keyTip: 'V',
                        allowedSizes: RibbonItemSize.Large,
                        displayOptions: DisplayMode.Classic,
                        buttonSettings: {
                            // Two-line label ("Local" / "Clipboard") keeps the large
                            // item compact, like Word's ribbon labels. The aria-label
                            // is normalized to the plain text after render.
                            content: this.localObj.getConstant('Local Clipboard').split(' ').join('<br>'),
                            iconCss: 'e-icons e-de-ctnr-paste',
                            isToggle: true,
                            clicked: () => {
                                this.container.enableLocalPaste = !this.container.enableLocalPaste;
                            }
                        },
                        id: id + LOCAL_CLIPBOARD_ID,
                        ribbonTooltipSettings: { content: this.localObj.getConstant('Toggle between the internal clipboard and system clipboard') }
                    }]
                },
                {
                    items: [
                        {
                            type: 'Button',
                            keyTip: 'X',
                            allowedSizes: RibbonItemSize.Small,
                            buttonSettings: {
                                content: this.localObj.getConstant('Cut'),
                                iconCss: 'e-icons e-de-ctnr-cut',
                                isToggle: false,
                                clicked: () => {
                                    if (!this.documentEditor.isReadOnly && this.documentEditor.editor) {
                                        this.documentEditor.editor.cut();
                                    }
                                }
                            },
                            id: id + CUT_ID,
                            ribbonTooltipSettings: { content: this.localObj.getConstant('Cut Tooltip') }
                        }, {
                            type: 'Button',
                            keyTip: 'C',
                            allowedSizes: RibbonItemSize.Small,
                            buttonSettings: {
                                content: this.localObj.getConstant('Copy'),
                                iconCss: 'e-icons e-de-ctnr-copy',
                                isToggle: false,
                                clicked: () => {
                                    if (this.documentEditor.selection) {
                                        this.documentEditor.selection.copy();
                                    }
                                }
                            },
                            id: id + COPY_ID,
                            ribbonTooltipSettings: { content: this.localObj.getConstant('Copy Tooltip') }

                        },
                        {
                            type: 'Button',
                            keyTip: 'FP',
                            allowedSizes: RibbonItemSize.Small,
                            displayOptions: DisplayMode.Classic | DisplayMode.Simplified,
                            buttonSettings: {
                                content: this.localObj.getConstant('Format Painter'),
                                iconCss: 'e-icons e-de-ctnr-format-painter',
                                cssClass: 'e-de-format-painter-btn',
                                // Pressed state is applied from Format Painter, not the ribbon
                                // toggle. A toggle click adds e-active before cancel runs, and
                                // the ribbon does not remove that border when the mode ends.
                                isToggle: false,
                                clicked: () => {
                                    this.onFormatPainterClicked(false);
                                }
                            },
                            id: id + FORMAT_PAINTER_ID,
                            ribbonTooltipSettings: {
                                title: this.localObj.getConstant('Format Painter Tooltip'),
                                content: this.localObj.getConstant('Format Painter Expanded Tooltip')
                            }
                        }]
                },
                {
                    // Simplified ("Normal") ribbon only: the same Local Clipboard
                    // command as an icon-only small item after Format Painter, so
                    // the flat order reads Cut, Copy, Format Painter, Local
                    // Clipboard. Classic mode keeps the large presentation above
                    // and never renders this variant.
                    id: id + '_local_clipboard_simplified_collection',
                    items: [{
                        type: 'Button',
                        keyTip: 'L',
                        allowedSizes: RibbonItemSize.Small,
                        displayOptions: DisplayMode.Simplified,
                        buttonSettings: {
                            content: this.localObj.getConstant('Local Clipboard'),
                            iconCss: 'e-icons e-de-ctnr-paste',
                            isToggle: true,
                            clicked: () => {
                                this.container.enableLocalPaste = !this.container.enableLocalPaste;
                            }
                        },
                        id: id + LOCAL_CLIPBOARD_SIMPLIFIED_ID,
                        ribbonTooltipSettings: { content: this.localObj.getConstant('Toggle between the internal clipboard and system clipboard') }
                    }]
                }
            ]
        };
    }

    /**
     * Handles single click (single-use or cancel) and double click (persistent) on Format Painter button.
     *
     * @param {boolean} isPersistent - True when double click activates persistent mode.
     * @returns {void}
     * @private
     */
    private onFormatPainterClicked(isPersistent: boolean): void {
        if (this.formatPainterClickTimer) {
            clearTimeout(this.formatPainterClickTimer);
            this.formatPainterClickTimer = undefined;
            this.activateFormatPainter(true);
            return;
        }
        // Defer single-click so a double click upgrades to persistent mode
        // instead of activating and then immediately cancelling.
        const timerId: number = window.setTimeout(() => {
            this.formatPainterClickTimer = undefined;
            this.activateFormatPainter(isPersistent);
        }, 250);
        this.formatPainterClickTimer = timerId;
    }

    private activateFormatPainter(isPersistent: boolean): void {
        const selection: any = this.documentEditor.selection;
        if (!selection || !selection.formatPainterModule) {
            return;
        }
        const painter: any = selection.formatPainterModule;
        if (painter.isActive && !isPersistent) {
            // Second click while active cancels the mode.
            selection.cancelFormatPainter();
            this.clearFormatPainterPressedState();
            return;
        }
        selection.formatPainterModule.armForSelectionApply(isPersistent);
        // updateSelection paints the pressed state. Do not clear it here: the
        // button must stay highlighted until the painter is cancelled or consumed.
        this.updateSelection();
    }

    /**
     * Attaches double-click handler for persistent mode activation on the ribbon button.
     *
     * @returns {void}
     * @private
     */
    public wireFormatPainterDoubleClick(): void {
        const ribbon: any = this.container.ribbonModule ? this.container.ribbonModule.ribbon : undefined;
        if (!ribbon || !ribbon.element) {
            return;
        }
        this.injectFormatPainterStyles();
        this.normalizeLocalClipboardLabel();
        const buttonElement: HTMLElement = ribbon.element.querySelector('#' + this.ribbonId + FORMAT_PAINTER_ID + ' .e-ribbon-button') as HTMLElement;
        const itemElement: HTMLElement = document.getElementById(this.ribbonId + FORMAT_PAINTER_ID);
        if (isNullOrUndefined(buttonElement) && isNullOrUndefined(itemElement)) {
            return;
        }
        this.formatPainterDblClickHandler = (): void => {
            if (this.formatPainterClickTimer) {
                clearTimeout(this.formatPainterClickTimer);
                this.formatPainterClickTimer = undefined;
            }
            this.activateFormatPainter(true);
        };
        // The ribbon click target is the inner button. Also listen on the item so
        // a double-click on the item id reaches persistent mode.
        if (!isNullOrUndefined(buttonElement)) {
            buttonElement.addEventListener('dblclick', this.formatPainterDblClickHandler);
        }
        if (!isNullOrUndefined(itemElement) && itemElement !== buttonElement) {
            itemElement.addEventListener('dblclick', this.formatPainterDblClickHandler);
        }
    }

    /**
     * The Classic Local Clipboard button renders a two-line label; the accessible
     * name must stay the plain single-line text. The ribbon copies buttonSettings
     * content into aria-label, so rewrite it from the rendered line breaks.
     *
     * @returns {void}
     * @private
     */
    private normalizeLocalClipboardLabel(): void {
        const ribbon: any = this.container.ribbonModule ? this.container.ribbonModule.ribbon : undefined;
        if (!ribbon || !ribbon.element) {
            return;
        }
        const label: string = this.localObj.getConstant('Local Clipboard');
        const broken: string = label.split(' ').join('<br>');
        const buttons: NodeListOf<HTMLElement> = ribbon.element.querySelectorAll('button');
        for (let i: number = 0; i < buttons.length; i++) {
            const button: HTMLElement = buttons.item(i);
            if (isNullOrUndefined(button) || button.innerHTML.indexOf(broken) === -1) {
                continue;
            }
            if (button.getAttribute('aria-label') !== label) {
                button.setAttribute('aria-label', label);
            }
        }
    }

    /**
     * Injects the format painter icon-only and active-state styles once. The glyph is the theme class e-de-ctnr-format-painter.
     *
     * @returns {void}
     * @private
     */
    private injectFormatPainterStyles(): void {
        if (document.getElementById('e-de-format-painter-styles')) {
            return;
        }
        const styleElement: HTMLStyleElement = document.createElement('style');
        styleElement.id = 'e-de-format-painter-styles';
        // Icon only. Small ribbon items still render content as a text node, so hide it
        // here rather than dropping the accessible name. The glyph is the theme class
        // e-de-ctnr-format-painter. Active state uses the same e-active treatment as Bold.
        const themeContent: string = this.formatPainterThemeContent();
        // Alias the ribbon class onto the theme's e-format-painter glyph only when
        // no stylesheet defines e-de-ctnr-format-painter itself. Container themes
        // remap e-de-ctnr-* classes; once that remap ships it must win.
        const hasOwnRule: boolean = this.hasFormatPainterContainerRule();
        const iconRule: string = themeContent === '' || hasOwnRule
            ? ''
            : '.e-icons.e-de-ctnr-format-painter::before { content: ' + themeContent + '; }';
        styleElement.textContent = [
            '.e-de-format-painter-btn .e-btn-text,',
            '.e-ribbon-item:has(.e-de-format-painter-btn) .e-ribbon-item-text { display: none; }',
            iconRule,
            '.e-ribbon-item.e-de-format-painter-active,',
            '.e-ribbon-item.e-de-format-painter-active .e-ribbon-button,',
            '.e-de-format-painter-btn.e-active {',
            'background: rgba(0, 0, 0, 0.08);',
            'box-shadow: inset 0 0 0 1px currentColor;',
            '}'
        ].join(' ');
        document.head.appendChild(styleElement);
    }

    /**
     * Update clipboard buttons based on selection state
     *
     * @returns {void}
     * @private
     */
    public updateSelection(): void {
        // Selection updates run after every ribbon render, including renders
        // whose one-time created callback was already consumed by another suite.
        this.normalizeLocalClipboardLabel();
        // Get the ribbon from container
        const ribbon: Ribbon = this.container.ribbonModule.ribbon;
        if (!ribbon) { return; }

        const id: string = this.ribbonId;
        const isSelectionEmpty: boolean = this.container.documentEditor.selection.isEmpty;

        // Update Cut and Copy buttons state based on selection
        if (isSelectionEmpty) {
            ribbon.disableItem(id + CUT_ID);
            ribbon.disableItem(id + COPY_ID);
        } else {
            ribbon.enableItem(id + CUT_ID);
            ribbon.enableItem(id + COPY_ID);
        }

        // Format Painter: enabled when editable, reflects active state for accessibility.
        const isPainterDisabled: boolean = this.documentEditor.isReadOnly || !this.documentEditor.isDocumentLoaded;
        if (isPainterDisabled) {
            ribbon.disableItem(id + FORMAT_PAINTER_ID);
        } else {
            ribbon.enableItem(id + FORMAT_PAINTER_ID);
        }
        // enableItem refreshes the button control and drops a class applied
        // before the refresh. Resolve the button again and paint after it.
        this.applyFormatPainterPressedState();
    }

    /**
     * Paints the Format Painter button from the current painter state.
     * Called after ribbon enable/disable so the pressed class survives the refresh.
     *
     * @returns {void}
     * @private
     */
    private applyFormatPainterPressedState(): void {
        const id: string = this.ribbonId;
        const painterButton: HTMLElement = document.getElementById(id + FORMAT_PAINTER_ID);
        const painterItem: HTMLElement = document.getElementById(id + FORMAT_PAINTER_ID + '_container');
        const selection: any = this.documentEditor.selection;
        const painter: any = !isNullOrUndefined(selection) ? selection.formatPainterModule : undefined;
        if (!isNullOrUndefined(painterButton)) {
            const isActive: boolean = !isNullOrUndefined(painter) && painter.isActive;
            const label: string = this.localObj.getConstant('Format Painter') +
                (isActive && painter.isPersistent ? ' (' + this.localObj.getConstant('Persistent Mode') + ')' : '');
            // e-active on the button matches Bold. The wrapper class keeps the pressed
            // state visible if the ribbon toggle resets the button class on click.
            // Clear both, plus any nested toggle the ribbon painted itself.
            this.setPressed(painterButton, isActive);
            painterButton.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            painterButton.setAttribute('aria-label', label);
            if (!isNullOrUndefined(painterItem)) {
                this.setPressed(painterItem, isActive);
                if (isActive) {
                    painterItem.classList.add('e-de-format-painter-active');
                } else {
                    painterItem.classList.remove('e-de-format-painter-active');
                    painterItem.classList.remove('e-de-format-painter-pressed');
                }
            }
            const nested: HTMLElement = painterButton.querySelector('.e-ribbon-button') as HTMLElement;
            if (!isNullOrUndefined(nested) && nested !== painterButton) {
                this.setPressed(nested, isActive);
                nested.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            }
            if (!isActive) {
                this.clearFormatPainterFocusState(painterButton);
            }
        }
    }

    /**
     * Removes the keyboard focus artifact left by the click that armed the
     * painter. A mouse click focuses the button; Escape cancels the mode
     * without a document click, so the button must be unfocused here or it
     * stays visually selected until the next click.
     *
     * @param {HTMLElement} button - The Format Painter ribbon button.
     * @returns {void}
     * @private
     */
    private clearFormatPainterFocusState(button: HTMLElement): void {
        const focused: HTMLElement = button.ownerDocument.activeElement as HTMLElement;
        // Only blur when the focus is still on this button. Escape while the
        // user has moved focus elsewhere (keyboard-only flow) must not steal it.
        if (!isNullOrUndefined(focused) && button.contains(focused)) {
            focused.blur();
        }
        button.classList.remove('e-focus');
        const nested: HTMLElement = button.querySelector('.e-ribbon-button') as HTMLElement;
        if (!isNullOrUndefined(nested)) {
            nested.classList.remove('e-focus');
        }
    }

    /**
     * Drops a ribbon toggle border the click handler may have painted before cancel.
     *
     * @returns {void}
     * @private
     */
    private clearFormatPainterPressedState(): void {
        const id: string = this.ribbonId;
        const button: HTMLElement = document.getElementById(id + FORMAT_PAINTER_ID);
        const item: HTMLElement = document.getElementById(id + FORMAT_PAINTER_ID + '_container');
        const targets: HTMLElement[] = [button, item];
        if (!isNullOrUndefined(button)) {
            const nested: HTMLElement = button.querySelector('.e-ribbon-button') as HTMLElement;
            if (!isNullOrUndefined(nested)) {
                targets.push(nested);
            }
        }
        const selection: any = this.documentEditor.selection;
        const painter: any = !isNullOrUndefined(selection) ? selection.formatPainterModule : undefined;
        const isActive: boolean = !isNullOrUndefined(painter) && painter.isActive;
        for (const target of targets) {
            if (!isNullOrUndefined(target)) {
                this.setPressed(target, isActive);
                target.setAttribute('aria-pressed', isActive ? 'true' : 'false');
                if (!isActive) {
                    target.classList.remove('e-de-format-painter-active');
                    target.classList.remove('e-de-format-painter-pressed');
                }
            }
        }
    }

    private setPressed(element: HTMLElement, isActive: boolean): void {
        if (isActive) {
            element.classList.add('e-active');
        } else {
            element.classList.remove('e-active');
        }
    }

    /**
     * Disposes format painter listeners.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        if (this.formatPainterClickTimer) {
            clearTimeout(this.formatPainterClickTimer);
            this.formatPainterClickTimer = undefined;
        }
        const ribbon: any = this.container.ribbonModule ? this.container.ribbonModule.ribbon : undefined;
        if (this.formatPainterDblClickHandler && ribbon && ribbon.element) {
            const buttonElement: HTMLElement = ribbon.element.querySelector('#' + this.ribbonId + FORMAT_PAINTER_ID + ' .e-ribbon-button') as HTMLElement;
            const itemElement: HTMLElement = document.getElementById(this.ribbonId + FORMAT_PAINTER_ID);
            if (!isNullOrUndefined(buttonElement)) {
                buttonElement.removeEventListener('dblclick', this.formatPainterDblClickHandler);
            }
            if (!isNullOrUndefined(itemElement)) {
                itemElement.removeEventListener('dblclick', this.formatPainterDblClickHandler);
            }
        }
        this.formatPainterDblClickHandler = undefined;
    }

    /**
     * Reads the loaded theme's Format Painter code point. Container themes remap
     * e-de-ctnr-* classes; until that remap ships, the ribbon class uses the same
     * content as `.e-icons.e-format-painter`.
     *
     * @returns {string} Quoted CSS content, or '' when the theme has no painter glyph.
     * @private
     */
    private formatPainterThemeContent(): string {
        const sheets: StyleSheetList = document.styleSheets;
        for (let i: number = 0; i < sheets.length; i++) {
            const sheet: StyleSheet = sheets.item(i);
            if (isNullOrUndefined(sheet)) {
                continue;
            }
            let rules: CSSRuleList = null;
            try {
                // TS 3.7's lib.dom types StyleSheet without cssRules; every
                // document stylesheet is a CSSStyleSheet at runtime.
                rules = (sheet as CSSStyleSheet).cssRules;
            } catch (e) {
                rules = null;
            }
            if (isNullOrUndefined(rules)) {
                continue;
            }
            for (let j: number = 0; j < rules.length; j++) {
                const rule: CSSStyleRule = rules.item(j) as CSSStyleRule;
                if (isNullOrUndefined(rule) || isNullOrUndefined(rule.selectorText) ||
                    rule.selectorText.indexOf('e-format-painter') === -1) {
                    continue;
                }
                const content: string = rule.style && rule.style.content ? rule.style.content : '';
                if (content !== '' && content !== 'none' && content !== 'normal') {
                    return content;
                }
            }
        }
        return '';
    }

    /**
     * Whether any loaded stylesheet already maps the container painter class.
     * A shipped theme mapping must win over the injected alias.
     *
     * @returns {boolean} True when e-de-ctnr-format-painter has a content rule.
     * @private
     */
    private hasFormatPainterContainerRule(): boolean {
        const sheets: StyleSheetList = document.styleSheets;
        for (let i: number = 0; i < sheets.length; i++) {
            const sheet: StyleSheet = sheets.item(i);
            if (isNullOrUndefined(sheet)) {
                continue;
            }
            let rules: CSSRuleList = null;
            try {
                // TS 3.7's lib.dom types StyleSheet without cssRules; every
                // document stylesheet is a CSSStyleSheet at runtime.
                rules = (sheet as CSSStyleSheet).cssRules;
            } catch (e) {
                rules = null;
            }
            if (isNullOrUndefined(rules)) {
                continue;
            }
            for (let j: number = 0; j < rules.length; j++) {
                const rule: CSSStyleRule = rules.item(j) as CSSStyleRule;
                if (isNullOrUndefined(rule) || isNullOrUndefined(rule.selectorText) ||
                    rule.selectorText.indexOf('e-de-ctnr-format-painter') === -1) {
                    continue;
                }
                if (rule.style && rule.style.content && rule.style.content !== 'none' && rule.style.content !== 'normal') {
                    return true;
                }
            }
        }
        return false;
    }
}
