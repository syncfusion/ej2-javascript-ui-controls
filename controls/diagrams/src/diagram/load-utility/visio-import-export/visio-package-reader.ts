import { IImportingEventArgs } from '../..';
import { ensureArray, isObject, hasKey } from './visio-core';
import { ParsingContext } from './visio-import-export';
import {
    DocumentSettingsElement,
    MasterElement,
    VisioPageContent,
    ParsedXmlObject,
    VisioDocumentStructure,
    VisioPageMetadata,
    WindowRootElement,
    XmlRelationship,
    VisioConnectElement
} from './visio-types';
import { MinimalZipReader, ZipEntry, xmlToJsObject } from './zipReader';

/**
 * Resolves a relationship Target into a canonical ZIP path.
 *
 * Normalizes slashes, trims leading slashes, and resolves "." and ".." segments
 * against the given base directory using a stack-based algorithm. Preserves paths
 * already under "visio/" as-is.
 *
 * This function is essential for resolving relative relationship targets in OPC
 * (Open Packaging Convention) packages, ensuring all paths are canonical and
 * normalized to use forward slashes.
 *
 * @param {string} baseDir - The base directory path for relative resolution (e.g., "visio/pages").
 *                           Should not have a trailing slash.
 * @param {string} target - The relationship target path to normalize (e.g., "../masters/master1.xml").
 *                          May be relative (../, ./), absolute under visio/, or a direct file reference.
 * @returns {string} The canonical ZIP path (e.g., "visio/masters/master1.xml").
 *
 * @example
 * normalizeZipPath("visio/pages", "../masters/master1.xml")
 * // Returns: "visio/masters/master1.xml"
 *
 * normalizeZipPath("visio/pages/_rels", "../page1.xml.rels")
 * // Returns: "visio/pages/page1.xml.rels"
 *
 * @private
 */
function normalizeZipPath(baseDir: string, target: string): string {
    // ==================== Normalize Base Directory ====================
    // Remove backslashes, leading/trailing slashes to create clean base path
    const base: string = baseDir.replace(/\\/g, '/').replace(/^\/+/, '').replace(/\/+$/, '');

    // ==================== Normalize Target ====================
    // Remove backslashes and leading slashes from target
    const t: string = target.replace(/\\/g, '/').replace(/^\/+/, '');

    // ==================== Already Absolute ====================
    // If target already starts with "visio/", return as-is (absolute path in archive)
    if (/^visio\//i.test(t)) { return t; }

    // ==================== Build Stack for Path Resolution ====================
    // Split base into segments and filter empty strings
    const stack: string[] = base.split('/').filter(function (s: string): boolean { return !!s; });

    // Split target into segments and filter empty strings
    const parts: string[] = t.split('/').filter(function (s: string): boolean { return !!s; });

    // ==================== Process Path Segments ====================
    // Process each segment in target, handling . and .. navigation
    for (let i: number = 0; i < parts.length; i += 1) {
        const p: string = parts[parseInt(i.toString(), 10)];

        // Current directory reference - skip
        if (p === '.') { continue; }

        // Parent directory reference - pop from stack if available
        if (p === '..') {
            if (stack.length > 0) { stack.pop(); }
        }
        // Regular segment - push onto stack
        else {
            stack.push(p);
        }
    }

    // ==================== Return Canonical Path ====================
    return stack.join('/');
}

/**
 * Returns the parent directory of a normalized ZIP path.
 *
 * Extracts the directory portion of a given path by finding the last forward slash.
 * Assumes input is already normalized (forward slashes, no trailing slash).
 *
 * @param {string} path - The normalized ZIP path (e.g., "visio/pages/page1.xml").
 *                        Should use forward slashes and not have trailing slash.
 * @returns {string} The parent directory path (e.g., "visio/pages").
 *                   Returns empty string if no directory separator found.
 *
 * @example
 * dirname("visio/pages/page1.xml") // Returns: "visio/pages"
 * dirname("visio/document.xml")    // Returns: "visio"
 * dirname("file.xml")              // Returns: ""
 *
 * @private
 */
function dirname(path: string): string {
    // ==================== Normalize Path ====================
    // Convert backslashes to forward slashes and remove trailing slashes
    const norm: string = path.replace(/\\/g, '/').replace(/\/+$/, '');

    // ==================== Find Last Directory Separator ====================
    // Search for last forward slash to find directory boundary
    const idx: number = norm.lastIndexOf('/');

    // ==================== Return Result ====================
    // If no separator found, return empty string (root level)
    // Otherwise return everything up to (but not including) the last separator
    return idx === -1 ? '' : norm.slice(0, idx);
}

/**
 * Safely extracts the list of Page entries from a parsed pages.xml object.
 *
 * The parsed pages.xml may have different structures depending on the XML parser:
 * - Root structure: { Pages: { Page: [...] } }
 * - Flattened structure: { Page: [...] }
 * - Empty/missing: { }
 *
 * This function handles all variants and returns a consistent array.
 *
 * @param {ParsedXmlObject} pagesJsObj - The parsed pages.xml as a JavaScript object.
 *                                       Expected to have Pages element containing Page children.
 * @returns {VisioPageMetadata[]} An array of page metadata entries or empty array if none found.
 *                                Each entry represents a page index record with $ attributes.
 *
 * @example
 * const pages = getPagesArray(parsedPagesXml);
 * pages.forEach(page => {
 *     console.log(page.$.ID); // Page ID
 *     console.log(page.$.Name); // Page name
 * });
 *
 * @private
 */
function getPagesArray(pagesJsObj: ParsedXmlObject): VisioPageMetadata[] {
    // ==================== Extract Pages Root ====================
    // Start with the object, then drill down to Pages if it exists
    let pagesRoot: ParsedXmlObject = pagesJsObj;
    if (hasKey(pagesJsObj, 'Pages')) {
        pagesRoot = (pagesJsObj as ParsedXmlObject)['Pages'] as any;
    }

    // ==================== Extract Page Elements ====================
    // Look for Page element(s) within the root
    let pageNode: unknown = undefined;
    if (hasKey(pagesRoot, 'Page')) {
        pageNode = (pagesRoot as ParsedXmlObject)['Page'];
    }

    // ==================== Return Array ====================
    // ensureArray converts single items to [item] and handles undefined
    return ensureArray(pageNode ? pageNode : []) as VisioPageMetadata[];
}

/**
 * Safely extracts the list of Relationship entries from a parsed .rels XML file.
 *
 * The parsed .rels file may have different structures:
 * - Root structure: { Relationships: { Relationship: [...] } }
 * - Flattened structure: { Relationship: [...] }
 * - Empty/missing: { }
 *
 * This function handles all variants and returns a consistent array.
 *
 * @param {ParsedXmlObject} relsJsObj - The parsed .rels file as a JavaScript object.
 *                                      Expected to have Relationships element with Relationship children.
 * @returns {XmlRelationship[]} An array of relationship entries or empty array if none found.
 *                              Each entry has $ attributes with Id, Type, Target, etc.
 *
 * @example
 * const relationships = getRelationshipsArray(parsedRelsXml);
 * relationships.forEach(rel => {
 *     console.log(rel.$.Id);     // Relationship ID
 *     console.log(rel.$.Target); // Target file path
 * });
 *
 * @private
 */
function getRelationshipsArray(relsJsObj: ParsedXmlObject): XmlRelationship[] {
    // ==================== Extract Relationships Root ====================
    // Start with the object, then drill down to Relationships if it exists
    let relsRoot: ParsedXmlObject = relsJsObj;
    if (hasKey(relsJsObj, 'Relationships')) {
        relsRoot = (relsJsObj as ParsedXmlObject)['Relationships'] as any;
    }

    // ==================== Extract Relationship Elements ====================
    // Look for Relationship element(s) within the root
    let relNode: unknown = undefined;
    if (hasKey(relsRoot, 'Relationship')) {
        relNode = (relsRoot as ParsedXmlObject)['Relationship'];
    }

    // ==================== Return Array ====================
    // ensureArray converts single items to [item] and handles undefined
    return ensureArray(relNode ? relNode : []) as XmlRelationship[];
}

/**
 * Finds a ZIP entry by exact path name.
 *
 * Performs a linear search through the entries array to locate a matching path.
 * This is a simple utility for locating ZIP file entries by their exact names.
 *
 * @param {ZipEntry[]} entries - The array of available ZIP entries to search through.
 * @param {string} path - The exact path to search for (e.g., "visio/pages/pages.xml").
 *                        Must match exactly (case-sensitive).
 * @returns {ZipEntry | undefined} The matching ZipEntry if found, undefined otherwise.
 *
 * @example
 * const entry = findEntry(zipEntries, "visio/document.xml");
 * if (entry) {
 *     const data = await zip.extract(entry);
 * }
 *
 * @private
 */
function findEntry(entries: ZipEntry[], path: string): ZipEntry | undefined {
    // ==================== Linear Search ====================
    // Iterate through entries looking for exact path match
    for (let i: number = 0; i < entries.length; i += 1) {
        const e: ZipEntry = entries[parseInt(i.toString(), 10)];
        if (e.name === path) { return e; }
    }
    // ==================== Not Found ====================
    return undefined;
}

/**
 * Traverses OPC (Open Packaging Convention) relationships and collects dependent parts.
 *
 * Performs a breadth-first search starting from a .rels file, with a maximum depth limit
 * to prevent runaway inclusion and infinite loops. This function only collects targets
 * under "visio/" directory and ignores external parts. For each discovered part, if a
 * sibling .rels file exists, it is queued for traversal.
 *
 * The traversal follows the OPC package model where relationships define dependencies
 * between parts, allowing discovery of all transitively required XML parts like themes,
 * masters, fonts, and data parts.
 *
 * @param {MinimalZipReader} zip - The ZIP reader instance for extracting and parsing .rels files.
 * @param {ZipEntry[]} visioEntries - All "visio/" entries available in the VSDX archive.
 *                                    Used to check for existence before adding to results.
 * @param {string} startRelsPath - The starting relationships part path to traverse from
 *                                (e.g., "visio/pages/_rels/page1.xml.rels").
 * @param {number} maxDepth - Maximum relationship nesting depth to traverse (e.g., 3).
 *                            Prevents infinite recursion and controls inclusion depth.
 * @param {ParsingContext} context - Parser context for collecting non-fatal warnings.
 *                                   Used to log parsing failures and missing relationships.
 * @returns {Promise<Set<string>>} A Promise resolving to a Set of canonical ZIP paths discovered
 *                                 during breadth-first traversal. Paths are normalized and
 *                                 only include entries that exist in visioEntries.
 *
 * @example
 * const deps = await collectDependencies(
 *     zip,
 *     visioEntries,
 *     "visio/pages/_rels/page1.xml.rels",
 *     3,
 *     context
 * );
 * // Returns Set containing paths like "visio/theme/theme1.xml", "visio/masters/master1.xml"
 *
 * @private
 */
async function collectDependencies(
    zip: MinimalZipReader,
    visioEntries: ZipEntry[],
    startRelsPath: string,
    maxDepth: number,
    context: ParsingContext
): Promise<Set<string>> {
    // ==================== Initialize BFS Queue and Tracking ====================
    // Queue contains tuples of (relsPath, currentDepth) for breadth-first traversal
    const toVisit: Array<{ relsPath: string; depth: number }> = [{ relsPath: startRelsPath, depth: 0 }];

    // Track which .rels files we've already processed to avoid cycles
    const visitedRels: Set<string> = new Set<string>();

    // Accumulate discovered part paths
    const collected: Set<string> = new Set<string>();

    // ==================== Breadth-First Traversal ====================
    while (toVisit.length > 0) {
        const item: { relsPath: string; depth: number } = toVisit.shift();
        if (!item) { break; }

        const relsPath: string = item.relsPath;
        const depth: number = item.depth;

        // ==================== Skip if Already Visited ====================
        // Prevent reprocessing the same .rels file
        if (visitedRels.has(relsPath)) { continue; }
        visitedRels.add(relsPath);

        // ==================== Extract and Parse .rels File ====================
        const relsEntry: ZipEntry = findEntry(visioEntries, relsPath);
        if (!relsEntry) { continue; }

        let relsJs: ParsedXmlObject | undefined;
        try {
            // Extract binary data from ZIP
            const data: any = await zip.extract(relsEntry);

            // Decode as UTF-8 text
            const text: string = new TextDecoder('utf-8').decode(data);

            // Parse XML using browser DOMParser
            const doc: Document = new DOMParser().parseFromString(text, 'text/xml');

            // Convert DOM to JS object
            relsJs = xmlToJsObject(doc.documentElement) as ParsedXmlObject;
        } catch (_e) {
            // Log non-fatal parsing error and continue with next item
            context.addWarning('[ERROR] :: Failed to parse relationships: ' + relsPath);
            continue;
        }

        // ==================== Extract Relationships ====================
        const rels: XmlRelationship[] = getRelationshipsArray(relsJs);

        // Get base directory for resolving relative paths
        // Remove the _rels directory to get the base (e.g., "visio/pages/_rels/..." -> "visio/pages")
        const baseDir: string = dirname(relsPath).replace(/\/_rels$/, '');

        // ==================== Process Each Relationship ====================
        for (let i: number = 0; i < rels.length; i += 1) {
            const rel: XmlRelationship = rels[parseInt(i.toString(), 10)];

            // Skip invalid relationships
            if (!rel || !rel.$ || typeof rel.$.Target !== 'string') { continue; }

            // ==================== Normalize Target Path ====================
            // Resolve relative paths like "../theme/theme1.xml" to canonical paths
            const resolved: string = normalizeZipPath(baseDir, rel.$.Target);

            // ==================== Filter to Visio Parts Only ====================
            // Only include parts under visio/ directory (exclude external parts and not selected page)
            if (!/^visio\//i.test(resolved) || /(?:^|\/)page\d+\.xml$/i.test(resolved)) { continue; }

            // ==================== Add to Collected ====================
            const partEntry: ZipEntry | undefined = findEntry(visioEntries, resolved);
            if (partEntry) {
                collected.add(resolved);

                // ==================== Queue .rels Traversal ====================
                // If depth limit not reached, traverse this part's .rels file if it exists
                if (depth < maxDepth) {
                    // Split path to find parent directory and file name
                    const split: string[] = resolved.split('/');
                    const base: string = split.slice(0, split.length - 1).join('/');
                    const file: string = split[split.length - 1] || '';

                    // Construct path to .rels file for this part
                    const relsCandidate: string = base + '/_rels/' + file + '.rels';

                    // Queue for traversal if it exists
                    if (findEntry(visioEntries, relsCandidate)) {
                        toVisit.push({ relsPath: relsCandidate, depth: depth + 1 });
                    }
                }
            }
        }
    }

    return collected;
}

/**
 * Reads and aggregates Visio XML parts from a VSDX (ZIP) package.
 *
 * This class is the main entry point for reading VSDX files. It:
 * - Resolves the requested non-background page via relationship ID
 * - Normalizes relationship target paths
 * - Follows .rels files to include dependent parts (themes, masters, media, etc.)
 * - Parses only XML parts and retains binary parts separately
 * - Designed for browser runtimes (uses TextDecoder and DOMParser)
 *
 * The VSDX format is based on OPC (Open Packaging Convention), which uses
 * relationships to define dependencies between parts. This reader traverses
 * those relationships to collect all required files.
 *
 * @private
 */
export class VisioPackageReader {
    // Task #1004826: Force-include additional parts (e.g., background page contents).
    // Set keeps it deduped and fast to check.
    private extraIncludeParts: Set<string> = new Set<string>();

    /**
     * Reads a VSDX ArrayBuffer and returns a consolidated VisioDocumentStructure for the chosen page.
     *
     * This is the main public entry point. It:
     * 1. Validates the VSDX file structure
     * 2. Identifies non-background pages from pages.xml
     * 3. Triggers an import event for page selection
     * 4. Resolves the selected page via relationships
     * 5. Delegates to buildVisioDocumentStructure for part collection and parsing
     *
     * Errors are logged as warnings in the context, and import events are triggered
     * to allow caller-side cancellation or page selection.
     *
     * @param {ArrayBuffer} arrayBuffer - The VSDX file content as an ArrayBuffer.
     *                                    Must be a valid ZIP archive with Visio structure.
     * @param {ParsingContext} [context] - Collector for non-fatal warnings and event dispatching.
     *                                     If not provided, warnings will be lost.
     * @param {number} [pageIndex=0] - Zero-based index of the non-background page to extract.
     *                                Defaults to 0; if out of range, selects the last available page.
     * @returns {Promise<VisioDocumentStructure | null>} A Promise resolving to the consolidated document structure
     *                                                    or null if fatal errors occur.
     *
     * @example
     * const reader = new VisioPackageReader();
     * const vsdxBuffer = await fetch('diagram.vsdx').then(r => r.arrayBuffer());
     * const structure = await reader.readPackage(vsdxBuffer, context, 0);
     * if (structure) {
     *     console.log(structure.Page); // Page content
     *     console.log(structure.Master); // Master definitions
     * }
     *
     * @private
     */
    public async readPackage(
        arrayBuffer: ArrayBuffer,
        context: ParsingContext,
        pageIndex: number = 0
    ): Promise<VisioDocumentStructure | null> {
        this.extraIncludeParts = new Set<string>();
        // ==================== Define Helper Functions ====================

        /**
         * Safely gets a string attribute from an object.
         *
         * @param {ParsedXmlObject | undefined} obj - The object to get attribute from.
         * @param {string} name - The attribute name.
         * @returns {string} The attribute value or empty string if not found.
         */
        function getAttr(obj: ParsedXmlObject | undefined, name: string): string {
            if (obj && Object.prototype.hasOwnProperty.call(obj, name)) {
                const v: unknown = obj[`${name}`];
                if (typeof v === 'string') { return v; }
            }
            return '';
        }

        /**
         * Gets a string attribute and converts to lowercase.
         *
         * @param {object} obj - The object to get attribute from.
         * @param {string} name - The attribute name.
         * @returns {string} The lowercased attribute value or empty string.
         */
        function getAttrLower(obj: { [k: string]: unknown } | undefined, name: string): string {
            const val: string = getAttr(obj, name);
            return val.toLowerCase();
        }

        /**
         * Determines if a page is a background page.
         *
         * Background pages are templates shared across multiple pages.
         * We only want to load non-background pages.
         *
         * @param {VisioPageMetadata} page - The page metadata to check.
         * @returns {boolean} True if page is a background page, false otherwise.
         */
        function isBackground(page: VisioPageMetadata): boolean {
            const attrs: ParsedXmlObject = page.$;
            const bgFlag: string = getAttrLower(attrs, 'Background');
            const bgPageFlag: string = getAttrLower(attrs, 'BackgroundPage');
            return bgFlag === '1' || bgFlag === 'true' || bgPageFlag === '1' || bgPageFlag === 'true';
        }

        /**
         * Extracts the relationship ID (r:id or rId) from a page metadata.
         *
         * The r:id attribute links the page index entry to its actual page file.
         *
         * @param {VisioPageMetadata} page - The page metadata.
         * @returns {string} The relationship ID or empty string if not found.
         */
        function getPageRelId(page: VisioPageMetadata): string {
            if (page) {
                const maybeRel: { $?: { [k: string]: string[] } } = (page as { Rel?: { $?: { [k: string]: string[] } } }).Rel;
                if (maybeRel && maybeRel.$) {
                    const rid: string = getAttr(maybeRel.$, 'r:id');
                    if (rid) { return rid; }
                    const ridAlt: string = getAttr(maybeRel.$, 'rId'); // some parsers drop namespace colon
                    if (ridAlt) { return ridAlt; }
                }
            }
            return '';
        }

        try {
            // ==================== Initialize ZIP Reader ====================
            const zip: MinimalZipReader = new MinimalZipReader(arrayBuffer);
            const allEntries: ZipEntry[] = zip.getEntries();

            // ==================== Validate ZIP Structure ====================
            if (!allEntries || allEntries.length === 0) {
                context.addWarning('[ERROR] :: VSDX file is empty or corrupted.');
                context.triggerEvent('Import', { status: 'failed' });
                return null;
            }

            // ==================== Filter to Visio Entries ====================
            // Only include entries under visio/ directory (exclude root-level OPC metadata)
            const visioEntries: ZipEntry[] = allEntries.filter(function (entry: ZipEntry): boolean {
                return entry.name.startsWith('visio/') && !entry.name.endsWith('/');
            });

            if (visioEntries.length === 0) {
                context.addWarning('[ERROR] :: Visio folder not found in VSDX file.');
                context.triggerEvent('Import', { status: 'failed' });
                return null;
            }

            // ==================== Extract Core Files ====================
            // pages.xml lists all pages; pages.xml.rels maps pages to their content files
            const pagesXmlEntry: ZipEntry = findEntry(visioEntries, 'visio/pages/pages.xml');
            const pagesRelsEntry: ZipEntry = findEntry(visioEntries, 'visio/pages/_rels/pages.xml.rels');

            if (!pagesXmlEntry || !pagesRelsEntry) {
                context.addWarning('[ERROR] :: Core files pages.xml or pages.xml.rels not found.');
                context.triggerEvent('Import', { status: 'failed' });
                return null;
            }

            // ==================== Parse pages.xml and pages.xml.rels ====================
            const pagesJsObj: ParsedXmlObject = await this.extractAndParseXml(zip, pagesXmlEntry);
            const relsJsObj: ParsedXmlObject = await this.extractAndParseXml(zip, pagesRelsEntry);

            // ==================== Extract Non-Background Pages ====================
            const pageMetas: VisioPageMetadata[] = getPagesArray(pagesJsObj);
            const nonBgPages: VisioPageMetadata[] = [];
            const pagesForSelection: { name: string }[] = [];

            // Filter to non-background pages and prepare UI selection list
            for (let i: number = 0; i < pageMetas.length; i += 1) {
                const p: VisioPageMetadata = pageMetas[parseInt(i.toString(), 10)];
                if (!p || !p.$) { continue; }
                if (isBackground(p)) { continue; }

                nonBgPages.push(p);

                // Build human-readable label for page
                const attrs: ParsedXmlObject = p.$ as ParsedXmlObject;
                const idStr: string = typeof attrs['ID'] === 'string' ? String(attrs['ID']) :
                    typeof attrs['Id'] === 'string' ? String(attrs['Id']) : '';
                const nameStr: string = typeof attrs['Name'] === 'string' ? String(attrs['Name']) :
                    typeof attrs['NameU'] === 'string' ? String(attrs['NameU']) : '';
                const label: string = (nameStr && nameStr.trim().length > 0) ? nameStr : (idStr || '');
                if (label) {
                    pagesForSelection.push({ name: label });
                } else {
                    pagesForSelection.push({ name: 'Page ' + String(pagesForSelection.length + 1) });
                }
            }

            // Task #1004826-EXT: Fallback if no foreground (non-background) pages exist.
            // Instead of failing, pick the first background page so background-only files render.
            let selectedByFallbackBg: VisioPageMetadata | null = null;
            if (nonBgPages.length === 0) {
                const firstBackground: VisioPageMetadata | undefined = (pageMetas || [])
                    .find(
                        (p: VisioPageMetadata) =>
                            p && p.$ && isBackground(p)
                    );
                if (firstBackground) {
                    selectedByFallbackBg = firstBackground;
                    // Make the fallback visible to downstream selection logic by seeding nonBgPages
                    // (so code that indexes into nonBgPages still works without special cases).
                    nonBgPages.push(firstBackground);
                    // Also add a UI item label for consistency (optional; keep if your UI uses pagesForSelection)
                    const attrs: Record<string, unknown> = firstBackground.$ as Record<string, unknown>;
                    let displayName: string;
                    if (attrs && typeof attrs['Name'] === 'string') {
                        displayName = attrs['Name'] as string;
                    } else if (attrs && typeof attrs['NameU'] === 'string') {
                        displayName = attrs['NameU'] as string;
                    } else {
                        const count: number = (pagesForSelection && pagesForSelection.length) ? pagesForSelection.length : 0;
                        displayName = 'Page ' + String(count + 1);
                    }
                    pagesForSelection.push({ name: displayName });
                } else {
                    // Truly no pages in the file
                    context.addWarning('[ERROR] :: No valid Visio pages found.');
                    context.triggerEvent('Import', { status: 'failed' });
                    return null;
                }
            }

            // ==================== Validate and Clamp Page Index ====================
            let idx: number = Number.isInteger(pageIndex) ? (pageIndex as number) : parseInt(String(pageIndex), 10);
            if (!Number.isFinite(idx) || idx < 0) { idx = 0; }
            if (nonBgPages.length > 0 && idx >= nonBgPages.length) {
                idx = nonBgPages.length - 1;
            }

            // ==================== Trigger Import Event (Page Selection) ====================
            // Allows caller to select page or cancel import
            const args: IImportingEventArgs = {
                status: 'started',
                pages: pagesForSelection,
                selectedPage: { name: pagesForSelection[parseInt(idx.toString(), 10)].name }
            };
            context.triggerEvent('Import', args);

            // Check for cancellation
            if (args.cancel) {
                return null;
            }

            // ==================== Resolve Selected Page Index ====================
            let selectedPageIndex: number = pagesForSelection.findIndex(
                (p: { name: string }) => p.name === args.selectedPage.name
            );
            selectedPageIndex = selectedPageIndex < 0 ? 0 : selectedPageIndex;

            // Task #1004826-EXT: Prefer UI-selected foreground; otherwise use the background fallback.
            const selectedPage: VisioPageMetadata = selectedByFallbackBg || nonBgPages[parseInt(selectedPageIndex.toString(), 10)];

            if (!selectedPage || !selectedPage.$) {
                context.addWarning('[ERROR] :: Selected page metadata missing.');
                context.triggerEvent('Import', { status: 'failed' });
                return null;
            }

            // ==================== Build Relationship ID Map ====================
            // Create map from relationship $.Id to relationship for quick lookup
            const relationships: XmlRelationship[] = getRelationshipsArray(relsJsObj);
            const idToRel: Map<string, XmlRelationship> = new Map<string, XmlRelationship>();

            for (let i: number = 0; i < relationships.length; i += 1) {
                const r: XmlRelationship = relationships[parseInt(i.toString(), 10)];
                if (!r || !r.$) { continue; }
                const relObj: { [k: string]: unknown } = r.$ as { [k: string]: unknown };
                const relId: unknown = relObj.Id;
                if (typeof relId === 'string' && relId.length > 0) {
                    idToRel.set(relId, r);
                }
            }

            let targetPageRel: XmlRelationship = undefined;

            // ==================== Resolve Target Page Relationship ====================
            // Primary: use page's r:id to lookup relationship
            const pageRelId: string = getPageRelId(selectedPage);
            if (pageRelId && idToRel.has(pageRelId)) {
                const rel: XmlRelationship = idToRel.get(pageRelId);
                if (rel) { targetPageRel = rel; }
            }

            // ==================== Fallback: Align by Order ====================
            // If primary lookup failed, try aligning by order of non-background pages
            const orderedNonBgRels: XmlRelationship[] = [];
            for (let i: number = 0; i < nonBgPages.length; i += 1) {
                const p: VisioPageMetadata = nonBgPages[parseInt(i.toString(), 10)];
                const rid: string = getPageRelId(p);
                if (rid && idToRel.has(rid)) {
                    const rel: XmlRelationship = idToRel.get(rid);
                    if (rel) { orderedNonBgRels.push(rel); }
                }
            }

            if (selectedPageIndex >= 0 && selectedPageIndex < orderedNonBgRels.length) {
                targetPageRel = orderedNonBgRels[parseInt(selectedPageIndex.toString(), 10)];
            }

            if (!targetPageRel) {
                context.addWarning('[ERROR] :: Could not resolve page relationship. No valid page found.');
                context.triggerEvent('Import', { status: 'failed' });
                return null;
            }

            // Task #1004826: If the selected page references a background (BackPage),
            // force-include that background PageContents so its "Solid" (background color) is parsed.
            const backPageId: string | number | undefined = selectedPage.$ && (selectedPage.$ as any).BackPage;
            if (backPageId) {
                // Find the background page metadata by ID in pages.xml
                const backgroundPageMeta: VisioPageMetadata | undefined = (pageMetas || []).find(
                    (p: VisioPageMetadata) => p && p.$ && String(p.$.ID) === String(backPageId)
                );
                if (backgroundPageMeta) {
                    // Resolve r:id of the background page → actual PageContents (e.g., visio/pages/page1.xml)
                    const backgroundRelId: string | undefined = getPageRelId(backgroundPageMeta);
                    if (backgroundRelId && idToRel.has(backgroundRelId)) {
                        const bgRel: XmlRelationship | undefined = idToRel.get(backgroundRelId);
                        if (bgRel && bgRel.$ && typeof bgRel.$.Target === 'string') {
                            // Canonical ZIP path for pageN.xml
                            const bgPageFilePath: string = normalizeZipPath('visio/pages', bgRel.$.Target);
                            this.extraIncludeParts.add(bgPageFilePath);

                            // Also include its .rels if it exists (lets dependency walk pick up media, etc.)
                            const parts: string[] = bgPageFilePath.split('/');
                            const bgFileName: string = parts[parts.length - 1] || '';
                            const bgRelsPath: string = normalizeZipPath('visio/pages/_rels', bgFileName + '.rels');
                            if (findEntry(visioEntries, bgRelsPath)) {
                                this.extraIncludeParts.add(bgRelsPath);
                            }
                        }
                    }
                }
            }

            // ==================== Build Document Structure ====================
            return this.buildVisioDocumentStructure(zip, visioEntries, targetPageRel, context);
        } catch (error) {
            // ==================== Handle Fatal Errors ====================
            const errorMessage: string = error instanceof Error ? error.message : 'Unknown error';
            context.addWarning('[ERROR] :: Package reader error: ' + errorMessage);
            context.triggerEvent('Import', { status: 'failed' });
            return null;
        }
    }

    /**
     * Builds the VisioDocumentStructure for the selected page.
     *
     * This method:
     * 1. Collects base entries (page, masters, document.xml, etc.)
     * 2. Traverses .rels files to discover dependencies (themes, fonts, media, etc.)
     * 3. Parses XML entries and extracts binary parts
     * 4. Merges parsed XML into typed document fields
     * 5. Stores unmapped data in __Extensions bag for extensibility
     * 6. Preserves binary data in __BinaryParts bag
     *
     * This structure is then ready for parsing by the VisioImporter.
     *
     * @param {MinimalZipReader} zip - The ZIP reader instance for extracting entries.
     * @param {ZipEntry[]} visioEntries - All "visio/" entries available in the VSDX archive.
     * @param {XmlRelationship} targetPageRel - The resolved relationship entry pointing to the target page.
     *                                          Must have $.Id, $.Type, and $.Target properties.
     * @param {ParsingContext} context - Collector array for non-fatal warnings during processing.
     * @returns {Promise<VisioDocumentStructure>} A Promise resolving to the complete VisioDocumentStructure.
     *
     * @private
     */
    private async buildVisioDocumentStructure(
        zip: MinimalZipReader,
        visioEntries: ZipEntry[],
        targetPageRel: XmlRelationship,
        context: ParsingContext
    ): Promise<VisioDocumentStructure> {
        const visioDoc: VisioDocumentStructure = {};
        visioDoc.PageRelId = targetPageRel.$.Id;

        // ==================== Resolve Target Page File ====================
        // Normalize the relationship target path to a canonical ZIP path
        const targetPageFileName: string = normalizeZipPath('visio/pages', targetPageRel.$.Target);

        // ==================== Get Initial Entries ====================
        // Includes: target page, document.xml, settings, windows, masters, themes
        const initialEntries: ZipEntry[] = this.filterEntriesToExtract(visioEntries, targetPageFileName);

        // Task #1004826: Merge any forced-included parts (e.g., background page1.xml)
        // into the initial set before dependency traversal, with simple dedupe.
        if (this.extraIncludeParts && this.extraIncludeParts.size > 0) {
            const already: Set<string> = new Set<string>(initialEntries.map((e: ZipEntry) => e.name));
            this.extraIncludeParts.forEach((zipPath: string) => {
                const entry: ZipEntry | undefined = findEntry(visioEntries, zipPath);
                if (entry && !already.has(entry.name)) {
                    initialEntries.push(entry);
                    already.add(entry.name);
                }
            });
        }

        // ==================== Resolve Target Page .rels Path ====================
        // Construct the path to the .rels file for this page
        const split: string[] = targetPageFileName.split('/');
        const targetPageName: string = split.length > 0 ? split[split.length - 1] : '';
        const targetPageRelsPath: string = normalizeZipPath('visio/pages/_rels', targetPageName + '.rels');

        // ==================== Collect Transitive Dependencies ====================
        const extraPaths: Set<string> = new Set<string>();

        // ==================== Traverse Target Page .rels ====================
        // Discover parts referenced by the page (media, shapes, themes, etc.)
        const pageRelsExists: boolean = !!findEntry(visioEntries, targetPageRelsPath);
        if (pageRelsExists) {
            try {
                const deps: Set<string> = await collectDependencies(zip, visioEntries, targetPageRelsPath, 3, context);
                deps.forEach(function (p: string): void { extraPaths.add(p); });
            } catch (_err) {
                context.addWarning('[ERROR] :: Failed to traverse page relationships for dependency inclusion.');
            }
        }

        // ==================== Traverse Document.xml.rels ====================
        // Discover document-level parts (themes, fonts, data parts, etc.)
        const documentRelsPath: string = 'visio/_rels/document.xml.rels';
        if (findEntry(visioEntries, documentRelsPath)) {
            try {
                const docDeps: Set<string> = await collectDependencies(zip, visioEntries, documentRelsPath, 3, context);
                docDeps.forEach(function (p: string): void {
                    // ==================== Filter Out Unrelated Pages ====================
                    // Avoid bringing in other pages than the selected one
                    if ((/^visio\/pages\/page\d+\.xml$/i.test(p) || /^visio\/pages\/_rels\/page\d+\.xml\.rels$/i.test(p)) && p !== targetPageFileName && p !== targetPageRelsPath) {
                        return;
                    }
                    extraPaths.add(p);
                });
            } catch (_err) {
                context.addWarning('[ERROR] :: Failed to traverse document relationships for dependency inclusion.');
            }
        }

        // ==================== Merge Initial + Dependencies ====================
        // Build final entry list with deduplication
        const nameSet: Set<string> = new Set<string>();
        for (let i: number = 0; i < initialEntries.length; i += 1) {
            nameSet.add(initialEntries[parseInt(i.toString(), 10)].name);
        }
        const finalEntries: ZipEntry[] = initialEntries.slice();

        extraPaths.forEach(function (p: string): void {
            const entry: ZipEntry = findEntry(visioEntries, p);
            if (entry && !nameSet.has(entry.name)) {
                finalEntries.push(entry);
                nameSet.add(entry.name);
            }
        });

        // ==================== Separate XML from Binary ====================
        // Determines if a file path appears to be XML-like.
        function isXmlLikePath(name: string): boolean {
            return (/\.xml$/i.test(name) || /\.rels$/i.test(name));
        }

        // Returns priority for sorting entries by processing order.
        // Lower numbers are processed first (pages.xml before pages, etc.).
        function getFilePriority(fileName: string): number {
            if (fileName === 'visio/pages/pages.xml') { return 1; }
            if (fileName === 'visio/masters/masters.xml') { return 2; }
            if (fileName.startsWith('visio/masters/master')) { return 3; }
            if (fileName.startsWith('visio/pages/page')) { return 4; }
            return 5;
        }

        // ==================== Filter XML vs Binary Entries ====================
        // Only parse XML-like entries; avoid parsing media/binary parts directly
        const xmlEntries: ZipEntry[] = finalEntries.filter(function (e: ZipEntry): boolean { return isXmlLikePath(e.name); });
        const binEntries: ZipEntry[] = finalEntries.filter(function (e: ZipEntry): boolean { return !isXmlLikePath(e.name); });

        // ==================== Sort Entries ====================
        // Sort for correct processing order (pages before shapes, etc.)
        xmlEntries.sort((a: ZipEntry, b: ZipEntry) => {
            const priorityA: number = getFilePriority(a.name);
            const priorityB: number = getFilePriority(b.name);
            if (priorityA !== priorityB) {
                return priorityA - priorityB;
            }
            return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
        });

        // ==================== Extract and Parse XML Entries ====================
        // Parallel extraction and parsing for performance
        const parsed: ParsedXmlObject[] = await Promise.all(xmlEntries.map((e: ZipEntry) => this.extractAndParseXml(zip, e)));
        for (let i: number = 0; i < xmlEntries.length; i += 1) {
            this.mergeIntoDocument(visioDoc, xmlEntries[parseInt(i.toString(), 10)].name, parsed[parseInt(i.toString(), 10)]);
        }

        // ==================== Extract and Store Binary Parts ====================
        // Store binary parts to avoid data loss
        if (binEntries.length > 0) {
            const binBag: Record<string, Uint8Array> = this.getOrInitBinaryParts(visioDoc);
            await Promise.all(
                binEntries.map(async (e: ZipEntry) => {
                    try {
                        const data: any = await zip.extract(e);
                        binBag[e.name] = data; // Uint8Array
                    } catch (_err) {
                        context.addWarning('[ERROR] :: Failed to extract binary part: ' + e.name);
                    }
                })
            );
        }

        return visioDoc;
    }

    /**
     * Returns the minimal set of entries required before dependency traversal.
     *
     * Always includes:
     * - Target page XML and its .rels file
     *
     * Document-level includes:
     * - document.xml, settings.xml, windows.xml (core document structure)
     *
     * Includes all:
     * - visio/masters/ (all master definitions)
     * - visio/theme/ (all theme definitions)
     *
     * Excludes:
     * - Other pages and their .rels files (to avoid unnecessary parsing)
     *
     * This base set is then supplemented by collectDependencies for a complete picture.
     *
     * @param {ZipEntry[]} visioEntries - All "visio/" entries available in the VSDX archive.
     * @param {string} targetPageFileName - The resolved file name of the target page
     *                                      (e.g., "visio/pages/page1.xml").
     * @returns {ZipEntry[]} An array of filtered ZipEntry objects ready for extraction.
     *
     * @private
     */
    private filterEntriesToExtract(
        visioEntries: ZipEntry[],
        targetPageFileName: string
    ): ZipEntry[] {
        const entries: ZipEntry[] = [];

        // ==================== Calculate Target Page .rels Path ====================
        const split: string[] = targetPageFileName.split('/');
        const targetPageName: string = split.length > 0 ? split[split.length - 1] : '';
        const targetPageRelsName: string = normalizeZipPath('visio/pages/_rels', targetPageName + '.rels');

        // ==================== Filter Entries ====================
        for (let i: number = 0; i < visioEntries.length; i += 1) {
            const entry: ZipEntry = visioEntries[parseInt(i.toString(), 10)];
            const name: string = entry.name;

            // ==================== Always Include Target Page ====================
            // Include target page and its relationships file
            if (name === targetPageFileName || name === targetPageRelsName) {
                entries.push(entry);
                continue;
            }

            // ==================== Exclude Other Pages ====================
            // Skip other page files and their .rels to reduce parsing load
            if (/^visio\/pages\/page\d+\.xml$/i.test(name) || /^visio\/pages\/_rels\/page\d+\.xml\.rels$/i.test(name)) {
                continue;
            }

            // ==================== Include Document-Level Essentials ====================
            // Include core document structure files
            if (
                name === 'visio/document.xml' ||
                name === 'visio/settings.xml' ||
                name === 'visio/windows.xml' ||
                name.startsWith('visio/masters/') ||  // All masters
                name.startsWith('visio/theme/')       // All themes
            ) {
                entries.push(entry);
            }
        }

        return entries;
    }

    /**
     * Merges a parsed XML part into the VisioDocumentStructure.
     *
     * Known files are mapped to typed fields:
     * - visio/document.xml → root properties (merged)
     * - visio/settings.xml → DocumentSettings
     * - visio/windows.xml  → Window[]
     * - visio/pages/pageN.xml → Page[]
     * - visio/masters/masterN.xml → Master[]
     * - Theme XML → a:themeElements
     * - Connections XML → Connects
     * - Shapes XML → Shapes
     *
     * Unknown XML parts are stored under __Extensions[fileName] to preserve data
     * and support future extensions.
     *
     * @param {VisioDocumentStructure} visioDoc - The document structure to merge into.
     *                                            Will be modified in place.
     * @param {string} fileName - The ZIP path of the file being merged
     *                           (e.g., "visio/document.xml").
     * @param {ParsedXmlObject} jsObj - The parsed XML content as a JavaScript object.
     *                                  Root element and its children.
     * @returns {void} - Modifies visioDoc in place.
     *
     * @private
     */
    private mergeIntoDocument(
        visioDoc: VisioDocumentStructure,
        fileName: string,
        jsObj: ParsedXmlObject
    ): void {
        // ==================== Windows ====================
        // Root element contains Window elements
        if (jsObj.Window) {
            this.appendToProperty(visioDoc, 'Window', jsObj);
        }

        // ==================== Pages ====================
        // Page elements from pages.xml
        if (jsObj.Page) {
            this.appendToProperty(visioDoc, 'Page', jsObj.Page);
        }

        // ==================== DocumentSettings ====================
        // Document-level settings from settings.xml
        if (jsObj.DocumentSettings) {
            this.appendToProperty(visioDoc, 'DocumentSettings', jsObj.DocumentSettings);
        }

        // ==================== Masters ====================
        // Master definitions from masters.xml and individual master files
        if (jsObj.Master) {
            this.appendToProperty(visioDoc, 'Master', jsObj.Master);
        }

        // ==================== Connections ====================
        // Connection records from page content
        if (jsObj.Connects && Object.keys(jsObj.Connects as VisioConnectElement).length > 0) {
            this.appendToProperty(visioDoc, 'Connects', jsObj.Connects);
        }

        // ==================== Shapes ====================
        // Shape elements from page content
        if (jsObj.Shapes) {
            this.appendToProperty(visioDoc, 'Shapes', jsObj.Shapes);
        }

        // ==================== Theme Elements ====================
        // Theme color and font definitions
        if (jsObj['a:themeElements']) {
            this.appendToProperty(visioDoc, 'a:themeElements', jsObj['a:themeElements']);
        }

        // ==================== Relationships ====================
        // Raw relationship elements (for extensibility)
        if (jsObj.Relationship) {
            this.appendToProperty(visioDoc, 'Relationship', jsObj.Relationship);
        }

        // ==================== Stash Unknown Parts ====================
        // Store unmapped XML in extensions bag for future extensibility
        const bag: Record<string, ParsedXmlObject> = this.getOrInitExtensions(visioDoc);
        bag[`${fileName}`] = jsObj;
    }

    /**
     * Extracts a ZIP entry and converts its XML content to a JavaScript object.
     *
     * Uses browser APIs (TextDecoder and DOMParser) for extraction and parsing.
     * Detects and throws on invalid XML (parsererror elements).
     *
     * This is an async operation because ZIP extraction may involve I/O.
     *
     * @param {MinimalZipReader} zip - The ZIP reader instance for extracting.
     * @param {ZipEntry} entry - The ZIP entry to extract and parse.
     * @returns {Promise<ParsedXmlObject>} A Promise resolving to the ParsedXmlObject
     *                                     representing the root element.
     * @throws {Error} If XML parsing fails or the entry cannot be extracted.
     *
     * @private
     */
    private async extractAndParseXml(zip: MinimalZipReader, entry: ZipEntry): Promise<ParsedXmlObject> {
        // ==================== Extract Binary Data ====================
        const data: any = await zip.extract(entry);

        // ==================== Decode UTF-8 ====================
        const text: string = new TextDecoder('utf-8').decode(data);

        // ==================== Parse XML ====================
        const doc: Document = new DOMParser().parseFromString(text, 'text/xml');
        const root: HTMLElement = doc.documentElement;

        // ==================== Detect Parse Errors ====================
        // DOMParser doesn't always throw on invalid XML, so check for parsererror element
        if (!root || root.nodeName.toLowerCase() === 'parsererror') {
            throw new Error('XML parse error in ' + entry.name);
        }

        // ==================== Convert to JS Object ====================
        // For theme files, track element order (shouldTrackOrder = true)
        const shouldTrackOrder: boolean = entry.name.startsWith('visio/theme');
        return xmlToJsObject(root, shouldTrackOrder) as ParsedXmlObject;
    }

    /**
     * Type-safe helper to append an item to a property that can be a single item or an array.
     *
     * Handles promotion of singleton values to arrays as needed:
     * - If property is undefined/null: set to item
     * - If property is already an array: push item
     * - Otherwise: create array [existing, item]
     *
     * This allows flexible handling of both single and multiple elements
     * in the document structure.
     *
     * @template K - The key of the property in VisioDocumentStructure.
     * @template T - The type of the item being appended.
     * @param {VisioDocumentStructure} doc - The document object to modify (in place).
     * @param {K} key - The key of the property to append to.
     * @param {T} item - The item to append.
     * @returns {void} - Modifies doc in place.
     *
     * @example
     * appendToProperty(doc, 'Page', pageObj);
     * // doc.Page is now [pageObj] or [existing, pageObj]
     *
     * @private
     */
    private appendToProperty<K extends keyof VisioDocumentStructure, T>(
        doc: VisioDocumentStructure,
        key: K,
        item: T
    ): void {
        const existing: unknown = doc[`${key}`] as unknown;

        // ==================== Case 1: Property is Empty ====================
        // First item being added
        if (existing === undefined || existing === null) {
            (doc[`${key}`] as unknown) = item as unknown;
            return;
        }

        // ==================== Case 2: Property is Already an Array ====================
        // Append to existing array
        if (Array.isArray(existing)) {
            (existing as T[]).push(item);
            return;
        }

        // ==================== Case 3: Property is a Singleton ====================
        // Promote to array and add item
        (doc[`${key}`] as unknown) = [existing as T, item] as unknown;
    }

    /**
     * Returns the __Extensions bag on the document, creating it if necessary.
     *
     * Used to store unmapped XML parts keyed by their ZIP path. This bag preserves
     * unknown or extension XML content that does not fit standard Visio structure fields.
     * This provides extensibility for future Visio features or custom XML.
     *
     * @param {VisioDocumentStructure} doc - The document structure to access or initialize.
     * @returns {Record<string, ParsedXmlObject>} The __Extensions bag as a key-value object
     *                                            mapping file paths to parsed XML objects.
     *
     * @example
     * const ext = getOrInitExtensions(doc);
     * ext['visio/custom/custom.xml'] = customXmlObj;
     *
     * @note Values are raw ParsedXmlObject instances; no schema validation is performed.
     *
     * @private
     */
    private getOrInitExtensions(doc: VisioDocumentStructure): Record<string, ParsedXmlObject> {
        const key: keyof VisioDocumentStructure = '__Extensions' as keyof VisioDocumentStructure;
        const current: unknown = doc[`${key}`] as unknown;

        // ==================== Return if Already Initialized ====================
        if (isObject(current)) { return current as Record<string, ParsedXmlObject>; }

        // ==================== Create New Extensions Bag ====================
        const bag: Record<string, ParsedXmlObject> = {};
        (doc as ParsedXmlObject)[key as string] = bag;
        return bag;
    }

    /**
     * Returns the __BinaryParts bag on the document, creating it if necessary.
     *
     * Used to store non-XML assets (e.g., images, media files) keyed by their ZIP path.
     * This bag preserves binary data that cannot be represented as XML and allows
     * later retrieval by the import process.
     *
     * @param {VisioDocumentStructure} doc - The document structure to access or initialize.
     * @returns {Record<string, Uint8Array>} The __BinaryParts bag as a key-value object
     *                                       mapping file paths to Uint8Array buffers.
     *
     * @example
     * const bin = getOrInitBinaryParts(doc);
     * // Later: const imageData = bin['visio/media/image1.png'];
     *
     * @note This uses a loose object check; it does not validate that values are Uint8Array.
     *       Callers must only assign Uint8Array values to this bag.
     *
     * @private
     */
    private getOrInitBinaryParts(doc: VisioDocumentStructure): Record<string, Uint8Array> {
        const key: keyof VisioDocumentStructure = '__BinaryParts' as keyof VisioDocumentStructure;
        const current: unknown = doc[`${key}`] as unknown;

        // ==================== Return if Already Initialized ====================
        if (isObject(current)) { return current as Record<string, Uint8Array>; }

        // ==================== Create New Binary Parts Bag ====================
        const bag: Record<string, Uint8Array> = {};
        (doc as ParsedXmlObject)[key as string] = bag;
        return bag;
    }
}
