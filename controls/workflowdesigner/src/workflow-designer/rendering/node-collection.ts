import { L10n } from '@syncfusion/ej2-base';
import { Accordion, AccordionItemModel, ExpandEventArgs } from '@syncfusion/ej2-navigations';
import { Button } from '@syncfusion/ej2-buttons';
import { TextBox } from '@syncfusion/ej2-inputs';
import { WorkflowStepType } from '../models/workflow-enums';
import { WorkflowNodeCatalogEntry } from './node-catalog';
import { InsertionController } from '../interactions/insertion-controller';
import { ServiceLocator } from './service';
import { CustomStepResolver } from './custom-step-resolver';
import { WorkflowStepCollectionSettingsModel } from '../models/workflow-node-collection-settings-model';

/** One rendered catalog entry and the EJ2 Button that presents it. */
interface NodeCollectionItemRecord {
    entry: WorkflowNodeCatalogEntry;
    element: HTMLButtonElement;
    button: Button | null;
}

/**
 * Insertion-driven Node Collection palette.
 *
 * The palette is displayed as an overlay and opens only while an insertion
 * context is active. Closing the palette also clears that insertion context.
 *
 * Categories are presented with a Syncfusion `Accordion` and each catalog
 * entry with a Syncfusion `Button`, so the palette inherits the active
 * Syncfusion theme. Every panel is expanded on open, preserving the previous
 * always-visible list behaviour while adding collapse support.
 *
 * NOTE: this supersedes the `FR-014a` native-HTML-UI dependency boundary for
 * this file. The boundary remains in force for files not yet migrated.
 *
 * @internal
 * @private
 */
export class NodeCollection {
    private readonly host: HTMLElement;
    private readonly insertionController: InsertionController;
    private readonly serviceLocator: ServiceLocator;
    private l10n: L10n;
    private settings?: WorkflowStepCollectionSettingsModel;

    private root: HTMLDivElement | null = null;
    private searchTextBox: TextBox | null = null;
    private searchInputHandler: (() => void) | null = null;
    private cancelButton: Button | null = null;
    private listElement: HTMLDivElement | null = null;
    private accordion: Accordion | null = null;
    private accordionElement: HTMLDivElement | null = null;
    private emptyElement: HTMLDivElement | null = null;
    private entries: WorkflowNodeCatalogEntry[] = [];
    /** Rendered entries, in Accordion panel order. */
    private itemRecords: NodeCollectionItemRecord[] = [];
    /** Rendered `.e-acrdn-item` element per category, in render order. */
    private readonly categoryElements: Map<string, HTMLElement> =
    new Map<string, HTMLElement>();
    /** Tracks whether palette was opened from user handle; if true, close on selection. */
    private openedFromUserHandle: boolean = false;

    /**
     * Creates the instance.
     *
     * @param {HTMLElement} host The host.
     * @param {InsertionController} insertionController The insertion controller.
     * @param {ServiceLocator} serviceLocator The service locator holding the localization instance.
     * @param {WorkflowStepCollectionSettingsModel} settings The settings.
     * @returns {void} Nothing.
     * @private
     */
    public constructor(
        host: HTMLElement,
        insertionController: InsertionController,
        serviceLocator: ServiceLocator,
        settings?: WorkflowStepCollectionSettingsModel
    ) {
        this.host = host;
        this.insertionController = insertionController;
        this.serviceLocator = serviceLocator;
        this.settings = settings;
        // Resolve the shared localization instance; the main component
        // registers it before any rendering begins.
        this.l10n = this.serviceLocator.getService<L10n>('localization');
        // Node Collection width is responsive — sized by the parent layout,
        // not from settings.width (removed).
    }

    /**
     * Creates the Node Collection DOM in its initial closed state.
     *
     * @returns {void}
     * @private
     */
    public create(): void {
        if (this.root) {
            return;
        }

        this.root = document.createElement('div');
        this.root.className = 'e-wf-node-collection-panel';
        this.root.setAttribute('role', 'region');
        this.root.setAttribute('aria-label', this.l10n.getConstant('workflowSteps'));
        this.root.style.display = 'none';

        const header: HTMLDivElement =
            document.createElement('div');

        header.className = 'e-wf-node-collection-header';

        const title: HTMLSpanElement =
            document.createElement('span');

        title.className = 'e-wf-node-collection-title';
        title.textContent = this.l10n.getConstant('workflowSteps');

        const cancel: HTMLButtonElement =
            document.createElement('button');

        cancel.type = 'button';
        cancel.className = 'e-wf-node-collection-cancel';

        header.appendChild(title);
        header.appendChild(cancel);

        const searchInput: HTMLInputElement = document.createElement('input');
        searchInput.type = 'text';

        this.listElement = document.createElement('div');
        this.listElement.className = 'e-wf-node-collection-list';

        this.root.appendChild(header);
        this.root.appendChild(searchInput);
        this.root.appendChild(this.listElement);

        this.host.appendChild(this.root);

        // Instantiate EJ2 components only after the DOM is attached: a
        // component initialised while detached computes zero dimensions.
        this.cancelButton = new Button({
            iconCss: 'e-icons e-close',
            cssClass: 'e-flat',
            isPrimary: false
        });
        this.cancelButton.appendTo(cancel);
        cancel.setAttribute('aria-label', this.l10n.getConstant('cancelInsertion'));
        cancel.setAttribute('title', this.l10n.getConstant('cancel'));
        cancel.addEventListener('click', () => this.close());

        // Define the filter handler that will be used by both input and change events
        this.searchInputHandler = () => this.applyFilter();

        this.searchTextBox = new TextBox({
            cssClass: 'e-wf-node-collection-search',
            placeholder: this.l10n.getConstant('searchWorkflowSteps'),
            showClearButton: true,
            input: this.searchInputHandler,
            change: this.searchInputHandler
        });
        this.searchTextBox.appendTo(searchInput);
        this.searchTextBox.element.setAttribute('aria-label', this.l10n.getConstant('searchWorkflowSteps'));

        this.applyClosedState();
    }

    /**
     * Re-resolves the shared localization instance from the service registry.
     * The main component re-registers the instance (with a new locale) before
     * calling this method, so every rendered string reads the fresh constants.
     *
     * @returns {void} Nothing.
     */
    public setLocale(): void {
        this.l10n = this.serviceLocator.getService<L10n>('localization');
        if (!this.root) {
            return;
        }
        const text: string = this.l10n.getConstant('workflowSteps');
        const title: Element | null = this.root.querySelector('.e-wf-node-collection-title');
        if (title) {
            title.textContent = text;
        }
        this.root.setAttribute('aria-label', text);
        const searchText: string = this.l10n.getConstant('searchWorkflowSteps');
        if (this.searchTextBox) {
            this.searchTextBox.placeholder = searchText;
            this.searchTextBox.element.setAttribute('aria-label', searchText);
        }
        // Close button reflects the localized cancel labels.
        const cancelButton: Element | null = this.root.querySelector('.e-wf-node-collection-cancel');
        if (cancelButton) {
            cancelButton.setAttribute('aria-label', this.l10n.getConstant('cancelInsertion'));
            cancelButton.setAttribute('title', this.l10n.getConstant('cancel'));
        }
        // Re-render the accordion when it is currently mounted so category
        // headers and the empty-state text pick up the new locale. The
        // `entries` list and `isOpen` state are preserved.
        if (this.accordion && this.accordionElement) {
            this.buildAccordion();
            // Re-apply the current search filter so the visible state
            // matches what the user saw before the locale change.
            this.applyFilter();
        } else if (this.emptyElement) {
            // Accordion not yet built but the empty state was added; refresh
            // its text only.
            this.emptyElement.textContent = this.l10n.getConstant('noNodesMatchSearch');
        }
    }

    /**
     * Maps a catalog category name to its localized header label.
     *
     * Catalog categories are persisted on entries (`entry.category`) to keep
     * the data classification stable, but the user-visible category header
     * is sourced from L10n constants. Falls back to the raw catalog name
     * when no key matches — this preserves the existing English surface in
     * any locale that has not translated the categories.
     *
     * @param {string} categoryName The catalog category name.
     * @returns {string} The localized category header text.
     * @private
     */
    private localizeCategory(categoryName: string): string {
        // Lookup uses the L10n instance; missing keys resolve to '' via
        // getConstant. Map known category names to their L10n keys by
        // convention so we always read the correct one.
        switch (categoryName) {
        case 'Triggers':
            return this.l10n.getConstant('categoryTriggers') || categoryName;
        case 'Actions':
            return this.l10n.getConstant('categoryActions') || categoryName;
        case 'Flow':
            return this.l10n.getConstant('categoryFlow') || categoryName;
        case 'Human':
            return this.l10n.getConstant('categoryHuman') || categoryName;
        case 'AI':
            return this.l10n.getConstant('categoryAI') || categoryName;
        case 'Output':
            return this.l10n.getConstant('categoryOutput') || categoryName;
        case 'Custom':
            return this.l10n.getConstant('categoryCustom') || categoryName;
        default:
            return categoryName;
        }
    }

    /**
     * Opens the Node Collection for the active insertion context.
     *
     * @param {boolean} fromUserHandle Whether opened from user handle (closes on selection) vs toolbar (stays open).
     * @param {boolean} [focusSearch] Whether to move focus to the search box; false when opened without user action.
     * @returns {void}
     * @private
     */
    public open(fromUserHandle: boolean = true, focusSearch: boolean = true): void {
        if (!this.root) {
            return;
        }
        // Check if step collection is enabled
        if (this.settings && this.settings.visible === false) {
            return;
        }

        this.openedFromUserHandle = fromUserHandle;
        this.entries = this.getPermittedEntries();

        // Reset search box if it exists
        if (this.searchTextBox) {
            this.searchTextBox.value = '';
            this.searchTextBox.dataBind();
        }

        // Make the panel visible before building the Accordion so the
        // component measures a laid-out container rather than a hidden one.
        this.root.style.display = '';
        this.host.classList.add('e-wf-node-collection-open');
        this.host.setAttribute('aria-hidden', 'false');

        this.buildAccordion();
        this.applyFilter();

        // Focus the search box only when the user opened the collection.
        if (this.searchTextBox && focusSearch) {
            this.searchTextBox.element.focus();
        }
    }

    /**
     * Toggles the collection from the canvas toolbar or user handle.
     *
     * @param {boolean} fromUserHandle Whether opened from user handle (closes on selection) vs toolbar (stays open).
     * @returns {void}
     * @private
     */
    public toggle(fromUserHandle: boolean = true): void {
        if (this.isOpen()) {
            this.close();
        } else {
            this.open(fromUserHandle);
        }
    }

    /**
     * Applies new step collection settings. The palette is refreshed in place when it is open; the
     * canvas is not touched.
     *
     * @param {WorkflowStepCollectionSettingsModel} settings The new settings.
     * @returns {void}
     * @private
     */
    public updateSettings(settings?: WorkflowStepCollectionSettingsModel): void {
        this.settings = settings;
        if (this.isOpen()) {
            this.entries = this.getPermittedEntries();
            this.buildAccordion();
            this.applyFilter();
        }
    }

    /**
     * Closes the Node Collection and clears the insertion context.
     *
     * @returns {void}
     * @private
     */
    public close(): void {
        if (this.root) {
            this.root.style.display = 'none';
        }

        this.applyClosedState();
        this.insertionController.clearContext();
    }

    /**
     * Returns true when the complete Node Collection overlay is open.
     *
     * @returns {boolean} Whether the collection is open.
     * @private
     */
    public isOpen(): boolean {
        return Boolean(
            this.root &&
            this.root.style.display !== 'none' &&
            this.host.classList.contains(
                'e-wf-node-collection-open'
            )
        );
    }

    /**
     * Removes the Node Collection and clears its insertion context.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.insertionController.clearContext();
        this.applyClosedState();

        this.destroyAccordion();

        if (this.searchTextBox) {
            this.searchTextBox.destroy();
            this.searchTextBox = null;
        }
        this.searchInputHandler = null;

        if (this.cancelButton) {
            this.cancelButton.destroy();
            this.cancelButton = null;
        }

        if (this.root) {
            this.root.remove();
        }

        this.root = null;
        this.listElement = null;
        this.emptyElement = null;
        this.entries = [];
    }

    /**
     * Applies the complete closed state to the overlay host.
     *
     * @returns {void}
     */
    private applyClosedState(): void {
        this.host.classList.remove(
            'e-wf-node-collection-open'
        );

        this.host.setAttribute(
            'aria-hidden',
            'true'
        );
    }

    /**
     * Returns the node types permitted for the current insertion context.
     *
     * @returns {WorkflowNodeCatalogEntry[]} The permitted catalog entries.
     */
    private getPermittedEntries(): WorkflowNodeCatalogEntry[] {
        const all: WorkflowNodeCatalogEntry[] =
            CustomStepResolver.getEntries(this.settings);

        return all.filter(
            (entry: WorkflowNodeCatalogEntry): boolean =>
                this.insertionController.isPermitted(
                    entry.stepType
                )
        );
    }

    /**
     * Rebuilds the Accordion for the currently permitted catalog entries.
     * One panel per category, in first-appearance order, all expanded so the
     * palette reads as the previous flat list until the author collapses a
     * category.
     *
     * @returns {void}
     */
    private buildAccordion(): void {
        if (!this.listElement) {
            return;
        }

        this.destroyAccordion();

        const categories: string[] = [];
        this.entries.forEach((entry: WorkflowNodeCatalogEntry): void => {
            if (categories.indexOf(entry.category) === -1) {
                categories.push(entry.category);
            }
        });

        this.emptyElement = document.createElement('div');
        this.emptyElement.className = 'e-wf-node-collection-empty';
        this.emptyElement.textContent = this.l10n.getConstant('noNodesMatchSearch');
        this.emptyElement.hidden = true;

        if (!categories.length) {
            this.listElement.appendChild(this.emptyElement);
            this.emptyElement.hidden = false;
            return;
        }

        const items: AccordionItemModel[] = categories.map(
            (categoryName: string): AccordionItemModel => ({
                header: NodeCollection.escapeHtml(this.localizeCategory(categoryName)),
                content: this.buildCategoryContent(categoryName),
                expanded: true
            })
        );

        this.accordionElement = document.createElement('div');
        this.listElement.appendChild(this.accordionElement);
        this.listElement.appendChild(this.emptyElement);

        this.accordion = new Accordion({
            // Multiple keeps every category open at once, matching the
            // previous always-visible grouping.
            expandMode: 'Multiple',
            cssClass: 'e-wf-node-collection-accordion',
            items: items,
            // Accordion may defer content rendering; hydrate again whenever a
            // panel first expands. `hydrateItems` is idempotent.
            expanded: (args: ExpandEventArgs) => {
                void args;
                this.hydrateItems();
            }
        } as any);
        this.accordion.appendTo(this.accordionElement);

        this.captureCategoryElements(categories);
        this.hydrateItems();
    }

    /**
     * Builds one category panel's markup. Buttons are emitted as empty
     * elements carrying their step type; the EJ2 Button that renders the icon
     * and label is attached in `hydrateItems`.
     *
     * @param {string} categoryName The category to render.
     * @returns {string} The panel content markup.
     */
    private buildCategoryContent(categoryName: string): string {
        const buttons: string = this.entries
            .filter((entry: WorkflowNodeCatalogEntry): boolean => entry.category === categoryName)
            .map((entry: WorkflowNodeCatalogEntry): string =>
                '<button type="button" class="e-wf-node-collection-item" data-wf-step-type="'
                + NodeCollection.escapeHtml(String(entry.stepType))
                + '"' + (entry.customStepId !== undefined
                    ? ' data-wf-custom-id="' + NodeCollection.escapeHtml(entry.customStepId) + '"' : '')
                + '></button>')
            .join('');
        return '<div class="e-wf-node-collection-category">' + buttons + '</div>';
    }

    /**
     * Records the rendered `.e-acrdn-item` element for each category so the
     * search filter can hide a whole panel when none of its entries match.
     *
     * @param {string[]} categories The categories in render order.
     * @returns {void}
     */
    private captureCategoryElements(categories: string[]): void {
        this.categoryElements.clear();
        if (!this.accordion || !this.accordion.element) {
            return;
        }
        const rendered: NodeListOf<Element> =
            this.accordion.element.querySelectorAll('.e-acrdn-item');
        categories.forEach((categoryName: string, index: number): void => {
            const element: Element | null = rendered.item(index);
            if (element) {
                this.categoryElements.set(categoryName, element as HTMLElement);
            }
        });
    }

    /**
     * Attaches an EJ2 Button to every rendered catalog entry that does not yet
     * have one. Safe to call repeatedly.
     *
     * @returns {void}
     */
    private hydrateItems(): void {
        if (!this.accordion || !this.accordion.element) {
            return;
        }
        const elements: NodeListOf<Element> =
            this.accordion.element.querySelectorAll('[data-wf-step-type]');
        for (let i: number = 0; i < elements.length; i++) {
            const element: HTMLButtonElement = elements.item(i) as HTMLButtonElement;
            if (element.getAttribute('data-wf-hydrated') === 'true') {
                continue;
            }
            const stepType: string = element.getAttribute('data-wf-step-type') || '';
            const customId: string | null = element.getAttribute('data-wf-custom-id');
            const entry: WorkflowNodeCatalogEntry | undefined = this.entries.filter(
                (candidate: WorkflowNodeCatalogEntry): boolean => String(candidate.stepType) === stepType
                    && (customId === null ? candidate.customStepId === undefined : candidate.customStepId === customId)
            )[0];
            if (!entry) {
                continue;
            }
            element.setAttribute('data-wf-hydrated', 'true');
            const button: Button = new Button({
                content: entry.label,
                iconCss: 'e-wf-node-collection-item-icon e-icons' + (entry.icon ? ' ' + entry.icon : ''),
                iconPosition: 'Left',
                cssClass: 'e-flat'
            });
            button.appendTo(element);
            element.setAttribute('aria-label', entry.label);
            element.setAttribute('title', entry.description || entry.label);
            element.addEventListener('click', () => this.onSelect(entry));
            this.itemRecords.push({ entry: entry, element: element, button: button });
        }
    }

    /**
     * Applies the current search text by hiding non-matching entries and any
     * category left with no visible entry. Filtering never rebuilds the
     * Accordion, so expand/collapse state survives typing.
     *
     * @returns {void}
     */
    private applyFilter(): void {
        if (!this.searchTextBox) {
            return;
        }

        const query: string =
            (this.searchTextBox.element.value || '').trim().toLowerCase();

        const visibleByCategory: Map<string, number> = new Map<string, number>();
        let visibleTotal: number = 0;

        this.itemRecords.forEach((record: NodeCollectionItemRecord): void => {
            const matches: boolean = !query
                || record.entry.label.toLowerCase().indexOf(query) !== -1
                || record.entry.category.toLowerCase().indexOf(query) !== -1;
            record.element.style.display = matches ? '' : 'none';
            if (matches) {
                visibleTotal++;
                visibleByCategory.set(
                    record.entry.category,
                    (visibleByCategory.get(record.entry.category) || 0) + 1
                );
            }
        });

        this.categoryElements.forEach((element: HTMLElement, categoryName: string): void => {
            element.style.display = (visibleByCategory.get(categoryName) || 0) > 0 ? '' : 'none';
        });

        if (this.emptyElement) {
            this.emptyElement.hidden = visibleTotal > 0;
        }
    }

    /**
     * Destroys the Accordion, its entry Buttons and their owned DOM.
     *
     * @returns {void}
     */
    private destroyAccordion(): void {
        this.itemRecords.forEach((record: NodeCollectionItemRecord): void => {
            if (record.button) {
                record.button.destroy();
            }
        });
        this.itemRecords = [];
        this.categoryElements.clear();

        if (this.accordion) {
            this.accordion.destroy();
            this.accordion = null;
        }
        if (this.accordionElement) {
            this.accordionElement.remove();
            this.accordionElement = null;
        }
        if (this.emptyElement) {
            this.emptyElement.remove();
            this.emptyElement = null;
        }
    }

    /**
     * Inserts the selected node and closes the palette only if opened from user handle.
     *
     * @param {WorkflowNodeCatalogEntry} entry The selected catalog entry.
     * @returns {void}
     */
    private onSelect(
        entry: WorkflowNodeCatalogEntry
    ): void {
        const id: string | null =
            this.insertionController.insert(
                entry.stepType as WorkflowStepType,
                entry.label,
                entry.customStepId !== undefined ? CustomStepResolver.find(this.settings, entry.customStepId) : undefined
            );

        if (id && this.openedFromUserHandle) {
            this.close();
        }
    }

    /**
     * Escapes text interpolated into Accordion header / content markup.
     *
     * @param {string} value The raw text.
     * @returns {string} The escaped text.
     */
    private static escapeHtml(value: string): string {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
}
