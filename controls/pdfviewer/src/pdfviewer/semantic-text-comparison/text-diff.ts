import { PdfViewerBase, PdfViewer, TextComparisonOptions, SemanticTextCompareResult } from '../index';
import { TextDiffAnalyzer } from './text-diff-analyzer';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * Provides core functionality for semantic text comparison between PDF documents.
 *
 * @hidden
 */
export class SemanticTextComparison {
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    private analyzer!: TextDiffAnalyzer;
    private isComparingInProgress: boolean = false;
    private isRemovalInProgress: boolean = false;

    /**
     * @param {PdfViewer} viewer - It describes about the viewer
     * @param {PdfViewerBase} viewerBase - It describes about the viewer base
     * @private
     */
    constructor(viewer: PdfViewer, viewerBase: PdfViewerBase) {
        this.pdfViewer = viewer;
        this.pdfViewerBase = viewerBase;
    }
    /**
     * Get all differences between two loaded PDF documents
     * Pure programmatic API - analyzes differences without rendering
     * Returns structured difference data that can be used by UI or external systems
     * @private
     * @async
     * @param {PdfViewer} targetViewer - Second PdfViewer instance with document loaded
     * @param {TextComparisonOptions} options - Optional settings to override defaults for this comparison only
     * @returns {Promise<SemanticTextCompareResult>} Promise resolving to structured result with
     * filtered differences and summary stats
     */
    public async semanticTextCompare(targetViewer: PdfViewer, options?: TextComparisonOptions): Promise<SemanticTextCompareResult> {
        try {
            if (this.isComparingInProgress) {
                throw new Error('Comparison already in progress. Wait for current operation to complete.');
            }
            this.isComparingInProgress = true;
            // Validation
            if (!this.pdfViewer || !targetViewer) {
                throw new Error('Both viewer instances must be provided for text comparison');
            }
            if (!this.pdfViewer.pageCount || this.pdfViewer.pageCount === 0) {
                throw new Error('First viewer document not loaded or is empty');
            }
            if (!targetViewer.pageCount || targetViewer.pageCount === 0) {
                throw new Error('Second viewer document not loaded or is empty');
            }
            // Clear previously added semantic text comparison annotations from both viewers
            await this.pdfViewer.removeSemanticTextCompare(targetViewer);
            // Merge options: use provided options with fallback to viewer settings
            const textComparisonOption: TextComparisonOptions = this.mergeSettings(options);
            // Initialize analyzer with viewer instances for text extraction and rotation transformation
            // Viewers are stored in the analyzer so they don't need to be passed to each method
            if (!this.analyzer) {
                this.analyzer = new TextDiffAnalyzer(
                    this.pdfViewer,
                    textComparisonOption,
                    this.pdfViewerBase,
                    this.pdfViewer,
                    targetViewer
                );
            }
            // Analyze documents using stored viewer instances
            // Annotations are rendered directly based on enableHighlights setting
            const structuredResult: SemanticTextCompareResult = await this.analyzer.analyzeDocuments(textComparisonOption);
            return structuredResult;
        } catch (error) {
            console.error('Text comparison failed:', error);
            throw error;
        } finally {
            this.isComparingInProgress = false;
        }
    }
    /**
     * Merge provided options with viewer's default textComparisonSettings
     * Options parameter takes priority over defaults
     * @private
     * @param {TextComparisonOptions} options - Optional comparison settings to merge
     * @returns {TextComparisonOptions} Merged options with defaults applied
     */
    private mergeSettings(options?: TextComparisonOptions): TextComparisonOptions {
        return {
            beforeColor: !options || isNullOrUndefined(options.beforeColor) ? 'red' : options.beforeColor,
            afterColor: !options || isNullOrUndefined(options.afterColor) ? 'green' : options.afterColor,
            beforeColorOpacity: !options || isNullOrUndefined(options.beforeColorOpacity) ? 0.4 : options.beforeColorOpacity,
            afterColorOpacity: !options || isNullOrUndefined(options.afterColorOpacity) ? 0.4 : options.afterColorOpacity,
            enableHighlights: !options || isNullOrUndefined(options.enableHighlights) ? true : options.enableHighlights
        } as TextComparisonOptions;
    }
    /**
     * Remove only the annotations added by semanticTextCompare() from both viewers
     * Preserves any other annotations that are unrelated to semantic text comparison
     * Checks customData.isSemanticTextComparison property to identify semantic annotations
     * @private
     * @async
     * @param {PdfViewer} targetViewer - The target PdfViewer instance to also clean annotations from
     * @returns {Promise<void>} Promise that resolves when annotations are removed from both viewers
     */
    public async removeSemanticTextCompare(targetViewer: PdfViewer): Promise<void> {
        try {
            if (this.isRemovalInProgress) {
                throw new Error('Removal already in progress. Wait for current operation to complete.');
            }
            this.isRemovalInProgress = true;
            if (!this.pdfViewer || !targetViewer) {
                throw new Error('Both viewer instances must be provided for removing semantic annotations');
            }
            if (!(targetViewer instanceof PdfViewer)) {
                throw new Error('targetViewer must be a valid PdfViewer instance');
            }
            if (!this.pdfViewer.pageCount || this.pdfViewer.pageCount === 0) {
                throw new Error('First viewer document not loaded or is empty');
            }
            if (!targetViewer.pageCount || targetViewer.pageCount === 0) {
                throw new Error('Second viewer document not loaded or is empty');
            }
            await this.removeSemanticAnnotations(this.pdfViewer);
            await this.removeSemanticAnnotations(targetViewer);
        } catch (error) {
            console.error('Failed to remove semantic annotations:', error);
            throw error;
        } finally {
            this.isRemovalInProgress = false;
        }
    }
    /**
     * Remove only comparison-generated annotations from a viewer
     * Preserves any other annotations that are unrelated to semanticTextCompare()
     * Filters based on customData.isSemanticTextComparison property
     * @private
     * @async
     * @param {PdfViewer} viewer - The viewer to remove semantic annotations from
     * @returns {Promise<void>} Promise that resolves when removal is complete
     */
    private async removeSemanticAnnotations(viewer: PdfViewer): Promise<void> {
        if (!viewer || !viewer.annotationModule || !viewer.annotationCollection) {
            return;
        }
        const annotationsToDelete: string[] = [];
        // Iterate through all annotations in annotationCollection
        const collections: any[] = viewer.annotationCollection;
        if (collections && collections.length > 0) {
            collections.forEach((annotation: any) => {
                // Check if annotation has isSemanticTextComparison flag
                if (annotation && annotation.customData && annotation.customData.isSemanticTextComparison) {
                    annotationsToDelete.push(annotation.annotationId);
                }
            });
        }
        // Delete collected semantic annotations using deleteAnnotationById
        if (annotationsToDelete.length > 0) {
            annotationsToDelete.forEach((annotationId: string) => {
                if (viewer.annotation) {
                    viewer.annotation.deleteAnnotationById(annotationId);
                }
            });
        }
    }
}
