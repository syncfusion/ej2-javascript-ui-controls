/**
 * Side-effect module: registers the trial-license watermark bridge on `WordDocument`.
 *
 * @private
 */
import { setLicenseWatermarkApplicator } from '../document/document';
import { applyLicenseWatermark } from './license-watermark';

setLicenseWatermarkApplicator(applyLicenseWatermark);
