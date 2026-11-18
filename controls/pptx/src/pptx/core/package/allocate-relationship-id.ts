import { arrayAt } from '../util/es5-compat';
/**
 * Allocates the next `rIdN` relationship Id for a relationships collection.
 */
import { PackageRelationship } from './relationships';
/**
 * Next relationship Id: `rId` + (max numeric suffix among `rIdN` form + 1).
 *
 * @remarks Non-`rIdN` ids are ignored for the max scan (left untouched). Used by add-slide and picture insert so both share one allocator.
 * @internal
 * @param {*} existing - Relationships already present on the source part.
 * @returns {string} A new Id such as `rId2` that does not collide with existing `rIdN` ids.
 */
export function allocateNextRelationshipId(existing: ReadonlyArray<PackageRelationship>): string {
    let max: number = 0;
    for (let i: number = 0; i < existing.length; i++) {
        const r: PackageRelationship = arrayAt(existing, i);
        const m: RegExpExecArray = /^rId(\d+)$/u.exec(r.id);
        if (m !== null) {
            const n: number = Number(m[1]);
            if (Number.isSafeInteger(n) && n > max) {
                max = n;
            }
        }

    }
    return `rId${String(max + 1)}`;
}
