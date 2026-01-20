import { _PdfDictionary } from "../src/pdf/core/pdf-primitives";
import { _isNullOrUndefined } from "../src/pdf/core/utils";
export function setMeasureDictionary(measureDetail: any): _PdfDictionary {
    const measureDictionary: _PdfDictionary = new _PdfDictionary();
    measureDictionary.set('Type', 'Measure');
    measureDictionary.set('R', measureDetail.ratio);
    if (_isNullOrUndefined(measureDetail.x)) {
        const xNumberFormat: _PdfDictionary[] = createNumberFormat(measureDetail.x) as any;
        measureDictionary.set('X', xNumberFormat);
    }
    if (_isNullOrUndefined(measureDetail.distance)) {
        const dNumberFormat: _PdfDictionary[] = createNumberFormat(JSON.parse(measureDetail.distance)) as any;
        measureDictionary.set('D', dNumberFormat);
    }
    if (_isNullOrUndefined(measureDetail.area)) {
        const aNumberFormat: _PdfDictionary[] = createNumberFormat(JSON.parse(measureDetail.area)) as any;
        measureDictionary.set('A', aNumberFormat);
    }
    if (_isNullOrUndefined(measureDetail.angle)) {
        const tNumberFormat: _PdfDictionary[] = createNumberFormat(JSON.parse(measureDetail.angle)) as any;
        measureDictionary.set('T', tNumberFormat);
    }
    if (_isNullOrUndefined(measureDetail.volume)) {
        const vNumberFormat: _PdfDictionary[] = createNumberFormat(JSON.parse(measureDetail.volume)) as any;
        measureDictionary.set('V', vNumberFormat);
    }
    return measureDictionary;
}
export function createNumberFormat(numberFormatList: any) {
    var numberFormats: any[] = [];
    if (
        !_isNullOrUndefined(numberFormatList) ||
        numberFormatList.length === 0
    ) {
        return undefined;
    }
    for (var index = 0; index < numberFormatList.length; index++) {
        var numberFormatDictionary: _PdfDictionary = new _PdfDictionary();
        var numberFormat = numberFormatList[parseInt(index.toString(), 10)];
        numberFormatDictionary.set('Type', 'NumberFormat');
        numberFormatDictionary.set('U', numberFormat.unit);
        numberFormatDictionary.set('F', numberFormat.fractionalType);
        numberFormatDictionary.set('D', numberFormat.denominator);
        numberFormatDictionary.set('C', numberFormat.conversionFactor);
        numberFormatDictionary.set('FD', numberFormat.formatDenominator);
        numberFormats.push(numberFormatDictionary);
    }
    return numberFormats;
}
