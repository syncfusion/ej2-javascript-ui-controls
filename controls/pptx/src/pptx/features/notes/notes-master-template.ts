/**
 * Minimal notes master so a created notes slide inherits font, alignment, and position.
 *
 * Citation: Transitional `pml.xsd` `CT_NotesMaster` (`cSld`, `clrMap`, `hf`, `txStyles`);
 * `ST_PlaceholderType` `hdr`, `dt`, `sldImg`, `body`, `ftr`, `sldNum`.
 * Boxes match the inspected notes master (page 6858000 x 9144000 EMU).
 *
 * @internal
 */
import { NOTES_MASTER_CONTENT_TYPE } from './constants';
import { ownerNamespace, officeRootNamespace } from '../../core/xml/office-dialect';
import { OFFICE_REL_ATTR_NS, PML_NS } from '../../core/presentation/constants';
import { DML_NS } from '../../core/shapes/constants';
import { InvalidPackageError } from '../../core/security/errors';

const encoder: TextEncoder = new TextEncoder();

/** @internal */
export const NOTES_MASTER_CREATE_CONTENT_TYPE: string = NOTES_MASTER_CONTENT_TYPE;

/**
 * @internal
 * @param namespace - PresentationML dialect of the source slide.
 * @returns UTF-8 notesMaster part bytes.
 */
export function buildMinimalNotesMasterPartBytes(namespace: string = PML_NS): Uint8Array {
    if (!officeRootNamespace(namespace, PML_NS)) {
        throw new InvalidPackageError('Invalid notes source dialect', {});
    }
    const a: string = ownerNamespace(namespace, DML_NS);
    const r: string = ownerNamespace(namespace, OFFICE_REL_ATTR_NS);
    const ph = (id: string, name: string, type: string, extra: string, xfrm: string, body: string): string =>
        '<p:sp><p:nvSpPr>' +
        `<p:cNvPr id="${id}" name="${name}"/>` +
        '<p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr>' +
        `<p:nvPr><p:ph type="${type}"${extra}/></p:nvPr></p:nvSpPr>` +
        `<p:spPr>${xfrm}<a:ln><a:headEnd type="none"/><a:tailEnd type="none"/></a:ln></p:spPr>` +
        `<p:txBody>${body}</p:txBody></p:sp>`;
    const box = (x: string, y: string, cx: string, cy: string): string =>
        `<a:xfrm><a:off x="${x}" y="${y}"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm>`;
    const insets = '<a:bodyPr lIns="91440" tIns="45720" rIns="91440" bIns="45720" wrap="square"/>';
    const bottom = '<a:bodyPr lIns="91440" tIns="45720" rIns="91440" bIns="45720" anchor="b" wrap="square"/>';
    const style = (align: string): string =>
        `<a:lstStyle><a:lvl1pPr algn="${align}"><a:defRPr sz="1200"/></a:lvl1pPr></a:lstStyle>`;
    const xml: string = '<?xml version="1.0" encoding="UTF-8"?>' +
        `<p:notesMaster xmlns:p="${namespace}" xmlns:a="${a}" xmlns:r="${r}">` +
        '<p:cSld><p:spTree>' +
        '<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/>' +
        ph('2', 'Header Placeholder 1', 'hdr', ' sz="quarter"', box('0', '0', '2971800', '458788'),
            `${insets}${style('l')}<a:p><a:pPr algn="l"/></a:p>`) +
        ph('3', 'Date Placeholder 2', 'dt', ' idx="1"', box('3884613', '0', '2971800', '458788'),
            `${insets}${style('r')}<a:p><a:pPr algn="r"/></a:p>`) +
        ph('4', 'Slide Image Placeholder 3', 'sldImg', ' idx="2"', box('685800', '1143000', '5486400', '3086100'),
            '<a:bodyPr/><a:lstStyle/><a:p><a:endParaRPr/></a:p>') +
        ph('5', 'Notes Placeholder 4', 'body', ' sz="quarter" idx="3"', box('685800', '4400550', '5486400', '3600450'),
            `${insets}<a:lstStyle/><a:p><a:endParaRPr/></a:p>`) +
        ph('6', 'Footer Placeholder 5', 'ftr', ' sz="quarter" idx="4"', box('0', '8685213', '2971800', '458787'),
            `${bottom}${style('l')}<a:p><a:pPr algn="l"/></a:p>`) +
        ph('7', 'Slide Number Placeholder 6', 'sldNum', ' sz="quarter" idx="5"', box('3884613', '8685213', '2971800', '458787'),
            `${bottom}${style('r')}<a:p><a:pPr algn="r"/><a:fld id="{B5F0D3C1-6A5E-4C0B-9E0A-2D3F5B7A9C11}" type="slidenum">` +
            '<a:rPr lang="en-US"/><a:t>\u2039#\u203A</a:t></a:fld><a:endParaRPr lang="en-US"/></a:p>') +
        '</p:spTree></p:cSld>' +
        '<p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" ' +
        'accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/>' +
        '<p:hf hdr="0" ftr="0" dt="0"/>' +
        '<p:notesStyle><a:lvl1pPr marL="0" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">' +
        '<a:defRPr sz="1200" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill>' +
        '<a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl1pPr></p:notesStyle>' +
        '</p:notesMaster>';
    return encoder.encode(xml);
}
