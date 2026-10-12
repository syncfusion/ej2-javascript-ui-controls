import { CommentFilterSettings } from '../pdfviewer';
import { CommentStatus } from '../base/types';

/**
 * @hidden
 * Represents the return value of buildFilterPredicates().
 * Contains two predicates for filtering annotations.
 */
export interface FilterPredicates {
    /**
     * Predicate for comment panel filtering.
     * Includes reply thread logic for author filtering.
     */
    commentPredicate: (annotation: any) => boolean;

    /**
     * Predicate for document annotation rendering.
     * Simpler logic, no thread evaluation.
     */
    documentPredicate: (annotation: any) => boolean;
}

/**
 * @hidden
 * Builds filter predicates from a filter settings object.
 *
 * Returns two predicates:
 * 1. commentPredicate: For comment panel filtering (includes reply logic)
 * 2. documentPredicate: For document annotation filtering
 *
 * Both predicates are stateless, O(1) functions.
 *
 * @param {CommentFilterSettings} settings - Filter criteria
 * @returns {FilterPredicates} Object containing commentPredicate and documentPredicate
 */
export function buildFilterPredicates(settings: CommentFilterSettings): FilterPredicates {

    /**
     * Helper: Map measurement (calibrate) annotation user-facing names to internal indent identifiers.
     * Bidirectional: handles both user-facing names and internal identifiers.
     * @param {string} value - The measurement type value
     * @returns {string} - The mapped internal identifier (indent)
     */
    const mapMeasurementType: (value: string | any) => string = (value: string | any): string => {
        // Handle case when object is received for Radius
        if (typeof value === 'object' && value !== null) {
            if (value.PolygonRadius) {
                return value.PolygonRadius;
            }
        }

        // Handle string cases
        if (typeof value === 'string') {
            switch (value) {
            case 'Distance': return 'LineDimension';
            case 'Perimeter': return 'PolyLineDimension';
            case 'Area': return 'PolygonDimension';
            case 'Radius': return 'PolygonRadius';
            case 'Volume': return 'PolygonVolume';
            case 'Rectangle': return 'Square';
            // Also handle reverse mapping (internal identifiers pass through)
            case 'LineDimension':
            case 'PolyLineDimension':
            case 'PolygonDimension':
            case 'PolygonRadius':
            case 'PolygonVolume': return value;
            default: return value;
            }
        }
        return String(value);
    };
    /**
     * Helper: Pad a string with zeros to reach desired length.
     * Compatible with older ES versions.
     * @param {string} str - The string to pad
     * @param {number} length - The desired length
     * @returns {string} - The padded string
     */
    const padWithZeros: (str: string, length: number) => string = (str: string, length: number): string => {
        while (str.length < length) {
            str = '0' + str;
        }
        return str;
    };

    /**
     * Helper: Normalize color values to hexadecimal format.
     * Converts rgba(), rgb(), and other formats to hex for comparison.
     * @param {any} colorValue - The color value in any format (may be string, null, undefined, etc.)
     * @returns {string} - The color value in hex format
     */
    const normalizeColorToHex: (colorValue: any) => string = (colorValue: any): string => {
        // Type check: ensure colorValue is a string
        if (typeof colorValue !== 'string') {
            return '';
        }
        if (!colorValue || colorValue === '') {
            return '';
        }
        // Convert to string to be safe
        const colorStr: string = String(colorValue).trim();

        // If already in hex format, return as is
        if (colorStr.indexOf('#') === 0) {
            if (colorStr.length === 9) {
                return colorStr.substring(0, 7).toLowerCase();
            }
            return colorStr.toLowerCase();
        }

        // Handle rgba format: rgba(255, 0, 0, 0.5) or rgba(255,0,0,0.5)
        // eslint-disable-next-line security/detect-unsafe-regex
        const rgbaMatch: RegExpMatchArray | null = colorStr.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/i);
        if (rgbaMatch) {
            const r: string = padWithZeros(parseInt(rgbaMatch[1], 10).toString(16), 2);
            const g: string = padWithZeros(parseInt(rgbaMatch[2], 10).toString(16), 2);
            const b: string = padWithZeros(parseInt(rgbaMatch[3], 10).toString(16), 2);
            return ('#' + r + g + b).toLowerCase();
        }

        // If it's a named color or other format, try to return as-is lowercased
        return colorStr.toLowerCase();
    };

    /**
     * Helper: Get the annotation type using proper field lookup with fallback strategy.
     * Tries specific type fields first, then falls back to shapeAnnotationType.
     * Handles: Measurement, TextMarkup, FreeText, and Shape annotations.
     * Distinguishes between lines and arrows by checking lineHeadStart and lineHeadEnd.
     * @param {any} annotation - The annotation object
     * @returns {string} - The annotation type
     */
    const getAnnotationType: (annotation: any) => string = (annotation: any): string => {

        // PRIORITY ORDER: Check specific type fields, then fallback to shapeAnnotationType
        // 1. Check for Measurement/Calibrate annotations via indent field
        const indent: string | undefined = annotation.indent || annotation.Indent;
        if (indent) {
            // indent contains the internal identifier (e.g., "LineDimension")
            return indent;
        }

        // 2. Check for TextMarkup annotations (Highlight, Underline, Strikethrough)
        const textMarkupType: string | undefined = annotation.textMarkupAnnotationType || annotation.TextMarkupAnnotationType;
        if (textMarkupType) {
            return textMarkupType;
        }

        // 3. Check for FreeText annotations
        const freeTextType: string | undefined = annotation.freeTextAnnotationType || annotation.FreeTextAnnotationType;
        if (freeTextType) {
            return freeTextType;
        }

        // FALLBACK: Use shapeAnnotationType (catches Shape, Sticky, Stamp, etc.)
        const shapeType: string | undefined = annotation.shapeAnnotationType || annotation.ShapeAnnotationType || '';

        // 4. Special handling for Arrow annotation: distinguish arrows from lines
        // Arrows have shapeAnnotationType === 'line' but with lineHeadStart/lineHeadEnd !== "none"
        if (shapeType === 'Line' && annotation.lineHeadStart !== 'None' && annotation.lineHeadEnd !== 'None') {
            return 'Arrow';
        }
        return shapeType;
    };

    /**
     * Helper: Check if annotation matches filter criteria (ignoring replies).
     * Supports multiple annotation type systems with proper field lookup.
     * Handles: Shape, Sticky, Stamp, TextMarkup, FreeText, and Measurement annotations.
     * Used by both predicates.
     * @param {any} annotation - The annotation object to evaluate
     * @returns {boolean} - Returns true if annotation matches filter criteria
     */
    const matchesAnnotation: (annotation: any) => boolean = (annotation: any): boolean => {
        // Type filter with proper annotation type retrieval
        if (settings.type && Array.isArray(settings.type) && settings.type.length > 0) {
            const annotType: string = getAnnotationType(annotation);

            // Check if the annotation type matches any of the filter types
            let typeMatches: boolean = false;
            for (const filterType of settings.type) {
                // Map measurement type if needed (handles both user-facing and internal names)
                const mappedFilterType: string = mapMeasurementType(filterType);
                if (annotType === mappedFilterType || annotType === filterType) {
                    typeMatches = true;
                    break;
                }
            }
            if (!typeMatches) {
                return false;
            }
        }

        // Color filter with proper color normalization and field lookup
        if (settings.color && Array.isArray(settings.color) && settings.color.length > 0) {
            // Try to get color from various fields (different annotation types use different fields)
            const annotColorRaw: string =
                annotation.color || annotation.Color ||
                annotation.strokeColor || annotation.StrokeColor ||
                annotation.fillColor || annotation.FillColor ||
                annotation.fontColor || annotation.FontColor || '';

            // Normalize the annotation color to hex format
            const annotColor: string | undefined = normalizeColorToHex(annotColorRaw);

            // Normalize all filter colors to hex for comparison
            const normalizedFilterColors: string[] = settings.color.map((c: string) => normalizeColorToHex(c));
            if (!annotColor) {
                return false;
            }
            // Check if the normalized annotation color matches any of the filter colors
            if (annotColor && normalizedFilterColors.indexOf(annotColor) === -1) {
                return false;
            }
        }

        // Status filter (can be single value or array)
        if (settings.status && Array.isArray(settings.status) && settings.status.length > 0) {
            const annotStatus: string =
                annotation.state || annotation.State ||
                annotation.stateModel || annotation.StateModel || annotation.review.state ||
                'None';

            // Handle both single status value and array of status values
            let statusMatches: boolean = false;
            if (Array.isArray(settings.status)) {
                // If status is an array, check if annotation status is in the array
                statusMatches = settings.status.indexOf(annotStatus) !== -1;
            } else {
                // If status is a single value, compare directly
                statusMatches = annotStatus === settings.status;
            }
            if (!statusMatches) {
                return false;
            }
        }

        // Author filter (parent only, not considering replies)
        if (settings.author && Array.isArray(settings.author) && settings.author.length > 0) {
            const annotAuthor: string = annotation.author || annotation.Author || '';
            if (settings.author.indexOf(annotAuthor) === -1) {
                return false;
            }
        }

        // Modified date filter (collection-based, not range-based)
        if (settings.modifiedDate && Array.isArray(settings.modifiedDate) && settings.modifiedDate.length > 0) {
            const annotDate: string = annotation.modifiedDate || annotation.ModifiedDate || '';
            const annotDateOnly: string = new Date(annotDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
            const match: boolean = settings.modifiedDate.some((d: string) =>
                new Date(d).toDateString() === new Date(annotDate).toDateString()
            ) as any;
            if (!match) {
                return false;
            }
        }
        return true;
    };

    /**
     * Helper: Check if a reply (nested comment) matches thread-aware filter criteria.
     * Supports both lowercase and capitalized field names.
     * Checks author, status, and modifiedDate at reply level.
     * Used only when thread-aware filtering (author, status, or modifiedDate) is active.
     * @param {any} reply - The reply object to evaluate
     * @returns {boolean} - Returns true if the reply matches filter criteri
     */
    const replyMatchesFilter: (reply: any) => boolean = (reply: any): boolean => {

        //AUTHOR filter
        if (settings.author && Array.isArray(settings.author) && settings.author.length > 0) {
            const replyAuthor: string = reply.author || reply.Author || '';
            if (settings.author.indexOf(replyAuthor) === -1) {
                return false;
            }
        }

        //STATUS filter
        if (settings.status && Array.isArray(settings.status) && settings.status.length > 0) {
            const replyStatus: string =
                reply.state ||
                reply.State ||
                reply.stateModel ||
                reply.StateModel ||
                (reply.review && reply.review.state) ||
                'None';
            if (settings.status.indexOf(replyStatus) === -1) {
                return false;
            }
        }

        //DATE filter
        if (settings.modifiedDate && Array.isArray(settings.modifiedDate) && settings.modifiedDate.length > 0) {
            const replyDate: string = reply.modifiedDate || reply.ModifiedDate || '';
            const replyDateOnly: string = new Date(replyDate).toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            const match: boolean = settings.modifiedDate.some((d: string) => new Date(d).toDateString()
            === new Date(replyDate).toDateString());
            if (!match) {
                return false;
            }
        }
        return true;
    };

    /**
     * Helper: Check if a thread (parent + replies) should be displayed.
     * Used only in comment panel (not document) when thread-aware filters are active.
     * Thread-aware filters: author, status, modifiedDate.
     *
     * Implements includeReplies logic:
     *   - true: Show if parent matches OR any reply matches
     *   - false: Show only if parent matches
     *
     * Supports both lowercase and capitalized Comments/comments field names.
     * @param {any} annotation - The parent annotation (thread root) to evaluate
     * @returns {boolean} - Returns true if the thread should be displayed
     */
    const threadMatchesFilter: (annotation: any) => boolean = (annotation: any): boolean => {

        //STRICT TYPE filter (annotation only)
        if (settings.type && Array.isArray(settings.type) && settings.type.length > 0) {
            const annotType: string = getAnnotationType(annotation);
            let typeMatch: boolean = false;
            for (let i: number = 0; i < settings.type.length; i++) {
                // eslint-disable-next-line security/detect-object-injection
                const mappedFilterType: any = mapMeasurementType(settings.type[i]);
                // eslint-disable-next-line security/detect-object-injection
                if (annotType === mappedFilterType || annotType === settings.type[i]) {
                    typeMatch = true;
                    break;
                }
            }
            if (!typeMatch) {
                return false;
            }
        }

        //STRICT COLOR filter (annotation only)
        if (settings.color && Array.isArray(settings.color) && settings.color.length > 0) {
            const annotColorRaw: any =
                annotation.color || annotation.Color ||
                annotation.strokeColor || annotation.StrokeColor ||
                annotation.fillColor || annotation.FillColor ||
                annotation.fontColor || annotation.FontColor || '';
            const annotColor: string = normalizeColorToHex(annotColorRaw);
            const normalizedFilterColors: string[] = settings.color.map((c: string) =>
                normalizeColorToHex(c)
            );
            if (!annotColor || normalizedFilterColors.indexOf(annotColor) === -1) {
                return false;
            }
        }

        //STEP 3: check annotation-level filters (author/status/date)
        if (matchesAnnotation(annotation)) {
            return true;
        }

        // check replies (OR logic)
        const replies: any[] = annotation.comments || annotation.Comments || [];
        if (settings.includeReplies !== false && Array.isArray(replies)) {
            for (let i: number = 0; i < replies.length; i++) {
                // eslint-disable-next-line security/detect-object-injection
                const reply: any[] = replies[i];
                if (replyMatchesFilter(reply)) {
                    return true;
                }
            }
        }
        return false;
    };

    /**
     * Helper: Check if any thread-aware filter is active.
     * Thread-aware filters are: author, status, and modifiedDate.
     * These filters can match against replies when includeReplies is enabled.
     * @returns {boolean} Returns true if any thread-aware filter is active
     */
    const isThreadAwareFilterActive: () => boolean = (): boolean => {
        const hasAuthorFilter: boolean = settings.author && settings.author.length > 0;
        const hasStatusFilter: boolean = settings.status && Array.isArray(settings.status) && settings.status.length > 0;
        const hasModifiedDateFilter: boolean = settings.modifiedDate && settings.modifiedDate.length > 0;
        return !!(hasAuthorFilter || hasStatusFilter || hasModifiedDateFilter);
    };

    /**
     * Predicate for comment panel (includes reply thread logic)
     *
     * When thread-aware filtering is active (author, status, or modifiedDate),
     * uses thread logic (parent + replies).
     * Otherwise, uses simple annotation matching.
     *
     * Thread-aware filters include replies in results when includeReplies is enabled:
     *   - true: Show if parent matches OR any reply matches
     *   - false: Show only if parent matches
     * @param {any} annotation - The annotation (thread root) to evaluate
     * @returns {boolean} - Returns true if the annotation should be shown in the comment panel
     */
    const commentPredicate: (annotation: any) => boolean = (annotation: any): boolean => {
        // If any thread-aware filter is active, use thread logic
        if (isThreadAwareFilterActive()) {
            return threadMatchesFilter(annotation);
        }
        // Otherwise, just match the annotation
        return matchesAnnotation(annotation);
    };

    /**
     * Predicate for document annotations.
     *
     * When includeReplies is true and thread-aware filters are active,
     * use thread logic (parent + replies) to ensure consistency with comment panel.
     * Otherwise, use basic annotation matching.
     * @param {any} annotation - The annotation to evaluate
     * @returns {boolean} Returns true if the annotation should be include
     */
    const documentPredicate: (annotation: any) => boolean = (annotation: any): boolean => {
        // If includeReplies is enabled and thread-aware filters are active,
        // use thread logic to ensure document visibility matches comment panel
        if (settings.includeReplies !== false && isThreadAwareFilterActive()) {
            return threadMatchesFilter(annotation);
        }
        // Otherwise, just match the annotation
        return matchesAnnotation(annotation);
    };
    return {
        commentPredicate,
        documentPredicate
    };
}

/**
 * @hidden
 * Helper function to check if a filter is empty (no criteria set).
 * Used to determine if filtering is active.
 *
 * @param {CommentFilterSettings} settings - Filter settings to check
 * @returns {boolean} true if filter has no criteria, false otherwise
 */
export function isFilterEmpty(settings: CommentFilterSettings | null | undefined): boolean {
    if (!settings) {
        return true;
    }
    return (
        (!settings.type || settings.type.length === 0) &&
        (!settings.color || settings.color.length === 0) &&
        (!settings.status || (Array.isArray(settings.status) && settings.status.length === 0)) &&
        (!settings.author || settings.author.length === 0) &&
        (!settings.modifiedDate || settings.modifiedDate.length === 0)
    );
}
