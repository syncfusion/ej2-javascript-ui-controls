import { Button, CheckBox } from '@syncfusion/ej2-buttons';
import { PdfViewer, TextComparisonOptions } from '../index';

/**
 * Represents a grouped difference entry with both old and new documents
 * @hidden
 */
interface IGroupedDifference {
    textDiffId: number;
    diffType: 'Replaced' | 'Deleted' | 'Added';
    oldText?: string;
    newText?: string;
    pageNumber: number;
    oldBounds?: any;
    newBounds?: any;
}

/**
 * @hidden
 */
export class DifferencePanel {
    private containerElement: HTMLElement;
    private pdfViewer1: PdfViewer;
    private pdfViewer2: PdfViewer;
    private panelElement: HTMLElement | null = null;
    private sidebarElement: HTMLElement | null = null;
    private groupedDifferences: IGroupedDifference[] = [];
    public enableHighlights: boolean = true;
    private isVisible: boolean = true;
    private cachedComparisonResult: any = null;
    private closeBtn: Button | null = null;
    private highlightCheckBox: CheckBox | null = null;
    private comparisonOptions?: TextComparisonOptions;
    /**
     * Initialize the DifferencePanel
     * @param {PdfViewer} pdfViewer1 - First PDF viewer (original document)
     * @param {PdfViewer} pdfViewer2 - Second PDF viewer (modified document)
     * @param {string} containerId - ID of container element for the panel
     * @param {TextComparisonOptions} comparisonOptions - Optional semantic text comparison options with enableHighlights setting
     */
    constructor(pdfViewer1: PdfViewer, pdfViewer2: PdfViewer, containerId: string, comparisonOptions?: TextComparisonOptions) {
        this.pdfViewer1 = pdfViewer1;
        this.pdfViewer2 = pdfViewer2;
        this.comparisonOptions = comparisonOptions;
        const container: HTMLElement | null = document.getElementById(containerId);
        if (!container) {
            return;
        }
        this.containerElement = container;
    }

    /**
     * Update comparison options and dynamically update the highlight container visibility
     * Called when comparisonOptions property changes in PdfComparer
     *
     * @private
     * @param {TextComparisonOptions | undefined} newOptions - New comparison options
     * @returns {void}
     */
    public updateComparisonOptions(newOptions: TextComparisonOptions | undefined): void {
        // Update the stored comparison options
        this.comparisonOptions = newOptions;
        // Only proceed if panel is rendered and visible (not in mobile mode)
        if (!this.panelElement || !this.isVisible) {
            return;
        }
        // Check if in mobile mode - don't show highlight toggle in mobile
        const isMobilePanel: boolean = window.innerWidth <= 1024 ||
            (this.containerElement && this.containerElement.classList.contains('pdf-comparer-mobile-panel'));
        if (isMobilePanel) {
            return;
        }
        // Determine if highlight toggle should be shown
        const shouldShowHighlightToggle: boolean = ((newOptions && newOptions.enableHighlights !== false) || !newOptions);
        // Find existing highlight container
        const highlightContainer: HTMLElement | null = this.panelElement.querySelector('.e-pv-highlight-toggle-container');
        if (shouldShowHighlightToggle && !highlightContainer) {
            // Need to add the highlight container
            const newHighlightContainer: HTMLElement = this.createHighlightContainer();
            // Insert before the differences list
            const listContainer: HTMLElement | null = this.panelElement.querySelector('#differences-list');
            if (listContainer) {
                this.panelElement.insertBefore(newHighlightContainer, listContainer);
            } else {
                this.panelElement.appendChild(newHighlightContainer);
            }
        } else if (!shouldShowHighlightToggle && highlightContainer) {
            // Need to remove the highlight container
            highlightContainer.remove();
            // Destroy the CheckBox component if it exists
            if (this.highlightCheckBox) {
                this.highlightCheckBox.destroy();
                this.highlightCheckBox = null;
            }
        }
    }
    /**
     * Group differences by textDiffId and classify them using the new annotation-based result structure
     * @private
     * @param {any} result - SemanticTextCompareResult from semanticTextCompare() with
     * originalDocumentAnnotations and modifiedDocumentAnnotations
     * @returns {void}
     */
    private groupDifferences(result: any): void {
        this.groupedDifferences = [];
        // Create maps for quick lookup by textDiffId
        const oldAnnotationMap: Map<number, { textDiffData: string; annotation: any; pageNumber: number }> = new Map();
        const newAnnotationMap: Map<number, { textDiffData: string; annotation: any; pageNumber: number }> = new Map();
        // Populate maps from originalDocumentAnnotations (original document)
        if (result.originalDocumentAnnotations && result.originalDocumentAnnotations.length > 0) {
            result.originalDocumentAnnotations.forEach((pageAnnotations: any) => {
                pageAnnotations.differenceAnnotations.forEach((diffAnnotation: any) => {
                    oldAnnotationMap.set(diffAnnotation.textDiffId, {
                        annotation: diffAnnotation.annotation,
                        pageNumber: pageAnnotations.pageNumber,
                        textDiffData: diffAnnotation.textDiffData
                    });
                });
            });
        }
        // Populate maps from modifiedDocumentAnnotations (modified document)
        if (result.modifiedDocumentAnnotations && result.modifiedDocumentAnnotations.length > 0) {
            result.modifiedDocumentAnnotations.forEach((pageAnnotations: any) => {
                pageAnnotations.differenceAnnotations.forEach((diffAnnotation: any) => {
                    newAnnotationMap.set(diffAnnotation.textDiffId, {
                        annotation: diffAnnotation.annotation,
                        pageNumber: pageAnnotations.pageNumber,
                        textDiffData: diffAnnotation.textDiffData
                    });
                });
            });
        }
        // Get all unique textDiffIds
        const allDiffIds: Set<number> = new Set<number>([
            ...Array.from(oldAnnotationMap.keys()),
            ...Array.from(newAnnotationMap.keys())
        ]);
        // Group differences by textDiffId and classify them
        allDiffIds.forEach((textDiffId: number): void => {
            const oldEntry: { textDiffData: string; annotation: any; pageNumber: number } | undefined = oldAnnotationMap.get(textDiffId);
            const newEntry: { textDiffData: string; annotation: any; pageNumber: number } | undefined = newAnnotationMap.get(textDiffId);
            let diffType: 'Replaced' | 'Deleted' | 'Added';
            let groupedDiff: IGroupedDifference;
            if (oldEntry && newEntry) {
                // Both exist: Replaced
                diffType = 'Replaced';
                groupedDiff = {
                    textDiffId,
                    diffType,
                    oldText: oldEntry.textDiffData,
                    newText: newEntry.textDiffData,
                    pageNumber: oldEntry.pageNumber,
                    oldBounds: oldEntry.annotation.bounds,
                    newBounds: newEntry.annotation.bounds
                };
            } else if (oldEntry && !newEntry) {
                // Only in old: Deleted
                diffType = 'Deleted';
                groupedDiff = {
                    textDiffId,
                    diffType,
                    oldText: oldEntry.textDiffData,
                    pageNumber: oldEntry.pageNumber,
                    oldBounds: oldEntry.annotation.bounds
                };
            } else if (!oldEntry && newEntry) {
                // Only in new: Added
                diffType = 'Added';
                groupedDiff = {
                    textDiffId,
                    diffType,
                    newText: newEntry.textDiffData,
                    pageNumber: newEntry.pageNumber,
                    newBounds: newEntry.annotation.bounds
                };
            } else {
                return; // Should not happen
            }
            this.groupedDifferences.push(groupedDiff);
        });
        // Sort by pageNumber and textDiffId for consistent ordering
        this.groupedDifferences.sort((a: IGroupedDifference, b: IGroupedDifference): number => {
            if (a.pageNumber !== b.pageNumber) {
                return a.pageNumber - b.pageNumber;
            }
            return a.textDiffId - b.textDiffId;
        });
    }
    /**
     * Initialize and display the Difference Panel
     * @private
     * @returns {void}
     */
    public renderPanel(): void {
        // Create panel container
        this.panelElement = document.createElement('div');
        this.panelElement.id = 'difference-panel';
        this.panelElement.className = 'e-pv-panel-wrapper';
        // Check if in mobile mode (check window width and container position)
        const isMobilePanel: boolean = window.innerWidth <= 1024 ||
            (this.containerElement && this.containerElement.classList.contains('pdf-comparer-mobile-panel'));
        if (isMobilePanel) {
            // Create a dedicated header section outside the scrollable list so it stays visible in mobile mode
            const headerElement: HTMLDivElement = document.createElement('div');
            headerElement.className = 'e-pv-difference-panel-header';
            this.updateClassList(headerElement, 'e-pv-sticky', null);
            // Create close button element for Syncfusion Button
            const closeBtnElement: HTMLButtonElement = document.createElement('button');
            closeBtnElement.id = 'mobile-close-btn-element';
            closeBtnElement.className = 'e-pv-icon-btn';
            closeBtnElement.title = 'Close Panel';
            closeBtnElement.type = 'button';
            closeBtnElement.innerHTML = '<span class="e-icons e-close"></span>';
            // Initialize Syncfusion Button for close
            this.closeBtn = new Button({ cssClass: 'e-small e-icon-btn' }, closeBtnElement );
            closeBtnElement.addEventListener('click', (): void => this.handlePanelClose());
            const titleElement: HTMLHeadingElement = document.createElement('h3');
            titleElement.textContent = this.pdfViewer1.localeObj.getConstant('Differences');
            headerElement.appendChild(closeBtnElement);
            headerElement.appendChild(titleElement);
            this.panelElement.appendChild(headerElement);
        }
        // Create highlight toggle (desktop only)
        // Only render if enableHighlights is not explicitly false in comparisonOptions
        const showHighlightToggle: boolean = !isMobilePanel && (
            (this.comparisonOptions && this.comparisonOptions.enableHighlights !== false) ||
            !this.comparisonOptions
        );
        if (showHighlightToggle) {
            const highlightContainer: HTMLElement = this.createHighlightContainer();
            this.panelElement.appendChild(highlightContainer);
        }
        // Create differences list container. It is the only element that scrolls.
        const listContainer: HTMLDivElement = document.createElement('div');
        listContainer.id = 'differences-list';
        listContainer.className = 'e-pv-differences-list';
        // Populate differences
        this.groupedDifferences.forEach((diff: IGroupedDifference): void => {
            const diffCard: HTMLElement = this.createDifferenceCard(diff);
            listContainer.appendChild(diffCard);
        });
        this.panelElement.appendChild(listContainer);
        // Add to container
        this.containerElement.innerHTML = '';
        this.containerElement.appendChild(this.panelElement);
        this.isVisible = true;
    }
    /**
     * Create highlight toggle container
     * @private
     * @returns {HTMLElement} The highlight toggle container
     */
    private createHighlightContainer(): HTMLElement {
        const highlightContainer: HTMLDivElement = document.createElement('div');
        highlightContainer.className = 'e-pv-highlight-toggle-container';
        const highlightSwitchElement: HTMLInputElement = document.createElement('input');
        highlightSwitchElement.type = 'checkbox';
        highlightSwitchElement.id = 'highlight-changes-toggle';
        highlightContainer.appendChild(highlightSwitchElement);
        this.highlightCheckBox = new CheckBox({
            label: this.pdfViewer1.localeObj.getConstant('Highlight changes'),
            checked: this.enableHighlights,
            disabled: this.groupedDifferences.length === 0,
            change: (e: any): Promise<void> => this.onHighlightToggle(e)
        }, highlightSwitchElement );
        return highlightContainer;
    }
    /**
     * Create a single difference card element
     * @private
     * @param {IGroupedDifference} diff - Grouped difference to render
     * @returns {HTMLElement} The rendered difference card
     */
    private createDifferenceCard(diff: IGroupedDifference): HTMLElement {
        const card: HTMLDivElement = document.createElement('div');
        card.className = `e-pv-difference-card e-pv-diff-${diff.diffType.toLowerCase()}`;
        // Create header row with badge and page info
        const headerRow: HTMLDivElement = document.createElement('div');
        headerRow.className = 'e-pv-diff-header-row';
        // Type badge
        const badge: HTMLDivElement = document.createElement('div');
        badge.className = `e-pv-diff-badge e-pv-badge-${diff.diffType.toLowerCase()}`;
        badge.textContent = this.pdfViewer1.localeObj.getConstant(diff.diffType);
        // Page number info
        const pageInfo: HTMLDivElement = document.createElement('div');
        pageInfo.className = 'e-pv-diff-page-info';
        pageInfo.textContent = `${this.pdfViewer1.localeObj.getConstant('Page')} ${diff.pageNumber}`;
        headerRow.appendChild(badge);
        headerRow.appendChild(pageInfo);
        // Content area
        const content: HTMLDivElement = document.createElement('div');
        content.className = 'e-pv-diff-content';
        if (diff.diffType === 'Replaced') {
            const oldTextDiv: HTMLDivElement = document.createElement('div');
            oldTextDiv.className = 'e-pv-diff-old-text';
            oldTextDiv.innerHTML = `<del>${this.escapeHtml(diff.oldText || '')}</del>`;
            const newTextDiv: HTMLDivElement = document.createElement('div');
            newTextDiv.className = 'e-pv-diff-new-text';
            newTextDiv.innerHTML = `<span class="e-pv-added">${this.escapeHtml(diff.newText || '')}</span>`;
            content.appendChild(oldTextDiv);
            content.appendChild(newTextDiv);
        } else if (diff.diffType === 'Deleted') {
            const oldTextDiv: HTMLDivElement = document.createElement('div');
            oldTextDiv.className = 'e-pv-diff-old-text';
            oldTextDiv.innerHTML = `<del>${this.escapeHtml(diff.oldText || '')}</del>`;
            content.appendChild(oldTextDiv);
        } else if (diff.diffType === 'Added') {
            const newTextDiv: HTMLDivElement = document.createElement('div');
            newTextDiv.className = 'e-pv-diff-new-text';
            newTextDiv.innerHTML = `<span class="e-pv-added">${this.escapeHtml(diff.newText || '')}</span>`;
            content.appendChild(newTextDiv);
        }
        card.appendChild(headerRow);
        card.appendChild(content);
        // Add click handler for navigation
        card.addEventListener('click', (): void => this.navigateToDifference(diff));
        return card;
    }
    /**
     * Navigate both viewers to the difference location and select corresponding annotations
     * @private
     * @param {IGroupedDifference} diff - Difference to navigate to
     * @returns {void}
     */
    private navigateToDifference(diff: IGroupedDifference): void {
        // Navigate to the page
        if (this.pdfViewer1 && this.pdfViewer1.navigation) {
            this.pdfViewer1.navigation.goToPage(diff.pageNumber);
        }
        if (this.pdfViewer2 && this.pdfViewer2.navigation) {
            this.pdfViewer2.navigation.goToPage(diff.pageNumber);
        }
        // Select annotations only when highlights are enabled.
        if (this.enableHighlights) {
            this.selectAnnotationsByDiffId(diff.textDiffId, diff.diffType);
        }
    }
    /**
     * Find and select highlight annotations by textDiffId in both viewers
     * Handles three diff types: Added (only in new), Deleted (only in old), and Replaced (in both)
     * @private
     * @param {number} textDiffId - The unique identifier for the difference
     * @param {'Added' | 'Deleted' | 'Replaced'} diffType - Type of difference
     * @returns {void}
     */
    private selectAnnotationsByDiffId(textDiffId: number, diffType: 'Added' | 'Deleted' | 'Replaced'): void {
        if (!this.cachedComparisonResult) {
            return;
        }
        // Find annotations matching this textDiffId
        const oldAnnotation: any = this.findAnnotationByTextDiffId(textDiffId, this.cachedComparisonResult.originalDocumentAnnotations);
        const newAnnotation: any = this.findAnnotationByTextDiffId(textDiffId, this.cachedComparisonResult.modifiedDocumentAnnotations);
        // Clear any existing selections
        this.clearAllAnnotationSelections();
        // Select based on diff type
        if (diffType === 'Deleted' && oldAnnotation) {
            // Only deleted: select in viewer1 (original)
            // Find the actual annotationId by matching bounds (annotName ≠ annotationId for text markup)
            const annotationId: string | null = oldAnnotation.customData.annotationId;
            if (annotationId) {
                this.selectAnnotationInViewer(this.pdfViewer1, annotationId, oldAnnotation.pageNumber);
            }
        } else if (diffType === 'Added' && newAnnotation) {
            // Only added: select in viewer2 (modified)
            // Find the actual annotationId by matching bounds
            const annotationId: string | null = newAnnotation.customData.annotationId;
            if (annotationId) {
                this.selectAnnotationInViewer(this.pdfViewer2, annotationId, newAnnotation.pageNumber);
            }
        } else if (diffType === 'Replaced' && oldAnnotation && newAnnotation) {
            // Modified (replaced): select both versions in their respective viewers
            const oldAnnotationId: string | null = oldAnnotation.customData.annotationId;
            const newAnnotationId: string | null = newAnnotation.customData.annotationId;
            if (oldAnnotationId) {
                this.selectAnnotationInViewer(this.pdfViewer1, oldAnnotationId, oldAnnotation.pageNumber);
            }
            if (newAnnotationId) {
                this.selectAnnotationInViewer(this.pdfViewer2, newAnnotationId, newAnnotation.pageNumber);
            }
        }
    }
    /**
     * Find a highlight annotation in the cached result by textDiffId
     * @private
     * @param {number} textDiffId - The unique identifier for the difference
     * @param {any[]} pageAnnotations - Array of page annotation data to search
     * @returns {any} The annotation object if found, null otherwise
     */
    private findAnnotationByTextDiffId(textDiffId: number, pageAnnotations: any[]): any {
        if (!pageAnnotations || pageAnnotations.length === 0) {
            return null;
        }
        for (const pageData of pageAnnotations) {
            if (pageData.differenceAnnotations && pageData.differenceAnnotations.length > 0) {
                const found: any = pageData.differenceAnnotations.find((diffAnnotation: any) => diffAnnotation.textDiffId === textDiffId);
                if (found) {
                    // Return the annotation with page number attached
                    return {
                        ...found.annotation,
                        pageNumber: pageData.pageNumber,
                        textDiffId: textDiffId
                    };
                }
            }
        }
        return null;
    }
    /**
     * Select a highlight annotation in a specific viewer
     * @private
     * @param {any} viewer - The PdfViewer instance
     * @param {string} annotationId - The annotation ID to select
     * @param {number} pageNumber - The page number where the annotation is located
     * @returns {void}
     */
    private selectAnnotationInViewer(viewer: any, annotationId: string, pageNumber: number): void {
        if (!viewer || !viewer.annotationModule || !viewer.annotationModule.textMarkupAnnotationModule) {
            return;
        }
        // Get the text markup annotation collection for the page
        const annotations: any[] = viewer.annotationCollection || [];
        const annotation: any = annotations.find((ann: any): boolean => {
            const idMatches: boolean = ann.annotationId === annotationId ||
                (ann.customData && ann.customData.annotationId === annotationId);
            return idMatches && ann.pageNumber === pageNumber - 1;
        });
        if (annotation) {
            // Call the selectAnnotation API with programmatic flag
            // This method handles all UI updates including selection box, resizers, etc.
            const canvas: HTMLCanvasElement | null = viewer.annotationModule.textMarkupAnnotationModule.pdfViewerBase.getElement(
                '_blendAnnotationsIntoCanvas_' + (pageNumber - 1)
            ) || viewer.annotationModule.textMarkupAnnotationModule.pdfViewerBase.getAnnotationCanvas(
                '_annotationCanvas_', pageNumber - 1
            );
            if (canvas) {
                viewer.annotationModule.textMarkupAnnotationModule.selectAnnotation(annotation, canvas, pageNumber - 1, null, true);
            }
        }
    }
    /**
     * Clear all annotation selections in both viewers
     * @private
     * @returns {void}
     */
    private clearAllAnnotationSelections(): void {
        if (this.pdfViewer1 && this.pdfViewer1.clearSelection) {
            // Clear current page selection
            if (this.pdfViewer1.annotationModule &&
                this.pdfViewer1.annotationModule.textMarkupAnnotationModule &&
                this.pdfViewer1.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage !== undefined) {
                const pageIndex: number = this.pdfViewer1.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage;
                this.pdfViewer1.clearSelection(pageIndex);
            }
        }
        if (this.pdfViewer2 && this.pdfViewer2.clearSelection) {
            // Clear current page selection
            if (this.pdfViewer2.annotationModule &&
                this.pdfViewer2.annotationModule.textMarkupAnnotationModule &&
                this.pdfViewer2.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage !== undefined) {
                const pageIndex: number = this.pdfViewer2.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage;
                this.pdfViewer2.clearSelection(pageIndex);
            }
        }
    }
    /**
     * Handle highlight toggle change - add or remove comparison annotations
     * @private
     * @param {Event | Object} event - Toggle change event
     * @returns {Promise<void>} Resolves after highlight settings are applied
     */
    private async onHighlightToggle(event: Event | { checked?: boolean; target?: HTMLInputElement }): Promise<void> {
        const changeEvent: any = event as any;
        const checkedValue: boolean = typeof changeEvent.checked === 'boolean'
            ? changeEvent.checked
            : (changeEvent.target as HTMLInputElement | null)!.checked;
        this.enableHighlights = checkedValue;
        if (this.enableHighlights) {
            // Add annotations from cached comparison results
            this.addAnnotationsFromCache();
        } else {
            await this.pdfViewer1.removeSemanticTextCompare(this.pdfViewer2);
        }
    }
    /**
     * Handle mobile panel close
     * Hides the difference panel on mobile devices
     * @private
     * @returns {void}
     */
    private handlePanelClose(): void {
        // Find the panel container (could be by ID or by reference)
        let panelContainer: HTMLElement | null = document.getElementById('pdf-comparer-panel');
        if (!panelContainer) {
            panelContainer = this.containerElement;
        }
        if (panelContainer) {
            this.updateClassList(panelContainer, 'e-pv-hidden', null);
            // Show the Show Changes button again
            const showChangesBtn: HTMLElement | null = document.getElementById('pdf-comparer-show-changes-btn');
            this.updateClassList(showChangesBtn, null, 'e-pv-hidden');
            // Show the Viewers again
            const viewerContainer: HTMLElement | null = document.getElementById('pdf-comparer-viewers-container');
            this.updateClassList(viewerContainer, null, 'e-pv-hidden');
        }
    }
    /**
     * Update panel with new comparison results
     * @private
     * @param {any} result - Semantic text comparison result
     * @returns {void}
     */
    public updatePanel(result: any): void {
        // Cache the result for show/hide functionality
        this.cachedComparisonResult = result;
        if (this.comparisonOptions && this.comparisonOptions.enableHighlights === true) {
            this.enableHighlights = true;
        } else if (this.comparisonOptions && this.comparisonOptions.enableHighlights === false) {
            this.enableHighlights = false;
        }
        this.groupDifferences(result);
        this.renderPanel();
    }
    /**
     * Escape HTML special characters
     * @private
     * @param {string} text - Text to escape
     * @returns {string} Escaped HTML text
     */
    private escapeHtml(text: string): string {
        return text.replace(/[&<>"']/g, (match: string): string => {
            switch (match) {
            case '&': return '&amp;';
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '"': return '&quot;';
            default: return '&#039;';
            }
        });
    }
    /**
     * Add annotations from cached comparison results with rotation transformation
     * Retrieves annotations from semanticTextCompare() results and applies them to both viewers
     * @private
     * @returns {void} Adds cached comparison annotations to both viewers
     */
    private addAnnotationsFromCache(): void {
        if (!this.cachedComparisonResult) {
            return;
        }
        // Add annotations from originalDocumentAnnotations to pdfViewer1
        if (this.cachedComparisonResult.originalDocumentAnnotations &&
            this.cachedComparisonResult.originalDocumentAnnotations.length > 0) {
            this.cachedComparisonResult.originalDocumentAnnotations.forEach((pageAnnotations: any): void => {
                if (pageAnnotations.differenceAnnotations && pageAnnotations.differenceAnnotations.length > 0) {
                    pageAnnotations.differenceAnnotations.forEach((diffAnnotation: any): void => {
                        if (this.pdfViewer1 && typeof this.pdfViewer1.addAnnotation === 'function') {
                            this.pdfViewer1.annotation.addAnnotation('Highlight', diffAnnotation.annotation);
                        }
                    });
                }
            });
        }
        // Add annotations from modifiedDocumentAnnotations to pdfViewer2
        if (this.cachedComparisonResult.modifiedDocumentAnnotations &&
            this.cachedComparisonResult.modifiedDocumentAnnotations.length > 0) {
            this.cachedComparisonResult.modifiedDocumentAnnotations.forEach((pageAnnotations: any): void => {
                if (pageAnnotations.differenceAnnotations && pageAnnotations.differenceAnnotations.length > 0) {
                    pageAnnotations.differenceAnnotations.forEach((diffAnnotation: any): void => {
                        if (this.pdfViewer2 && typeof this.pdfViewer2.addAnnotation === 'function') {
                            this.pdfViewer2.annotation.addAnnotation('Highlight', diffAnnotation.annotation);
                        }
                    });
                }
            });
        }
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
     * Destroy the DifferencePanel and clean up resources
     * @private
     * @returns {void} Releases panel resources
     */
    public destroy(): void {
        this.clearAllAnnotationSelections();
        this.cachedComparisonResult = null;
        this.groupedDifferences = [];
        // Destroy Syncfusion component instances
        if (this.closeBtn) {
            this.closeBtn.destroy();
            this.closeBtn = null;
        }
        if (this.highlightCheckBox) {
            this.highlightCheckBox.destroy();
            this.highlightCheckBox = null;
        }
        if (this.panelElement) {
            this.panelElement.remove();
            this.panelElement = null;
        }
        if (this.sidebarElement) {
            this.sidebarElement.remove();
            this.sidebarElement = null;
        }
    }
}
