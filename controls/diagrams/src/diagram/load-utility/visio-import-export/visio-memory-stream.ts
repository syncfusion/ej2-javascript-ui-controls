import { Diagram } from '../../diagram';
import { getCellMapStringValue, mapCellValues } from './visio-core';
import { ParsingContext } from './visio-import-export';
import { VisioRelationship } from './visio-models';
import { isBackground, VisioPackageReader } from './visio-package-reader';
import { CellMapValue, ParsedXmlObject, RetirevedData, VisioDocumentStructure, VisioMemoryObject, VisioSection, VisioThemeObject } from './visio-types';

/**
 * A static in-memory storage used during Visio Import/Export operations.
 *
 * This class temporarily stores:
 *  - The entire Visio `.vsdx` ArrayBuffer
 *  - File name of the package
 *  - The selected page index for import/export
 *
 * It allows modules involved in the parsing pipeline to share Visio masters,
 * page XML content, and document metadata without passing them through function calls.
 * @private
 */
export class VisioMemoryStream {
    /** Holds the raw Visio (.vsdx) file buffer. */
    public static arrayBuffer: ArrayBuffer = undefined;
    /** Holds the original Visio file name. */
    public static fileName: string = '';
    /** Stores the selected page index imported into the EJ2 Diagram. */
    public static pageIndex: number = 0;
    /** Stores the selected page index imported into the EJ2 Diagram. */
    public static isClearVisio: boolean = true;

    /**
     * Stores the Visio file metadata and buffer in the memory stream.
     *
     * @param {string} fileName - The name of the Visio file.
     * @param {ArrayBuffer} arrayBuffer - The VSDX file data buffer.
     * @param {number} pageIndex - The index of the imported Visio page.
     * @returns {void} - Saves the provided details into the memory stream.
     * @private
     */
    public static set(fileName: string, arrayBuffer: ArrayBuffer, pageIndex: number): void {
        VisioMemoryStream.fileName = fileName;
        VisioMemoryStream.arrayBuffer = arrayBuffer;
        VisioMemoryStream.pageIndex = pageIndex;
    }

    /**
     * Reads and parses the Visio package stored in memory, extracting preserved
     * pages, masters, page relationships, and document-level XML parts.
     *
     * @param {Diagram} diagram - The EJ2 Diagram instance used to initialize parsing context.
     * @returns {Promise<RetirevedData>} - Returns all extracted Visio components needed for export.
     */
    public static async get(diagram: Diagram): Promise<RetirevedData> {
        const context: ParsingContext = new ParsingContext(diagram);
        /** Instance of VisioPackageReader for reading and extracting VSDX file contents */
        const packageReader: VisioPackageReader = new VisioPackageReader();
        const visioObj: VisioMemoryObject = await packageReader.readPackage(
            VisioMemoryStream.arrayBuffer,
            context,
            VisioMemoryStream.pageIndex,
            true
        ) as VisioMemoryObject;
        if (visioObj) {
            visioObj.Page = Array.isArray(visioObj.Page) ? visioObj.Page : [visioObj.Page];
            visioObj.Page = (visioObj.Page as ParsedXmlObject[]).filter((item: ParsedXmlObject) =>
                visioObj.PageRelId !== (item.Rel as VisioRelationship).$['r:id']);
            const extentionFiles: Record<string, ParsedXmlObject> = visioObj.__Extensions;
            const allPages: ParsedXmlObject[] =  Array.isArray(extentionFiles['visio/pages/pages.xml'].Page)
                ? extentionFiles['visio/pages/pages.xml'].Page : [extentionFiles['visio/pages/pages.xml'].Page];
            // Use isBackground from VisioPackageReader
            const pageArray: ParsedXmlObject[] = [];
            const backgroundPages: ParsedXmlObject[] = [];
            for (const page of allPages) {
                if (isBackground(page)) {
                    backgroundPages.push(page);
                } else {
                    pageArray.push(page);
                }
            }
            if ((this.pageIndex >= pageArray.length) || this.pageIndex < 0) {
                this.pageIndex = 0;
            }
            pageArray.push(...backgroundPages);
            const currentPage: ParsedXmlObject = pageArray[this.pageIndex];
            const currentPageCells: Map<string, CellMapValue> = mapCellValues((currentPage.PageSheet as VisioSection).Cell);
            return {
                pageIndex: this.pageIndex + backgroundPages.length,
                currentPage: currentPage,
                currentPageTheme: appliedThemeValues(currentPageCells),
                masters: visioObj.Master,
                pages: visioObj.Page,
                window: visioObj.Window,
                themes: getPagesXmlContentMap(extentionFiles, 'Theme'),
                documentSettings: extentionFiles['visio/document.xml'],
                pageWithContent: getPagesXmlContentMap(extentionFiles, 'Page'),
                pageRelWithContent: getPagesXmlContentMap(extentionFiles, 'PageRel'),
                masterWithContent: getPagesXmlContentMap(extentionFiles, 'Master'),
                masterRel: extentionFiles['visio/masters/_rels/masters.xml.rels']
            };
        }
        return undefined;
    }

    /**
     * Clears all stored memory reference data used during import/export.
     *
     * @returns {void} - Resets the memory container.
     * @private
     */
    public static clear(): void {
        if (VisioMemoryStream.isClearVisio) {
            VisioMemoryStream.arrayBuffer = undefined;
            VisioMemoryStream.fileName = '';
        }
    }
}

/**
 * Extracts a filtered map of XML content based on its type:
 * Page XML, Page Relationship XML, or Master XML.
 *
 * @param {ParsedXmlObject} extensions - All XML parts extracted from the VSDX package.
 * @param {string} kind - The type of XML to extract: 'Page', 'PageRel', or 'Master'.
 * @returns {ParsedXmlObject} - A map of file paths to their XML content.
 * @private
 */
function getPagesXmlContentMap(extensions: ParsedXmlObject, kind: string): ParsedXmlObject {
    const pages: ParsedXmlObject = {};
    const paths: string[] = Object.keys(extensions);
    for (const path of paths) {
        const content: ParsedXmlObject = extensions[`${path}`] as ParsedXmlObject;
        if (kind === 'Page' && isPageXmlContent(path)) {
            pages[`${path}`] = content;
        } else if (kind === 'PageRel' && isPageRelXml(path)) {
            pages[`${path}`] = content;
        } else if (kind === 'Master' && isMasterXmlContent(path)) {
            pages[`${path}`] = content;
        } else if (kind === 'Theme' && isThemeXmlContent(path)) {
            pages[`${path}`] = content;
        }
    }

    return pages;
}

/**
 * Determines whether a given file path corresponds to a Visio page XML file.
 *
 * @param {string} path - Path of the XML file inside the VSDX container.
 * @returns {boolean} - True if the path is a valid Visio page XML file.
 * @private
 */
function isPageXmlContent(path: string): boolean {
    // e.g., 'visio/pages/page1.xml'
    return (
        path.startsWith('visio/pages/') &&
        path.endsWith('.xml') &&
        !path.includes('/_rels/') &&
        path !== 'visio/pages/pages.xml'
    );
}

/**
 * Determines whether a given file path corresponds to a Visio master XML file.
 *
 * @param {string} path - Path of the XML file inside the VSDX package.
 * @returns {boolean} - True if the path points to a master XML file.
 * @private
 */
function isMasterXmlContent(path: string): boolean {
    // e.g., 'visio/pages/page1.xml'
    return (
        path.startsWith('visio/masters/') &&
        path.endsWith('.xml') &&
        !path.includes('/_rels/') &&
        path !== 'visio/masters/masters.xml'
    );
}

/**
 * Determines whether a given file path corresponds to a Visio page-level relationship (.rels) file.
 *
 * @param {string} path - Path of the .rels file inside the VSDX container.
 * @returns {boolean} - True if the path is a page relationship file.
 * @private
 */
function isPageRelXml(path: string): boolean {
    // e.g., 'visio/pages/_rels/page1.xml.rels'
    return (
        path.startsWith('visio/pages/_rels/') &&
        path.endsWith('.rels')
    );
}

/**
 * Determines whether a given file path corresponds to a Visio theme XML file.
 *
 * @param {string} path - Path of the XML file inside the VSDX package.
 * @returns {boolean} - True if the path points to a theme XML file.
 * @private
 */
function isThemeXmlContent(path: string): boolean {
    // e.g., 'visio/theme/theme1.xml'
    return (
        path.startsWith('visio/theme/')
    );
}

/**
 * Extracts and returns theme-related values from the provided Visio cell map.
 * Ensures all values are explicitly retrieved and sanitized.
 * @param {Map<string, CellMapValue>} cellMap - Map containing Visio cell values.
 * @returns {VisioThemeObject} - Object containing theme indices.
 * @private
 */
function appliedThemeValues(cellMap: Map<string, CellMapValue>): VisioThemeObject {
    const themeValues: VisioThemeObject = {
        themeIndex: getCellMapStringValue(cellMap, 'ThemeIndex'),
        colorSchemeIndex: getCellMapStringValue(cellMap, 'ColorSchemeIndex'),
        effectSchemeIndex: getCellMapStringValue(cellMap, 'EffectSchemeIndex'),
        connectorSchemeIndex: getCellMapStringValue(cellMap, 'ConnectorSchemeIndex'),
        fontSchemeIndex: getCellMapStringValue(cellMap, 'FontSchemeIndex')
    };
    return themeValues;
}
