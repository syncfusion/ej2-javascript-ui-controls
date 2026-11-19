import { PdfViewer, PdfViewerBase, TextComparisonOptions, HighlightSettings, SemanticTextCompareResult, ITextDiffAnnotation, IPageTextDiffAnnotations } from '../index';
import { TextDiffType } from '../base/types';
import { IAnnotationPoint } from '../annotation/annotation';

const WHITESPACE_REGEX: RegExp = /^[\s\r\n\t]+$/;
const LINE_THRESHOLD: number = 2; // pixels for grouping words on same line
const ROTATION_DEGREES: { [key: string]: number } = { '0': 0, '1': 90, '2': 180, '3': 270 };

/**
 * @hidden
 */
interface ILCSMatch {
    origIndex: number;
    modIndex: number;
}

/**
 * Provides internal text difference analysis for semantic PDF comparison.
 * @hidden
 */
export class TextDiffAnalyzer {
    private pdfViewer: PdfViewer;
    private pdfViewerBase?: PdfViewerBase;
    private sourceViewer: PdfViewer;
    private targetViewer: PdfViewer;
    private globalTextDiffIdCounter: number = 1;
    private textComparisonOption: TextComparisonOptions;
    private originalDocumentAnnotations: IPageTextDiffAnnotations[] = [];
    private modifiedDocumentAnnotations: IPageTextDiffAnnotations[] = [];
    private uniqueTextDiffIds: Set<number> = new Set<number>();

    constructor(
        viewer: PdfViewer,
        options: TextComparisonOptions,
        viewerBase?: PdfViewerBase,
        sourceViewer?: PdfViewer,
        targetViewer?: PdfViewer
    ) {
        this.pdfViewer = viewer;
        this.pdfViewerBase = viewerBase;
        this.sourceViewer = sourceViewer || viewer;
        this.targetViewer = targetViewer || viewer;
        this.textComparisonOption = options;
    }

    /**
     * Extract word-level text data from a PDF viewer.
     * @private
     * @param {PdfViewer} viewer - The viewer to extract data from.
     * @param {number} pageNumber - The page number to extract.
     * @returns {Promise<any>} Promise resolving to word data and bounds.
     */
    private async extractWordTextData(viewer: PdfViewer, pageNumber: number): Promise<any> {
        if (typeof (viewer as any).extractWordText === 'function') {
            const result: any = await (viewer as any).extractWordText(pageNumber);
            return result || { words: [], wordBounds: [] };
        }
        return { words: [], wordBounds: [] };
    }
    /**
     * Analyze two documents page-by-page for text differences.
     * @private
     * @async
     * @param {TextComparisonOptions} options - Text comparison options.
     * @returns {Promise<SemanticTextCompareResult>} Structured result with annotations.
     */
    public async analyzeDocuments(options: TextComparisonOptions): Promise<SemanticTextCompareResult> {
        this.textComparisonOption = options;
        // Initialize class variables
        this.originalDocumentAnnotations = [];
        this.modifiedDocumentAnnotations = [];
        this.uniqueTextDiffIds = new Set<number>();
        const pageCount: number = Math.min(this.sourceViewer.pageCount, this.targetViewer.pageCount);
        for (let pageNum: number = 0; pageNum < pageCount; pageNum++) {
            const textData1: any = await this.extractWordTextData(this.sourceViewer, pageNum);
            const textData2: any = await this.extractWordTextData(this.targetViewer, pageNum);
            await this.analyzePage(pageNum, textData1, textData2);
        }
        this.globalTextDiffIdCounter = 1;
        return {
            originalDocumentAnnotations: this.originalDocumentAnnotations,
            modifiedDocumentAnnotations: this.modifiedDocumentAnnotations,
            totalTextDiffCount: this.uniqueTextDiffIds.size
        };
    }
    /**
     * Analyze text differences on a specific page.
     * @private
     * @param {number} pageNumber - The current page number.
     * @param {any} originalData - Word and bounds data from the original document.
     * @param {any} modifiedData - Word and bounds data from the modified document.
     * @returns {Promise<void>} Promise resolving when page analysis completes.
     */
    private async analyzePage(
        pageNumber: number,
        originalData?: any,
        modifiedData?: any
    ): Promise<void> {
        if (!originalData || !originalData.words || !originalData.words.length ||
            !modifiedData || !modifiedData.words || !modifiedData.words.length) {
            const emptyAnnotations: { original: IPageTextDiffAnnotations; modified: IPageTextDiffAnnotations } =
                this.createEmptyPageAnnotations(pageNumber);
            if (emptyAnnotations.original.differenceAnnotations.length > 0) {
                this.originalDocumentAnnotations.push(emptyAnnotations.original);
            }
            if (emptyAnnotations.modified.differenceAnnotations.length > 0) {
                this.modifiedDocumentAnnotations.push(emptyAnnotations.modified);
            }
            return;
        }
        const { originalResults, modifiedResults, origIndexMap, modIndexMap }: {
            originalResults: ITextDiffAnnotation[];
            modifiedResults: ITextDiffAnnotation[];
            origIndexMap: Map<number, number>;
            modIndexMap: Map<number, number>;
        } = this.computePairedDifferences(
            originalData.words,
            modifiedData.words,
            originalData.wordBounds,
            modifiedData.wordBounds,
            pageNumber
        );
        // Group differences by type and proximity
        const groupedOriginalResults: ITextDiffAnnotation[] = this.groupConsecutiveDifferences(
            this.sourceViewer,
            pageNumber,
            originalResults,
            originalData.words,
            originalData.wordBounds,
            origIndexMap
        );
        const groupedModifiedResults: ITextDiffAnnotation[] = this.groupConsecutiveDifferences(
            this.targetViewer,
            pageNumber,
            modifiedResults,
            modifiedData.words,
            modifiedData.wordBounds,
            modIndexMap
        );
        if (groupedOriginalResults.length > 0) {
            this.originalDocumentAnnotations.push({ pageNumber: pageNumber + 1, differenceAnnotations: groupedOriginalResults });
        }
        if (groupedModifiedResults.length > 0) {
            this.modifiedDocumentAnnotations.push({ pageNumber: pageNumber + 1, differenceAnnotations: groupedModifiedResults });
        }
    }
    /**
     * Create empty page annotations.
     *
     * @private
     * @param {number} pageNumber - The current page number.
     * @returns {{ original: IPageTextDiffAnnotations, modified: IPageTextDiffAnnotations }} The empty page annotation containers.
     */
    private createEmptyPageAnnotations(pageNumber: number): { original: IPageTextDiffAnnotations; modified: IPageTextDiffAnnotations } {
        return {
            original: { pageNumber, differenceAnnotations: [] as ITextDiffAnnotation[] },
            modified: { pageNumber, differenceAnnotations: [] as ITextDiffAnnotation[] }
        };
    }
    /**
     * Compute paired differences using the LCS algorithm.
     *
     * @private
     * @param {string[]} originalWords - Words from the original document.
     * @param {string[]} modifiedWords - Words from the modified document.
     * @param {any[]} originalBounds - Word bounds from the original document.
     * @param {any[]} modifiedBounds - Word bounds from the modified document.
     * @param {number} pageNumber - The current page number.
     * @returns {{ originalResults: ITextDiffAnnotation[], modifiedResults: ITextDiffAnnotation[], origIndexMap: Map<number, number>, modIndexMap: Map<number, number> }} Object with original results, modified results, and index maps.
     */
    private computePairedDifferences(
        originalWords: string[],
        modifiedWords: string[],
        originalBounds: any[],
        modifiedBounds: any[],
        pageNumber: number
    ): {
            originalResults: ITextDiffAnnotation[];
            modifiedResults: ITextDiffAnnotation[];
            origIndexMap: Map<number, number>;
            modIndexMap: Map<number, number>;
        } {
        const matches: ILCSMatch[] = this.findLCSMatches(originalWords, modifiedWords);
        const ranges: Array<{ origStart: number; origEnd: number; modStart: number; modEnd: number }> =
            this.extractRangesBetweenMatches(matches, originalWords.length, modifiedWords.length);
        const originalResults: ITextDiffAnnotation[] = [];
        const modifiedResults: ITextDiffAnnotation[] = [];
        const origIndexMap: Map<number, number> = new Map();
        const modIndexMap: Map<number, number> = new Map();
        for (const range of ranges) {
            this.processRange(
                range, originalWords, modifiedWords, originalBounds, modifiedBounds, pageNumber,
                originalResults, modifiedResults, origIndexMap, modIndexMap
            );
        }
        return { originalResults, modifiedResults, origIndexMap, modIndexMap };
    }
    /**
     * Find LCS matches between two word arrays.
     *
     * @private
     * @param {string[]} original - Original array of words.
     * @param {string[]} modified - Modified array of words.
     * @returns {ILCSMatch[]} The LCS matches between the two arrays.
     */
    private findLCSMatches(original: string[], modified: string[]): ILCSMatch[] {
        const originalLength: number = original.length;
        const modifiedLength: number = modified.length;
        const matchMatrix: number[][] = Array.from({ length: originalLength + 1 }, () =>
            Array(modifiedLength + 1).fill(0)
        );
        for (let origRow: number = 1; origRow <= originalLength; origRow++) {
            for (let modRow: number = 1; modRow <= modifiedLength; modRow++) {
                const prevRow: number[] = matchMatrix[origRow - 1];
                const currRow: number[] = matchMatrix[parseInt(origRow.toString(), 10)];
                if (original[origRow - 1] === modified[modRow - 1]) {
                    currRow[parseInt(modRow.toString(), 10)] = prevRow[parseInt((modRow - 1).toString(), 10)] + 1;
                } else {
                    currRow[parseInt(modRow.toString(), 10)] = Math.max(prevRow[parseInt(modRow.toString(), 10)], currRow[modRow - 1]);
                }
            }
        }
        const matches: ILCSMatch[] = [];
        let origRow: number = originalLength;
        let modRow: number = modifiedLength;
        while (origRow > 0 && modRow > 0) {
            if (original[origRow - 1] === modified[modRow - 1]) {
                matches.unshift({ origIndex: origRow - 1, modIndex: modRow - 1 });
                origRow--;
                modRow--;
            } else {
                const prevRow: number[] = matchMatrix[origRow - 1];
                const currRow: number[] = matchMatrix[parseInt(origRow.toString(), 10)];

                if (prevRow[parseInt(modRow.toString(), 10)] > currRow[modRow - 1]) {
                    origRow--;
                } else {
                    modRow--;
                }
            }
        }
        return matches;
    }
    /**
     * Extract ranges between LCS matches.
     *
     * @private
     * @param {ILCSMatch[]} matches - LCS matches between original and modified words.
     * @param {number} origLength - Total count of original words.
     * @param {number} modLength - Total count of modified words.
     * @returns {Array<{ origStart: number, origEnd: number, modStart: number, modEnd: number }>} The extracted unmatched ranges.
     */
    private extractRangesBetweenMatches(
        matches: ILCSMatch[],
        origLength: number,
        modLength: number
    ): Array<{ origStart: number; origEnd: number; modStart: number; modEnd: number }> {
        const ranges: Array<{ origStart: number; origEnd: number; modStart: number; modEnd: number }> = [];
        if (matches.length === 0) {
            ranges.push({ origStart: 0, origEnd: origLength, modStart: 0, modEnd: modLength });
            return ranges;
        }
        if (matches[0].origIndex > 0 || matches[0].modIndex > 0) {
            ranges.push({ origStart: 0, origEnd: matches[0].origIndex, modStart: 0, modEnd: matches[0].modIndex });
        }
        for (let i: number = 0; i < matches.length - 1; i++) {
            const curr: ILCSMatch = matches[parseInt(i.toString(), 10)];
            const next: ILCSMatch = matches[i + 1];
            ranges.push({ origStart: curr.origIndex + 1, origEnd: next.origIndex, modStart: curr.modIndex + 1, modEnd: next.modIndex });
        }
        const lastMatch: ILCSMatch = matches[matches.length - 1];
        if (lastMatch.origIndex < origLength - 1 || lastMatch.modIndex < modLength - 1) {
            ranges.push({ origStart: lastMatch.origIndex + 1, origEnd: origLength, modStart: lastMatch.modIndex + 1, modEnd: modLength });
        }
        return ranges;
    }
    /**
     * Process a range to pair unmatched items and create annotations.
     *
     * @private
     * @param {{ origStart: number, origEnd: number, modStart: number, modEnd: number }} range - The range of unmatched words.
     * @param {string[]} originalWords - Words from the original document.
     * @param {string[]} modifiedWords - Words from the modified document.
     * @param {any[]} originalBounds - Word bounds from the original document.
     * @param {any[]} modifiedBounds - Word bounds from the modified document.
     * @param {number} pageNumber - The current page number.
     * @param {ITextDiffAnnotation[]} originalResults - Result array for original annotations.
     * @param {ITextDiffAnnotation[]} modifiedResults - Result array for modified annotations.
     * @param {Map<number, number>} origIndexMap - Mapping of original diff IDs to word indices.
     * @param {Map<number, number>} modIndexMap - Mapping of modified diff IDs to word indices.
     * @returns {void}
     */
    private processRange(
        range: { origStart: number; origEnd: number; modStart: number; modEnd: number },
        originalWords: string[],
        modifiedWords: string[],
        originalBounds: any[],
        modifiedBounds: any[],
        pageNumber: number,
        originalResults: ITextDiffAnnotation[],
        modifiedResults: ITextDiffAnnotation[],
        origIndexMap: Map<number, number>,
        modIndexMap: Map<number, number>
    ): void {
        const origRangeWords: string[] = originalWords.slice(range.origStart, range.origEnd);
        const modRangeWords: string[] = modifiedWords.slice(range.modStart, range.modEnd);
        const maxLen: number = Math.max(origRangeWords.length, modRangeWords.length);
        for (let k: number = 0; k < maxLen; k++) {
            const origWord: string | undefined = origRangeWords.slice(k, k + 1)[0] as string | undefined;
            const modWord: string | undefined = modRangeWords.slice(k, k + 1)[0] as string | undefined;
            const origIndex: number = range.origStart + k;
            const modIndex: number = range.modStart + k;
            if (origWord && modWord) {
                // Both exist: modified
                const textDiffId: number = this.globalTextDiffIdCounter++;
                origIndexMap.set(textDiffId, origIndex);
                modIndexMap.set(textDiffId, modIndex);
                const origBound: any = originalBounds[parseInt(origIndex.toString(), 10)];
                const modBound: any = modifiedBounds[parseInt(modIndex.toString(), 10)];
                const origAnnotation: ITextDiffAnnotation | null = this.createAnnotationFromBound(
                    origBound,
                    origWord,
                    textDiffId,
                    TextDiffType.Modified,
                    pageNumber,
                    this.textComparisonOption.beforeColor,
                    this.textComparisonOption.beforeColorOpacity,
                    this.sourceViewer
                );
                const modAnnotation: ITextDiffAnnotation | null = this.createAnnotationFromBound(
                    modBound,
                    modWord,
                    textDiffId,
                    TextDiffType.Modified,
                    pageNumber,
                    this.textComparisonOption.afterColor,
                    this.textComparisonOption.afterColorOpacity,
                    this.targetViewer
                );
                if (origAnnotation) {
                    originalResults.push(origAnnotation);
                }
                if (modAnnotation) {
                    modifiedResults.push(modAnnotation);
                }
            } else if (origWord) {
                // Only original: deleted
                const textDiffId: number = this.globalTextDiffIdCounter++;
                origIndexMap.set(textDiffId, origIndex);
                const origBound: any = originalBounds[parseInt(origIndex.toString(), 10)];
                const origAnnotation: ITextDiffAnnotation | null = this.createAnnotationFromBound(
                    origBound,
                    origWord,
                    textDiffId,
                    TextDiffType.Deleted,
                    pageNumber,
                    this.textComparisonOption.beforeColor,
                    this.textComparisonOption.beforeColorOpacity,
                    this.sourceViewer
                );
                if (origAnnotation) {
                    originalResults.push(origAnnotation);
                }
            } else {
                // Only modified: added
                const textDiffId: number = this.globalTextDiffIdCounter++;
                modIndexMap.set(textDiffId, modIndex);
                const modBound: any = modifiedBounds[parseInt(modIndex.toString(), 10)];
                const modText: string = modWord as string;
                const modAnnotation: ITextDiffAnnotation | null = this.createAnnotationFromBound(
                    modBound,
                    modText,
                    textDiffId,
                    TextDiffType.Added,
                    pageNumber,
                    this.textComparisonOption.afterColor,
                    this.textComparisonOption.afterColorOpacity,
                    this.targetViewer
                );
                if (modAnnotation) {
                    modifiedResults.push(modAnnotation);
                }
            }
        }
    }
    /**
     * Merge a group of consecutive differences.
     *
     * @private
     * @param {PdfViewer} viewer - The source viewer instance.
     * @param {number} pageNumber - The current page number.
     * @param {ITextDiffAnnotation[]} group - Difference annotations to merge.
     * @returns {ITextDiffAnnotation | null} The merged annotation group or null.
     */
    private mergeGroup(
        viewer: PdfViewer,
        pageNumber: number,
        group: ITextDiffAnnotation[]
    ): ITextDiffAnnotation | null {
        if (group.length === 1) {
            const item: ITextDiffAnnotation = group[0];
            const mergedText: string = item.textDiffData;
            if (WHITESPACE_REGEX.test(mergedText)) {
                return null;
            }
            this.uniqueTextDiffIds.add(item.textDiffId);
            if (this.textComparisonOption.enableHighlights && (viewer as any).annotation) {
                if (!item.annotation.customData) {
                    item.annotation.customData = {};
                }
                (item.annotation.customData as any).isSemanticTextComparison = true;
                const annotationModule: any = (viewer as any).annotation;
                annotationModule.addAnnotation('Highlight', item.annotation);
                const annotationCollection: any[] = (viewer as any).annotationCollection;
                if (annotationCollection && annotationCollection.length > 0) {
                    const lastAnnotation: any = annotationCollection[annotationCollection.length - 1];
                    if (lastAnnotation) {
                        (item.annotation.customData as any).annotationId = lastAnnotation.annotationId;
                    }
                }
            }
            return item;
        }
        // Find the first Modified type in the group if it exists, otherwise use the first item
        const modifiedInGroup: ITextDiffAnnotation | undefined = group.find(
            (item: ITextDiffAnnotation) => item.textDiffType === TextDiffType.Modified
        );
        const first: ITextDiffAnnotation = modifiedInGroup || group[0];
        const mergedText: string = group.map((r: ITextDiffAnnotation) => r.textDiffData).join(' ');
        if (WHITESPACE_REGEX.test(mergedText)) {
            return null;
        }
        this.uniqueTextDiffIds.add(first.textDiffId);
        const allBounds: IAnnotationPoint[] = [];
        for (const item of group) {
            if (item.annotation.bounds && Array.isArray(item.annotation.bounds)) {
                allBounds.push(...item.annotation.bounds);
            }
        }
        const lineGroupedBounds: IAnnotationPoint[] = this.groupBoundsByLine(allBounds);
        const mergedAnnotation: HighlightSettings = {
            ...first.annotation,
            bounds: lineGroupedBounds.length > 0 ? lineGroupedBounds : (first.annotation.bounds || [])
        } as HighlightSettings;
        const result: ITextDiffAnnotation = {
            textDiffId: first.textDiffId,
            textDiffType: first.textDiffType,
            textDiffData: mergedText,
            annotation: mergedAnnotation
        };
        if (this.textComparisonOption.enableHighlights && (viewer as any).annotation) {
            if (!result.annotation.customData) {
                result.annotation.customData = {};
            }
            (result.annotation.customData as any).isSemanticTextComparison = true;
            const annotationModule: any = (viewer as any).annotation;
            annotationModule.addAnnotation('Highlight', result.annotation);
            const annotationCollection: any[] = (viewer as any).annotationCollection;
            if (annotationCollection && annotationCollection.length > 0) {
                const lastAnnotation: any = annotationCollection[annotationCollection.length - 1];
                if (lastAnnotation) {
                    (result.annotation.customData as any).annotationId = lastAnnotation.annotationId;
                }
            }
        }
        return result;
    }
    /**
     * Group consecutive differences by type with optional whitespace bridging.
     *
     * @private
     * @param {PdfViewer} viewer - The source viewer instance.
     * @param {number} pageNumber - The current page number.
     * @param {ITextDiffAnnotation[]} differences - Text differences to group.
     * @param {string[]} wordData - Word text data for the page.
     * @param {any[]} boundsData - Word bounds data for the page.
     * @param {Map<number, number>} indexMap - Mapping of diff IDs to word indices.
     * @returns {ITextDiffAnnotation[]} The grouped text differences.
     */
    private groupConsecutiveDifferences(
        viewer: PdfViewer,
        pageNumber: number,
        differences: ITextDiffAnnotation[],
        wordData: string[],
        boundsData: any[],
        indexMap: Map<number, number>
    ): ITextDiffAnnotation[] {
        if (!differences || differences.length === 0) {
            return differences;
        }
        const grouped: ITextDiffAnnotation[] = [];
        let currentGroup: ITextDiffAnnotation[] = [];
        for (let i: number = 0; i < differences.length; i++) {
            const current: ITextDiffAnnotation = differences[parseInt(i.toString(), 10)];
            if (currentGroup.length > 0) {
                const lastInGroup: ITextDiffAnnotation = currentGroup[currentGroup.length - 1];
                const currentValue: number | undefined = indexMap.get(current.textDiffId);
                const lastValue: number | undefined = indexMap.get(lastInGroup.textDiffId);
                const currentIndex: number = currentValue !== undefined ? currentValue : current.textDiffId;
                const lastIndex: number = lastValue !== undefined ? lastValue : lastInGroup.textDiffId;
                const indexGap: number = currentIndex - lastIndex;
                if (indexGap === 1) {
                    currentGroup.push(current);
                } else if (indexGap === 2) {
                    const missingIndex: number = lastIndex + 1;
                    const gapWord: string | undefined = wordData[parseInt(missingIndex.toString(), 10)];
                    if (gapWord && WHITESPACE_REGEX.test(gapWord)) {
                        const missingBound: any = boundsData[parseInt(missingIndex.toString(), 10)];
                        if (missingBound) {
                            const bounds: IAnnotationPoint = {
                                x: missingBound.X || 0,
                                y: missingBound.Y || 0,
                                width: missingBound.Width || 0,
                                height: missingBound.Height || 0
                            };
                            const pageRotation: number = this.getPageRotation(viewer, pageNumber);
                            const rotatedBound: IAnnotationPoint = this.transformBoundsByRotation(bounds, pageRotation);
                            const spaceTextDiffId: number = this.globalTextDiffIdCounter++;
                            indexMap.set(spaceTextDiffId, missingIndex);
                            // Find the first Modified type in the group to get its properties
                            const modifiedInGroup: ITextDiffAnnotation | undefined = currentGroup.find(
                                (item: ITextDiffAnnotation) => item.textDiffType === TextDiffType.Modified
                            );
                            const referenceItem: ITextDiffAnnotation = modifiedInGroup || lastInGroup;
                            const spaceHighlightSettings: HighlightSettings = {
                                pageNumber: referenceItem.annotation.pageNumber,
                                bounds: [rotatedBound],
                                color: referenceItem.annotation.color,
                                author: 'SemanticComparison',
                                opacity: referenceItem.annotation.opacity,
                                isLock: false,
                                isPrint: true
                            } as HighlightSettings;
                            const spaceRecord: ITextDiffAnnotation = {
                                textDiffId: spaceTextDiffId,
                                textDiffType: referenceItem.textDiffType,
                                textDiffData: gapWord,
                                annotation: spaceHighlightSettings
                            };
                            currentGroup.push(spaceRecord);
                            currentGroup.push(current);
                        } else {
                            const mergedGroup: ITextDiffAnnotation | null = this.mergeGroup(viewer, pageNumber, currentGroup);
                            if (mergedGroup) {
                                grouped.push(mergedGroup);
                            }
                            currentGroup = [current];
                        }
                    } else {
                        const mergedGroup: ITextDiffAnnotation | null = this.mergeGroup(viewer, pageNumber, currentGroup);
                        if (mergedGroup) {
                            grouped.push(mergedGroup);
                        }
                        currentGroup = [current];
                    }
                } else {
                    const mergedGroup: ITextDiffAnnotation | null = this.mergeGroup(viewer, pageNumber, currentGroup);
                    if (mergedGroup) {
                        grouped.push(mergedGroup);
                    }
                    currentGroup = [current];
                }
            } else {
                currentGroup.push(current);
            }
        }
        if (currentGroup.length > 0) {
            const mergedGroup: ITextDiffAnnotation | null = this.mergeGroup(viewer, pageNumber, currentGroup);
            if (mergedGroup) {
                grouped.push(mergedGroup);
            }
        }
        return grouped;
    }
    /**
     * Get page rotation in degrees.
     *
     * @private
     * @param {PdfViewer} viewer - Viewer instance containing page size data.
     * @param {number} pageNumber - The page number to query.
     * @returns {number} The page rotation in degrees.
     */
    private getPageRotation(viewer: PdfViewer, pageNumber: number): number {
        if (!viewer.viewerBase) {
            return 0;
        }
        const pageSize: any = (viewer.viewerBase as any).pageSize;
        const pageDetails: any = pageSize[parseInt(pageNumber.toString(), 10)];
        const rotationValue: any = pageDetails.rotation;
        return rotationValue !== undefined
            ? ROTATION_DEGREES[rotationValue as keyof typeof ROTATION_DEGREES] || 0
            : 0;
    }
    /**
     * Apply rotation transformation to bounds.
     *
     * @private
     * @param {IAnnotationPoint} bounds - The annotation bounds to transform.
     * @param {number} rotation - Rotation angle in degrees.
     * @returns {IAnnotationPoint} The transformed bounds.
     */
    private transformBoundsByRotation(bounds: IAnnotationPoint, rotation: number): IAnnotationPoint {
        if (!bounds || rotation === 0) {
            return bounds;
        }
        const { x, y, width, height } = bounds;
        switch (rotation) {
        case 90:
            return { x: x - height, y, width: height, height: width };
        case 180:
            return { x: x - width, y: y - height, width, height };
        case 270:
            return { x, y: y - width, width: height, height: width };
        default:
            return bounds;
        }
    }
    /**
     * Group bounds by line (Y-coordinate proximity).
     *
     * @private
     * @param {IAnnotationPoint[]} boundsArray - Array of annotation bounds.
     * @returns {IAnnotationPoint[]} Grouped bounding rectangles by line.
     */
    private groupBoundsByLine(boundsArray: IAnnotationPoint[]): IAnnotationPoint[] {
        if (!boundsArray.length) {
            return [];
        }
        if (boundsArray.length === 1) {
            return boundsArray;
        }
        const lineGroups: Map<number, IAnnotationPoint[]> = new Map();
        for (const bound of boundsArray) {
            const y: number = bound.y || 0;
            const lineY: number | undefined = Array.from(lineGroups.keys()).find((key: number) => Math.abs(y - key) <= LINE_THRESHOLD);
            if (lineY !== undefined) {
                lineGroups.get(lineY)!.push(bound);
            } else {
                lineGroups.set(y, [bound]);
            }
        }
        return Array.from(lineGroups.values()).map((boundsOnLine: IAnnotationPoint[]) => {
            let minX: number = Infinity;
            let minY: number = Infinity;
            let maxRight: number = -Infinity;
            let maxBottom: number = -Infinity;
            for (const { x = 0, y = 0, width = 0, height = 0 } of boundsOnLine) {
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxRight = Math.max(maxRight, x + width);
                maxBottom = Math.max(maxBottom, y + height);
            }
            return {
                x: minX === Infinity ? 0 : minX,
                y: minY === Infinity ? 0 : minY,
                width: (maxRight === -Infinity || minX === Infinity) ? 0 : maxRight - minX,
                height: (maxBottom === -Infinity || minY === Infinity) ? 0 : maxBottom - minY
            };
        });
    }
    /**
     * Create annotation from raw bound data and text.
     *
     * @private
     * @param {any} bound - Raw bound object containing X, Y, Width, and Height.
     * @param {string} text - The text for the annotation.
     * @param {number} textDiffId - Unique ID for the text difference.
     * @param {TextDiffType} diffType - The type of text difference.
     * @param {number} pageNumber - The page number for the annotation.
     * @param {string} color - Highlight color for the annotation.
     * @param {number} opacity - Highlight opacity for the annotation.
     * @param {PdfViewer} viewer - Viewer instance used to determine page rotation.
     * @returns {ITextDiffAnnotation | null} The created annotation object or null.
     */
    private createAnnotationFromBound(
        bound: any,
        text: string,
        textDiffId: number,
        diffType: TextDiffType,
        pageNumber: number,
        color: string,
        opacity: number,
        viewer: PdfViewer
    ): ITextDiffAnnotation | null {
        if (!bound) {
            return null;
        }
        const annotationPoint: IAnnotationPoint = {
            x: bound.X || 0,
            y: bound.Y || 0,
            width: bound.Width || 0,
            height: bound.Height || 0
        };
        const pageRotation: number = this.getPageRotation(viewer, pageNumber);
        const rotatedBound: IAnnotationPoint = this.transformBoundsByRotation(annotationPoint, pageRotation);
        const highlightSettings: HighlightSettings = {
            pageNumber: pageNumber + 1,
            bounds: [rotatedBound],
            color: color,
            author: 'SemanticComparison',
            opacity: opacity,
            isLock: false,
            isPrint: true
        } as HighlightSettings;
        return {
            textDiffId,
            textDiffType: diffType,
            textDiffData: text,
            annotation: highlightSettings
        };
    }
}
