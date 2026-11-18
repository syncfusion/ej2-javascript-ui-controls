/**
 * Side-effect module: registers the trial-license watermark bridge on `Workbook`.
 *
 * @private
 */
import { setLicenseWatermarkApplicator } from '../workbook/workbook';
import { applyLicenseWatermark } from './license-watermark';

setLicenseWatermarkApplicator(applyLicenseWatermark);
