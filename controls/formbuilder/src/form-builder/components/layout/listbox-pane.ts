import { createElement, L10n } from '@syncfusion/ej2-base';
import { ListBox, ListBoxChangeEventArgs, BeforeItemRenderEventArgs } from '@syncfusion/ej2-dropdowns';
import { PaletteComponent } from '../../types/form-schema';
import { ComponentCategory, ToolboxCategoryConfig } from '../../model/base';
import { defaultPalette } from '../../default-palette';
import { simpleModeHiddenTypes, getIconMarkup } from './left-pane';


/** @private */
export interface ListBoxPaneProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (component: PaletteComponent) => void;
    paletteConfig?: ToolboxCategoryConfig;
    mode?: 'Simple' | 'Developer';
    l10n?: L10n;
    owners?: ListBoxPaneOwners;
    ariaLabel?: string;
    popupAriaLabel?: string;
}


/** @private */
export interface ListBoxPaneOwners {
    listboxes: ListBox[];
    docListeners?: ListBoxPaneTrackedListener[];
    timers?: number[];
}


/** @private */
export interface ListBoxPaneTrackedListener {
    target: EventTarget;
    event: string;
    handler: EventListener;
    opts?: AddEventListenerOptions | boolean;
}


/** @private */
interface PaletteRow {
    type: string;
    label: string;
    group: string;
    category: string;
}

/** @private */
interface TrustedChangeEvent extends Event {
    isTrusted: boolean;
}

/** @private */
export class ListBoxPane {
    private host: HTMLElement;
    private props: ListBoxPaneProps;
    private l10n: L10n;
    private wrapperEl: HTMLElement | null;
    private popupEl: HTMLElement | null;
    private listHost: HTMLInputElement | null;
    private listbox: ListBox | null;
    private owners: ListBoxPaneOwners;
    private handlers: {
        handleDocumentMouseDown: EventListener;
        handleDocumentKeyDown: EventListener;
        handleBackdropClick: EventListener;
        handleListChange: (args: ListBoxChangeEventArgs) => void;
        handleBeforeItemRender: (args: BeforeItemRenderEventArgs) => void;
    };
    private destroyed: boolean;
    private currentPalette: PaletteRow[];

    constructor(host: HTMLElement, props: ListBoxPaneProps, l10n: L10n) {
        this.host = host;
        this.props = props;
        this.l10n = l10n;
        this.wrapperEl = null;
        this.popupEl = null;
        this.listHost = null;
        this.listbox = null;
        this.destroyed = false;
        this.currentPalette = [];

        this.owners = props.owners || {
            listboxes: [],
            docListeners: [],
            timers: []
        };

        var self: ListBoxPane = this;
        this.handlers = {
            handleDocumentMouseDown: function (e: Event): void {
                self.onDocumentMouseDown(e);
            },
            handleDocumentKeyDown: function (e: Event): void {
                self.onDocumentKeyDown(e);
            },
            handleBackdropClick: function (e: Event): void {
                self.onBackdropClick(e);
            },
            handleListChange: function (args: ListBoxChangeEventArgs): void {
                self.onListChange(args);
            },
            handleBeforeItemRender: function (args: BeforeItemRenderEventArgs): void {
                self.onBeforeItemRender(args);
            }
        };

        this.buildShell();
    }

    public render(props: ListBoxPaneProps): void {
        if (this.destroyed) {
            return;
        }
        var prevIsOpen: boolean = !!this.props.isOpen;
        this.props = props;
        if (props.owners) {
            this.owners = props.owners;
        }
        this.applyVisibility();
        if (this.props.isOpen && !prevIsOpen) {
            this.attachGlobalListeners();
        } else if (!this.props.isOpen && prevIsOpen) {
            this.detachGlobalListeners();
        }
    }

    public close(): void {
        if (this.props.isOpen) {
            this.props.onClose();
        }
    }

    public destroy(): void {
        if (this.destroyed) {
            return;
        }
        this.destroyed = true;
        this.detachGlobalListeners();
        if (this.owners && this.owners.timers) {
            var pending: number[] = this.owners.timers;
            for (var t: number = 0; t < pending.length; t++) {
                window.clearTimeout(pending[t as number]);
            }
            pending.length = 0;
        }
        this.destroyListbox();
        if (this.wrapperEl && this.wrapperEl.parentNode === this.host) {
            this.host.removeChild(this.wrapperEl);
        }
        this.wrapperEl = null;
        this.popupEl = null;
        this.listHost = null;
        this.currentPalette = [];
    }

    public __audit(): {
        listboxes: number;
        listeners: number;
    } {
        return {
            listboxes: this.owners.listboxes
                ? this.owners.listboxes.length
                : 0,
            listeners: this.owners.docListeners
                ? this.owners.docListeners.length
                : 0
        };
    }

    private buildShell(): void {
        if (this.wrapperEl && this.wrapperEl.parentNode === this.host) {
            return;
        }
        var ariaDialog: string = this.props.ariaLabel
            || (this.l10n ? (this.l10n.getConstant('componentSelection') || 'Component Selection') : 'Component Selection');
        var ariaPopup: string = this.props.popupAriaLabel
            || (this.l10n ? (this.l10n.getConstant('availableComponents') || 'Available Components') : 'Available Components');

        var wrapper: HTMLElement = createElement('div', {
            className: 'listbox-pane-wrapper',
            attrs: {
                'aria-modal': 'true',
                'tabindex': '-1',
                'role': 'dialog',
                'aria-label': ariaDialog
            }
        });
        wrapper.addEventListener('click', this.handlers.handleBackdropClick);

        var popup: HTMLElement = createElement('div', {
            className: 'listbox-pane-popup',
            attrs: { 'aria-label': ariaPopup }
        });
        var listHost: HTMLInputElement = createElement('input', {
            attrs: { type: 'text', tabindex: '0' }
        }) as HTMLInputElement;
        listHost.className = 'listbox-host';
        popup.appendChild(listHost);
        wrapper.appendChild(popup);
        this.host.appendChild(wrapper);

        this.wrapperEl = wrapper;
        this.popupEl = popup;
        this.listHost = listHost;

        this.applyVisibility();
    }

    private applyVisibility(): void {
        if (!this.wrapperEl) {
            return;
        }
        if (this.props.isOpen) {
            this.wrapperEl.style.display = '';
            this.ensureListbox();
        } else {
            this.wrapperEl.style.display = 'none';
        }
    }

    private ensureListbox(): void {
        if (this.destroyed || !this.listHost || !this.popupEl) {
            return;
        }
        var palette: PaletteRow[] = this.buildPalette();
        var paletteChanged: boolean = !this.paletteEquals(palette, this.currentPalette);
        this.currentPalette = palette;
        if (this.listbox) {
            if (paletteChanged) {
                this.listbox.dataSource = palette as any;
                this.listbox.fields = {
                    groupBy: 'group',
                    text: 'label',
                    value: 'type'
                } as any;
            }
            return;
        }
        var searchPlaceholder: string = this.l10n
            ? (this.l10n.getConstant('search') || 'Search')
            : 'Search';
        this.listbox = new ListBox({
            dataSource: palette as any,
            tabIndex: 0,
            fields: {
                groupBy: 'group',
                text: 'label',
                value: 'type'
            } as any,
            change: this.handlers.handleListChange,
            beforeItemRender: this.handlers.handleBeforeItemRender,
            allowFiltering: true,
            filterBarPlaceholder: searchPlaceholder,
            height: '400px',
            itemTemplate: '<button class="listbox-item-with-icon e-btn e-flat e-lib" data-type="${type}" aria-label="${label}">'
                + '<span class="e-listbox-icon listbox-item-icon" aria-hidden="true">'
                + this.iconMarkupForFirst(palette)
                + '</span>'
                + '<span class="listbox-item-label">${label}</span>'
                + '</button>'
        } as any);
        this.listbox.appendTo(this.listHost);
        this.relayoutIntoPopup();
        if (this.owners && this.owners.listboxes) {
            this.owners.listboxes.push(this.listbox);
        }
    }

    private buildPalette(): PaletteRow[] {
        var merged: Record<string, PaletteComponent[]> = {};
        var paletteConfig: any = this.props.paletteConfig;
        var paletteCategories = Array.isArray(paletteConfig)
            ? paletteConfig
            : paletteConfig
                ? Object.keys(paletteConfig).map(function (category: string): any {
                    return {
                        category: category,
                        items: paletteConfig[category]
                    };
                })
                : [];
        var keys: string[] = Object.keys(defaultPalette);
        for (var i: number = 0; i < keys.length; i++) {
            var key: string = keys[i as number];
            merged[key as string] = (defaultPalette as any)[key as string].slice();
        }
        for (var c: number = 0; c < paletteCategories.length; c++) {
            var paletteCategory = paletteCategories[c as number];
            if (!paletteCategory || !paletteCategory.category || !Array.isArray(paletteCategory.items)) {
                continue;
            }
            if (!paletteCategory.items.length) {
                delete merged[paletteCategory.category];
                continue;
            }
            merged[paletteCategory.category] = paletteCategory.items.map(function (item: any): PaletteComponent {
                return { type: typeof item === 'string' ? item : item.type, label: '' };
            });
        }
        var rows: PaletteRow[] = [];
        var catKeys: string[] = Object.keys(merged);
        for (var k: number = 0; k < catKeys.length; k++) {
            var category: string = catKeys[k as number];
            var comps: PaletteComponent[] = merged[category as string] || [];
            for (var m: number = 0; m < comps.length; m++) {
                var comp: PaletteComponent = comps[m as number];
                if (this.props.mode === 'Simple' && simpleModeHiddenTypes.has(comp.type)) {
                    continue;
                }
                var label: string = comp.label
                    || (this.l10n ? (this.l10n.getConstant(comp.type) || comp.type) : comp.type);
                rows.push({
                    type: comp.type,
                    label: label,
                    group: this.categoryDisplayName(category),
                    category: category
                });
            }
        }
        return rows;
    }

    private categoryDisplayName(category: string): string {
        if (this.l10n) {
            if (category === ComponentCategory.Basic) {
                return this.l10n.getConstant('basic') || 'Basic';
            }
            if (category === ComponentCategory.Advanced) {
                return this.l10n.getConstant('advanced') || 'Advanced';
            }
            if (category === ComponentCategory.Layout) {
                return this.l10n.getConstant('layout') || 'Layout';
            }
        }
        return category;
    }

    private paletteEquals(a: PaletteRow[], b: PaletteRow[]): boolean {
        if (a === b) {
            return true;
        }
        if (!a || !b || a.length !== b.length) {
            return false;
        }
        for (var i: number = 0; i < a.length; i++) {
            if (a[i as number].type !== b[i as number].type
                || a[i as number].label !== b[i as number].label
                || a[i as number].group !== b[i as number].group) {
                return false;
            }
        }
        return true;
    }

    private iconMarkupForFirst(palette: PaletteRow[]): string {
        if (!palette || palette.length === 0) {
            return '';
        }
        return getIconMarkup(palette[0].type);
    }

    private onBeforeItemRender(args: BeforeItemRenderEventArgs): void {
        if (!args || !args.element || !args.item) {
            return;
        }
        var rowType: string = String((args.item as any).type || '');
        if (!rowType) {
            return;
        }
        var li: HTMLElement = args.element as HTMLElement;
        var iconHost: HTMLElement | null = li.querySelector('.listbox-item-icon');
        if (iconHost) {
            iconHost.innerHTML = getIconMarkup(rowType);
        }
    }

    private relayoutIntoPopup(): void {
        if (!this.listHost || !this.popupEl || this.destroyed) {
            return;
        }
        var self: ListBoxPane = this;
        var attempts: number = 0;
        var maxAttempts: number = 8;
        var tryRelayout: () => void = function (): void {
            if (self.destroyed || !self.listHost || !self.popupEl) {
                return;
            }
            attempts++;
            var ejPopup: HTMLElement | null = self.findEj2ListboxWrapper();
            if (ejPopup && ejPopup.parentNode !== self.popupEl) {
                self.popupEl.appendChild(ejPopup);
                return;
            }
            if (attempts < maxAttempts) {
                self.trackTimer(function (): void { tryRelayout(); }, 25);
            }
        };
        tryRelayout();
    }

    private findEj2ListboxWrapper(): HTMLElement | null {
        if (!this.listHost) {
            return null;
        }
        var host: HTMLElement = this.listHost;
        var cur: Node | null = host.parentNode;
        while (cur && cur !== document.body) {
            var el: HTMLElement = cur as HTMLElement;
            if (el.classList
                && (el.classList.contains('e-listbox')
                    || el.classList.contains('e-popup')
                    || el.querySelector('.e-list-parent'))) {
                if (el.contains(host)) {
                    return el;
                }
            }
            cur = cur.parentNode;
        }
        if (this.popupEl) {
            var all: HTMLCollectionOf<Element> = document.body.getElementsByTagName('div');
            for (var i: number = 0; i < all.length; i++) {
                var cand: HTMLElement = all[i as number] as HTMLElement;
                if (this.popupEl.contains(cand)) {
                    continue;
                }
                if (cand.classList
                    && (cand.classList.contains('e-listbox')
                        || cand.classList.contains('e-popup'))
                    && cand.querySelector('.e-list-parent')) {
                    return cand;
                }
            }
        }
        return null;
    }

    private trackTimer(fn: () => void, delay: number): void {
        var self: ListBoxPane = this;
        var handle: number = window.setTimeout(function (): void {
            if (self.owners && self.owners.timers) {
                var idx: number = self.owners.timers.indexOf(handle);
                if (idx >= 0) {
                    self.owners.timers.splice(idx, 1);
                }
            }
            try { fn(); } catch (e) { /* swallow */ }
        }, delay);
        if (this.owners && this.owners.timers) {
            this.owners.timers.push(handle);
        }
    }

    private attachGlobalListeners(): void {
        if (this.destroyed) {
            return;
        }
        this.addTrackedListener(
            document,
            'mousedown',
            this.handlers.handleDocumentMouseDown
        );
        this.addTrackedListener(
            document,
            'keydown',
            this.handlers.handleDocumentKeyDown
        );
    }

    private detachGlobalListeners(): void {
        this.removeTrackedListener(
            document,
            'mousedown',
            this.handlers.handleDocumentMouseDown
        );
        this.removeTrackedListener(
            document,
            'keydown',
            this.handlers.handleDocumentKeyDown
        );
    }

    private addTrackedListener(
        target: EventTarget,
        event: string,
        handler: EventListener,
        opts?: AddEventListenerOptions | boolean
    ): void {
        target.addEventListener(event, handler, opts);
        if (this.owners && this.owners.docListeners) {
            this.owners.docListeners.push({
                target: target,
                event: event,
                handler: handler,
                opts: opts
            });
        }
    }

    private removeTrackedListener(
        target: EventTarget,
        event: string,
        handler: EventListener,
        opts?: AddEventListenerOptions | boolean
    ): void {
        target.removeEventListener(event, handler, opts);
        if (this.owners && this.owners.docListeners) {
            var list: ListBoxPaneTrackedListener[] = this.owners.docListeners;
            for (var i: number = list.length - 1; i >= 0; i--) {
                var l: ListBoxPaneTrackedListener = list[i as number];
                if (l.target === target && l.event === event && l.handler === handler) {
                    list.splice(i, 1);
                }
            }
        }
    }

    private onDocumentMouseDown(e: Event): void {
        if (!this.popupEl) {
            return;
        }
        var target: Node | null = e.target as Node;
        if (target && this.popupEl.contains(target)) {
            return;
        }
        this.close();
    }

    private onDocumentKeyDown(e: Event): void {
        var ke: KeyboardEvent = e as KeyboardEvent;
        if (ke && ke.key === 'Escape') {
            this.close();
        }
    }

    private onBackdropClick(e: Event): void {
        var target: HTMLElement = e.target as HTMLElement;
        if (target && this.wrapperEl && target === this.wrapperEl) {
            this.close();
        }
    }

    private onListChange(args: ListBoxChangeEventArgs): void {
        if (!args) {
            return;
        }
        var trusted: TrustedChangeEvent = args.event as TrustedChangeEvent;
        if (trusted && trusted.isTrusted === undefined) {
            return;
        }
        var dataType: string | null = null;
        var elements: Element[] = args.elements || [];
        if (elements.length > 0) {
            dataType = elements[0].getAttribute('data-value');
        }
        if (!dataType && args.value && args.value.length > 0) {
            dataType = String(args.value[0]);
        }
        if (!dataType) {
            return;
        }
        var selected: PaletteComponent | null = null;
        for (var i: number = 0; i < this.currentPalette.length; i++) {
            if (this.currentPalette[i as number].type === dataType) {
                selected = {
                    type: this.currentPalette[i as number].type,
                    label: this.currentPalette[i as number].label
                };
                break;
            }
        }
        if (!selected) {
            return;
        }
        this.props.onSelect(selected);
        this.close();
    }

    private destroyListbox(): void {
        if (this.listbox) {
            try {
                this.listbox.destroy();
            } catch {
            }
            if (this.owners && this.owners.listboxes) {
                var list: ListBox[] = this.owners.listboxes;
                for (var i: number = list.length - 1; i >= 0; i--) {
                    if (list[i as number] === this.listbox) {
                        list.splice(i, 1);
                    }
                }
            }
        }
        this.listbox = null;
    }
}

export default ListBoxPane;
