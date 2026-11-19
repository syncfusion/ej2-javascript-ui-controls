/**
 * Workbook protection — lock structure and/or windows so the workbook layout cannot be changed freely.
 *
 * This is Excel’s “Protect Workbook” (structure and windows), **not** file encryption.
 * Call {@link Workbook.protect} with optional password and {@link WorkbookProtectionOptions}.
 * Unlike sheet protection, options use **lock** polarity (`true` means that feature is locked).
 *
 * Citations:
 * - ECMA-376-1 §18.2.29 (`workbookProtection`)
 * - transitional sml.xsd `CT_WorkbookProtection` (~L4371–4387)
 * - `CT_Workbook` sequence: after `workbookPr`, before `bookViews` (rank 40)
 * - MS-OE376 iterative password hash (same as sheet: SHA-512, salt prepended)
 * - docs/specs/workbook-protection.md; docs/ooxml-mapping/workbook-protection.md
 */

import {
    InvalidArgumentError,
    InvalidProtectionError
} from '../core/errors';
import {
    attrsToXmlExcluding,
    escapeXml,
    parseAttrMap
} from '../core/xml/minimal-xml';
import { hashPasswordModern,
    SHEET_PROTECTION_ALGORITHM,
    SHEET_PROTECTION_DEFAULT_SPIN_COUNT,
    verifyPasswordModern, ModernHash } from '../worksheet/sheet-protection';

/** Default spin count for modern workbook password hash (same as sheet). */
export const WORKBOOK_PROTECTION_DEFAULT_SPIN_COUNT: number =
  SHEET_PROTECTION_DEFAULT_SPIN_COUNT;

/** Algorithm name authored on new protect. */
export const WORKBOOK_PROTECTION_ALGORITHM: string = SHEET_PROTECTION_ALGORITHM;

/**
 * Options for {@link Workbook.protect}.
 *
 * Each flag is **lock** polarity: `true` means that capability is locked for the user.
 */
export interface WorkbookProtectionOptions {
    /**
     * Prevent adding, deleting, renaming, or reordering sheets.
     * Default `true` when you call protect.
     */
    lockStructure?: boolean;
    /**
     * Prevent resizing or moving workbook windows.
     * Default `false`.
     */
    lockWindows?: boolean;
    /**
     * Lock shared-workbook revision tracking. Mostly preserved when opening existing files;
     * default `false` on new protect.
     */
    lockRevision?: boolean;
}

/**
 * Read-only view of the workbook’s current protection settings.
 *
 * Returned by {@link Workbook.workbookProtection} when protection is on;
 * otherwise that property is `undefined`.
 */
export interface WorkbookProtectionInfo {
    readonly isProtected: true;
    /** `true` when unprotecting requires a password. */
    readonly hasPassword: boolean;
    /** Effective lock flags after defaults are applied. */
    readonly options: Readonly<Required<WorkbookProtectionOptions>>;
    /**
     * Modern OOXML `workbookAlgorithmName` when present (e.g. `SHA-512`).
     * Undefined for password-less protection or legacy-only password.
     */
    readonly algorithmName: string | undefined;
    /**
     * Modern OOXML `workbookHashValue` (base64) when present.
     * Read-only snapshot of wire material; not a cleartext password.
     */
    readonly hashValue: string | undefined;
    /**
     * Modern OOXML `workbookSaltValue` (base64) when present.
     */
    readonly saltValue: string | undefined;
    /**
     * Modern OOXML `workbookSpinCount` when present.
     */
    readonly spinCount: number | undefined;
}

/**
 * Wire model for `workbookProtection` (empty element, attributes only).
 *
 * @private
 */
export interface WorkbookProtectionModel {
    /** Whether a `workbookProtection` element is present / authored. */
    readonly present: boolean;
    /** Public lock flags (direct wire polarity). */
    readonly options: Required<WorkbookProtectionOptions>;
    /** Modern `workbookAlgorithmName` when present. */
    readonly algorithmName: string | undefined;
    /** Modern `workbookHashValue` (base64) when present. */
    readonly hashValue: string | undefined;
    /** Modern `workbookSaltValue` (base64) when present. */
    readonly saltValue: string | undefined;
    /** Modern `workbookSpinCount` when present. */
    readonly spinCount: number | undefined;
    /**
     * Legacy `workbookPassword` ST_UnsignedShortHex when present (preserve-only;
     * never authored by `protect()`).
     */
    readonly legacyPassword: string | undefined;
    /** Legacy `workbookPasswordCharacterSet` when present. */
    readonly legacyPasswordCharacterSet: string | undefined;
    /** Preserved `revisionsPassword`. */
    readonly revisionsPassword: string | undefined;
    /** Preserved `revisionsPasswordCharacterSet`. */
    readonly revisionsPasswordCharacterSet: string | undefined;
    /** Preserved revisions modern hash material. */
    readonly revisionsAlgorithmName: string | undefined;
    readonly revisionsHashValue: string | undefined;
    readonly revisionsSaltValue: string | undefined;
    readonly revisionsSpinCount: number | undefined;
    /** Unknown attributes preserved as XML fragment. */
    readonly extraAttrsXml: string;
}

/**
 * Host notifications for protection mutations.
 *
 * @private
 */
export interface WorkbookProtectionHost {
    markDirty(): void;
}

/**
 * Defaults when calling `protect()` without options (XlsIO structure protect).
 *
 * @private
 */
export const DEFAULT_WORKBOOK_PROTECT_OPTIONS: Readonly<
Required<WorkbookProtectionOptions>
> = Object.freeze({
    lockStructure: true,
    lockWindows: false,
    lockRevision: false
});

/**
 * XSD defaults for lock booleans (all false).
 * Citation: sml.xsd `CT_WorkbookProtection`.
 */
const XSD_LOCK_DEFAULTS: { lockStructure: boolean; lockWindows: boolean; lockRevision: boolean; } = {
    lockStructure: false,
    lockWindows: false,
    lockRevision: false
};

const KNOWN_WIRE_ATTRS: Set<string> = new Set([
    'workbookPassword',
    'workbookPasswordCharacterSet',
    'revisionsPassword',
    'revisionsPasswordCharacterSet',
    'lockStructure',
    'lockWindows',
    'lockRevision',
    'revisionsAlgorithmName',
    'revisionsHashValue',
    'revisionsSaltValue',
    'revisionsSpinCount',
    'workbookAlgorithmName',
    'workbookHashValue',
    'workbookSaltValue',
    'workbookSpinCount'
]);

const EMPTY_MODEL: WorkbookProtectionModel = {
    present: false,
    options: { ...DEFAULT_WORKBOOK_PROTECT_OPTIONS },
    algorithmName: undefined,
    hashValue: undefined,
    saltValue: undefined,
    spinCount: undefined,
    legacyPassword: undefined,
    legacyPasswordCharacterSet: undefined,
    revisionsPassword: undefined,
    revisionsPasswordCharacterSet: undefined,
    revisionsAlgorithmName: undefined,
    revisionsHashValue: undefined,
    revisionsSaltValue: undefined,
    revisionsSpinCount: undefined,
    extraAttrsXml: ''
};

/**
 * Mutable workbook-protection store bound to a workbook.
 *
 * @private
 */
export class WorkbookProtectionImpl {
    private model: WorkbookProtectionModel = cloneModel(EMPTY_MODEL);
    private host: WorkbookProtectionHost | undefined;

    /**
     * Creates a new instance.
     *
     * @param {WorkbookProtectionModel} [initial] - initial value.
     */
    public constructor(initial?: WorkbookProtectionModel) {
        if (initial !== undefined) {
            this.model = cloneModel(initial);
        }
    }

    /**
     * bindHost function.
     *
     * @param {WorkbookProtectionHost} host - host value.
     * @returns {void} Nothing.
     * @private
     */
    public bindHost(host: WorkbookProtectionHost): void {
        this.host = host;
    }

    /**
     * replaceFromParse function.
     *
     * @param {WorkbookProtectionModel} model - model value.
     * @returns {void} Nothing.
     * @private
     */
    public replaceFromParse(model: WorkbookProtectionModel): void {
        this.model = cloneModel(model);
    }

    /**
     * toModel function.
     *
     * @returns {WorkbookProtectionModel} Function result.
     * @private
     */
    public toModel(): WorkbookProtectionModel {
        return cloneModel(this.model);
    }

    /**
     * True when protection is active: element present and at least one lock or
     * password material exists.
     *
     * @returns {boolean} Function result.
     */
    public get isProtected(): boolean {
        if (!this.model.present) {
            return false;
        }
        const o: Required<WorkbookProtectionOptions> = this.model.options;
        return (
            o.lockStructure ||
      o.lockWindows ||
      o.lockRevision ||
      modelHasPassword(this.model)
        );
    }

    /**
     * Snapshot when protected; `undefined` when not.
     *
     * @returns {WorkbookProtectionInfo | undefined} Function result.
     */
    public get workbookProtection(): WorkbookProtectionInfo | undefined {
        if (!this.isProtected) {
            return undefined;
        }
        return {
            isProtected: true,
            hasPassword: modelHasPassword(this.model),
            options: { ...this.model.options },
            algorithmName: this.model.algorithmName,
            hashValue: this.model.hashValue,
            saltValue: this.model.saltValue,
            spinCount: this.model.spinCount
        };
    }

    /**
     * Enable or replace workbook structure/windows protection.
     *
     * @param {string} [password] - password value.
     * @param {WorkbookProtectionOptions} [options] - options value.
     * @returns {void} Nothing.
     */
    public protect(
        password?: string,
        options?: WorkbookProtectionOptions
    ): void {
        const merged: Required<WorkbookProtectionOptions> = mergeProtectOptions(options);
        let algorithmName: string | undefined;
        let hashValue: string | undefined;
        let saltValue: string | undefined;
        let spinCount: number | undefined;

        // eslint-disable-next-line security/detect-possible-timing-attacks -- presence check only; secret compare uses timingSafeEqual
        if (password !== undefined) {
            if (typeof password !== 'string') {
                throw new InvalidArgumentError('protect password must be a string');
            }
            if (password.length > 0) {
                const hashed: ModernHash = hashPasswordModern(password);
                algorithmName = hashed.algorithmName;
                hashValue = hashed.hashValue;
                saltValue = hashed.saltValue;
                spinCount = hashed.spinCount;
            }
        }

        this.model = {
            present: true,
            options: merged,
            algorithmName,
            hashValue,
            saltValue,
            spinCount,
            legacyPassword: undefined,
            legacyPasswordCharacterSet: undefined,
            revisionsPassword: undefined,
            revisionsPasswordCharacterSet: undefined,
            revisionsAlgorithmName: undefined,
            revisionsHashValue: undefined,
            revisionsSaltValue: undefined,
            revisionsSpinCount: undefined,
            extraAttrsXml: ''
        };
        if (this.host != null) { this.host.markDirty(); }
    }

    /**
     * Remove workbook protection.
     *
     * @param {string} [password] - password value.
     * @returns {void} Nothing.
     * @throws InvalidProtectionError when password is required/wrong/unsupported.
     */
    public unprotect(password?: string): void {
        if (!this.isProtected) {
            return;
        }

        if (modelHasPassword(this.model)) {
            const pwd: string = (password != null ? password : '');
            if (pwd.length === 0) {
                throw new InvalidProtectionError(
                    'Password is required to unprotect this workbook'
                );
            }

            const hasModern: boolean =
        this.model.hashValue !== undefined &&
        this.model.hashValue.length > 0 &&
        this.model.saltValue !== undefined &&
        this.model.saltValue.length > 0;

            if (hasModern) {
                const algo: string = (this.model.algorithmName != null ? this.model.algorithmName : WORKBOOK_PROTECTION_ALGORITHM);
                if (!isSupportedAlgorithm(algo)) {
                    throw new InvalidProtectionError(
                        `Unsupported workbook protection algorithm "${algo}"`
                    );
                }
                const spin: number =
          this.model.spinCount !== undefined &&
          Number.isFinite(this.model.spinCount) &&
          this.model.spinCount >= 0
              ? Math.floor(this.model.spinCount)
              : WORKBOOK_PROTECTION_DEFAULT_SPIN_COUNT;
                const salt: string = this.model.saltValue;
                const hash: string = this.model.hashValue;
                if (salt === undefined || hash === undefined) {
                    throw new InvalidProtectionError('Incorrect password');
                }
                const ok: boolean = verifyPasswordModern(pwd, salt, hash, spin);
                if (!ok) {
                    throw new InvalidProtectionError('Incorrect password');
                }
            } else if (
                this.model.legacyPassword !== undefined &&
        this.model.legacyPassword.length > 0
            ) {
                // Legacy XOR password: cannot cryptographically verify. Spec policy:
                // require non-empty password argument only (best-effort obstructive).
            } else {
                throw new InvalidProtectionError('Incorrect password');
            }
        }

        this.model = cloneModel(EMPTY_MODEL);
        if (this.host != null) { this.host.markDirty(); }
    }
}

/**
 * Parse a `workbookProtection` element into a model.
 *
 * @param {string} xml - xml value.
 * @returns {WorkbookProtectionModel} Function result.
 * @private
 */
export function parseWorkbookProtectionXml(
    xml: string
): WorkbookProtectionModel {
    const openAttrs: string = elementOpenAttrsLocal(xml);
    const attrs: Map<string, string> = parseAttrMap(openAttrs);

    const options: Required<WorkbookProtectionOptions> = {
        lockStructure: parseBoolAttr(
            attrs.get('lockStructure'),
            XSD_LOCK_DEFAULTS.lockStructure
        ),
        lockWindows: parseBoolAttr(
            attrs.get('lockWindows'),
            XSD_LOCK_DEFAULTS.lockWindows
        ),
        lockRevision: parseBoolAttr(
            attrs.get('lockRevision'),
            XSD_LOCK_DEFAULTS.lockRevision
        )
    };

    const algorithmName: string = emptyToUndefined(attrs.get('workbookAlgorithmName'));
    const hashValue: string = emptyToUndefined(attrs.get('workbookHashValue'));
    const saltValue: string = emptyToUndefined(attrs.get('workbookSaltValue'));
    const spinCount: number = parseSpinCount(attrs.get('workbookSpinCount'));

    const legacyPassword: string = emptyToUndefined(attrs.get('workbookPassword'));
    const legacyPasswordCharacterSet: string = emptyToUndefined(
        attrs.get('workbookPasswordCharacterSet')
    );

    const revisionsPassword: string = emptyToUndefined(attrs.get('revisionsPassword'));
    const revisionsPasswordCharacterSet: string = emptyToUndefined(
        attrs.get('revisionsPasswordCharacterSet')
    );
    const revisionsAlgorithmName: string = emptyToUndefined(
        attrs.get('revisionsAlgorithmName')
    );
    const revisionsHashValue: string = emptyToUndefined(attrs.get('revisionsHashValue'));
    const revisionsSaltValue: string = emptyToUndefined(attrs.get('revisionsSaltValue'));
    const revisionsSpinCount: number = parseSpinCount(attrs.get('revisionsSpinCount'));

    const extraAttrsXml: string = attrsToXmlExcluding(attrs, KNOWN_WIRE_ATTRS);

    return {
        present: true,
        options,
        algorithmName,
        hashValue,
        saltValue,
        spinCount,
        legacyPassword,
        legacyPasswordCharacterSet,
        revisionsPassword,
        revisionsPasswordCharacterSet,
        revisionsAlgorithmName,
        revisionsHashValue,
        revisionsSaltValue,
        revisionsSpinCount,
        extraAttrsXml
    };
}

/**
 * Serialize model to a `workbookProtection` element, or `undefined` when absent.
 * Omits lock attributes that equal XSD defaults (false).
 *
 * @param {WorkbookProtectionModel | undefined} model - model value.
 * @returns {string | undefined} Function result.
 * @private
 */
export function serializeWorkbookProtectionXml(
    model: WorkbookProtectionModel | undefined
): string | undefined {
    if (model === undefined || !model.present) {
        return undefined;
    }

    const parts: string[] = [];
    const o: Required<WorkbookProtectionOptions> = model.options;
    pushBoolIfNotDefault(
        parts,
        'lockStructure',
        o.lockStructure,
        XSD_LOCK_DEFAULTS.lockStructure
    );
    pushBoolIfNotDefault(
        parts,
        'lockWindows',
        o.lockWindows,
        XSD_LOCK_DEFAULTS.lockWindows
    );
    pushBoolIfNotDefault(
        parts,
        'lockRevision',
        o.lockRevision,
        XSD_LOCK_DEFAULTS.lockRevision
    );

    if (model.algorithmName !== undefined && model.algorithmName.length > 0) {
        parts.push(
            `workbookAlgorithmName="${escapeXml(model.algorithmName)}"`
        );
    }
    if (model.hashValue !== undefined && model.hashValue.length > 0) {
        parts.push(`workbookHashValue="${escapeXml(model.hashValue)}"`);
    }
    if (model.saltValue !== undefined && model.saltValue.length > 0) {
        parts.push(`workbookSaltValue="${escapeXml(model.saltValue)}"`);
    }
    if (model.spinCount !== undefined) {
        parts.push(`workbookSpinCount="${model.spinCount}"`);
    }
    if (model.legacyPassword !== undefined && model.legacyPassword.length > 0) {
        parts.push(`workbookPassword="${escapeXml(model.legacyPassword)}"`);
    }
    if (
        model.legacyPasswordCharacterSet !== undefined &&
    model.legacyPasswordCharacterSet.length > 0
    ) {
        parts.push(
            `workbookPasswordCharacterSet="${escapeXml(model.legacyPasswordCharacterSet)}"`
        );
    }
    if (
        model.revisionsPassword !== undefined &&
    model.revisionsPassword.length > 0
    ) {
        parts.push(
            `revisionsPassword="${escapeXml(model.revisionsPassword)}"`
        );
    }
    if (
        model.revisionsPasswordCharacterSet !== undefined &&
    model.revisionsPasswordCharacterSet.length > 0
    ) {
        parts.push(
            `revisionsPasswordCharacterSet="${escapeXml(model.revisionsPasswordCharacterSet)}"`
        );
    }
    if (
        model.revisionsAlgorithmName !== undefined &&
    model.revisionsAlgorithmName.length > 0
    ) {
        parts.push(
            `revisionsAlgorithmName="${escapeXml(model.revisionsAlgorithmName)}"`
        );
    }
    if (
        model.revisionsHashValue !== undefined &&
    model.revisionsHashValue.length > 0
    ) {
        parts.push(
            `revisionsHashValue="${escapeXml(model.revisionsHashValue)}"`
        );
    }
    if (
        model.revisionsSaltValue !== undefined &&
    model.revisionsSaltValue.length > 0
    ) {
        parts.push(
            `revisionsSaltValue="${escapeXml(model.revisionsSaltValue)}"`
        );
    }
    if (model.revisionsSpinCount !== undefined) {
        parts.push(`revisionsSpinCount="${model.revisionsSpinCount}"`);
    }
    if (model.extraAttrsXml.trim().length > 0) {
        parts.push(model.extraAttrsXml.trim());
    }

    if (parts.length === 0) {
        return '<workbookProtection/>';
    }
    return `<workbookProtection ${parts.join(' ')}/>`;
}

/* ── helpers ─────────────────────────────────────────────────────────── */

/**
 * mergeProtectOptions function.
 *
 * @param {WorkbookProtectionOptions | undefined} options - options value.
 * @returns {*} Function result.
 */
function mergeProtectOptions(
    options: WorkbookProtectionOptions | undefined
): Required<WorkbookProtectionOptions> {
    if (options === undefined) {
        return { ...DEFAULT_WORKBOOK_PROTECT_OPTIONS };
    }
    if (typeof options !== 'object' || options === null) {
        throw new InvalidArgumentError('protect options must be an object');
    }
    const out: Required<WorkbookProtectionOptions> = {
        ...DEFAULT_WORKBOOK_PROTECT_OPTIONS
    };
    assignBoolOption(out, options, 'lockStructure');
    assignBoolOption(out, options, 'lockWindows');
    assignBoolOption(out, options, 'lockRevision');
    return out;
}

/**
 * assignBoolOption function.
 *
 * @param {*} target - target value.
 * @param {WorkbookProtectionOptions} source - source value.
 * @param {string} key - key value.
 * @returns {void} Nothing.
 */
function assignBoolOption(
    target: Required<WorkbookProtectionOptions>,
    source: WorkbookProtectionOptions,
    key: keyof WorkbookProtectionOptions
): void {
    // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
    const v: boolean = source[key];
    if (v === undefined) {
        return;
    }
    if (typeof v !== 'boolean') {
        throw new InvalidProtectionError(
            `Workbook protection option "${key}" must be a boolean`
        );
    }
    // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
    target[key] = v;
}

/**
 * modelHasPassword function.
 *
 * @param {WorkbookProtectionModel} model - model value.
 * @returns {boolean} Function result.
 */
function modelHasPassword(model: WorkbookProtectionModel): boolean {
    if (
        model.hashValue !== undefined &&
    model.hashValue.length > 0 &&
    model.saltValue !== undefined &&
    model.saltValue.length > 0
    ) {
        return true;
    }
    return (
        model.legacyPassword !== undefined && model.legacyPassword.length > 0
    );
}

/**
 * cloneModel function.
 *
 * @param {WorkbookProtectionModel} m - m value.
 * @returns {WorkbookProtectionModel} Function result.
 */
function cloneModel(m: WorkbookProtectionModel): WorkbookProtectionModel {
    return {
        present: m.present,
        options: { ...m.options },
        algorithmName: m.algorithmName,
        hashValue: m.hashValue,
        saltValue: m.saltValue,
        spinCount: m.spinCount,
        legacyPassword: m.legacyPassword,
        legacyPasswordCharacterSet: m.legacyPasswordCharacterSet,
        revisionsPassword: m.revisionsPassword,
        revisionsPasswordCharacterSet: m.revisionsPasswordCharacterSet,
        revisionsAlgorithmName: m.revisionsAlgorithmName,
        revisionsHashValue: m.revisionsHashValue,
        revisionsSaltValue: m.revisionsSaltValue,
        revisionsSpinCount: m.revisionsSpinCount,
        extraAttrsXml: m.extraAttrsXml
    };
}

/**
 * parseBoolAttr function.
 *
 * @param {string | undefined} raw - raw value.
 * @param {boolean} defaultValue - defaultValue value.
 * @returns {boolean} Function result.
 */
function parseBoolAttr(
    raw: string | undefined,
    defaultValue: boolean
): boolean {
    if (raw === undefined) {
        return defaultValue;
    }
    const v: string = raw.trim().toLowerCase();
    if (v === '1' || v === 'true') {
        return true;
    }
    if (v === '0' || v === 'false') {
        return false;
    }
    return defaultValue;
}

/**
 * parseSpinCount function.
 *
 * @param {string | undefined} raw - raw value.
 * @returns {number | undefined} Function result.
 */
function parseSpinCount(raw: string | undefined): number | undefined {
    if (raw === undefined || raw.trim().length === 0) {
        return undefined;
    }
    const n: number = Number.parseInt(raw, 10);
    if (Number.isFinite(n) && n >= 0) {
        return n;
    }
    return undefined;
}

/**
 * emptyToUndefined function.
 *
 * @param {string | undefined} raw - raw value.
 * @returns {string | undefined} Function result.
 */
function emptyToUndefined(raw: string | undefined): string | undefined {
    if (raw === undefined) {
        return undefined;
    }
    return raw.length > 0 ? raw : undefined;
}

/**
 * pushBoolIfNotDefault function.
 *
 * @param {string[]} parts - parts value.
 * @param {string} name - name value.
 * @param {boolean} value - value value.
 * @param {boolean} xsdDefault - xsdDefault value.
 * @returns {void} Nothing.
 */
function pushBoolIfNotDefault(
    parts: string[],
    name: string,
    value: boolean,
    xsdDefault: boolean
): void {
    if (value === xsdDefault) {
        return;
    }
    parts.push(`${name}="${value ? '1' : '0'}"`);
}

/**
 * elementOpenAttrsLocal function.
 *
 * @param {string} el - el value.
 * @returns {string} Function result.
 */
function elementOpenAttrsLocal(el: string): string {
    const trimmed: string = el.trim();
    const m: RegExpExecArray = /^<[^>\s]+\s([^>]*?)\/?>/.exec(trimmed);
    return ((__t: string) => __t != null ? __t : '')(m == null ? undefined : m[1]);
}

/**
 * isSupportedAlgorithm function.
 *
 * @param {string} name - name value.
 * @returns {boolean} Function result.
 */
function isSupportedAlgorithm(name: string): boolean {
    const n: string = name.trim().toUpperCase();
    return n === 'SHA-512' || n === 'SHA512';
}
