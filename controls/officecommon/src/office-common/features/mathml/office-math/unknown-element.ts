/**
 * Preservation of unrecognized Math elements.
 */

import { MathFunctionType } from './enums';
import { OfficeMathFunctionBase } from './function-base';
import { OfficeMathEntity } from './entity';
import { OpenXmlElement } from '../openxml';

/**
 * An unrecognized `m:*` element kept verbatim so a load and save does not lose content.
 *
 * @public
 */
export class OfficeMathUnknownElement extends OfficeMathFunctionBase {
    readonly type: MathFunctionType = MathFunctionType.Unknown;
    private readonly _localName: string;
    private readonly _xml: OpenXmlElement;

    /**
     * Creates the preserved element.
     *
     * @param {string} localName Local name of the element.
     * @param {OpenXmlElement} xml The original element tree.
     * @param {OfficeMathEntity} owner Optional owner.
     */
    constructor(localName: string, xml: OpenXmlElement, owner?: OfficeMathEntity) {
        super(owner);
        this._localName = localName;
        this._xml = xml;
    }

    /**
     * Local name of the preserved element.
     *
     * @returns {string} The local name.
     */
    get localName(): string { return this._localName; }

    /**
     * The preserved element tree, re-serialized verbatim.
     *
     * @returns {OpenXmlElement} The original element tree.
     */
    get preservedXml(): OpenXmlElement { return this._xml; }
}
