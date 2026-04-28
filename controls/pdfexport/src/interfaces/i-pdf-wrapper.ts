/**
 * `IPdfWrapper.ts` interface for EJ2-PDF
 * Defines the basic interace of the various Wrapper.
 * @private
 */
import { IPdfPrimitive } from './i-pdf-primitives';
export interface IPdfWrapper {
    /**
     * Gets the `element`.
     * @private
     */
    element : IPdfPrimitive;
}