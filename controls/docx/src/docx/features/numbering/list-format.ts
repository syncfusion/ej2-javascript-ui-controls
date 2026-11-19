import { DocxError, InvalidArgumentError } from '../../core/errors/docx-error';
import { visitParagraphsInDocumentOrder } from '../../core/registry/index';
import { Paragraph } from '../document/paragraph';
import { WordDocument } from '../document/document';
import { AbstractNumbering, MultiLevelType } from './abstract-numbering';
import { NumberingInstance, NumberingLevelOverride } from './numbering-instance';
import { NumberingLevel } from './numbering-level';
import { ListType } from './list-style';
import { numberingFor, NumberingPart } from './index';

/**
 * @deprecated Prefer {@link ListType}. Kept for internal ensureInstance format mapping.
 * @private
 */
export type ListFormatType = 'bullet' | 'decimal';

const MAX_LIST_LEVEL: number = 8;

/** Minimal styles surface used by ListFormat.applyStyle. */
export interface ListStyleLookup {
    getStyle(id: string): { styleId: string; type: string | undefined; name: string | undefined } | undefined;
    findStyleByDisplayName(n: string): { styleId: string; type: string | undefined; name: string | undefined } | undefined;
}

type StylesLookupFactory = (document: WordDocument) => ListStyleLookup;

let stylesLookupFactory: StylesLookupFactory | undefined;

/**
 * @param {StylesLookupFactory} factory - The factory.
 * @returns {void} Nothing is returned.
 *  Registered by the styles feature so applyStyle avoids CJS require under Vitest.
 *
 * @private
 */
export function setStylesLookupFactory(factory: StylesLookupFactory): void {
    stylesLookupFactory = factory;
}

/**
 * @returns {void} Nothing is returned.
 *  Test-only reset.
 *
 * @private
 */
export function resetStylesLookupFactoryForTests(): void {
    stylesLookupFactory = undefined;
}

/**
 * Live paragraph list formatting (`w:pPr/w:numPr` + document numbering catalog).
 *
 * Obtained via {@link Paragraph.listFormat}. The same logical instance is returned
 * for repeated access on the same paragraph; mutations update the paragraph and
 * numbering definitions immediately.
 *
 * @public
 */
export class ListFormat {
    private readonly paragraph: Paragraph;
    private listStyleNameValue: string | undefined;

    /**
     * @param {Paragraph} paragraph - The paragraph.
     * @private
     */
    constructor(paragraph: Paragraph) {
        this.paragraph = paragraph;
    }

    /** Owning paragraph. */
    get ownerParagraph(): Paragraph {
        return this.paragraph;
    }

    /** Numbering instance id (`w:num/@w:numId`), when the paragraph is in a list. */
    get listId(): number | undefined {
        return this.paragraph.numId;
    }

    /**
     * Assign an existing numbering instance id, or clear with `undefined`.
     * Prefer {@link applyDefBulletStyle} / {@link applyDefNumberedStyle} for new lists.
     *
     * Does not fabricate a default definition for unknown ids.
     *
     * @param {number | undefined} value - The value.
     * @returns {void} Nothing is returned.
     */
    set listId(value: number | undefined) {
        if (value === undefined) {
            this.removeList();
            return;
        }
        if (typeof value !== 'number' || !Number.isFinite(value) || value < 1 || Math.floor(value) !== value) {
            throw new InvalidArgumentError('listId must be a positive integer');
        }
        const numbering: NumberingPart = this.catalog();
        const resolved: NumberingInstance = numbering.getNumbering(value);
        if (resolved === undefined) {
            if (numbering.hasInstance(value)) {
                // Pending authoring id (createBulletInstance / createDecimalInstance) — keep pending.
                numbering.registerPendingInstance(value);
            } else {
                throw new DocxError(
                    'content/invalid-num-id',
                    'Numbering instance ' + String(value) + ' is not defined in this document'
                );
            }
        } else {
            numbering.registerPendingInstance(value);
        }
        this.paragraph.numId = value;
        if (this.paragraph.listLevel === undefined) {
            this.paragraph.listLevel = 0;
        }
    }

    /** Zero-based indent level (`w:ilvl`), when present. */
    get listLevelNumber(): number | undefined {
        return this.paragraph.listLevel;
    }

    set listLevelNumber(value: number | undefined) {
        if (value === undefined) {
            if (this.paragraph.numId === undefined) {
                this.paragraph.listLevel = undefined;
                return;
            }
            throw new InvalidArgumentError('listLevelNumber cannot be cleared while the paragraph remains in a list');
        }
        this.assertLevel(value);
        this.assertLevelExistsOnAbstract(value);
        this.paragraph.listLevel = value;
    }

    /** Whether the paragraph is assigned to a numbering instance. */
    get isList(): boolean {
        return this.paragraph.numId !== undefined;
    }

    /**
     * Broad list category from the resolved active level's `numFmt`.
     * {@link ListType.Bulleted} when `numFmt` is `bullet`; otherwise {@link ListType.Numbered}.
     */
    get listType(): ListType | undefined {
        const numberFormat: string = this.numberFormat;
        if (numberFormat === undefined) {
            return undefined;
        }
        if (numberFormat === 'bullet') {
            return ListType.Bulleted;
        }
        return ListType.Numbered;
    }

    /** Number format token at the active level (`w:numFmt/@w:val`). */
    get numberFormat(): string | undefined {
        const level: NumberingLevel = this.resolvedListLevel;
        return level === undefined ? undefined : level.numFmt;
    }

    /** Level text pattern (`w:lvlText/@w:val`) at the active level. */
    get levelText(): string | undefined {
        const level: NumberingLevel = this.resolvedListLevel;
        return level === undefined ? undefined : level.lvlText;
    }

    /** Named list style applied via {@link applyStyle}, when set. */
    get listStyleName(): string | undefined {
        return this.listStyleNameValue;
    }

    /** Start value at the active level (override or abstract level). */
    get startAt(): number | undefined {
        const listId: number = this.paragraph.numId;
        if (listId === undefined) {
            return undefined;
        }
        const level: number = this.activeLevelIndex();
        try {
            const part: NumberingPart = this.catalog();
            const instance: NumberingInstance = part.getNumbering(listId);
            if (instance !== undefined) {
                const override: NumberingLevelOverride = instance.levelOverrides.find(
                    (entry: NumberingLevelOverride) => entry.ilvl === level
                );
                if (override !== undefined && override.startOverride !== undefined) {
                    return override.startOverride;
                }
            }
        } catch {
            // catalog unavailable
        }
        const levelDef: NumberingLevel = this.resolvedListLevel;
        return levelDef === undefined ? undefined : levelDef.start;
    }

    /**
     * Set a start override for the active level on the concrete numbering instance.
     * Does not mutate the shared abstract definition.
     *
     * @param {number | undefined} value - The value.
     * @returns {void} Nothing is returned.
     */
    set startAt(value: number | undefined) {
        if (value === undefined) {
            throw new InvalidArgumentError('startAt cannot be cleared; pass a non-negative integer');
        }
        this.assertStartAt(value);
        const listId: number = this.paragraph.numId;
        if (listId === undefined) {
            throw new DocxError('content/not-in-list', 'Paragraph is not in a list; apply a list style before setting startAt');
        }
        const numbering: NumberingPart = this.catalog();
        // Materialize pending so overrides can be stored on a concrete instance.
        if (numbering.getNumbering(listId) === undefined) {
            const format: ListFormatType = this.inferEnsureFormat();
            numbering.ensureInstance(listId, format);
        }
        const existing: NumberingInstance = numbering.getNumbering(listId);
        if (existing === undefined) {
            throw new DocxError('content/invalid-num-id', 'Numbering instance ' + String(listId) + ' could not be resolved');
        }
        existing.setStartOverride(this.activeLevelIndex(), value);
        numbering.markDirty();
    }

    /**
     * @private
     * Abstract numbering definition id when the instance is resolved.
     */
    get abstractNumId(): number | undefined {
        const resolved: NumberingInstance = this.resolvedList;
        return resolved === undefined ? undefined : resolved.abstractNumId;
    }

    /** Abstract multi-level type token, when available. */
    get multiLevelType(): MultiLevelType | undefined {
        const abs: AbstractNumbering = this.resolvedAbstractList;
        return abs === undefined ? undefined : abs.multiLevelType;
    }

    /** Abstract definition name, when present. */
    get name(): string | undefined {
        const abs: AbstractNumbering = this.resolvedAbstractList;
        return abs === undefined ? undefined : abs.name;
    }

    /** Resolved numbering instance (`w:num`), when available. */
    get resolvedList(): NumberingInstance | undefined {
        const listId: number = this.paragraph.numId;
        if (listId === undefined) {
            return undefined;
        }
        try {
            return this.catalog().getNumbering(listId);
        } catch {
            return undefined;
        }
    }

    /** Resolved abstract numbering definition, when available. */
    get resolvedAbstractList(): AbstractNumbering | undefined {
        const instance: NumberingInstance = this.resolvedList;
        if (instance === undefined) {
            return undefined;
        }
        try {
            return this.catalog().getAbstractNumbering(instance.abstractNumId);
        } catch {
            return undefined;
        }
    }

    /** Resolved active list level definition, when available. */
    get resolvedListLevel(): NumberingLevel | undefined {
        const listId: number = this.paragraph.numId;
        if (listId === undefined) {
            return undefined;
        }
        const level: number = this.activeLevelIndex();
        try {
            return resolveLevelDefinition(this.catalog(), listId, level);
        } catch {
            return undefined;
        }
    }

    /**
     * Apply the default nine-level bullet list and set level `0`.
     *
     * @returns {void} Nothing is returned.
     */
    applyDefBulletStyle(): void {
        const numbering: NumberingPart = this.catalog();
        const listId: number = numbering.createBulletInstance();
        this.paragraph.numId = listId;
        this.paragraph.listLevel = 0;
        this.listStyleNameValue = undefined;
    }

    /**
     * Apply the default nine-level numbered (decimal hybrid) list and set level `0`.
     *
     * @returns {void} Nothing is returned.
     */
    applyDefNumberedStyle(): void {
        const numbering: NumberingPart = this.catalog();
        const listId: number = numbering.createDecimalInstance();
        this.paragraph.numId = listId;
        this.paragraph.listLevel = 0;
        this.listStyleNameValue = undefined;
    }

    /**
     * Apply a named numbering style from the document styles part.
     *
     * Resolves `type="numbering"` styles by style id or display name, then binds a
     * numbering instance linked through `w:styleLink` / abstract name, or creates
     * a new instance from a matching abstract definition.
     *
     * @param {string} styleName - Non-empty style id or display name.
     * @returns {void} Nothing is returned.
     * @throws InvalidArgumentError when `styleName` is empty.
     * @throws DocxError when the style is missing or not a numbering style.
     */
    applyStyle(styleName: string): void {
        if (typeof styleName !== 'string' || styleName.trim() === '') {
            throw new InvalidArgumentError('styleName must be a non-empty string');
        }
        const name: string = styleName.trim();
        const doc: WordDocument = this.paragraph.owningDocument();
        if (stylesLookupFactory === undefined) {
            throw new DocxError(
                'feature/not-registered',
                'Styles part is required to apply a list style; ensure styles are registered'
            );
        }
        let styles: ListStyleLookup;
        try {
            styles = stylesLookupFactory(doc);
        } catch (err) {
            throw new DocxError(
                'feature/not-registered',
                'Styles part is required to apply a list style; ensure styles are registered',
                err instanceof Error ? { cause: err } : undefined
            );
        }
        const style: { styleId: string; type: string; name: string; } =
      styles.getStyle(name) !== undefined
          ? styles.getStyle(name)
          : styles.findStyleByDisplayName(name);
        if (style === undefined) {
            throw new DocxError('styles/undefined-style', `Style "${name}" is not defined in this document`);
        }
        if (style.type !== 'numbering') {
            throw new DocxError(
                'styles/invalid-type-for-target',
                `Style "${style.styleId}" is a ${String(style.type)} style and cannot be used as a numbering style`
            );
        }
        const numbering: NumberingPart = this.catalog();
        const listId: number = resolveNumberingStyleToInstance(numbering, style.styleId, style.name);
        this.paragraph.numId = listId;
        this.paragraph.listLevel = 0;
        this.listStyleNameValue = style.name !== undefined ? style.name : style.styleId;
    }

    /**
     * Continue the nearest preceding list in document order.
     * Reuses that paragraph's numbering instance; keeps this paragraph's level when set.
     *
     * @returns {void} Nothing is returned.
     * @throws DocxError when no preceding list paragraph exists in the document.
     */
    continueListNumbering(): void {
        const doc: WordDocument = this.paragraph.owningDocument();
        let previous: Paragraph | undefined;
        let foundSelf: boolean = false;
        visitParagraphsInDocumentOrder(doc, (p: Paragraph) => {
            if (foundSelf) {
                return;
            }
            if (p === this.paragraph) {
                foundSelf = true;
                return;
            }
            if (p.numId !== undefined) {
                previous = p;
            }
        });
        if (previous === undefined || previous.numId === undefined) {
            throw new DocxError('content/no-preceding-list', 'No preceding list paragraph is available to continue');
        }
        const level: number =
      this.paragraph.listLevel !== undefined
          ? this.paragraph.listLevel
          : previous.listLevel !== undefined
              ? previous.listLevel
              : 0;
        this.paragraph.numId = previous.numId;
        this.paragraph.listLevel = level;
        try {
            this.catalog().registerPendingInstance(previous.numId);
        } catch {
            // ignore if catalog not attached yet
        }
    }

    /**
     * Restart numbering as a new list instance that reuses the current abstract definition.
     *
     * @param {number} startAt - Optional start value for the active level (`w:startOverride`).
     * @returns {void} Nothing is returned.
     */
    restartNumbering(startAt?: number): void {
        const listId: number = this.paragraph.numId;
        if (listId === undefined) {
            throw new DocxError('content/not-in-list', 'Paragraph is not in a list; apply a list style before restarting');
        }
        if (startAt !== undefined) {
            this.assertStartAt(startAt);
        }
        const numbering: NumberingPart = this.catalog();
        // Materialize pending so abstract id is known.
        if (numbering.getNumbering(listId) === undefined) {
            numbering.ensureInstance(listId, this.inferEnsureFormat());
        }
        const existing: NumberingInstance = numbering.getNumbering(listId);
        if (existing === undefined) {
            throw new DocxError('content/invalid-num-id', `Numbering instance ${String(listId)} could not be resolved`);
        }
        const level: number = this.activeLevelIndex();
        const start: number = startAt !== undefined ? startAt : 1;
        const newId: number = numbering.createInstanceFromAbstract(existing.abstractNumId);
        const restarted: NumberingInstance = numbering.getNumbering(newId);
        if (restarted === undefined) {
            throw new DocxError('content/invalid-num-id', 'Failed to create restarted numbering instance');
        }
        restarted.setStartOverride(level, start);
        numbering.markDirty();
        this.paragraph.numId = newId;
        this.paragraph.listLevel = level;
    }

    /**
     * Increase the active list level by one (max 8). No-op when not in a list or already at 8.
     *
     * @returns {void} Nothing is returned.
     */
    increaseIndentLevel(): void {
        if (this.paragraph.numId === undefined) {
            return;
        }
        const current: number = this.activeLevelIndex();
        if (current >= MAX_LIST_LEVEL) {
            return;
        }
        this.paragraph.listLevel = current + 1;
    }

    /**
     * Decrease the active list level by one (min 0). No-op when not in a list or already at 0.
     * Does not remove list membership at level 0.
     *
     * @returns {void} Nothing is returned.
     */
    decreaseIndentLevel(): void {
        if (this.paragraph.numId === undefined) {
            return;
        }
        const current: number = this.activeLevelIndex();
        if (current <= 0) {
            return;
        }
        this.paragraph.listLevel = current - 1;
    }

    /**
     * Remove list membership (`w:numPr` / numId and ilvl) without deleting catalog definitions.
     *
     * @returns {void} Nothing is returned.
     */
    removeList(): void {
        this.paragraph.numId = undefined;
        this.paragraph.listLevel = undefined;
        this.listStyleNameValue = undefined;
    }

    private catalog(): NumberingPart {
        return numberingFor(this.paragraph.owningDocument());
    }

    private activeLevelIndex(): number {
        const level: number = this.paragraph.listLevel;
        return level !== undefined ? level : 0;
    }

    private assertLevel(value: number): void {
        if (typeof value !== 'number' || !Number.isFinite(value) || Math.floor(value) !== value) {
            throw new InvalidArgumentError('list level must be an integer from 0 through 8');
        }
        if (value < 0 || value > MAX_LIST_LEVEL) {
            throw new InvalidArgumentError('list level must be an integer from 0 through 8');
        }
    }

    private assertStartAt(value: number): void {
        if (typeof value !== 'number' || !Number.isFinite(value) || Math.floor(value) !== value) {
            throw new InvalidArgumentError('startAt must be a finite integer');
        }
        if (value < 0) {
            throw new InvalidArgumentError('startAt must be a non-negative integer');
        }
    }

    /**
     * When abstract is already resolved, ensure `ilvl` exists; pending lists skip (nine levels on materialize).
     *
     * @param {number} level - The level.
     * @returns {void} Nothing is returned.
     */
    private assertLevelExistsOnAbstract(level: number): void {
        const listId: number = this.paragraph.numId;
        if (listId === undefined) {
            return;
        }
        try {
            const part: NumberingPart = this.catalog();
            const instance: NumberingInstance = part.getNumbering(listId);
            if (instance === undefined) {
                return;
            }
            const abstract: AbstractNumbering = part.getAbstractNumbering(instance.abstractNumId);
            if (abstract === undefined) {
                return;
            }
            const override: NumberingLevelOverride = instance.levelOverrides.find((entry: NumberingLevelOverride) => entry.ilvl === level);
            if (override !== undefined && override.level !== undefined) {
                return;
            }
            const fromAbstract: NumberingLevel = abstract.levels.find((entry: NumberingLevel) => entry.ilvl === level);
            if (fromAbstract === undefined) {
                throw new DocxError(
                    'content/invalid-list-level',
                    'List level ' + String(level) + ' does not exist on numbering instance ' + String(listId)
                );
            }
        } catch (err) {
            if (err instanceof DocxError || err instanceof InvalidArgumentError) {
                throw err;
            }
            // catalog unavailable — skip existence check
        }
    }

    /**
     *  Map pending decimal ids to decimal ensure format; default bullet.
     *
     * @returns {string | string} The result.
     */
    private inferEnsureFormat(): 'bullet' | 'decimal' {
        const listId: number = this.paragraph.numId;
        if (listId === undefined) {
            return 'bullet';
        }
        try {
            const part: NumberingPart = this.catalog();
            if (part.isPendingDecimal(listId)) {
                return 'decimal';
            }
            const numberFormat: string = this.numberFormat;
            if (numberFormat !== undefined && numberFormat !== 'bullet') {
                return 'decimal';
            }
        } catch {
            // ignore
        }
        return 'bullet';
    }
}

/**
 * @param {NumberingPart} part - The part.
 * @param {number} numId - The num id.
 * @param {number} level - The level.
 * @returns {NumberingLevel | undefined} The result.
 * @private
 */
export function resolveLevelDefinition(
    part: NumberingPart,
    numId: number,
    level: number
): NumberingLevel | undefined {
    const instance: NumberingInstance = part.getNumbering(numId);
    if (instance === undefined) {
        return undefined;
    }
    const abstract: AbstractNumbering = part.getAbstractNumbering(instance.abstractNumId);
    if (abstract === undefined) {
        return undefined;
    }
    const override: NumberingLevelOverride = instance.levelOverrides.find((entry: NumberingLevelOverride) => entry.ilvl === level);
    if (override !== undefined && override.level !== undefined) {
        return override.level;
    }
    const fromAbstract: NumberingLevel = abstract.levels.find((entry: NumberingLevel) => entry.ilvl === level);
    if (fromAbstract !== undefined) {
        return fromAbstract;
    }
    // Do not silently fall back to level 0 when the requested level is missing.
    return undefined;
}

function resolveNumberingStyleToInstance(
    numbering: NumberingPart,
    styleId: string,
    displayName: string | undefined
): number {
    for (const abs of numbering.abstractNumberings) {
        const matchesStyle: boolean =
      abs.styleLink === styleId ||
      (displayName !== undefined && abs.styleLink === displayName) ||
      abs.name === styleId ||
      (displayName !== undefined && abs.name === displayName);
        if (!matchesStyle) {
            if (abs.numStyleLink === styleId || (displayName !== undefined && abs.numStyleLink === displayName)) {
                // External numStyleLink without a local abstract binding — keep searching.
                continue;
            }
            continue;
        }
        // Reuse an existing w:num for this abstract so continued applyStyle shares counters.
        for (const inst of numbering.numberings) {
            if (inst.abstractNumId === abs.abstractNumId) {
                return inst.numId;
            }
        }
        return numbering.createInstanceFromAbstract(abs.abstractNumId);
    }
    throw new DocxError(
        'content/unresolved-numbering-style',
        'No numbering definition is linked to style "' + styleId + '"'
    );
}
