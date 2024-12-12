import { Dictionary } from './../../pdf-primitives';
export class _Bidirectional {
    _indexes: number[] = [];
    _indexLevels: number[] = [];
    _mirroringShape: Dictionary<number, number> = new Dictionary<number, number>();
    /**
     * Creates a new instance of the `_Bidirectional` class.
     *
     * @private
     */
    constructor() {
        this._update();
    }
    _doMirrorShaping(text: string): string {
        const result: string[] = [];
        for (let i: number = 0; i < text.length; i++) {
            if (((this._indexLevels[Number.parseInt(i.toString(), 10)] & 1) === 1)
                && this._mirroringShape.containsKey(text[Number.parseInt(i.toString(), 10)].charCodeAt(0))) {
                const value: any = text[Number.parseInt(i.toString(), 10)].charCodeAt(0); // eslint-disable-line
                result[Number.parseInt(i.toString(), 10)] = String.fromCharCode(this._mirroringShape.getValue(value));
            } else {
                result[Number.parseInt(i.toString(), 10)] = text[Number.parseInt(i.toString(), 10)].toString();
            }
        }
        let res: string = '';
        for (let j: number = 0; j < result.length; j++) {
            res = res + result[Number.parseInt(j.toString(), 10)];
        }
        return res;
    }
    _getLogicalToVisualString(inputText: string, isRtl: boolean): string {
        const rtlCharacters: _RtlCharacters = new _RtlCharacters();
        this._indexLevels = rtlCharacters._getVisualOrder(inputText, isRtl);
        this._setDefaultIndexLevel();
        this._doOrder(0, this._indexLevels.length - 1);
        const text: string = this._doMirrorShaping(inputText);
        let resultBuilder: string = '';
        for (let i: number = 0; i < this._indexes.length; i++) {
            const index: number = this._indexes[Number.parseInt(i.toString(), 10)];
            resultBuilder += text[Number.parseInt(index.toString(), 10)];
        }
        return resultBuilder.toString();
    }
    _setDefaultIndexLevel(): void {
        for (let i: number = 0; i < this._indexLevels.length; i++) {
            this._indexes[Number.parseInt(i.toString(), 10)] = i;
        }
    }
    _doOrder(sIndex: number, eIndex: number): void {
        let max: number = this._indexLevels[Number.parseInt(sIndex.toString(), 10)];
        let min: number = max;
        let odd: number = max;
        let even: number = max;
        for (let i: number = sIndex + 1; i <= eIndex; ++i) {
            const data: number = this._indexLevels[Number.parseInt(i.toString(), 10)];
            if (data > max) {
                max = data;
            } else if (data < min) {
                min = data;
            }
            odd &= data;
            even |= data;
        }
        if ((even & 1) === 0) {
            return;
        }
        if ((odd & 1) === 1) {
            this._reArrange(sIndex, eIndex + 1);
            return;
        }
        min |= 1;
        while (max >= min) {
            let pstart: number = sIndex;
            while (true) { // eslint-disable-line
                while (pstart <= eIndex) {
                    if (this._indexLevels[Number.parseInt(pstart.toString(), 10)] >= max) {
                        break;
                    }
                    pstart += 1;
                }
                if (pstart > eIndex) {
                    break;
                }
                let pend: number = pstart + 1;
                while (pend <= eIndex) {
                    if (this._indexLevels[Number.parseInt(pend.toString(), 10)] < max) {
                        break;
                    }
                    pend += 1;
                }
                this._reArrange(pstart, pend);
                pstart = pend + 1;
            }
            max -= 1;
        }
    }
    _reArrange(i: number, j: number): void {
        const length: number = (i + j) / 2;
        --j;
        for (; i < length; ++i, --j) {
            const temp: number = this._indexes[Number.parseInt(i.toString(), 10)];
            this._indexes[Number.parseInt(i.toString(), 10)] = this._indexes[Number.parseInt(j.toString(), 10)];
            this._indexes[Number.parseInt(j.toString(), 10)] = temp;
        }
    }
    _update(): void {
        this._mirroringShape.setValue(40, 41);
        this._mirroringShape.setValue(41, 40);
        this._mirroringShape.setValue(60, 62);
        this._mirroringShape.setValue(62, 60);
        this._mirroringShape.setValue(91, 93);
        this._mirroringShape.setValue(93, 91);
        this._mirroringShape.setValue(123, 125);
        this._mirroringShape.setValue(125, 123);
        this._mirroringShape.setValue(171, 187);
        this._mirroringShape.setValue(187, 171);
        this._mirroringShape.setValue(8249, 8250);
        this._mirroringShape.setValue(8250, 8249);
        this._mirroringShape.setValue(8261, 8262);
        this._mirroringShape.setValue(8262, 8261);
        this._mirroringShape.setValue(8317, 8318);
        this._mirroringShape.setValue(8318, 8317);
        this._mirroringShape.setValue(8333, 8334);
        this._mirroringShape.setValue(8334, 8333);
        this._mirroringShape.setValue(8712, 8715);
        this._mirroringShape.setValue(8713, 8716);
        this._mirroringShape.setValue(8714, 8717);
        this._mirroringShape.setValue(8715, 8712);
        this._mirroringShape.setValue(8716, 8713);
        this._mirroringShape.setValue(8717, 8714);
        this._mirroringShape.setValue(8725, 10741);
        this._mirroringShape.setValue(8764, 8765);
        this._mirroringShape.setValue(8765, 8764);
        this._mirroringShape.setValue(8771, 8909);
        this._mirroringShape.setValue(8786, 8787);
        this._mirroringShape.setValue(8787, 8786);
        this._mirroringShape.setValue(8788, 8789);
        this._mirroringShape.setValue(8789, 8788);
        this._mirroringShape.setValue(8804, 8805);
        this._mirroringShape.setValue(8805, 8804);
        this._mirroringShape.setValue(8806, 8807);
        this._mirroringShape.setValue(8807, 8806);
        this._mirroringShape.setValue(8808, 8809);
        this._mirroringShape.setValue(8809, 8808);
        this._mirroringShape.setValue(8810, 8811);
        this._mirroringShape.setValue(8811, 8810);
        this._mirroringShape.setValue(8814, 8815);
        this._mirroringShape.setValue(8815, 8814);
        this._mirroringShape.setValue(8816, 8817);
        this._mirroringShape.setValue(8817, 8816);
        this._mirroringShape.setValue(8818, 8819);
        this._mirroringShape.setValue(8819, 8818);
        this._mirroringShape.setValue(8820, 8821);
        this._mirroringShape.setValue(8821, 8820);
        this._mirroringShape.setValue(8822, 8823);
        this._mirroringShape.setValue(8823, 8822);
        this._mirroringShape.setValue(8824, 8825);
        this._mirroringShape.setValue(8825, 8824);
        this._mirroringShape.setValue(8826, 8827);
        this._mirroringShape.setValue(8827, 8826);
        this._mirroringShape.setValue(8828, 8829);
        this._mirroringShape.setValue(8829, 8828);
        this._mirroringShape.setValue(8830, 8831);
        this._mirroringShape.setValue(8831, 8830);
        this._mirroringShape.setValue(8832, 8833);
        this._mirroringShape.setValue(8833, 8832);
        this._mirroringShape.setValue(8834, 8835);
        this._mirroringShape.setValue(8835, 8834);
        this._mirroringShape.setValue(8836, 8837);
        this._mirroringShape.setValue(8837, 8836);
        this._mirroringShape.setValue(8838, 8839);
        this._mirroringShape.setValue(8839, 8838);
        this._mirroringShape.setValue(8840, 8841);
        this._mirroringShape.setValue(8841, 8840);
        this._mirroringShape.setValue(8842, 8843);
        this._mirroringShape.setValue(8843, 8842);
        this._mirroringShape.setValue(8847, 8848);
        this._mirroringShape.setValue(8848, 8847);
        this._mirroringShape.setValue(8849, 8850);
        this._mirroringShape.setValue(8850, 8849);
        this._mirroringShape.setValue(8856, 10680);
        this._mirroringShape.setValue(8866, 8867);
        this._mirroringShape.setValue(8867, 8866);
        this._mirroringShape.setValue(8870, 10974);
        this._mirroringShape.setValue(8872, 10980);
        this._mirroringShape.setValue(8873, 10979);
        this._mirroringShape.setValue(8875, 10981);
        this._mirroringShape.setValue(8880, 8881);
        this._mirroringShape.setValue(8881, 8880);
        this._mirroringShape.setValue(8882, 8883);
        this._mirroringShape.setValue(8883, 8882);
        this._mirroringShape.setValue(8884, 8885);
        this._mirroringShape.setValue(8885, 8884);
        this._mirroringShape.setValue(8886, 8887);
        this._mirroringShape.setValue(8887, 8886);
        this._mirroringShape.setValue(8905, 8906);
        this._mirroringShape.setValue(8906, 8905);
        this._mirroringShape.setValue(8907, 8908);
        this._mirroringShape.setValue(8908, 8907);
        this._mirroringShape.setValue(8909, 8771);
        this._mirroringShape.setValue(8912, 8913);
        this._mirroringShape.setValue(8913, 8912);
        this._mirroringShape.setValue(8918, 8919);
        this._mirroringShape.setValue(8919, 8918);
        this._mirroringShape.setValue(8920, 8921);
        this._mirroringShape.setValue(8921, 8920);
        this._mirroringShape.setValue(8922, 8923);
        this._mirroringShape.setValue(8923, 8922);
        this._mirroringShape.setValue(8924, 8925);
        this._mirroringShape.setValue(8925, 8924);
        this._mirroringShape.setValue(8926, 8927);
        this._mirroringShape.setValue(8927, 8926);
        this._mirroringShape.setValue(8928, 8929);
        this._mirroringShape.setValue(8929, 8928);
        this._mirroringShape.setValue(8930, 8931);
        this._mirroringShape.setValue(8931, 8930);
        this._mirroringShape.setValue(8932, 8933);
        this._mirroringShape.setValue(8933, 8932);
        this._mirroringShape.setValue(8934, 8935);
        this._mirroringShape.setValue(8935, 8934);
        this._mirroringShape.setValue(8936, 8937);
        this._mirroringShape.setValue(8937, 8936);
        this._mirroringShape.setValue(8938, 8939);
        this._mirroringShape.setValue(8939, 8938);
        this._mirroringShape.setValue(8940, 8941);
        this._mirroringShape.setValue(8941, 8940);
        this._mirroringShape.setValue(8944, 8945);
        this._mirroringShape.setValue(8945, 8944);
        this._mirroringShape.setValue(8946, 8954);
        this._mirroringShape.setValue(8947, 8955);
        this._mirroringShape.setValue(8948, 8956);
        this._mirroringShape.setValue(8950, 8957);
        this._mirroringShape.setValue(8951, 8958);
        this._mirroringShape.setValue(8954, 8946);
        this._mirroringShape.setValue(8955, 8947);
        this._mirroringShape.setValue(8956, 8948);
        this._mirroringShape.setValue(8957, 8950);
        this._mirroringShape.setValue(8958, 8951);
        this._mirroringShape.setValue(8968, 8969);
        this._mirroringShape.setValue(8969, 8968);
        this._mirroringShape.setValue(8970, 8971);
        this._mirroringShape.setValue(8971, 8970);
        this._mirroringShape.setValue(9001, 9002);
        this._mirroringShape.setValue(9002, 9001);
        this._mirroringShape.setValue(10088, 10089);
        this._mirroringShape.setValue(10089, 10088);
        this._mirroringShape.setValue(10090, 10091);
        this._mirroringShape.setValue(10091, 10090);
        this._mirroringShape.setValue(10092, 10093);
        this._mirroringShape.setValue(10093, 10092);
        this._mirroringShape.setValue(10094, 10095);
        this._mirroringShape.setValue(10095, 10094);
        this._mirroringShape.setValue(10096, 10097);
        this._mirroringShape.setValue(10097, 10096);
        this._mirroringShape.setValue(10098, 10099);
        this._mirroringShape.setValue(10099, 10098);
        this._mirroringShape.setValue(10100, 10101);
        this._mirroringShape.setValue(10101, 10100);
        this._mirroringShape.setValue(10197, 10198);
        this._mirroringShape.setValue(10198, 10197);
        this._mirroringShape.setValue(10205, 10206);
        this._mirroringShape.setValue(10206, 10205);
        this._mirroringShape.setValue(10210, 10211);
        this._mirroringShape.setValue(10211, 10210);
        this._mirroringShape.setValue(10212, 10213);
        this._mirroringShape.setValue(10213, 10212);
        this._mirroringShape.setValue(10214, 10215);
        this._mirroringShape.setValue(10215, 10214);
        this._mirroringShape.setValue(10216, 10217);
        this._mirroringShape.setValue(10217, 10216);
        this._mirroringShape.setValue(10218, 10219);
        this._mirroringShape.setValue(10219, 10218);
        this._mirroringShape.setValue(10627, 10628);
        this._mirroringShape.setValue(10628, 10627);
        this._mirroringShape.setValue(10629, 10630);
        this._mirroringShape.setValue(10630, 10629);
        this._mirroringShape.setValue(10631, 10632);
        this._mirroringShape.setValue(10632, 10631);
        this._mirroringShape.setValue(10633, 10634);
        this._mirroringShape.setValue(10634, 10633);
        this._mirroringShape.setValue(10635, 10636);
        this._mirroringShape.setValue(10636, 10635);
        this._mirroringShape.setValue(10637, 10640);
        this._mirroringShape.setValue(10638, 10639);
        this._mirroringShape.setValue(10639, 10638);
        this._mirroringShape.setValue(10640, 10637);
        this._mirroringShape.setValue(10641, 10642);
        this._mirroringShape.setValue(10642, 10641);
        this._mirroringShape.setValue(10643, 10644);
        this._mirroringShape.setValue(10644, 10643);
        this._mirroringShape.setValue(10645, 10646);
        this._mirroringShape.setValue(10646, 10645);
        this._mirroringShape.setValue(10647, 10648);
        this._mirroringShape.setValue(10648, 10647);
        this._mirroringShape.setValue(10680, 8856);
        this._mirroringShape.setValue(10688, 10689);
        this._mirroringShape.setValue(10689, 10688);
        this._mirroringShape.setValue(10692, 10693);
        this._mirroringShape.setValue(10693, 10692);
        this._mirroringShape.setValue(10703, 10704);
        this._mirroringShape.setValue(10704, 10703);
        this._mirroringShape.setValue(10705, 10706);
        this._mirroringShape.setValue(10706, 10705);
        this._mirroringShape.setValue(10708, 10709);
        this._mirroringShape.setValue(10709, 10708);
        this._mirroringShape.setValue(10712, 10713);
        this._mirroringShape.setValue(10713, 10712);
        this._mirroringShape.setValue(10714, 10715);
        this._mirroringShape.setValue(10715, 10714);
        this._mirroringShape.setValue(10741, 8725);
        this._mirroringShape.setValue(10744, 10745);
        this._mirroringShape.setValue(10745, 10744);
        this._mirroringShape.setValue(10748, 10749);
        this._mirroringShape.setValue(10749, 10748);
        this._mirroringShape.setValue(10795, 10796);
        this._mirroringShape.setValue(10796, 10795);
        this._mirroringShape.setValue(10797, 10796);
        this._mirroringShape.setValue(10798, 10797);
        this._mirroringShape.setValue(10804, 10805);
        this._mirroringShape.setValue(10805, 10804);
        this._mirroringShape.setValue(10812, 10813);
        this._mirroringShape.setValue(10813, 10812);
        this._mirroringShape.setValue(10852, 10853);
        this._mirroringShape.setValue(10853, 10852);
        this._mirroringShape.setValue(10873, 10874);
        this._mirroringShape.setValue(10874, 10873);
        this._mirroringShape.setValue(10877, 10878);
        this._mirroringShape.setValue(10878, 10877);
        this._mirroringShape.setValue(10879, 10880);
        this._mirroringShape.setValue(10880, 10879);
        this._mirroringShape.setValue(10881, 10882);
        this._mirroringShape.setValue(10882, 10881);
        this._mirroringShape.setValue(10883, 10884);
        this._mirroringShape.setValue(10884, 10883);
        this._mirroringShape.setValue(10891, 10892);
        this._mirroringShape.setValue(10892, 10891);
        this._mirroringShape.setValue(10897, 10898);
        this._mirroringShape.setValue(10898, 10897);
        this._mirroringShape.setValue(10899, 10900);
        this._mirroringShape.setValue(10900, 10899);
        this._mirroringShape.setValue(10901, 10902);
        this._mirroringShape.setValue(10902, 10901);
        this._mirroringShape.setValue(10903, 10904);
        this._mirroringShape.setValue(10904, 10903);
        this._mirroringShape.setValue(10905, 10906);
        this._mirroringShape.setValue(10906, 10905);
        this._mirroringShape.setValue(10907, 10908);
        this._mirroringShape.setValue(10908, 10907);
        this._mirroringShape.setValue(10913, 10914);
        this._mirroringShape.setValue(10914, 10913);
        this._mirroringShape.setValue(10918, 10919);
        this._mirroringShape.setValue(10919, 10918);
        this._mirroringShape.setValue(10920, 10921);
        this._mirroringShape.setValue(10921, 10920);
        this._mirroringShape.setValue(10922, 10923);
        this._mirroringShape.setValue(10923, 10922);
        this._mirroringShape.setValue(10924, 10925);
        this._mirroringShape.setValue(10925, 10924);
        this._mirroringShape.setValue(10927, 10928);
        this._mirroringShape.setValue(10928, 10927);
        this._mirroringShape.setValue(10931, 10932);
        this._mirroringShape.setValue(10932, 10931);
        this._mirroringShape.setValue(10939, 10940);
        this._mirroringShape.setValue(10940, 10939);
        this._mirroringShape.setValue(10941, 10942);
        this._mirroringShape.setValue(10942, 10941);
        this._mirroringShape.setValue(10943, 10944);
        this._mirroringShape.setValue(10944, 10943);
        this._mirroringShape.setValue(10945, 10946);
        this._mirroringShape.setValue(10946, 10945);
        this._mirroringShape.setValue(10947, 10948);
        this._mirroringShape.setValue(10948, 10947);
        this._mirroringShape.setValue(10949, 10950);
        this._mirroringShape.setValue(10950, 10949);
        this._mirroringShape.setValue(10957, 10958);
        this._mirroringShape.setValue(10958, 10957);
        this._mirroringShape.setValue(10959, 10960);
        this._mirroringShape.setValue(10960, 10959);
        this._mirroringShape.setValue(10961, 10962);
        this._mirroringShape.setValue(10962, 10961);
        this._mirroringShape.setValue(10963, 10964);
        this._mirroringShape.setValue(10964, 10963);
        this._mirroringShape.setValue(10965, 10966);
        this._mirroringShape.setValue(10966, 10965);
        this._mirroringShape.setValue(10974, 8870);
        this._mirroringShape.setValue(10979, 8873);
        this._mirroringShape.setValue(10980, 8872);
        this._mirroringShape.setValue(10981, 8875);
        this._mirroringShape.setValue(10988, 10989);
        this._mirroringShape.setValue(10989, 10988);
        this._mirroringShape.setValue(10999, 11000);
        this._mirroringShape.setValue(11000, 10999);
        this._mirroringShape.setValue(11001, 11002);
        this._mirroringShape.setValue(11002, 11001);
        this._mirroringShape.setValue(12296, 12297);
        this._mirroringShape.setValue(12297, 12296);
        this._mirroringShape.setValue(12298, 12299);
        this._mirroringShape.setValue(12299, 12298);
        this._mirroringShape.setValue(12300, 12301);
        this._mirroringShape.setValue(12301, 12300);
        this._mirroringShape.setValue(12302, 12303);
        this._mirroringShape.setValue(12303, 12302);
        this._mirroringShape.setValue(12304, 12305);
        this._mirroringShape.setValue(12305, 12304);
        this._mirroringShape.setValue(12308, 12309);
        this._mirroringShape.setValue(12309, 12308);
        this._mirroringShape.setValue(12310, 12311);
        this._mirroringShape.setValue(12311, 12310);
        this._mirroringShape.setValue(12312, 12313);
        this._mirroringShape.setValue(12313, 12312);
        this._mirroringShape.setValue(12314, 12315);
        this._mirroringShape.setValue(12315, 12314);
        this._mirroringShape.setValue(65288, 65289);
        this._mirroringShape.setValue(65289, 65288);
        this._mirroringShape.setValue(65308, 65310);
        this._mirroringShape.setValue(65310, 65308);
        this._mirroringShape.setValue(65339, 65341);
        this._mirroringShape.setValue(65341, 65339);
        this._mirroringShape.setValue(65371, 65373);
        this._mirroringShape.setValue(65373, 65371);
        this._mirroringShape.setValue(65375, 65376);
        this._mirroringShape.setValue(65376, 65375);
        this._mirroringShape.setValue(65378, 65379);
        this._mirroringShape.setValue(65379, 65378);
    }
}
export class _RtlCharacters {
    _type: number[] = [];
    _textOrder: number = -1;
    _length: number;
    _result: number[];
    _levels: number[];
    _rtlCharacterTypes: number[] = new Array(65536);
    L: number = 0;
    lre: number = 1;
    lro: number = 2;
    R: number = 3;
    AL: number = 4;
    rle: number = 5;
    rlo: number = 6;
    pdf: number = 7;
    EN: number = 8;
    ES: number = 9;
    ET: number = 10;
    AN: number = 11;
    CS: number = 12;
    nsm: number = 13;
    BN: number = 14;
    B: number = 15;
    S: number = 16;
    WS: number = 17;
    ON: number = 18;
    _charTypes: number[] = [
        this.L, this.EN, this.BN, this.ES, this.ES, this.S, this.ET, this.ET, this.B, this.AN, this.AN, this.S, this.CS, this.CS,
        this.WS, this.nsm, this.nsm, this.B, this.BN, 27, this.BN, 28, 30, this.B, 31, 31, this.S, 32, 32, this.WS, 33, 34, this.ON, 35,
        37, this.ET, 38, 42, this.ON, 43, 43, this.ET, 44, 44, this.CS, 45, 45, this.ET, 46, 46, this.CS, 47, 47, this.CS, 48, 57, this.EN,
        58, 58, this.CS, 59, 64, this.ON, 65, 90, this.L, 91, 96, this.ON, 97, 122, this.L, 123, 126, this.ON, 127, 132, this.BN, 133, 133,
        this.B, 134, 159, this.BN, 160, 160, this.CS, 161, 161, this.ON, 162, 165, this.ET, 166, 169, this.ON, 170, 170, this.L, 171, 175,
        this.ON, 176, 177, this.ET, 178, 179, this.EN, 180, 180, this.ON, 181, 181, this.L, 182, 184, this.ON, 185, 185, this.EN, 186, 186,
        this.L, 187, 191, this.ON, 192, 214, this.L, 215, 215, this.ON, 216, 246, this.L, 247, 247, this.ON, 248, 696, this.L, 697, 698,
        this.ON, 699, 705, this.L, 706, 719, this.ON, 720, 721, this.L, 722, 735, this.ON, 736, 740, this.L, 741, 749, this.ON, 750, 750,
        this.L, 751, 767, this.ON, 768, 855, this.nsm, 856, 860, this.L, 861, 879, this.nsm, 880, 883, this.L, 884, 885, this.ON, 886, 893,
        this.L, 894, 894, this.ON, 895, 899, this.L, 900, 901, this.ON, 902, 902, this.L, 903, 903, this.ON, 904, 1013, this.L, 1014, 1014,
        this.ON, 1015, 1154, this.L, 1155, 1158, this.nsm, 1159, 1159, this.L, 1160, 1161, this.nsm, 1162, 1417, this.L, 1418, 1418,
        this.ON, 1419, 1424, this.L, 1425, 1441, this.nsm, 1442, 1442, this.L, 1443, 1465, this.nsm, 1466, 1466, this.L, 1467, 1469,
        this.nsm, 1470, 1470, this.R, 1471, 1471, this.nsm, 1472, 1472, this.R, 1473, 1474, this.nsm, 1475, 1475, this.R, 1476, 1476,
        this.nsm, 1477, 1487, this.L, 1488, 1514, this.R, 1515, 1519, this.L, 1520, 1524, this.R, 1525, 1535, this.L, 1536, 1539, this.AL,
        1540, 1547, this.L, 1548, 1548, this.CS, 1549, 1549, this.AL, 1550, 1551, this.ON, 1552, 1557, this.nsm, 1558, 1562, this.L, 1563,
        1563, this.AL, 1564, 1566, this.L, 1567, 1567, this.AL, 1568, 1568, this.L, 1569, 1594, this.AL, 1595, 1599, this.L, 1600, 1610,
        this.AL, 1611, 1624, this.nsm, 1625, 1631, this.L, 1632, 1641, this.AN, 1642, 1642, this.ET, 1643, 1644, this.AN, 1645, 1647,
        this.AL, 1648, 1648, this.nsm, 1649, 1749, this.AL, 1750, 1756, this.nsm, 1757, 1757, this.AL, 1758, 1764, this.nsm, 1765, 1766,
        this.AL, 1767, 1768, this.nsm, 1769, 1769, this.ON, 1770, 1773, this.nsm, 1774, 1775, this.AL, 1776, 1785, this.EN, 1786, 1805,
        this.AL, 1806, 1806, this.L, 1807, 1807, this.BN, 1808, 1808, this.AL, 1809, 1809, this.nsm, 1810, 1839, this.AL, 1840, 1866,
        this.nsm, 1867, 1868, this.L, 1869, 1871, this.AL, 1872, 1919, this.L, 1920, 1957, this.AL, 1958, 1968, this.nsm, 1969, 1969,
        this.AL, 1970, 2304, this.L, 2305, 2306, this.nsm, 2307, 2363, this.L, 2364, 2364, this.nsm, 2365, 2368, this.L, 2369, 2376,
        this.nsm, 2377, 2380, this.L, 2381, 2381, this.nsm, 2382, 2384, this.L, 2385, 2388, this.nsm, 2389, 2401, this.L, 2402, 2403,
        this.nsm, 2404, 2432, this.L, 2433, 2433, this.nsm, 2434, 2491, this.L, 2492, 2492, this.nsm, 2493, 2496, this.L, 2497, 2500,
        this.nsm, 2501, 2508, this.L, 2509, 2509, this.nsm, 2510, 2529, this.L, 2530, 2531, this.nsm, 2532, 2545, this.L, 2546, 2547,
        this.ET, 2548, 2560, this.L, 2561, 2562, this.nsm, 2563, 2619, this.L, 2620, 2620, this.nsm, 2621, 2624, this.L, 2625, 2626,
        this.nsm, 2627, 2630, this.L, 2631, 2632, this.nsm, 2633, 2634, this.L, 2635, 2637, this.nsm, 2638, 2671, this.L, 2672, 2673,
        this.nsm, 2674, 2688, this.L, 2689, 2690, this.nsm, 2691, 2747, this.L, 2748, 2748, this.nsm, 2749, 2752, this.L, 2753, 2757,
        this.nsm, 2758, 2758, this.L, 2759, 2760, this.nsm, 2761, 2764, this.L, 2765, 2765, this.nsm, 2766, 2785, this.L, 2786, 2787,
        this.nsm, 2788, 2800, this.L, 2801, 2801, this.ET, 2802, 2816, this.L, 2817, 2817, this.nsm, 2818, 2875, this.L, 2876, 2876,
        this.nsm, 2877, 2878, this.L, 2879, 2879, this.nsm, 2880, 2880, this.L, 2881, 2883, this.nsm, 2884, 2892, this.L, 2893, 2893,
        this.nsm, 2894, 2901, this.L, 2902, 2902, this.nsm, 2903, 2945, this.L, 2946, 2946, this.nsm, 2947, 3007, this.L, 3008, 3008,
        this.nsm, 3009, 3020, this.L, 3021, 3021, this.nsm, 3022, 3058, this.L, 3059, 3064, this.ON, 3065, 3065, this.ET, 3066, 3066,
        this.ON, 3067, 3133, this.L, 3134, 3136, this.nsm, 3137, 3141, this.L, 3142, 3144, this.nsm, 3145, 3145, this.L, 3146, 3149,
        this.nsm, 3150, 3156, this.L, 3157, 3158, this.nsm, 3159, 3259, this.L, 3260, 3260, this.nsm, 3261, 3275, this.L, 3276, 3277,
        this.nsm, 3278, 3392, this.L, 3393, 3395, this.nsm, 3396, 3404, this.L, 3405, 3405, this.nsm, 3406, 3529, this.L, 3530, 3530,
        this.nsm, 3531, 3537, this.L, 3538, 3540, this.nsm, 3541, 3541, this.L, 3542, 3542, this.nsm, 3543, 3632, this.L, 3633, 3633,
        this.nsm, 3634, 3635, this.L, 3636, 3642, this.nsm, 3643, 3646, this.L, 3647, 3647, this.ET, 3648, 3654, this.L, 3655, 3662,
        this.nsm, 3663, 3760, this.L, 3761, 3761, this.nsm, 3762, 3763, this.L, 3764, 3769, this.nsm, 3770, 3770, this.L, 3771, 3772,
        this.nsm, 3773, 3783, this.L, 3784, 3789, this.nsm, 3790, 3863, this.L, 3864, 3865, this.nsm, 3866, 3892, this.L, 3893, 3893,
        this.nsm, 3894, 3894, this.L, 3895, 3895, this.nsm, 3896, 3896, this.L, 3897, 3897, this.nsm, 3898, 3901, this.ON, 3902, 3952,
        this.L, 3953, 3966, this.nsm, 3967, 3967, this.L, 3968, 3972, this.nsm, 3973, 3973, this.L, 3974, 3975, this.nsm, 3976, 3983,
        this.L, 3984, 3991, this.nsm, 3992, 3992, this.L, 3993, 4028, this.nsm, 4029, 4037, this.L, 4038, 4038, this.nsm, 4039, 4140,
        this.L, 4141, 4144, this.nsm, 4145, 4145, this.L, 4146, 4146, this.nsm, 4147, 4149, this.L, 4150, 4151, this.nsm, 4152, 4152,
        this.L, 4153, 4153, this.nsm, 4154, 4183, this.L, 4184, 4185, this.nsm, 4186, 5759, this.L, 5760, 5760, this.WS, 5761, 5786,
        this.L, 5787, 5788, this.ON, 5789, 5905, this.L, 5906, 5908, this.nsm, 5909, 5937, this.L, 5938, 5940, this.nsm, 5941, 5969,
        this.L, 5970, 5971, this.nsm, 5972, 6001, this.L, 6002, 6003, this.nsm, 6004, 6070, this.L, 6071, 6077, this.nsm, 6078, 6085,
        this.L, 6086, 6086, this.nsm, 6087, 6088, this.L, 6089, 6099, this.nsm, 6100, 6106, this.L, 6107, 6107, this.ET, 6108, 6108,
        this.L, 6109, 6109, this.nsm, 6110, 6127, this.L, 6128, 6137, this.ON, 6138, 6143, this.L, 6144, 6154, this.ON, 6155, 6157,
        this.nsm, 6158, 6158, this.WS, 6159, 6312, this.L, 6313, 6313, this.nsm, 6314, 6431, this.L, 6432, 6434, this.nsm, 6435, 6438,
        this.L, 6439, 6443, this.nsm, 6444, 6449, this.L, 6450, 6450, this.nsm, 6451, 6456, this.L, 6457, 6459, this.nsm, 6460, 6463,
        this.L, 6464, 6464, this.ON, 6465, 6467, this.L, 6468, 6469, this.ON, 6470, 6623, this.L, 6624, 6655, this.ON, 6656, 8124, this.L,
        8125, 8125, this.ON, 8126, 8126, this.L, 8127, 8129, this.ON, 8130, 8140, this.L, 8141, 8143, this.ON, 8144, 8156, this.L, 8157,
        8159, this.ON, 8160, 8172, this.L, 8173, 8175, this.ON, 8176, 8188, this.L, 8189, 8190, this.ON, 8191, 8191, this.L, 8192, 8202,
        this.WS, 8203, 8205, this.BN, 8206, 8206, this.L, 8207, 8207, this.R, 8208, 8231, this.ON, 8232, 8232, this.WS, 8233, 8233, this.B,
        8234, 8234, this.lre, 8235, 8235, this.rle, 8236, 8236, this.pdf, 8237, 8237, this.lro, 8238, 8238, this.rlo, 8239, 8239, this.WS,
        8240, 8244, this.ET, 8245, 8276, this.ON, 8277, 8278, this.L, 8279, 8279, this.ON, 8280, 8286, this.L, 8287, 8287, this.WS, 8288,
        8291, this.BN, 8292, 8297, this.L, 8298, 8303, this.BN, 8304, 8304, this.EN, 8305, 8307, this.L, 8308, 8313, this.EN, 8314, 8315,
        this.ET, 8316, 8318, this.ON, 8319, 8319, this.L, 8320, 8329, this.EN, 8330, 8331, this.ET, 8332, 8334, this.ON, 8335, 8351,
        this.L, 8352, 8369, this.ET, 8370, 8399, this.L, 8400, 8426, this.nsm, 8427, 8447, this.L, 8448, 8449, this.ON, 8450, 8450, this.L,
        8451, 8454, this.ON, 8455, 8455, this.L, 8456, 8457, this.ON, 8458, 8467, this.L, 8468, 8468, this.ON, 8469, 8469, this.L, 8470,
        8472, this.ON, 8473, 8477, this.L, 8478, 8483, this.ON, 8484, 8484, this.L, 8485, 8485, this.ON, 8486, 8486, this.L, 8487, 8487,
        this.ON, 8488, 8488, this.L, 8489, 8489, this.ON, 8490, 8493, this.L, 8494, 8494, this.ET, 8495, 8497, this.L, 8498, 8498, this.ON,
        8499, 8505, this.L, 8506, 8507, this.ON, 8508, 8511, this.L, 8512, 8516, this.ON, 8517, 8521, this.L, 8522, 8523, this.ON, 8524,
        8530, this.L, 8531, 8543, this.ON, 8544, 8591, this.L, 8592, 8721, this.ON, 8722, 8723, this.ET, 8724, 9013, this.ON, 9014, 9082,
        this.L, 9083, 9108, this.ON, 9109, 9109, this.L, 9110, 9168, this.ON, 9169, 9215, this.L, 9216, 9254, this.ON, 9255, 9279, this.L,
        9280, 9290, this.ON, 9291, 9311, this.L, 9312, 9371, this.EN, 9372, 9449, this.L, 9450, 9450, this.EN, 9451, 9751, this.ON, 9752,
        9752, this.L, 9753, 9853, this.ON, 9854, 9855, this.L, 9856, 9873, this.ON, 9874, 9887, this.L, 9888, 9889, this.ON, 9890, 9984,
        this.L, 9985, 9988, this.ON, 9989, 9989, this.L, 9990, 9993, this.ON, 9994, 9995, this.L, 9996, 10023, this.ON, 10024, 10024,
        this.L, 10025, 10059, this.ON, 10060, 10060, this.L, 10061, 10061, this.ON, 10062, 10062, this.L, 10063, 10066, this.ON, 10067,
        10069, this.L, 10070, 10070, this.ON, 10071, 10071, this.L, 10072, 10078, this.ON, 10079, 10080, this.L, 10081, 10132, this.ON,
        10133, 10135, this.L, 10136, 10159, this.ON, 10160, 10160, this.L, 10161, 10174, this.ON, 10175, 10191, this.L, 10192, 10219,
        this.ON, 10220, 10223, this.L, 10224, 11021, this.ON, 11022, 11903, this.L, 11904, 11929, this.ON, 11930, 11930, this.L, 11931,
        12019, this.ON, 12020, 12031, this.L, 12032, 12245, this.ON, 12246, 12271, this.L, 12272, 12283, this.ON, 12284, 12287, this.L,
        12288, 12288, this.WS, 12289, 12292, this.ON, 12293, 12295, this.L, 12296, 12320, this.ON, 12321, 12329, this.L, 12330, 12335,
        this.nsm, 12336, 12336, this.ON, 12337, 12341, this.L, 12342, 12343, this.ON, 12344, 12348, this.L, 12349, 12351, this.ON, 12352,
        12440, this.L, 12441, 12442, this.nsm, 12443, 12444, this.ON, 12445, 12447, this.L, 12448, 12448, this.ON, 12449, 12538, this.L,
        12539, 12539, this.ON, 12540, 12828, this.L, 12829, 12830, this.ON, 12831, 12879, this.L, 12880, 12895, this.ON, 12896, 12923,
        this.L, 12924, 12925, this.ON, 12926, 12976, this.L, 12977, 12991, this.ON, 12992, 13003, this.L, 13004, 13007, this.ON, 13008,
        13174, this.L, 13175, 13178, this.ON, 13179, 13277, this.L, 13278, 13279, this.ON, 13280, 13310, this.L, 13311, 13311, this.ON,
        13312, 19903, this.L, 19904, 19967, this.ON, 19968, 42127, this.L, 42128, 42182, this.ON, 42183, 64284, this.L, 64285, 64285,
        this.R, 64286, 64286, this.nsm, 64287, 64296, this.R, 64297, 64297, this.ET, 64298, 64310, this.R, 64311, 64311, this.L, 64312,
        64316, this.R, 64317, 64317, this.L, 64318, 64318, this.R, 64319, 64319, this.L, 64320, 64321, this.R, 64322, 64322, this.L, 64323,
        64324, this.R, 64325, 64325, this.L, 64326, 64335, this.R, 64336, 64433, this.AL, 64434, 64466, this.L, 64467, 64829, this.AL,
        64830, 64831, this.ON, 64832, 64847, this.L, 64848, 64911, this.AL, 64912, 64913, this.L, 64914, 64967, this.AL, 64968, 65007,
        this.L, 65008, 65020, this.AL, 65021, 65021, this.ON, 65022, 65023, this.L, 65024, 65039, this.nsm, 65040, 65055, this.L, 65056,
        65059, this.nsm, 65060, 65071, this.L, 65072, 65103, this.ON, 65104, 65104, this.CS, 65105, 65105, this.ON, 65106, 65106, this.CS,
        65107, 65107, this.L, 65108, 65108, this.ON, 65109, 65109, this.CS, 65110, 65118, this.ON, 65119, 65119, this.ET, 65120, 65121,
        this.ON, 65122, 65123, this.ET, 65124, 65126, this.ON, 65127, 65127, this.L, 65128, 65128, this.ON, 65129, 65130, this.ET, 65131,
        65131, this.ON, 65132, 65135, this.L, 65136, 65140, this.AL, 65141, 65141, this.L, 65142, 65276, this.AL, 65277, 65278, this.L,
        65279, 65279, this.BN, 65280, 65280, this.L, 65281, 65282, this.ON, 65283, 65285, this.ET, 65286, 65290, this.ON, 65291, 65291,
        this.ET, 65292, 65292, this.CS, 65293, 65293, this.ET, 65294, 65294, this.CS, 65295, 65295, this.ES, 65296, 65305, this.EN, 65306,
        65306, this.CS, 65307, 65312, this.ON, 65313, 65338, this.L, 65339, 65344, this.ON, 65345, 65370, this.L, 65371, 65381, this.ON,
        65382, 65503, this.L, 65504, 65505, this.ET, 65506, 65508, this.ON, 65509, 65510, this.ET, 65511, 65511, this.L, 65512, 65518,
        this.ON, 65519, 65528, this.L, 65529, 65531, this.BN, 65532, 65533, this.ON, 65534, 65535, this.L];
    /**
     * Creates an instance of the 'RtlCharacters' class.
     *
     * @private
     */
    constructor() {
        for (let i: number = 0; i < this._charTypes.length; ++i) {
            let start: number = this._charTypes[Number.parseInt(i.toString(), 10)];
            const end: number = this._charTypes[++i];
            const b: number = this._charTypes[++i];
            while (start <= end) {
                this._rtlCharacterTypes[start++] = b;
            }
        }
    }
    _getVisualOrder(inputText: string, isRtl: boolean): number[] {
        this._type = this._getCharacterCode(inputText);
        this._textOrder = isRtl ? this.lre : this.L;
        this._doVisualOrder();
        const result: number[] = [];
        for (let i: number = 0; i < this._levels.length; i++) {
            result[Number.parseInt(i.toString(), 10)] = this._levels[Number.parseInt(i.toString(), 10)];
        }
        return result;
    }
    _getCharacterCode(text: string): number[] {
        const characterCodes: number[] = [];
        for (let i: number = 0; i < text.length; i++) {
            const value: any = text[Number.parseInt(i.toString(), 10)].charCodeAt(0); // eslint-disable-line
            characterCodes[Number.parseInt(i.toString(), 10)] = this._rtlCharacterTypes[Number.parseInt(value.toString(), 10)];
        }
        return characterCodes;
    }
    _setDefaultLevels(): void {
        for (let i: number = 0; i < this._length; i++) {
            this._levels[Number.parseInt(i.toString(), 10)] = this._textOrder;
        }
    }
    _setLevels(): void {
        this._setDefaultLevels();
        for (let n: number = 0; n < this._length; ++n) {
            const level: number = this._levels[Number.parseInt(n.toString(), 10)];
            this._levels[Number.parseInt(n.toString(), 10)] = level;
        }
    }
    _updateLevels(index: number, level: number, length: number): void {
        if ((level & 1) === 0) {
            for (let i: number = index; i < length; ++i) {
                if (this._result[Number.parseInt(i.toString(), 10)] === this.R) {
                    this._levels[Number.parseInt(i.toString(), 10)] += 1;
                } else if (this._result[Number.parseInt(i.toString(), 10)] !== this.L) {
                    this._levels[Number.parseInt(i.toString(), 10)] += 2;
                }
            }
        } else {
            for (let i: number = index; i < length; ++i) {
                if (this._result[Number.parseInt(i.toString(), 10)] !== this.R) {
                    this._levels[Number.parseInt(i.toString(), 10)] += 1;
                }
            }
        }
    }
    _doVisualOrder(): void {
        this._length = this._type.length;
        this._result = this._type;
        this._levels = [];
        this._setLevels();
        this._length = this._getEmbeddedCharactersLength();
        let preview: number = this._textOrder;
        let i: number = 0;
        while (i < this._length) {
            const level: number = this._levels[Number.parseInt(i.toString(), 10)];
            const preType: number = ((Math.max(preview, level) & 0x1) === 0) ? this.L : this.R;
            let length: number = i + 1;
            while (length < this._length && this._levels[Number.parseInt(length.toString(), 10)] === level) {
                ++length;
            }
            const success: number = length < this._length ? this._levels[Number.parseInt(length.toString(), 10)] : this._textOrder;
            const type: number = ((Math.max(success, level) & 0x1) === 0) ? this.L : this.R;
            this._check(i, length, level, preType, type);
            this._updateLevels(i, level, length);
            preview = level;
            i = length;
        }
        this._checkEmbeddedCharacters(this._length);
    }
    _getEmbeddedCharactersLength(): number {
        let index: number = 0;
        for (let i: number = 0; i < this._length; ++i) {
            if (!(this._type[Number.parseInt(i.toString(), 10)] === this.lre || this._type[Number.parseInt(i.toString(), 10)] === this.rle
                  || this._type[Number.parseInt(i.toString(), 10)] === this.lro ||
                  this._type[Number.parseInt(i.toString(), 10)] === this.rlo || this._type[Number.parseInt(i.toString(), 10)] === this.pdf
                  || this._type[Number.parseInt(i.toString(), 10)] === this.BN)) {
                this._result[Number.parseInt(index.toString(), 10)] = this._result[Number.parseInt(i.toString(), 10)];
                this._levels[Number.parseInt(index.toString(), 10)] = this._levels[Number.parseInt(i.toString(), 10)];
                index++;
            }
        }
        return index;
    }
    _checkEmbeddedCharacters(length: number): void {
        for (let i: number = this._type.length - 1; i >= 0; --i) {
            if (this._type[Number.parseInt(i.toString(), 10)] === this.lre || this._type[Number.parseInt(i.toString(), 10)] === this.rle
                || this._type[Number.parseInt(i.toString(), 10)] === this.lro ||
                this._type[Number.parseInt(i.toString(), 10)] === this.rlo || this._type[Number.parseInt(i.toString(), 10)] === this.pdf
                || this._type[Number.parseInt(i.toString(), 10)] === this.BN) {
                this._result[Number.parseInt(i.toString(), 10)] = this._type[Number.parseInt(i.toString(), 10)];
                this._levels[Number.parseInt(i.toString(), 10)] = -1;
            } else {
                length -= 1;
                this._result[Number.parseInt(i.toString(), 10)] = this._result[Number.parseInt(length.toString(), 10)];
                this._levels[Number.parseInt(i.toString(), 10)] = this._levels[Number.parseInt(length.toString(), 10)];
            }
        }
        for (let i: number = 0; i < this._type.length; i++) {
            if (this._levels[Number.parseInt(i.toString(), 10)] === -1) {
                this._levels[Number.parseInt(i.toString(), 10)] = this._levels[i - 1];
            }
        }
    }
    _check(index: number, length: number, level: number, startType: number, endType: number): void {
        let charType: number = startType;
        for (let i: number = index; i < length; ++i) {
            if (this._result[Number.parseInt(i.toString(), 10)] === this.nsm) {
                this._result[Number.parseInt(i.toString(), 10)] = charType;
            } else {
                charType = this._result[Number.parseInt(i.toString(), 10)];
            }
        }
        this._checkEuropeanDigits(index, length, level, startType, endType);
    }
    _checkEuropeanDigits(index: number, length: number, level: number, startType: number, endType: number): void {
        for (let i: number = index; i < length; ++i) {
            if (this._result[Number.parseInt(i.toString(), 10)] === this.EN) {
                for (let j: number = i - 1; j >= index; --j) {
                    if (this._result[Number.parseInt(j.toString(), 10)] === this.L ||
                        this._result[Number.parseInt(j.toString(), 10)] === this.R ||
                        this._result[Number.parseInt(j.toString(), 10)] === this.AL) {
                        if (this._result[Number.parseInt(j.toString(), 10)] === this.AL) {
                            this._result[Number.parseInt(i.toString(), 10)] = this.AN;
                        }
                        break;
                    }
                }
            }
        }
        this._checkArabicCharacters(index, length, level, startType, endType);
    }
    _checkArabicCharacters(index: number, length: number, level: number, startType: number, endType: number): void {
        for (let i: number = index; i < length; ++i) {
            if (this._result[Number.parseInt(i.toString(), 10)] === this.AL) {
                this._result[Number.parseInt(i.toString(), 10)] = this.R;
            }
        }
        this._checkEuropeanNumberSeparator(index, length, level, startType, endType);
    }
    _checkEuropeanNumberSeparator(index: number, length: number, level: number, startType: number, endType: number): void {
        for (let i: number = index + 1; i < length - 1; ++i) {
            if (this._result[Number.parseInt(i.toString(), 10)] === this.ES ||
                this._result[Number.parseInt(i.toString(), 10)] === this.CS) {
                const preview: number = this._result[i - 1];
                const success: number = this._result[i + 1];
                if (preview === this.EN && success === this.EN) {
                    this._result[Number.parseInt(i.toString(), 10)] = this.EN;
                } else if (this._result[Number.parseInt(i.toString(), 10)] === this.CS && preview === this.AN && success === this.AN) {
                    this._result[Number.parseInt(i.toString(), 10)] = this.AN;
                }
            }
        }
        this._checkEuropeanNumberTerminator(index, length, level, startType, endType);
    }
    _checkEuropeanNumberTerminator(index: number, length: number, level: number, startType: number, endType: number): void {
        for (let i: number = index; i < length; ++i) {
            if (this._result[Number.parseInt(i.toString(), 10)] === this.ET) {
                const s: number = i;
                const b: number[] = [];
                b.push(this.ET);
                const l: number = this._getLength(s, length, b);
                let data: number = s === index ? startType : this._result[s - 1];
                if (data !== this.EN) {
                    data = (l === length) ? endType : this._result[Number.parseInt(l.toString(), 10)];
                }
                i = l;
            }
        }
        this._checkOtherNeutrals(index, length, level, startType, endType);
    }
    _checkOtherNeutrals(index: number, length: number, level: number, startType: number, endType: number): void {
        for (let i: number = index; i < length; ++i) {
            if (this._result[Number.parseInt(i.toString(), 10)] === this.ES || this._result[Number.parseInt(i.toString(), 10)] === this.ET
                || this._result[Number.parseInt(i.toString(), 10)] === this.CS) {
                this._result[Number.parseInt(i.toString(), 10)] = this.ON;
            }
        }
        this._checkOtherCharacters(index, length, level, startType, endType);
    }
    _checkOtherCharacters(index: number, length: number, level: number, startType: number, endType: number): void {
        for (let i: number = index; i < length; ++i) {
            if (this._result[Number.parseInt(i.toString(), 10)] === this.EN) {
                let pst: number = startType;
                for (let j: number = i - 1; j >= index; --j) {
                    if (this._result[Number.parseInt(j.toString(), 10)] === this.L ||
                        this._result[Number.parseInt(j.toString(), 10)] === this.R) {
                        pst = this._result[Number.parseInt(j.toString(), 10)];
                        break;
                    }
                }
                if (pst === this.L) {
                    this._result[Number.parseInt(i.toString(), 10)] = this.L;
                }
            }
        }
        this._checkCharacters(index, length, level, startType, endType);
    }
    _getLength(index: number, length: number, validSet: number[]): number {
        --index;
        while (++index < length) {
            const t: number = this._result[Number.parseInt(index.toString(), 10)];
            for (let i: number = 0; i < validSet.length; ++i) {
                if (t === validSet[Number.parseInt(i.toString(), 10)]) {
                    index = this._getLength(++index, length, validSet);
                }
            }
            return index;
        }
        return length;
    }
    _checkCharacters(index: number, length: number, level: number, startType: number, endType: number): void {
        for (let i: number = index; i < length; ++i) {
            if (this._result[Number.parseInt(i.toString(), 10)] === this.WS ||
                this._result[Number.parseInt(i.toString(), 10)] === this.ON ||
                this._result[Number.parseInt(i.toString(), 10)] === this.B ||
                this._result[Number.parseInt(i.toString(), 10)] === this.S) {
                const s: number = i;
                const byte: number[] = [this.B, this.S, this.WS, this.ON];
                const l : number = this._getLength(s, length, byte);
                let lt: number = 0;
                let tt: number = 0;
                let rt: number = 0;
                if (s === index) {
                    lt = startType;
                } else {
                    lt = this._result[s - 1];
                    if (lt === this.AN) {
                        lt = this.R;
                    } else if (lt === this.EN) {
                        lt = this.R;
                    }
                }
                if (l === length) {
                    tt = endType;
                } else {
                    tt = this._result[Number.parseInt(l.toString(), 10)];
                    if (tt === this.AN) {
                        tt = this.R;
                    }
                }
                if (lt === tt) {
                    rt = lt;
                } else {
                    rt = ((level & 0x1) === 0) ? this.L : this.R;
                }
                for (let j: number = s; j < l; ++j) {
                    this._result[Number.parseInt(j.toString(), 10)] = rt;
                }
                i = l;
            }
        }
    }
}
