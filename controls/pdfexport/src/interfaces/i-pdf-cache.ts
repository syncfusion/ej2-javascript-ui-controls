/**
 * `IPdfCache.ts` interface for EJ2-PDF
 * Interface of the objects that support caching of their internals.
 * @private
 */
import { IPdfPrimitive } from './i-pdf-primitives';
export interface IPdfCache {
    /**
     * Checks whether the object `is similar to another object`.
     * @private
     */
    equalsTo(obj : IPdfCache) : boolean;
    /**
     * Returns `internals of the object`.
     * @private
     */
    getInternals() : IPdfPrimitive;
    /**
     * Sets `internals of the object`.
     * @private
     */
    setInternals(internals : IPdfPrimitive) : void;
}