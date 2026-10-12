import { createElement, L10n } from '@syncfusion/ej2-base';
import { ItemModel, Toolbar } from '@syncfusion/ej2-navigations';
import { Tooltip } from '@syncfusion/ej2-popups';

/**
 * @private
 */
export interface EditorToolbarOptions {
    enablePreview: boolean;
    enableRtl: boolean;
    isDefaultSchema: boolean;
    showSplitView: boolean;
    isPreviewOpen: boolean;
    onCopySchema: () => void;
    onReset: () => void;
    onShowBuild: () => void;
    onShowJson: () => void;
    onShowPreview: () => void;
}

/**
 * @private
 */
export interface EditorToolbarOwners {
    toolbars: any[];
    tooltips: any[];
}

/**
 * @private
 */
export class EditorToolbar {
    private host: HTMLElement;
    private toolbarContainer: HTMLElement;
    private options: EditorToolbarOptions;
    private l10n: L10n;
    private toolbarInstance: Toolbar | null;
    private tooltipInstance: Tooltip | null;
    private owners: EditorToolbarOwners | null;

    constructor(host: HTMLElement, options: EditorToolbarOptions, l10n: L10n, owners: EditorToolbarOwners | null) {
        this.host = host;
        this.options = options;
        this.l10n = l10n;
        this.owners = owners;
        this.toolbarInstance = null;
        this.tooltipInstance = null;
        this.toolbarContainer = createElement('div', { attrs: { id: 'toolbar', class: 'e-formbuilder-toolbar' } });
        this.host.appendChild(this.toolbarContainer);
        this.render(options);
    }

    /**
     * @private
     */
    public render(options: EditorToolbarOptions): void {
        this.options = options;
        this.ensureHostAttributes();
        this.destroyInstances();

        const items: ItemModel[] = [];
        if (!options.showSplitView && !options.isPreviewOpen) {
            items.push({
                prefixIcon: 'e-icons e-copy',
                tooltipText: this.l10n.getConstant('copyCode') || 'Copy code',
                disabled: options.isDefaultSchema,
                click: options.onCopySchema
            });
            items.push({
                prefixIcon: 'e-icons e-trash',
                tooltipText: this.l10n.getConstant('resetForm') || 'Reset form',
                disabled: options.isDefaultSchema,
                click: options.onReset
            });
            items.push({ type: 'Separator' } as ItemModel);
        }

        items.push({
            prefixIcon: 'e-icons e-edit',
            text: options.showSplitView || options.isPreviewOpen ? 'Build' : undefined,
            cssClass: !options.showSplitView && !options.isPreviewOpen ? 'e-toolbar-active' : '',
            tooltipText: this.l10n.getConstant('editForm') || 'Edit form',
            click: options.onShowBuild
        });
        items.push({
            prefixIcon: 'e-icons e-code-view',
            text: options.showSplitView || options.isPreviewOpen ? 'JSON' : undefined,
            cssClass: options.showSplitView && !options.isPreviewOpen ? 'e-toolbar-active' : '',
            tooltipText: this.l10n.getConstant('jsonview') || 'JSON view',
            click: options.onShowJson
        });

        if (options.enablePreview) {
            items.push({
                prefixIcon: 'e-icons e-eye',
                text: options.showSplitView || options.isPreviewOpen ? 'Preview' : undefined,
                cssClass: options.isPreviewOpen ? 'e-toolbar-active' : '',
                disabled: options.isDefaultSchema,
                tooltipText: this.l10n.getConstant('previewForm') || 'Preview form',
                click: options.onShowPreview
            });
        }

        this.toolbarInstance = new Toolbar({
            enableRtl: this.options.enableRtl,
            items: items
        });
        this.toolbarInstance.appendTo(this.toolbarContainer);
        if (this.owners) {
            this.owners.toolbars.push(this.toolbarInstance);
        }

        this.tooltipInstance = new Tooltip({
            target: '#toolbar [title]',
            position: 'BottomCenter'
        });
        this.tooltipInstance.appendTo(this.host);
        if (this.owners) {
            this.owners.tooltips.push(this.tooltipInstance);
        }
    }

    private ensureHostAttributes(): void {
        const existingClasses: string[] = Array.from(this.host.classList)
            .filter((className: string) => className !== 'editor-handle-center');
        this.host.className = 'editor-handle';
        for (let i: number = 0; i < existingClasses.length; i++) {
            this.host.classList.add(existingClasses[i as number]);
        }
        if (this.options.showSplitView || this.options.isPreviewOpen) {
            this.host.classList.add('editor-handle-center');
        }
        else {
            this.host.classList.remove('editor-handle-center');
        }
        this.host.setAttribute('role', 'toolbar');
        this.host.setAttribute('aria-label', 'Form Builder Actions');
        this.host.style.zIndex = this.options.isPreviewOpen || this.options.showSplitView ? '99999' : '999';
    }

    private destroyInstances(): void {
        if (this.tooltipInstance) {
            try {
                this.tooltipInstance.destroy();
            } catch (e) {
                /* ignore */
            }
            this.removeOwnerTooltip(this.tooltipInstance);
            this.tooltipInstance = null;
        }
        if (this.toolbarInstance) {
            try {
                this.toolbarInstance.destroy();
            } catch (e) {
                /* ignore */
            }
            this.removeOwnerToolbar(this.toolbarInstance);
            this.toolbarInstance = null;
        }
        while (this.toolbarContainer.firstChild) {
            this.toolbarContainer.removeChild(this.toolbarContainer.firstChild);
        }
    }

    private removeOwnerTooltip(instance: Tooltip): void {
        if (!this.owners) {
            return;
        }
        const index: number = this.owners.tooltips.indexOf(instance);
        if (index >= 0) {
            this.owners.tooltips.splice(index, 1);
        }
    }

    private removeOwnerToolbar(instance: Toolbar): void {
        if (!this.owners) {
            return;
        }
        const index: number = this.owners.toolbars.indexOf(instance);
        if (index >= 0) {
            this.owners.toolbars.splice(index, 1);
        }
    }

    /**
     * @private
     */
    public destroy(): void {
        this.destroyInstances();
        if (this.toolbarContainer.parentNode === this.host) {
            this.host.removeChild(this.toolbarContainer);
        }
    }
}
