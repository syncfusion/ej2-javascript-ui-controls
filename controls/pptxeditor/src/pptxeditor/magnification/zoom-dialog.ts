/**
 * Zoom dialog (View → Zoom → Zoom…): fit options, presets and a custom percentage.
 *
 * @module @syncfusion/ej2-pptxeditor/magnification/zoom-dialog
 */

import { createElement } from '@syncfusion/ej2-base';
import { Dialog } from '@syncfusion/ej2-popups';
import { RadioButton } from '@syncfusion/ej2-buttons';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { localize } from '../localization/localization';

/** Zoom choice committed by the dialog. */
export type ZoomChoice =
    | { kind: 'fit-window' }
    | { kind: 'fit-width' }
    | { kind: 'percent'; percent: number };

/** Host contract for the Zoom dialog. */
export interface ZoomDialogHost {
    /** Whether the shell is rendered right-to-left. */
    readonly enableRtl?: boolean;
    /** Editor root; the dialog is rendered inside it. */
    readonly element: HTMLElement;
    /** Current EJ2 locale used for dialog text. */
    readonly locale?: string;
    /** Current zoom percentage. */
    zoom: number;
    /** Applies Fit to window. */
    fitToWindow(): void;
    /** Applies Fit to width. */
    fitWidth(): void;
    /** Applies a zoom percentage. */
    setZoom(percent: number): void;
}

/** Preset radio options shown in the dialog, in display order. */
export const ZOOM_DIALOG_OPTIONS: { value: string; label: string; }[] = [
    { value: 'fit-window', label: 'Fit to window' },
    { value: 'fit-width', label: 'Fit to width' },
    { value: '200', label: '200%' },
    { value: '150', label: '150%' },
    { value: '100', label: '100%' },
    { value: '75', label: '75%' },
    { value: '50', label: '50%' },
    { value: 'percent', label: 'Percent' }
];

/** Minimum / maximum custom zoom percentage. */
const MIN_ZOOM: number = 10;
const MAX_ZOOM: number = 400;

/**
 * Resolves the choice for a radio value and the custom percentage.
 *
 * @param {string} value - Selected radio value
 * @param {number} custom - Custom percentage input
 * @returns {ZoomChoice|null} Choice, or null when the custom value is invalid
 */
export function resolveZoomChoice(value: string, custom: number): ZoomChoice | null {
    if (value === 'fit-window') {
        return { kind: 'fit-window' };
    }
    if (value === 'fit-width') {
        return { kind: 'fit-width' };
    }
    const raw: number = value === 'percent' ? custom : Number(value);
    if (!Number.isFinite(raw) || raw < MIN_ZOOM || raw > MAX_ZOOM) {
        return null;
    }
    return { kind: 'percent', percent: Math.round(raw) };
}

/**
 * Modal Zoom dialog controller.
 * @constructor
 */
export class ZoomDialog {
    private readonly host: ZoomDialogHost;
    private dialog: Dialog | null = null;
    private hostEl: HTMLElement | null = null;
    private radios: RadioButton[] = [];
    private numeric: NumericTextBox | null = null;
    private selected: string = 'fit-window';

    /**
     * @param {ZoomDialogHost} host - Editor host
     */
    public constructor(host: ZoomDialogHost) {
        this.host = host;
    }

    /**
     * Opens the dialog (replacing any open instance).
     *
     * @returns {void}
     */
    public open(): void {
        this.destroy();
        const target: HTMLElement = this.host.element;
        const hostEl: HTMLElement = createElement('div', { className: 'ej2-pptx-zoom-dialog-host' });
        target.appendChild(hostEl);
        this.hostEl = hostEl;

        const dialog: Dialog = new Dialog({
            header: localize(this.host.locale, 'Zoom'),
            content: this.buildContent(),
            isModal: true,
            showCloseIcon: true,
            closeOnEscape: true,
            width: '376px',
            enableRtl: !!this.host.enableRtl,
            cssClass: 'ej2-pptx-zoom-dialog',
            target,
            buttons: [
                {
                    click: (): void => {
                        this.destroy();
                    },
                    buttonModel: { content: localize(this.host.locale, 'Cancel'), cssClass: 'ej2-pptx-zoom-dialog__cancel' }
                },
                {
                    click: (): void => {
                        this.commit();
                    },
                    buttonModel: { content: localize(this.host.locale, 'Ok'), isPrimary: true, cssClass: 'ej2-pptx-zoom-dialog__ok' }
                }
            ],
            close: (): void => {
                this.destroy();
            }
        });
        dialog.appendTo(hostEl);
        this.dialog = dialog;
        dialog.show();
    }

    /**
     * Whether the dialog is currently open.
     *
     * @returns {boolean} True when open
     */
    public isOpen(): boolean {
        return this.dialog !== null;
    }

    /**
     * Applies the selected zoom choice and closes the dialog.
     *
     * @returns {void}
     */
    public commit(): void {
        const custom: number = this.numeric && typeof this.numeric.value === 'number'
            ? this.numeric.value : this.host.zoom;
        const choice: ZoomChoice | null = resolveZoomChoice(this.selected, custom);
        if (!choice) {
            return;
        }
        if (choice.kind === 'fit-window') {
            this.host.fitToWindow();
        } else if (choice.kind === 'fit-width') {
            this.host.fitWidth();
        } else {
            this.host.setZoom(choice.percent);
        }
        this.destroy();
    }

    /**
     * Destroys the dialog and its controls.
     *
     * @returns {void}
     */
    public destroy(): void {
        for (let i: number = 0; i < this.radios.length; i++) {
            if (!this.radios[i].isDestroyed) {
                this.radios[i].destroy();
            }
        }
        this.radios = [];
        if (this.numeric && !this.numeric.isDestroyed) {
            this.numeric.destroy();
        }
        this.numeric = null;
        const dialog: Dialog | null = this.dialog;
        this.dialog = null;
        if (dialog) {
            try {
                dialog.hide();
                dialog.destroy();
            } catch {
                // Already closed / torn down.
            }
        }
        if (this.hostEl && this.hostEl.parentElement) {
            this.hostEl.parentElement.removeChild(this.hostEl);
        }
        this.hostEl = null;
    }

    private optionLabel(opt: { value: string; label: string; }): string {
        const keys: Record<string, string> = { 'fit-window': 'FitToWindow', 'fit-width': 'FitToWidth', percent: 'Percent' };
        return keys[opt.value] ? localize(this.host.locale, keys[opt.value]) : opt.label;
    }

    private buildContent(): HTMLElement {
        const body: HTMLElement = createElement('div', {
            className: 'ej2-pptx-zoom-dialog__body',
            attrs: { role: 'radiogroup', 'aria-label': 'Zoom' }
        });
        this.selected = 'fit-window';
        for (let i: number = 0; i < ZOOM_DIALOG_OPTIONS.length; i++) {
            const opt: { value: string; label: string; } = ZOOM_DIALOG_OPTIONS[i];
            const row: HTMLElement = createElement('div', { className: 'ej2-pptx-zoom-dialog__row' });
            const input: HTMLInputElement = createElement('input', {
                attrs: { type: 'radio', name: 'ej2-pptx-zoom' }
            }) as HTMLInputElement;
            row.appendChild(input);
            body.appendChild(row);
            const radio: RadioButton = new RadioButton({
                label: this.optionLabel(opt),
                name: 'ej2-pptx-zoom',
                value: opt.value,
                checked: opt.value === this.selected,
                change: (): void => {
                    this.selected = opt.value;
                }
            });
            radio.appendTo(input);
            this.radios.push(radio);
            if (opt.value === 'percent') {
                const num: HTMLInputElement = createElement('input', {
                    attrs: { type: 'text', 'aria-label': 'Custom zoom percentage' }
                }) as HTMLInputElement;
                row.appendChild(num);
                const unit: HTMLElement = createElement('span', { className: 'ej2-pptx-zoom-dialog__unit' });
                unit.textContent = '%';
                row.appendChild(unit);
                this.numeric = new NumericTextBox({
                    value: Math.round(this.host.zoom),
                    min: MIN_ZOOM,
                    max: MAX_ZOOM,
                    format: 'n0',
                    showSpinButton: false,
                    width: '72px',
                    focus: (): void => {
                        this.selectPercent();
                    }
                });
                this.numeric.appendTo(num);
            }
        }
        return body;
    }

    private selectPercent(): void {
        this.selected = 'percent';
        for (let i: number = 0; i < this.radios.length; i++) {
            if (this.radios[i].value === 'percent') {
                this.radios[i].checked = true;
                this.radios[i].dataBind();
            }
        }
    }
}
