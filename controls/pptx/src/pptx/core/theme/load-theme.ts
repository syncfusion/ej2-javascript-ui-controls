import { officeRelationshipType, ownerNamespace, officeRootNamespace } from '../xml/office-dialect';
import { ThemeMatrixEditor } from './theme-matrix-editor';
import { readGradientThemeStyles } from './gradient-theme-styles';
import { arrayAt } from '../util/es5-compat';
/**
 * Discover and load the presentation theme part from an opened OPC package.
 *
 * @remarks
 * Discovery order (TASK-1011):
 * 1. Each Internal `slideMaster` relationship on the presentation: first
 *    Internal `theme` relationship on that master.
 * 2. Else first Internal `theme` relationship on the presentation main part.
 *
 * When no theme relationship exists on masters or the presentation, the
 * document has no theme model (`undefined`) — this is **not** an error (empty
 * or hand-minimal packages). When a theme relationship is present but the
 * target part is missing or not a theme root, load fails closed with
 * {@link Error}.
 *
 * Theme part bytes remain unchanged until an explicit fixed-index matrix edit.
 * This loader binds a lazy writer; no-op save does not re-serialize the theme part.
 */
import { SLIDE_MASTER_REL_TYPE, THEME_REL_TYPE } from '../package/constants';
import { OpcPackage, PackagePart } from '../package/package-model';
import { PackageRelationship } from '../package/relationships';
import { InvalidPackageError } from '../security/errors';
import { parseXml, OoxmlElement, OoxmlAttribute, OoxmlText } from '../xml/dom';
import { ColorScheme } from './color-scheme';
import { ColorValue } from './color-value';
import { COLOR_SCHEME_SLOTS, DML_NS, ColorSchemeIndex } from './constants';
import { parseRequiredColorChoice } from './parse-color-choice';
import { ThemePart } from './theme-part';
import { parseThemeFontScheme, parseThemeFormatScheme } from './theme-render-model';


/**
 * Discovers and parses the primary theme part for a package, if any.
 *
 * @throws {Error} Theme rel present but target missing, wrong root, or incomplete `clrScheme`.
 * @param {OpcPackage} pkg - Opened OPC package (parts + relationships already loaded).
 * @returns {ThemePart | undefined} when a theme relationship resolves; otherwise `undefined`.
 */
export function loadThemePart(pkg: OpcPackage): ThemePart | undefined {
    const target: ThemeTarget = discoverThemeTarget(pkg);
    if (target === undefined) {
        return undefined;
    }
    const part: PackagePart = pkg.parts.get(target.partName);
    if (part === undefined) {
        throw new InvalidPackageError(`Theme relationship "${target.relationshipId}" target "${target.partName}" is not present in the package`, { partName: target.partName });
    }
    const text: string = new TextDecoder('utf-8').decode(part.data);
    const root: OoxmlElement = parseXml(text, { limits: pkg.limits, partName: target.partName });
    if (root.localName !== 'theme' || !officeRootNamespace(root.namespaceUri, DML_NS)) {
        throw new InvalidPackageError('Theme root must be a:theme in the DrawingML main namespace', {
            partName: target.partName
        });
    }
    const themeName: string = getAttr(root, '', 'name');
    const themeElements: OoxmlElement = findChild(root, DML_NS, 'themeElements');
    if (themeElements === undefined) {
        throw new InvalidPackageError('a:theme requires a:themeElements (CT_BaseStyles)', {
            partName: target.partName
        });
    }
    const clrSchemeEl: OoxmlElement = findChild(themeElements, DML_NS, 'clrScheme');
    if (clrSchemeEl === undefined) {
        throw new InvalidPackageError('a:themeElements requires a:clrScheme', {
            partName: target.partName
        });
    }
    const colorScheme: ColorScheme = parseColorScheme(clrSchemeEl, target.partName);
    const fontSchemeEl: OoxmlElement = findChild(themeElements, DML_NS, 'fontScheme');
    const formatSchemeEl: OoxmlElement = findChild(themeElements, DML_NS, 'fmtScheme');
    return new ThemePart({
        partName: target.partName,
        relationshipId: target.relationshipId,
        sourcePartName: target.sourcePartName,
        name: themeName,
        colorScheme,
        fontScheme: parseThemeFontScheme(fontSchemeEl),
        formatScheme: parseThemeFormatScheme(formatSchemeEl),
        gradientStyles: readGradientThemeStyles(formatSchemeEl, target.partName),
        createMatrixEditor: (changed: (format: OoxmlElement) => void): ThemeMatrixEditor =>
            new ThemeMatrixEditor(pkg, target.partName, changed)
    });
}
interface ThemeTarget {
    readonly partName: string;
    readonly relationshipId: string;
    readonly sourcePartName: string;
}
/**
 * Prefer master→theme, then presentation→theme. First match wins.
 *
 * @param {OpcPackage} pkg - The pkg value.
 * @returns {ThemeTarget | undefined} The result.
 */
function discoverThemeTarget(pkg: OpcPackage): ThemeTarget | undefined {
    const presentationRels: Array<PackageRelationship> = ((function (): PackageRelationship[] {
        const __rels: Array<PackageRelationship> | undefined = pkg.partRelationships.get(pkg.presentationPartName);
        return __rels != null ? __rels : [];
    })());
    for (let i: number = 0; i < presentationRels.length; i++) {
        const masterRel: PackageRelationship = arrayAt(presentationRels, i);
        if (!officeRelationshipType(masterRel.type, SLIDE_MASTER_REL_TYPE) ||
            masterRel.targetMode !== 'Internal' ||
            masterRel.targetPartName === undefined) {
            continue;
        }
        const masterRels: Array<PackageRelationship> = ((function (): PackageRelationship[] {
            const __rels: Array<PackageRelationship> | undefined = pkg.partRelationships.get(masterRel.targetPartName);
            return __rels != null ? __rels : [];
        })());
        const themeFromMaster: PackageRelationship = findInternalThemeRel(masterRels);
        if (themeFromMaster != null && themeFromMaster.targetPartName !== undefined) {
            return {
                partName: themeFromMaster.targetPartName,
                relationshipId: themeFromMaster.id,
                sourcePartName: masterRel.targetPartName
            };
        }

    }
    const themeFromPresentation: PackageRelationship = findInternalThemeRel(presentationRels);
    if (themeFromPresentation != null && themeFromPresentation.targetPartName !== undefined) {
        return {
            partName: themeFromPresentation.targetPartName,
            relationshipId: themeFromPresentation.id,
            sourcePartName: pkg.presentationPartName
        };
    }
    return undefined;
}
/**
 *
 * @param {*} rels - The rels value.
 * @returns {PackageRelationship | undefined} The result.
 */
function findInternalThemeRel(rels: ReadonlyArray<PackageRelationship>): PackageRelationship | undefined {
    for (let i: number = 0; i < rels.length; i++) {
        const r: PackageRelationship = arrayAt(rels, i);
        if (officeRelationshipType(r.type, THEME_REL_TYPE) &&
            r.targetMode === 'Internal' &&
            r.targetPartName !== undefined) {
            return r;
        }

    }
    return undefined;
}
/**
 *
 * @param {OoxmlElement} clrSchemeEl - The clrSchemeEl value.
 * @param {string} partName - The partName value.
 * @returns {ColorScheme} The result.
 */
function parseColorScheme(clrSchemeEl: OoxmlElement, partName: string): ColorScheme {
    const name: string = getAttr(clrSchemeEl, '', 'name');
    if (name === undefined) {
        throw new InvalidPackageError('a:clrScheme requires @name', { partName });
    }
    const slots: Map<string, ColorValue> = new Map<ColorSchemeIndex, ColorValue>();
    for (let i: number = 0; i < COLOR_SCHEME_SLOTS.length; i++) {
        const slot: string = arrayAt(COLOR_SCHEME_SLOTS, i);
        const slotEl: OoxmlElement = findChild(clrSchemeEl, DML_NS, slot);
        if (slotEl === undefined) {
            throw new InvalidPackageError(`a:clrScheme is missing required slot a:${slot}`, {
                partName
            });
        }
        slots.set(slot, parseRequiredColorChoice(slotEl, partName, slot));

    }
    return new ColorScheme(name, slots);
}
/**
 *
 * @param {OoxmlElement} parent - The parent value.
 * @param {string} namespaceUri - The namespaceUri value.
 * @param {string} localName - The localName value.
 * @returns {OoxmlElement | undefined} The result.
 */
function findChild(parent: OoxmlElement, namespaceUri: string, localName: string): OoxmlElement | undefined {
    namespaceUri = ownerNamespace(parent.namespaceUri, namespaceUri);
    for (let i: number = 0; i < parent.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(parent.children, i);
        if (child.kind === 'element' &&
            child.namespaceUri === namespaceUri &&
            child.localName === localName) {
            return child;
        }

    }
    return undefined;
}
/**
 *
 * @param {OoxmlElement} el - The el value.
 * @param {string} namespaceUri - The namespaceUri value.
 * @param {string} localName - The localName value.
 * @returns {string | undefined} The result.
 */
function getAttr(el: OoxmlElement, namespaceUri: string, localName: string): string | undefined {
    namespaceUri = ownerNamespace(el.namespaceUri, namespaceUri);
    for (let i: number = 0; i < el.attributes.length; i++) {
        const a: OoxmlAttribute = arrayAt(el.attributes, i);
        if (a.namespaceUri === namespaceUri && a.localName === localName) {
            return a.value;
        }

    }
    return undefined;
}
