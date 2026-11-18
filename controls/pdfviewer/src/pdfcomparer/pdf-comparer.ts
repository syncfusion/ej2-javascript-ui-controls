import { PdfViewer, Magnification, Navigation, Annotation, TextSelection, FormFields, TextComparisonOptions, createSpinner, showSpinner, hideSpinner } from '../index';
import { Component, INotifyPropertyChanged, NotifyPropertyChanges, Property } from '@syncfusion/ej2-base';
import { Button } from '@syncfusion/ej2-buttons';
import { DifferencePanel } from './difference-panel';
import { PdfComparerModel } from './pdf-comparer-model';

/**
 * The `PdfComparer` component provides advanced side-by-side PDF document comparison
 * with semantic text analysis and interactive difference visualization. It enables users
 * to identify, review, and navigate content changes between two PDF documents through a
 * synchronized viewing experience.
 *
 * @remarks
 * Key Features:
 * - Side-by-side PDF viewing with synchronized navigation and scrolling
 * - Interactive difference panel for quick change review
 * - Configurable highlight colors and opacity settings
 * - Responsive layout optimized for desktop and mobile devices
 * - Localization and globalization support
 * - Flexible initialization through constructor parameters or property configuration
 *
 * Layout Behavior:
 * - Desktop (width > 1024px): 40% left viewer, 40% right viewer, 20% difference panel
 * - Mobile (width ≤ 1024px): Vertically stacked viewers with collapsible difference panel
 *
 * @example
 * ```typescript
 * const comparisonOptions: TextComparisonOptions = {
 *   beforeColor: '#FF0000',
 *   afterColor: '#00FF00',
 *   beforeColorOpacity: 0.4,
 *   afterColorOpacity: 0.4,
 *   enableHighlights: true
 * };
 *
 * const comparer = new PdfComparer(
 *   'documents/original.pdf',
 *   'documents/modified.pdf',
 *   'https://cdn.syncfusion.com/ej2/dist/ej2-pdfviewer-lib',
 *   comparisonOptions,
 *   true,
 *   true,
 *   'en-US'
 * );
 *
 * comparer.appendTo('#pdf-comparer');
 * ```
 *
 * @example
 * ```typescript
 * const comparer = new PdfComparer();
 *
 * comparer.originalDocumentPath = 'documents/original.pdf';
 * comparer.modifiedDocumentPath = 'documents/modified.pdf';
 * comparer.resourceUrl = 'https://cdn.syncfusion.com/ej2/dist/ej2-pdfviewer-lib';
 * comparer.comparisonOptions = comparisonOptions;
 * comparer.enableDifferencePanel = true;
 * comparer.enableSyncScrolling = true;
 * comparer.locale = 'en-US';
 *
 * comparer.appendTo('#pdf-comparer');
 * await comparer.compare();
 * ```
 */
@NotifyPropertyChanges
export class PdfComparer extends Component<HTMLElement> implements INotifyPropertyChanged {
    /**
     * Specifies the file path, URL, or document source of the original PDF document
     * displayed in the left comparison viewer.
     *
     * @default ''
     */
    @Property('')
    public originalDocumentPath: string;

    /**
     * Specifies the file path, URL, or document source of the modified PDF document
     * displayed in the right comparison viewer.
     *
     * @default ''
     */
    @Property('')
    public modifiedDocumentPath: string;

    /**
     * Set the resource URL for assets or the public directory. The PdfComparer will load its custom resources from this URL.
     *
     * @default ''
     */
    @Property('')
    public resourceUrl: string;

    /**
     * Configures semantic text comparison settings, including highlight colors, opacity values, and difference rendering behavior.
     *
     * @default null
     */
    @Property(null)
    public comparisonOptions: TextComparisonOptions;

    /**
     * Determines whether the interactive difference panel is displayed.
     * When enabled, users can quickly navigate detected differences.
     *
     * @default true
     */
    @Property(true)
    public enableDifferencePanel: boolean;

    /**
     * Determines whether scrolling, zooming, and navigation actions are synchronized between both PDF viewers.
     *
     * @default true
     */
    @Property(true)
    public enableSyncScrolling: boolean;

    /**
     * Specifies the culture and localization settings for the PdfComparer component.
     * Overrides the globally configured culture value.
     *
     * @default ''
     */
    @Property('')
    public locale: string;

    /**
     * Defines the scrollable height of the PdfComparer control.
     *
     * {% codeBlock src='pdfcomparer/height/index.md' %}{% endcodeBlock %}
     *
     * @default '100%'
     */
    @Property('100%')
    public height: string | number;

    /**
     * Defines the scrollable width of the PdfComparer control.
     *
     * {% codeBlock src='pdfcomparer/width/index.md' %}{% endcodeBlock %}
     *
     * @default '100%'
     */
    @Property('100%')
    public width: string | number;

    /**
     * Wrapper element containing the entire layout (left viewer + right viewer + difference panel)
     * @private
     */
    private wrapperElement: HTMLElement | null = null;

    /**
     * Container ID for the left (original) PDF viewer
     * @private
     */
    private leftViewerContainerId: string = 'pdf-comparer-left';

    /**
     * Container ID for the right (modified) PDF viewer
     * @private
     */
    private rightViewerContainerId: string = 'pdf-comparer-right';

    /**
     * Container ID for the difference panel
     * @private
     */
    private differencePanelContainerId: string = 'pdf-comparer-panel';

    /**
     * Left (original) PDF viewer instance
     * @private
     */
    private leftViewer: PdfViewer | null = null;

    /**
     * Right (modified) PDF viewer instance
     * @private
     */
    private rightViewer: PdfViewer | null = null;

    /**
     * Difference panel UI component
     * Currently stored as any type; integrates with DifferencePanel from demos
     * @private
     */
    private differencePanel: any | null = null;

    /**
     * Flag indicating left document has loaded
     * @private
     */
    private leftViewerLoaded: boolean = false;

    /**
     * Flag indicating right document has loaded
     * @private
     */
    private rightViewerLoaded: boolean = false;

    /**
     * Flag indicating render is in progress
     * Prevents multiple concurrent render() calls
     * @private
     */
    private isRenderingInProgress: boolean = false;

    /**
     * Mobile mode breakpoint (in pixels)
     * When window width <= this value, layout switches to mobile mode
     * @private
     */
    private mobileBreakpoint: number = 1024;

    /**
     * Current layout mode: true for mobile, false for desktop
     * @private
     */
    private isMobileMode: boolean = false;

    /**
     * Mobile panel visibility state
     * @private
     */
    private isMobilePanelOpen: boolean = false;

    /**
     * Window resize event handler reference (for cleanup)
     * @private
     */
    private resizeHandler: (() => void) | null = null;

    /**
     * Spinner container element for displaying loading indicator
     * @private
     */
    private spinnerContainer: HTMLElement | null = null;

    /**
     * Flag to control auto-comparison when both viewers load
     * Set to true only when compare() is explicitly called
     * Set to false when document paths change (to prevent auto-comparison)
     * @private
     */
    private shouldAutoCompareOnLoad: boolean = true;

    /**
     * Stores the last comparison result for restoring when panel is re-enabled
     * Allows the difference cards to be shown again without re-running comparison
     * @private
     */
    private lastComparisonResult: any = null;

    /**
     * Constructor for PdfComparer
     * Initializes the component with optional configuration parameters.
     * All parameters are optional - you can provide them here or set them as properties later.
     *
     * @param {PdfComparerModel} [options] - (Optional) Configuration options for the PdfComparer
     * @param {string | HTMLElement} [element] - (Optional) DOM element to attach the component to
     *
     * @remarks
     * Use one of two approaches:
     * 1. Pass options to constructor: `new PdfComparer({ originalDocumentPath: path1, modifiedDocumentPath: path2 })`
     * 2. Create empty instance and set properties: `new PdfComparer(); comparer.originalDocumentPath = path1;`
     */
    constructor(options?: PdfComparerModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
        this.leftViewer = null;
        this.rightViewer = null;
        this.differencePanel = null;
        this.wrapperElement = null;
        this.leftViewerLoaded = false;
        this.rightViewerLoaded = false;
        this.isRenderingInProgress = false;
        this.isMobileMode = false;
        this.isMobilePanelOpen = false;
        this.shouldAutoCompareOnLoad = true;
        this.lastComparisonResult = null;
    }
    /**
     * Component lifecycle method - pre-render initialization
     * Creates the wrapper element and internal DOM structure with headers
     *
     * Desktop Layout structure (width > 1024px):
     * - Row 1: Header containers (auto-height)
     * - Row 2: Content containers (flexible height)
     * - Columns: 40% 40% 20% (left, right, panel) or 50% 50% (without panel)
     *
     * Mobile Layout structure (width <= 1024px):
     * - Vertical stack: Headers and viewers stacked, panel as overlay
     * - Show Changes button at bottom (only in mobile)
     *
     * @private
     * @returns {void}
     */
    protected preRender(): void {
        // Detect current layout mode
        this.isMobileMode = window.innerWidth <= this.mobileBreakpoint;
        // Create main wrapper element
        this.wrapperElement = document.createElement('div');
        this.wrapperElement.id = 'pdf-comparer-wrapper';
        this.wrapperElement.className = 'e-pv-text-comparison';
        // Apply layout classes
        if (this.isMobileMode) {
            this.updateClassList(this.wrapperElement, 'e-pv-mobile-layout', null);
        } else {
            this.updateClassList(this.wrapperElement, 'e-pv-desktop-layout', null);
            if (this.enableDifferencePanel) {
                this.updateClassList(this.wrapperElement, 'e-pv-with-panel', null);
            } else {
                this.updateClassList(this.wrapperElement, 'e-pv-without-panel', null);
            }
        }
        if (this.isMobileMode) {
            // Mobile layout: vertical stack with headers above viewers
            // Viewers container (flexible)
            const viewersContainer: HTMLDivElement = document.createElement('div');
            viewersContainer.id = 'pdf-comparer-viewers-container';
            this.updateClassList(viewersContainer, 'e-pv-mobile', null);
            // Helper function to create header
            const createHeader: (text: string, className: string) => HTMLElement = (text: string, className: string): HTMLElement => {
                const header: HTMLDivElement = document.createElement('div');
                header.className = `e-pv-pdf-comparer-header ${className}`;
                header.textContent = text;
                return header;
            };
            // Left viewer: header + container
            const leftHeader: HTMLElement = createHeader('Original Document', 'e-pv-pdf-comparer-header-left');
            viewersContainer.appendChild(leftHeader);
            const leftContainer: HTMLDivElement = document.createElement('div');
            leftContainer.id = this.leftViewerContainerId;
            this.updateClassList(leftContainer, 'e-pv-mobile', null);
            viewersContainer.appendChild(leftContainer);
            // Right viewer: header + container
            const rightHeader: HTMLElement = createHeader('Modified Document', 'e-pv-pdf-comparer-header-right');
            viewersContainer.appendChild(rightHeader);
            const rightContainer: HTMLDivElement = document.createElement('div');
            rightContainer.id = this.rightViewerContainerId;
            this.updateClassList(rightContainer, 'e-pv-mobile', null);
            viewersContainer.appendChild(rightContainer);
            this.wrapperElement.appendChild(viewersContainer);
            // Difference panel container (overlay, hidden by default)
            // Positioned absolutely within the wrapper, not fixed to viewport
            if (this.enableDifferencePanel) {
                const panelContainer: HTMLDivElement = document.createElement('div');
                panelContainer.id = this.differencePanelContainerId;
                panelContainer.className = 'e-pv-pdf-comparer-mobile-panel e-pv-hidden';
                this.wrapperElement.appendChild(panelContainer);
            }
            // Show Changes button
            if (this.enableDifferencePanel) {
                // Create button element
                const buttonsContainer: HTMLDivElement = document.createElement('div');
                buttonsContainer.id = 'pdf-comparer-mobile-buttons';
                const showChangesBtnElement: HTMLButtonElement = document.createElement('button');
                showChangesBtnElement.id = 'pdf-comparer-show-changes-btn';
                showChangesBtnElement.textContent = 'Show Changes';
                // Initialize Syncfusion Button
                new Button({ cssClass: 'e-secondary', disabled: !this.enableDifferencePanel }, showChangesBtnElement );
                showChangesBtnElement.addEventListener('click', () => this.openMobilePanel());
                buttonsContainer.appendChild(showChangesBtnElement);
                this.updateClassList(buttonsContainer, 'e-pv-mobile-buttons', null);
                this.wrapperElement.appendChild(buttonsContainer);
            }
        } else {
            // Desktop layout: grid with side-by-side viewers and panel
            // Helper function to create header
            const createHeader: (text: string, className: string) => HTMLElement = (text: string, className: string): HTMLElement => {
                const header: HTMLDivElement = document.createElement('div');
                header.className = `e-pv-pdf-comparer-header ${className}`;
                header.textContent = text;
                return header;
            };
            // Create headers
            const leftHeader: HTMLElement = createHeader('Original Document', 'e-pv-pdf-comparer-header-left');
            this.wrapperElement.appendChild(leftHeader);
            const rightHeader: HTMLElement = createHeader('Modified Document', 'e-pv-pdf-comparer-header-right');
            this.wrapperElement.appendChild(rightHeader);
            if (this.enableDifferencePanel) {
                const panelHeader: HTMLElement = createHeader('Differences', 'e-pv-pdf-comparer-header-panel');
                this.wrapperElement.appendChild(panelHeader);
            }
            // Create viewer containers
            const leftContainer: HTMLDivElement = document.createElement('div');
            leftContainer.id = this.leftViewerContainerId;
            this.wrapperElement.appendChild(leftContainer);
            const rightContainer: HTMLDivElement = document.createElement('div');
            rightContainer.id = this.rightViewerContainerId;
            this.wrapperElement.appendChild(rightContainer);
            // Create difference panel container
            if (this.enableDifferencePanel) {
                const panelContainer: HTMLDivElement = document.createElement('div');
                panelContainer.id = this.differencePanelContainerId;
                this.wrapperElement.appendChild(panelContainer);
            }
        }
    }
    /**
     * Component lifecycle method - main render logic
     * Attaches the wrapper to the element and initializes the PdfViewer instances
     *
     * @private
     * @returns {void}
     */
    protected render(): void {
        // Attach the wrapper element (created in preRender) to the parent element
        // this.element is set by Component.appendTo() before render() is called
        if (this.wrapperElement && this.element) {
            this.element.appendChild(this.wrapperElement);
        }
        // Apply height and width dimensions to wrapper
        this.applyDimensions();
        // Setup window resize listener for responsive layout
        this.setupResizeListener();
        // Render will be called after preRender
        // The actual initialization happens in appendTo which calls this after DOM is ready
        this.renderInternal();
    }
    /**
     * Apply height and width dimensions to the wrapper element
     * Converts values to CSS-compatible format (auto, pixels, percentages, etc.)
     * Triggers viewer resize after applying dimensions
     *
     * @private
     * @returns {void}
     */
    private applyDimensions(): void {
        if (!this.wrapperElement) {
            return;
        }
        // Apply height
        if (this.height !== undefined && this.height !== null) {
            const heightValue: string = typeof this.height === 'number' ? `${this.height}px` : this.height.toString();
            this.wrapperElement.style.height = heightValue;
        }
        // Apply width
        if (this.width !== undefined && this.width !== null) {
            const widthValue: string = typeof this.width === 'number' ? `${this.width}px` : this.width.toString();
            this.wrapperElement.style.width = widthValue;
        }
        // Trigger window resize event so viewers recalculate their internal layout
        window.dispatchEvent(new Event('resize'));
    }
    /**
     * Setup window resize listener to handle mobile/desktop transitions
     * @private
     * @returns {void} Nothing
     */
    private setupResizeListener(): void {
        this.resizeHandler = () => {
            const wasInMobileMode: boolean = this.isMobileMode;
            this.isMobileMode = window.innerWidth <= this.mobileBreakpoint;
            // If mode changed, rebuild the layout
            if (wasInMobileMode !== this.isMobileMode) {
                this.rebuildLayout();
            }
        };
        window.addEventListener('resize', this.resizeHandler);
    }
    /**
     * Rebuild layout when switching between mobile and desktop
     * Preserves the spinner during layout transitions
     * @private
     * @returns {void} Nothing
     */
    private rebuildLayout(): void {
        if (!this.wrapperElement) {
            return;
        }
        // Store spinner visibility state before clearing wrapper
        let spinnerIsVisible: boolean = false;
        if (this.spinnerContainer) {
            spinnerIsVisible = this.spinnerContainer.style.display !== 'none';
        }
        // Clear the wrapper (but preserve spinner container reference)
        this.wrapperElement.innerHTML = '';
        this.preRender();
        // Reattach viewers if they exist
        if (this.leftViewer && this.leftViewerContainerId) {
            const leftContainer: HTMLElement | null = document.getElementById(this.leftViewerContainerId);
            if (leftContainer) {
                this.leftViewer.appendTo(leftContainer);
            }
        }
        if (this.rightViewer && this.rightViewerContainerId) {
            const rightContainer: HTMLElement | null = document.getElementById(this.rightViewerContainerId);
            if (rightContainer) {
                this.rightViewer.appendTo(rightContainer);
            }
        }
        if (this.differencePanel && this.differencePanelContainerId && this.enableDifferencePanel) {
            const panelContainer: HTMLElement | null = document.getElementById(this.differencePanelContainerId);
            if (panelContainer) {
                this.differencePanel.containerElement = panelContainer;
                this.differencePanel.renderPanel();
            }
        }
        // Re-create spinner element since wrapper was cleared
        this.createSpinnerElement();
        // Restore spinner visibility state
        if (spinnerIsVisible) {
            this.showComparisonSpinner();
        }
        // Re-attach the wrapper to the element
        if (this.element && this.wrapperElement.parentElement !== this.element) {
            this.element.appendChild(this.wrapperElement);
        }
        // Re-add mobile button event listener if in mobile mode
        if (this.isMobileMode && this.enableDifferencePanel) {
            const showChangesBtn: HTMLElement | null = document.getElementById('pdf-comparer-show-changes-btn');
            if (showChangesBtn) {
                showChangesBtn.addEventListener('click', () => this.openMobilePanel());
            }
        }
    }
    /**
     * Component lifecycle method - get persist data
     * Returns empty string as we handle persistence internally
     *
     * @private
     * @returns {string} Empty persistence data
     */
    protected getPersistData(): string {
        return '';
    }
    /**
     * Get the module name for this component
     * Required by Component interface
     *
     * @private
     * @returns {string} The component module name
     */
    protected getModuleName(): string {
        return 'pdfComparer';
    }
    /**
     * Handles property changes
     * Required by INotifyPropertyChanged interface
     * Dynamically updates component behavior when public properties change
     *
     * @private
     * @param {Record<string, any>} newProp - Object containing new property values
     * @param {Record<string, any>} oldProp - Object containing old property values
     * @returns {void} Nothing
     */
    public onPropertyChanged(newProp: Record<string, any>, oldProp: Record<string, any>): void {
        // Skip if component is not ready
        if (!newProp) {
            return;
        }
        // Cancel any in-progress operations when properties change
        if (this.isRenderingInProgress) {
            this.isRenderingInProgress = false;
        }
        const properties: string[] = Object.keys(newProp);
        for (const prop of properties) {
            switch (prop) {
            case 'originalDocumentPath':
            case 'modifiedDocumentPath':
                // Handle document path changes
                // eslint-disable-next-line security/detect-object-injection
                this.handleDocumentPathChange(prop, newProp[prop], oldProp[prop]).catch((error: any) => {
                    console.error('Error handling document path change:', error);
                });
                break;
            case 'comparisonOptions':
                // Handle comparison options changes
                // eslint-disable-next-line security/detect-object-injection
                this.handleComparisonOptionsChange(newProp[prop], oldProp[prop]).catch((error: any) => {
                    console.error('Error handling comparison options change:', error);
                });
                break;
            case 'enableDifferencePanel':
                // Handle difference panel visibility changes
                // eslint-disable-next-line security/detect-object-injection
                this.handleDifferencePanelToggle(newProp[prop], oldProp[prop]);
                break;
            case 'enableSyncScrolling':
                // Handle sync scrolling state changes
                // eslint-disable-next-line security/detect-object-injection
                this.handleSyncScrollingToggle(newProp[prop], oldProp[prop]);
                break;
            case 'height':
            case 'width':
                // Handle height or width changes
                this.applyDimensions();
                break;
            case 'resourceUrl':
                break;
            }
        }
    }
    /**
     * Handle changes to document paths (originalDocumentPath or modifiedDocumentPath)
     * Loads new documents and clears previous comparison results
     *
     * @private
     * @async
     * @param {string} propertyName - 'originalDocumentPath' or 'modifiedDocumentPath'
     * @param {string | undefined} newPath - New document path
     * @param {string | undefined} oldPath - Old document path
     * @returns {Promise<void>} Nothing
     */
    private async handleDocumentPathChange(
        propertyName: string,
        newPath: string | undefined,
        oldPath: string | undefined
    ): Promise<void> {
        // Check if viewers are ready
        if (!this.leftViewer || !this.rightViewer) {
            return;
        }
        this.shouldAutoCompareOnLoad = false;
        await this.clearComparisonResults();
        // Load the new document into the appropriate viewer
        if (propertyName === 'originalDocumentPath' && newPath) {
            this.leftViewerLoaded = false;
            this.leftViewer.documentPath = newPath;
        } else if (propertyName === 'modifiedDocumentPath' && newPath) {
            this.rightViewerLoaded = false;
            this.rightViewer.documentPath = newPath;
        }
    }
    /**
     * Handle changes to comparison options
     * Clears annotations and difference cards
     *
     * @private
     * @async
     * @param {TextComparisonOptions | undefined} newOptions - New comparison options
     * @param {TextComparisonOptions | undefined} oldOptions - Old comparison options
     * @returns {Promise<void>} Nothing
     */
    private async handleComparisonOptionsChange(
        newOptions: TextComparisonOptions | undefined,
        oldOptions: TextComparisonOptions | undefined
    ): Promise<void> {
        // Check if viewers are ready
        if (!this.leftViewer || !this.rightViewer) {
            return;
        }
        await this.clearComparisonResults();
        // Update the difference panel's comparison options
        // This will dynamically show/hide the highlight checkbox based on enableHighlights property
        if (this.differencePanel) {
            this.differencePanel.updateComparisonOptions(newOptions);
        }
    }
    /**
     * Handle toggling the difference panel visibility
     * When enabled: renders panel and shows previous comparison results
     * When disabled: hides panel but preserves results in memory
     *
     * @private
     * @param {boolean} newState - New enabled state
     * @param {boolean} oldState - Old enabled state
     * @returns {void} Nothing
     */
    private handleDifferencePanelToggle(newState: boolean, oldState: boolean): void {
        if (newState) {
            // Panel is being enabled - recreate DOM elements
            this.enableDifferencePanelElements();
        } else {
            // Panel is being disabled - remove DOM elements
            this.disableDifferencePanelElements();
        }
    }
    /**
     * Enable difference panel by recreating DOM elements
     * Recreates the panel container, header (desktop), and mobile buttons
     * Restores comparison results from memory if available
     * Recalculates layout to show panel
     *
     * @private
     * @returns {void}
     */
    private enableDifferencePanelElements(): void {
        if (!this.wrapperElement) {
            return;
        }
        const isMobileMode: boolean = window.innerWidth <= this.mobileBreakpoint;
        if (isMobileMode) {
            // Mobile: recreate panel container and mobile buttons
            // Panel container
            const panelContainer: HTMLDivElement = document.createElement('div');
            panelContainer.id = this.differencePanelContainerId;
            panelContainer.className = 'e-pv-pdf-comparer-mobile-panel e-pv-hidden';
            this.wrapperElement.appendChild(panelContainer);
            // Recreate mobile buttons
            const buttonsContainer: HTMLDivElement = document.createElement('div');
            buttonsContainer.id = 'pdf-comparer-mobile-buttons';
            const showChangesBtnElement: HTMLButtonElement = document.createElement('button');
            showChangesBtnElement.id = 'pdf-comparer-show-changes-btn';
            showChangesBtnElement.textContent = 'Show Changes';
            // Initialize Syncfusion Button
            new Button({ cssClass: 'e-secondary', disabled: false }, showChangesBtnElement);
            showChangesBtnElement.addEventListener('click', () => this.openMobilePanel());
            buttonsContainer.appendChild(showChangesBtnElement);
            this.updateClassList(buttonsContainer, 'e-pv-mobile-buttons', null);
            this.wrapperElement.appendChild(buttonsContainer);
        } else {
            // Desktop: recreate header and panel container
            // Find insert point - after right header
            const rightHeader: HTMLElement | null = this.wrapperElement.querySelector('.e-pv-pdf-comparer-header-right');
            // Create and insert panel header
            const panelHeader: HTMLDivElement = document.createElement('div');
            panelHeader.className = 'e-pv-pdf-comparer-header e-pv-pdf-comparer-header-panel';
            panelHeader.textContent = 'Differences';
            if (rightHeader && rightHeader.parentElement) {
                rightHeader.parentElement.insertBefore(panelHeader, rightHeader.nextSibling);
            } else {
                this.wrapperElement.appendChild(panelHeader);
            }
            // Create and insert panel container
            const panelContainer: HTMLDivElement = document.createElement('div');
            panelContainer.id = this.differencePanelContainerId;
            panelContainer.className = 'e-pv-pdf-comparer-panel';
            this.wrapperElement.appendChild(panelContainer);
        }
        // Update wrapper layout classes
        this.updateClassList(this.wrapperElement, 'e-pv-with-panel', 'e-pv-without-panel');
        // Restore DifferencePanel or create new instance
        // If panel exists in memory with previous results, reuse it
        if (this.differencePanel && this.differencePanelContainerId) {
            const panelContainer: HTMLElement | null = document.getElementById(this.differencePanelContainerId);
            if (panelContainer) {
                // Reuse existing panel with previous comparison results
                this.differencePanel.containerElement = panelContainer;
                if (typeof this.differencePanel.renderPanel === 'function') {
                    this.differencePanel.renderPanel();
                }
                // Restore previous comparison results if available
                if (this.lastComparisonResult && typeof this.differencePanel.updatePanel === 'function') {
                    this.differencePanel.updatePanel(this.lastComparisonResult);
                }
            }
        } else if (this.leftViewer && this.rightViewer) {
            // Create new DifferencePanel instance if none exists
            this.differencePanel = new DifferencePanel(
                this.leftViewer,
                this.rightViewer,
                this.differencePanelContainerId,
                this.comparisonOptions
            );
            if (typeof this.differencePanel.renderPanel === 'function') {
                this.differencePanel.renderPanel();
            }
            // Restore previous comparison results if available
            if (this.lastComparisonResult && typeof this.differencePanel.updatePanel === 'function') {
                this.differencePanel.updatePanel(this.lastComparisonResult);
            }
        }
        // Trigger window resize event so viewers recalculate their internal layout
        window.dispatchEvent(new Event('resize'));
    }
    /**
     * Disable difference panel by removing DOM elements
     * Removes the panel container, header (desktop), and mobile buttons
     * Preserves DifferencePanel instance in memory for result restoration
     * Recalculates layout to expand viewers
     *
     * @private
     * @returns {void}
     */
    private disableDifferencePanelElements(): void {
        if (!this.wrapperElement) {
            return;
        }
        // Remove panel header (desktop only)
        const panelHeader: HTMLElement | null = this.wrapperElement.querySelector('.e-pv-pdf-comparer-header-panel');
        if (panelHeader) {
            panelHeader.remove();
        }
        // Remove panel container
        const panelContainer: HTMLElement | null = document.getElementById(this.differencePanelContainerId);
        if (panelContainer) {
            panelContainer.remove();
        }
        // Remove mobile buttons container
        const buttonsContainer: HTMLElement | null = document.getElementById('pdf-comparer-mobile-buttons');
        if (buttonsContainer) {
            buttonsContainer.remove();
        }
        // Update wrapper layout classes
        this.updateClassList(this.wrapperElement, 'e-pv-without-panel', 'e-pv-with-panel');
        // Trigger window resize event so viewers recalculate their internal layout
        window.dispatchEvent(new Event('resize'));
    }
    /**
     * Handle toggling sync scrolling between viewers
     * When enabled: synchronizes scroll positions
     * When disabled: viewers scroll independently
     *
     * @private
     * @param {boolean} newState - New enabled state
     * @param {boolean} oldState - Old enabled state
     * @returns {void} Nothing
     */
    private handleSyncScrollingToggle(newState: boolean, oldState: boolean): void {
        // Skip if state didn't actually change
        if (newState === oldState) {
            return;
        }
        // Check if viewers are ready
        if (!this.leftViewer || !this.rightViewer) {
            return;
        }
        if (newState) {
            // Enable synchronization
            this.leftViewer.syncViewers(this.rightViewer, true);
        } else {
            // Disable synchronization
            this.leftViewer.syncViewers(this.rightViewer, false);
        }
    }
    /**
     * Clear all comparison results including annotations and difference cards
     * Calls removeSemanticTextCompare() to remove comparison-added annotations
     * Clears the difference panel UI
     *
     * @private
     * @async
     * @returns {Promise<void>} Nothing
     */
    private async clearComparisonResults(): Promise<void> {
        // Remove annotations added by semantic text comparison
        if (this.leftViewer && this.rightViewer && this.leftViewerLoaded && this.rightViewerLoaded) {
            await this.leftViewer.removeSemanticTextCompare(this.rightViewer);
        }
        // Clear difference panel cards
        if (this.differencePanel && typeof this.differencePanel.updatePanel === 'function') {
            this.differencePanel.updatePanel({});
        }
        // Clear stored comparison result when paths change
        this.lastComparisonResult = null;
    }
    /**
     * Internal render method called by Component lifecycle
     * Sets up the PDF viewers and difference panel
     *
     * @private
     * @async
     * @returns {Promise<void>} Resolves after the viewers and comparison panel are initialized
     */
    private async renderInternal(): Promise<void> {
        // Prevent concurrent render calls
        if (this.isRenderingInProgress) {
            return;
        }
        this.isRenderingInProgress = true;
        // Create and initialize spinner for loading indicator
        this.createSpinnerElement();
        // Inject required modules
        PdfViewer.Inject(Magnification, Navigation, Annotation, TextSelection, FormFields);
        // Create left viewer
        this.leftViewer = new PdfViewer();
        (this.leftViewer as any).isVue = (this as any).isVue;
        (this.leftViewer as any).isVue3 = (this as any).isVue3;
        if (this.resourceUrl) {
            this.leftViewer.resourceUrl = this.resourceUrl;
        }
        if (this.originalDocumentPath) {
            this.leftViewer.documentPath = this.originalDocumentPath;
        }
        this.leftViewer.enableNavigationToolbar = false;
        this.leftViewer.enableToolbar = false;
        this.leftViewer.enableAnnotationToolbar = false;
        this.leftViewer.enableCommentPanel = false;
        if (this.locale !== '') {
            this.leftViewer.locale = this.locale;
        }
        // Register left viewer events
        this.setupLeftViewerEvents();
        // Attach left viewer to DOM
        this.leftViewer.appendTo(`#${this.leftViewerContainerId}`);
        const leftHeader: HTMLCollectionOf<Element> = document.getElementsByClassName('e-pv-pdf-comparer-header-left');
        if (leftHeader.length > 0) {
            leftHeader[0].textContent = this.leftViewer.localeObj.getConstant('Original Document');
        }
        const rightHeader: HTMLCollectionOf<Element> = document.getElementsByClassName('e-pv-pdf-comparer-header-right');
        if (rightHeader.length > 0) {
            rightHeader[0].textContent = this.leftViewer.localeObj.getConstant('Modified Document');
        }
        const panelHeader: HTMLCollectionOf<Element> = document.getElementsByClassName('e-pv-pdf-comparer-header-panel');
        if (panelHeader.length > 0) {
            panelHeader[0].textContent = this.leftViewer.localeObj.getConstant('Differences');
        }
        const showChangesBtnElement: HTMLElement | null = document.getElementById('pdf-comparer-show-changes-btn');
        if (showChangesBtnElement) {
            showChangesBtnElement.textContent = this.leftViewer.localeObj.getConstant('Show Changes');
        }
        // Create right viewer
        this.rightViewer = new PdfViewer();
        (this.rightViewer as any).isVue = (this as any).isVue;
        (this.rightViewer as any).isVue3 = (this as any).isVue3;
        if (this.resourceUrl) {
            this.rightViewer.resourceUrl = this.resourceUrl;
        }
        if (this.modifiedDocumentPath) {
            this.rightViewer.documentPath = this.modifiedDocumentPath;
        }
        this.rightViewer.enableNavigationToolbar = false;
        this.rightViewer.enableToolbar = false;
        this.rightViewer.enableAnnotationToolbar = false;
        this.rightViewer.enableCommentPanel = false;
        if (this.locale !== '') {
            this.rightViewer.locale = this.locale;
        }
        // Register right viewer events
        this.setupRightViewerEvents();
        // Attach right viewer to DOM
        this.rightViewer.appendTo(`#${this.rightViewerContainerId}`);
        // Create difference panel if enabled
        if (this.enableDifferencePanel) {
            this.differencePanel = new DifferencePanel(
                this.leftViewer,
                this.rightViewer,
                this.differencePanelContainerId,
                this.comparisonOptions
            );
            if (typeof this.differencePanel.renderPanel === 'function') {
                this.differencePanel.renderPanel();
            }
        }
        // Enable viewer synchronization if configured
        if (this.enableSyncScrolling) {
            this.leftViewer.syncViewers(this.rightViewer, true);
        }
        // Run semantic text comparison
        this.isRenderingInProgress = false;
    }
    /**
     * Performs semantic text comparison on the currently loaded PDF documents.
     *
     * Use this overload when both documents have already been loaded through
     * component initialization or a previous compare operation. The comparison
     * results are displayed in the difference panel and highlighted within the
     * synchronized PDF viewers.
     *
     * @remarks
     * Both PDF viewer instances must contain valid documents before invoking this method.
     *
     * @example
     * ```typescript
     * await comparer.compare();
     * ```
     *
     * @returns {Promise<void>} A promise that resolves after the comparison
     * operation is completed and the UI is updated with the detected differences.
     */
    public async compare(): Promise<void>;
    /**
     * Loads the specified documents and performs semantic text comparison.
     *
     * This overload allows documents to be provided dynamically at runtime.
     * Documents can be supplied as file URLs, Base64 document paths, or
     * Uint8Array byte data. Once loaded, the comparison is executed and the
     * results are rendered in both viewers and the difference panel.
     *
     * @remarks
     * Supports comparisons between:
     * - Two document URLs
     * - Two Uint8Array document streams
     * - A URL and a Uint8Array document stream
     *
     * @example
     * ```typescript
     * // Compare documents using URLs
     * await comparer.compare('document1.pdf', 'document2.pdf');
     * ```
     *
     * @example
     * ```typescript
     * // Compare documents using byte arrays
     * await comparer.compare(fileData1, fileData2);
     * ```
     *
     * @example
     * ```typescript
     * // Compare a URL with byte data
     * await comparer.compare('document1.pdf', fileData2);
     * ```
     *
     * @param {string | Uint8Array} originalDocument - Specifies the original PDF document to compare.
     *
     * @param {string | Uint8Array} modifiedDocument - Specifies the modified PDF document to compare.
     *
     * @returns {Promise<void>} - A promise that resolves after the documents are
     * loaded, compared, and the comparison results are displayed.
     */
    public async compare(originalDocument: string | Uint8Array, modifiedDocument: string | Uint8Array): Promise<void>;
    /**
     * Performs semantic text comparison between two PDF documents.
     *
     * This method compares the currently loaded documents or optionally loads
     * the specified documents before performing the comparison. Detected
     * additions, deletions, and modifications are highlighted in both viewers
     * and listed in the difference panel for review and navigation.
     *
     * @param {string | Uint8Array} [originalDocument] - Optional original PDF document source.
     *
     * @param {string | Uint8Array} [modifiedDocument] - Optional modified PDF document source.
     *
     * @returns {Promise<void>} A promise that resolves when the comparison
     * operation has completed successfully.
     */
    public async compare(originalDocument?: string | Uint8Array, modifiedDocument?: string | Uint8Array): Promise<void> {
        // Validate viewers are available
        if (!this.leftViewer) {
            return;
        }
        if (!this.rightViewer) {
            return;
        }
        // Clear previous differences before starting new comparison
        if (this.differencePanel && typeof this.differencePanel.updatePanel === 'function') {
            this.differencePanel.updatePanel({});
        }
        // Case 1: No parameters - compare currently loaded documents
        if (originalDocument === undefined && modifiedDocument === undefined) {
            // Perform semantic text comparison
            if (this.leftViewerLoaded && this.rightViewerLoaded) {
                // Show spinner to indicate comparison is starting
                this.showComparisonSpinner();
                const result: any = await this.leftViewer!.semanticTextCompare( this.rightViewer!, this.comparisonOptions );
                // Store comparison result for later restoration when panel is re-enabled
                this.lastComparisonResult = result;
                // Update difference panel with results if available
                if (this.differencePanel && typeof this.differencePanel.updatePanel === 'function') {
                    this.differencePanel.updatePanel(result);
                }
                // Hide spinner after comparison completes
                this.hideComparisonSpinner();
            }
        }
        // Case 2: Both parameters provided - load documents and compare
        else if (originalDocument !== undefined && modifiedDocument !== undefined) {
            // Enable auto-comparison when documents finish loading
            // This allows the comparison to run automatically after both docs load
            this.shouldAutoCompareOnLoad = true;
            // Reset load flags since we're loading new documents
            this.leftViewerLoaded = false;
            this.rightViewerLoaded = false;
            this.leftViewer.load(originalDocument, '');
            this.rightViewer.load(modifiedDocument, '');
        }
        else {
            this.showComparisonSpinner();
        }
    }
    /**
     * Sets up event handlers for left viewer
     * Tracks document load completion and failures
     *
     * @private
     * @returns {void} Nothing
     */
    private setupLeftViewerEvents(): void {
        if (!this.leftViewer) {
            return;
        }
        // Track successful document load
        this.leftViewer.documentLoad = async () => {
            this.leftViewerLoaded = true;
            await this.onBothViewersLoaded();
        };
        // Track document load failures
        this.leftViewer.documentLoadFailed = (args: any) => {
            this.isRenderingInProgress = false;
            // Hide spinner on load failure
            this.hideComparisonSpinner();
        };
    }
    /**
     * Sets up event handlers for right viewer
     * Tracks document load completion and failures
     *
     * @private
     * @returns {void} Nothing
     */
    private setupRightViewerEvents(): void {
        if (!this.rightViewer) {
            return;
        }
        // Track successful document load
        this.rightViewer.documentLoad = async () => {
            this.rightViewerLoaded = true;
            await this.onBothViewersLoaded();
        };
        // Track document load failures
        this.rightViewer.documentLoadFailed = (args: any) => {
            this.isRenderingInProgress = false;
            // Hide spinner on load failure
            this.hideComparisonSpinner();
        };
    }
    /**
     * Compares the documents after both viewers have completed loading
     * and updates the difference panel with the comparison result.
     * Hides the spinner after comparison completes.
     *
     * Only runs if shouldAutoCompareOnLoad flag is true, which is set only
     * when compare() is explicitly called. This prevents auto-comparison when
     * documents are loaded via path changes.
     *
     * @private
     * @async
     * @returns {Promise<void>} Resolves after comparison and panel update complete
     */
    private async onBothViewersLoaded(): Promise<void> {
        // Only run comparison if explicitly requested via compare() call
        if (!this.shouldAutoCompareOnLoad) {
            return;
        }
        if (this.leftViewerLoaded && this.rightViewerLoaded) {
            // Show spinner before comparison starts
            this.showComparisonSpinner();
            const result: any = await this.leftViewer!.semanticTextCompare( this.rightViewer!, this.comparisonOptions );
            // Store comparison result for later restoration when panel is re-enabled
            this.lastComparisonResult = result;
            // Update difference panel with results
            if (this.differencePanel && typeof this.differencePanel.updatePanel === 'function') {
                this.differencePanel.updatePanel(result);
            }
            // Hide spinner after comparison completes
            this.hideComparisonSpinner();
        }
    }
    /**
     * Open the mobile difference panel with animation
     * Only available in mobile mode
     *
     * @private
     * @returns {void} Nothing
     */
    private openMobilePanel(): void {
        if (!this.isMobileMode || !this.enableDifferencePanel) {
            return;
        }
        const panelContainer: HTMLElement | null = document.getElementById(this.differencePanelContainerId);
        if (panelContainer) {
            this.updateClassList(panelContainer, null, 'e-pv-hidden');
            this.isMobilePanelOpen = true;
            // Hide Show Changes button when panel is open
            const showChangesBtn: HTMLElement | null = document.getElementById('pdf-comparer-show-changes-btn');
            this.updateClassList(showChangesBtn, 'e-pv-hidden', null);
            const viewerContainer: HTMLElement | null = document.getElementById('pdf-comparer-viewers-container');
            this.updateClassList(viewerContainer, 'e-pv-hidden', null);
            const handleBackButton: (e: KeyboardEvent) => void = (e: KeyboardEvent): void => {
                if (e.key === 'Escape' || e.key === 'Backspace') {
                    e.preventDefault();
                    this.closeMobilePanel();
                }
            };
            document.addEventListener('keydown', handleBackButton, { once: true });
        }
    }
    /**
     * Close the mobile difference panel with animation
     * Only available in mobile mode
     *
     * @private
     * @returns {void} Nothing
     */
    private closeMobilePanel(): void {
        if (!this.isMobileMode || !this.enableDifferencePanel) {
            return;
        }
        const panelContainer: HTMLElement | null = document.getElementById(this.differencePanelContainerId);
        this.updateClassList(panelContainer, 'e-pv-hidden', null);
        this.isMobilePanelOpen = false;
        // Show Show Changes button when panel is closed
        const showChangesBtn: HTMLElement | null = document.getElementById('pdf-comparer-show-changes-btn');
        this.updateClassList(showChangesBtn, null, 'e-pv-hidden');
    }
    /**
     * Updates the class list of an element by adding and/or removing classes
     * Safely handles null/undefined parameters and checks class existence before modifications
     *
     * @private
     * @param {HTMLElement | null} element - The element to update (can be null)
     * @param {string | null} classToAdd - Class name to add (optional, can be null)
     * @param {string | null} classToRemove - Class name to remove (optional, can be null)
     * @returns {void}
     */
    private updateClassList(element: HTMLElement | null, classToAdd: string | null, classToRemove: string | null): void {
        // Silently return if element is null or undefined
        if (!element) {
            return;
        }
        // Silently return if both parameters are null or undefined
        if (!classToAdd && !classToRemove) {
            return;
        }
        // Add class if provided and not already present
        if (classToAdd && classToAdd.trim().length > 0) {
            if (!element.classList.contains(classToAdd)) {
                element.classList.add(classToAdd);
            }
        }
        // Remove class if provided and already present
        if (classToRemove && classToRemove.trim().length > 0) {
            if (element.classList.contains(classToRemove)) {
                element.classList.remove(classToRemove);
            }
        }
    }
    /**
     * Creates and initializes the spinner element for the comparison loading indicator
     * Appends the spinner container to the wrapper element
     *
     * @private
     * @returns {void}
     */
    private createSpinnerElement(): void {
        if (!this.wrapperElement) {
            return;
        }
        // Create spinner container div
        this.spinnerContainer = document.createElement('div');
        this.spinnerContainer.id = 'pdf-comparer-spinner-container';
        // Append spinner container to wrapper
        this.wrapperElement.appendChild(this.spinnerContainer);
        // Initialize EJ2 spinner
        createSpinner({ target: this.spinnerContainer, cssClass: 'e-spin-center' });
    }
    /**
     * Shows the loading spinner to indicate comparison is in progress
     *
     * @private
     * @returns {void}
     */
    private showComparisonSpinner(): void {
        if (this.spinnerContainer) {
            this.spinnerContainer.classList.add('e-pv-show-spinner');
            showSpinner(this.spinnerContainer);
        }
    }
    /**
     * Hides the loading spinner after comparison completes
     *
     * @private
     * @returns {void}
     */
    private hideComparisonSpinner(): void {
        if (this.spinnerContainer) {
            this.spinnerContainer.classList.remove('e-pv-show-spinner');
            hideSpinner(this.spinnerContainer);
        }
    }
    /**
     * Releases all resources used by the PdfComparer component and removes it from the DOM.
     *
     * Use this method when the component is no longer required to ensure proper cleanup
     * and prevent memory leaks. This method destroys all internal viewer instances,
     * removes event listeners, clears generated UI elements, and resets component state.
     *
     * @remarks
     * The destroy process performs the following actions:
     * - Disables synchronization between PDF viewers
     * - Destroys the original document viewer instance
     * - Destroys the modified document viewer instance
     * - Clears the difference panel and comparison results
     * - Removes dynamically created wrapper elements
     * - Detaches registered event listeners, including window resize handlers
     * - Releases internal object references
     * - Resets component state and flags
     * - Invokes the base component destroy lifecycle
     *
     * @example
     * ```typescript
     * const comparer = new PdfComparer();
     *
     * comparer.appendTo('#container');
     * await comparer.compare();
     *
     * // Cleanup when the component is no longer needed
     * comparer.destroy();
     * ```
     *
     * @returns {void}
     */
    public destroy(): void {
        // Disable viewer synchronization
        if (this.leftViewer && this.rightViewer) {
            this.leftViewer.syncViewers(this.rightViewer, false);
        }
        // Destroy left viewer
        if (this.leftViewer) {
            this.leftViewer.destroy();
            this.leftViewer = null;
        }
        // Destroy right viewer
        if (this.rightViewer) {
            this.rightViewer.destroy();
            this.rightViewer = null;
        }
        // Clear difference panel
        if (this.differencePanel) {
            // If DifferencePanel has destroy method, call it
            if (typeof this.differencePanel.destroy === 'function') {
                this.differencePanel.destroy();
            }
            this.differencePanel = null;
        }
        // Clear spinner container
        if (this.spinnerContainer) {
            this.spinnerContainer.remove();
            this.spinnerContainer = null;
        }
        // Clear wrapper element
        if (this.wrapperElement) {
            this.wrapperElement.innerHTML = '';
            this.wrapperElement.remove();
            this.wrapperElement = null;
        }
        // Reset state flags
        this.leftViewerLoaded = false;
        this.rightViewerLoaded = false;
        this.isRenderingInProgress = false;
        this.isMobilePanelOpen = false;
        // Remove resize listener
        if (this.resizeHandler) {
            window.removeEventListener('resize', this.resizeHandler);
            this.resizeHandler = null;
        }
        // Call parent Component destroy
        super.destroy();
    }
}
