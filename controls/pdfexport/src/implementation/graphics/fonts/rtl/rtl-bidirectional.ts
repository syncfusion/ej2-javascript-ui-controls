/**
 * Bidi.ts class for EJ2-PDF
 */
import { Dictionary} from './../../../collections/dictionary';
/**
 * `Metrics` of the font.
 * @private
 */
export class Bidi {
         //#region Fields
        private  indexes : number[] = [];
        private  indexLevels : number[] = [];
        private  mirroringShapeCharacters : Dictionary<number, number>  = new Dictionary<number, number>();
        //#endregion
        //#region Constructor
        public constructor() {
            this.update();
        }
        //#endregion
        //#region implementation
        private doMirrorShaping( text : string) : string {
            let result : string[] = [];
            for (let i : number = 0; i < text.length; i++) {
                if (((this.indexLevels[i] & 1) === 1) && this.mirroringShapeCharacters.containsKey(text[i].charCodeAt(0))) {
                    result[i] = String.fromCharCode(this.mirroringShapeCharacters.getValue(text[i].charCodeAt(0)));
                } else {
                    result[i] = text[i].toString();
                }
            }
            let res : string = '';
            for (let j : number = 0; j < result.length; j++) {
                res = res + result[j];
            }
            return res;
        }
        public getLogicalToVisualString( inputText : string, isRtl : boolean) : string {
            let rtlCharacters : RtlCharacters  = new RtlCharacters();
            this.indexLevels = rtlCharacters.getVisualOrder(inputText, isRtl);
            this.setDefaultIndexLevel();
            this.doOrder(0, this.indexLevels.length - 1);
            let text : string = this.doMirrorShaping(inputText);
            //let text : string = inputText;
            let resultBuilder : string = '';
            for (let i : number = 0; i < this.indexes.length; i++) {
                let index : number = this.indexes[i];
                resultBuilder += text[index];
            }
            return resultBuilder.toString();
        }
        private setDefaultIndexLevel() : void {
            for (let i : number = 0; i < this.indexLevels.length; i++) {
                this.indexes[i] = i;
            }
        }
        private doOrder(sIndex : number,  eIndex : number): void {
            let max : number = this.indexLevels[sIndex];
            let min : number = max;
            let odd : number = max;
            let even : number = max;
            for (let i : number = sIndex + 1; i <= eIndex; ++i) {
                let data : number = this.indexLevels[i];
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
                this.reArrange(sIndex, eIndex + 1);
                return;
            }
            min |= 1;
            while (max >= min) {
                let pstart : number = sIndex;
                /*tslint:disable:no-constant-condition */
                while (true) {
                    while (pstart <= eIndex) {
                        if (this.indexLevels[pstart] >= max) {
                            break;
                        }
                        pstart += 1;
                    }
                    if (pstart > eIndex) {
                        break;
                    }
                    let pend : number = pstart + 1;
                    while (pend <= eIndex) {
                        if (this.indexLevels[pend] < max) {
                            break;
                        }
                        pend += 1;
                    }
                    this.reArrange(pstart, pend);
                    pstart = pend + 1;
                }
                max -= 1;
            }
        }
        private reArrange(i : number , j : number) : void {
            let length : number = (i + j) / 2;
            --j;
            for (; i < length; ++i, --j) {
                let temp : number = this.indexes[i];
                this.indexes[i] = this.indexes[j];
                this.indexes[j] = temp;
            }
        }
        private update() : void {
            this.mirroringShapeCharacters.setValue(40, 41);
            this.mirroringShapeCharacters.setValue(41, 40);
            this.mirroringShapeCharacters.setValue(60, 62);
            this.mirroringShapeCharacters.setValue(62, 60);
            this.mirroringShapeCharacters.setValue(91, 93);
            this.mirroringShapeCharacters.setValue(93, 91);
            this.mirroringShapeCharacters.setValue(123, 125);
            this.mirroringShapeCharacters.setValue(125, 123);
            this.mirroringShapeCharacters.setValue(171, 187);
            this.mirroringShapeCharacters.setValue(187, 171);
            this.mirroringShapeCharacters.setValue(8249, 8250);
            this.mirroringShapeCharacters.setValue(8250, 8249);
            this.mirroringShapeCharacters.setValue(8261, 8262);
            this.mirroringShapeCharacters.setValue(8262, 8261);
            this.mirroringShapeCharacters.setValue(8317, 8318);
            this.mirroringShapeCharacters.setValue(8318, 8317);
            this.mirroringShapeCharacters.setValue(8333, 8334);
            this.mirroringShapeCharacters.setValue(8334, 8333);
            this.mirroringShapeCharacters.setValue(8712, 8715);
            this.mirroringShapeCharacters.setValue(8713, 8716);
            this.mirroringShapeCharacters.setValue(8714, 8717);
            this.mirroringShapeCharacters.setValue(8715, 8712);
            this.mirroringShapeCharacters.setValue(8716, 8713);
            this.mirroringShapeCharacters.setValue(8717, 8714);
            this.mirroringShapeCharacters.setValue(8725, 10741);
            this.mirroringShapeCharacters.setValue(8764, 8765);
            this.mirroringShapeCharacters.setValue(8765, 8764);
            this.mirroringShapeCharacters.setValue(8771, 8909);
            this.mirroringShapeCharacters.setValue(8786, 8787);
            this.mirroringShapeCharacters.setValue(8787, 8786);
            this.mirroringShapeCharacters.setValue(8788, 8789);
            this.mirroringShapeCharacters.setValue(8789, 8788);
            this.mirroringShapeCharacters.setValue(8804, 8805);
            this.mirroringShapeCharacters.setValue(8805, 8804);
            this.mirroringShapeCharacters.setValue(8806, 8807);
            this.mirroringShapeCharacters.setValue(8807, 8806);
            this.mirroringShapeCharacters.setValue(8808, 8809);
            this.mirroringShapeCharacters.setValue(8809, 8808);
            this.mirroringShapeCharacters.setValue(8810, 8811);
            this.mirroringShapeCharacters.setValue(8811, 8810);
            this.mirroringShapeCharacters.setValue(8814, 8815);
            this.mirroringShapeCharacters.setValue(8815, 8814);
            this.mirroringShapeCharacters.setValue(8816, 8817);
            this.mirroringShapeCharacters.setValue(8817, 8816);
            this.mirroringShapeCharacters.setValue(8818, 8819);
            this.mirroringShapeCharacters.setValue(8819, 8818);
            this.mirroringShapeCharacters.setValue(8820, 8821);
            this.mirroringShapeCharacters.setValue(8821, 8820);
            this.mirroringShapeCharacters.setValue(8822, 8823);
            this.mirroringShapeCharacters.setValue(8823, 8822);
            this.mirroringShapeCharacters.setValue(8824, 8825);
            this.mirroringShapeCharacters.setValue(8825, 8824);
            this.mirroringShapeCharacters.setValue(8826, 8827);
            this.mirroringShapeCharacters.setValue(8827, 8826);
            this.mirroringShapeCharacters.setValue(8828, 8829);
            this.mirroringShapeCharacters.setValue(8829, 8828);
            this.mirroringShapeCharacters.setValue(8830, 8831);
            this.mirroringShapeCharacters.setValue(8831, 8830);
            this.mirroringShapeCharacters.setValue(8832, 8833);
            this.mirroringShapeCharacters.setValue(8833, 8832);
            this.mirroringShapeCharacters.setValue(8834, 8835);
            this.mirroringShapeCharacters.setValue(8835, 8834);
            this.mirroringShapeCharacters.setValue(8836, 8837);
            this.mirroringShapeCharacters.setValue(8837, 8836);
            this.mirroringShapeCharacters.setValue(8838, 8839);
            this.mirroringShapeCharacters.setValue(8839, 8838);
            this.mirroringShapeCharacters.setValue(8840, 8841);
            this.mirroringShapeCharacters.setValue(8841, 8840);
            this.mirroringShapeCharacters.setValue(8842, 8843);
            this.mirroringShapeCharacters.setValue(8843, 8842);
            this.mirroringShapeCharacters.setValue(8847, 8848);
            this.mirroringShapeCharacters.setValue(8848, 8847);
            this.mirroringShapeCharacters.setValue(8849, 8850);
            this.mirroringShapeCharacters.setValue(8850, 8849);
            this.mirroringShapeCharacters.setValue(8856, 10680);
            this.mirroringShapeCharacters.setValue(8866, 8867);
            this.mirroringShapeCharacters.setValue(8867, 8866);
            this.mirroringShapeCharacters.setValue(8870, 10974);
            this.mirroringShapeCharacters.setValue(8872, 10980);
            this.mirroringShapeCharacters.setValue(8873, 10979);
            this.mirroringShapeCharacters.setValue(8875, 10981);
            this.mirroringShapeCharacters.setValue(8880, 8881);
            this.mirroringShapeCharacters.setValue(8881, 8880);
            this.mirroringShapeCharacters.setValue(8882, 8883);
            this.mirroringShapeCharacters.setValue(8883, 8882);
            this.mirroringShapeCharacters.setValue(8884, 8885);
            this.mirroringShapeCharacters.setValue(8885, 8884);
            /*tslint:disable:max-func-body-length */
            this.mirroringShapeCharacters.setValue(8886, 8887);
            this.mirroringShapeCharacters.setValue(8887, 8886);
            this.mirroringShapeCharacters.setValue(8905, 8906);
            this.mirroringShapeCharacters.setValue(8906, 8905);
            this.mirroringShapeCharacters.setValue(8907, 8908);
            this.mirroringShapeCharacters.setValue(8908, 8907);
            this.mirroringShapeCharacters.setValue(8909, 8771);
            this.mirroringShapeCharacters.setValue(8912, 8913);
            this.mirroringShapeCharacters.setValue(8913, 8912);
            this.mirroringShapeCharacters.setValue(8918, 8919);
            this.mirroringShapeCharacters.setValue(8919, 8918);
            this.mirroringShapeCharacters.setValue(8920, 8921);
            this.mirroringShapeCharacters.setValue(8921, 8920);
            this.mirroringShapeCharacters.setValue(8922, 8923);
            this.mirroringShapeCharacters.setValue(8923, 8922);
            this.mirroringShapeCharacters.setValue(8924, 8925);
            this.mirroringShapeCharacters.setValue(8925, 8924);
            this.mirroringShapeCharacters.setValue(8926, 8927);
            this.mirroringShapeCharacters.setValue(8927, 8926);
            this.mirroringShapeCharacters.setValue(8928, 8929);
            this.mirroringShapeCharacters.setValue(8929, 8928);
            this.mirroringShapeCharacters.setValue(8930, 8931);
            this.mirroringShapeCharacters.setValue(8931, 8930);
            this.mirroringShapeCharacters.setValue(8932, 8933);
            this.mirroringShapeCharacters.setValue(8933, 8932);
            this.mirroringShapeCharacters.setValue(8934, 8935);
            this.mirroringShapeCharacters.setValue(8935, 8934);
            this.mirroringShapeCharacters.setValue(8936, 8937);
            this.mirroringShapeCharacters.setValue(8937, 8936);
            this.mirroringShapeCharacters.setValue(8938, 8939);
            this.mirroringShapeCharacters.setValue(8939, 8938);
            this.mirroringShapeCharacters.setValue(8940, 8941);
            this.mirroringShapeCharacters.setValue(8941, 8940);
            this.mirroringShapeCharacters.setValue(8944, 8945);
            this.mirroringShapeCharacters.setValue(8945, 8944);
            this.mirroringShapeCharacters.setValue(8946, 8954);
            this.mirroringShapeCharacters.setValue(8947, 8955);
            this.mirroringShapeCharacters.setValue(8948, 8956);
            this.mirroringShapeCharacters.setValue(8950, 8957);
            this.mirroringShapeCharacters.setValue(8951, 8958);
            this.mirroringShapeCharacters.setValue(8954, 8946);
            this.mirroringShapeCharacters.setValue(8955, 8947);
            this.mirroringShapeCharacters.setValue(8956, 8948);
            this.mirroringShapeCharacters.setValue(8957, 8950);
            this.mirroringShapeCharacters.setValue(8958, 8951);
            this.mirroringShapeCharacters.setValue(8968, 8969);
            this.mirroringShapeCharacters.setValue(8969, 8968);
            this.mirroringShapeCharacters.setValue(8970, 8971);
            this.mirroringShapeCharacters.setValue(8971, 8970);
            this.mirroringShapeCharacters.setValue(9001, 9002);
            this.mirroringShapeCharacters.setValue(9002, 9001);
            this.mirroringShapeCharacters.setValue(10088, 10089);
            this.mirroringShapeCharacters.setValue(10089, 10088);
            this.mirroringShapeCharacters.setValue(10090, 10091);
            this.mirroringShapeCharacters.setValue(10091, 10090);
            this.mirroringShapeCharacters.setValue(10092, 10093);
            this.mirroringShapeCharacters.setValue(10093, 10092);
            this.mirroringShapeCharacters.setValue(10094, 10095);
            this.mirroringShapeCharacters.setValue(10095, 10094);
            this.mirroringShapeCharacters.setValue(10096, 10097);
            this.mirroringShapeCharacters.setValue(10097, 10096);
            this.mirroringShapeCharacters.setValue(10098, 10099);
            this.mirroringShapeCharacters.setValue(10099, 10098);
            this.mirroringShapeCharacters.setValue(10100, 10101);
            this.mirroringShapeCharacters.setValue(10101, 10100);
            this.mirroringShapeCharacters.setValue(10197, 10198);
            this.mirroringShapeCharacters.setValue(10198, 10197);
            this.mirroringShapeCharacters.setValue(10205, 10206);
            this.mirroringShapeCharacters.setValue(10206, 10205);
            this.mirroringShapeCharacters.setValue(10210, 10211);
            this.mirroringShapeCharacters.setValue(10211, 10210);
            this.mirroringShapeCharacters.setValue(10212, 10213);
            this.mirroringShapeCharacters.setValue(10213, 10212);
            this.mirroringShapeCharacters.setValue(10214, 10215);
            this.mirroringShapeCharacters.setValue(10215, 10214);
            this.mirroringShapeCharacters.setValue(10216, 10217);
            this.mirroringShapeCharacters.setValue(10217, 10216);
            this.mirroringShapeCharacters.setValue(10218, 10219);
            this.mirroringShapeCharacters.setValue(10219, 10218);
            this.mirroringShapeCharacters.setValue(10627, 10628);
            this.mirroringShapeCharacters.setValue(10628, 10627);
            this.mirroringShapeCharacters.setValue(10629, 10630);
            this.mirroringShapeCharacters.setValue(10630, 10629);
            this.mirroringShapeCharacters.setValue(10631, 10632);
            this.mirroringShapeCharacters.setValue(10632, 10631);
            this.mirroringShapeCharacters.setValue(10633, 10634);
            this.mirroringShapeCharacters.setValue(10634, 10633);
            this.mirroringShapeCharacters.setValue(10635, 10636);
            this.mirroringShapeCharacters.setValue(10636, 10635);
            this.mirroringShapeCharacters.setValue(10637, 10640);
            this.mirroringShapeCharacters.setValue(10638, 10639);
            this.mirroringShapeCharacters.setValue(10639, 10638);
            this.mirroringShapeCharacters.setValue(10640, 10637);
            this.mirroringShapeCharacters.setValue(10641, 10642);
            this.mirroringShapeCharacters.setValue(10642, 10641);
            this.mirroringShapeCharacters.setValue(10643, 10644);
            this.mirroringShapeCharacters.setValue(10644, 10643);
            this.mirroringShapeCharacters.setValue(10645, 10646);
            this.mirroringShapeCharacters.setValue(10646, 10645);
            this.mirroringShapeCharacters.setValue(10647, 10648);
            this.mirroringShapeCharacters.setValue(10648, 10647);
            this.mirroringShapeCharacters.setValue(10680, 8856);
            this.mirroringShapeCharacters.setValue(10688, 10689);
            this.mirroringShapeCharacters.setValue(10689, 10688);
            this.mirroringShapeCharacters.setValue(10692, 10693);
            this.mirroringShapeCharacters.setValue(10693, 10692);
            this.mirroringShapeCharacters.setValue(10703, 10704);
            this.mirroringShapeCharacters.setValue(10704, 10703);
            this.mirroringShapeCharacters.setValue(10705, 10706);
            this.mirroringShapeCharacters.setValue(10706, 10705);
            this.mirroringShapeCharacters.setValue(10708, 10709);
            this.mirroringShapeCharacters.setValue(10709, 10708);
            this.mirroringShapeCharacters.setValue(10712, 10713);
            this.mirroringShapeCharacters.setValue(10713, 10712);
            this.mirroringShapeCharacters.setValue(10714, 10715);
            this.mirroringShapeCharacters.setValue(10715, 10714);
            this.mirroringShapeCharacters.setValue(10741, 8725);
            this.mirroringShapeCharacters.setValue(10744, 10745);
            this.mirroringShapeCharacters.setValue(10745, 10744);
            this.mirroringShapeCharacters.setValue(10748, 10749);
            this.mirroringShapeCharacters.setValue(10749, 10748);
            this.mirroringShapeCharacters.setValue(10795, 10796);
            this.mirroringShapeCharacters.setValue(10796, 10795);
            this.mirroringShapeCharacters.setValue(10797, 10796);
            this.mirroringShapeCharacters.setValue(10798, 10797);
            this.mirroringShapeCharacters.setValue(10804, 10805);
            this.mirroringShapeCharacters.setValue(10805, 10804);
            this.mirroringShapeCharacters.setValue(10812, 10813);
            this.mirroringShapeCharacters.setValue(10813, 10812);
            this.mirroringShapeCharacters.setValue(10852, 10853);
            this.mirroringShapeCharacters.setValue(10853, 10852);
            this.mirroringShapeCharacters.setValue(10873, 10874);
            this.mirroringShapeCharacters.setValue(10874, 10873);
            this.mirroringShapeCharacters.setValue(10877, 10878);
            this.mirroringShapeCharacters.setValue(10878, 10877);
            this.mirroringShapeCharacters.setValue(10879, 10880);
            this.mirroringShapeCharacters.setValue(10880, 10879);
            this.mirroringShapeCharacters.setValue(10881, 10882);
            this.mirroringShapeCharacters.setValue(10882, 10881);
            this.mirroringShapeCharacters.setValue(10883, 10884);
            this.mirroringShapeCharacters.setValue(10884, 10883);
            this.mirroringShapeCharacters.setValue(10891, 10892);
            this.mirroringShapeCharacters.setValue(10892, 10891);
            this.mirroringShapeCharacters.setValue(10897, 10898);
            this.mirroringShapeCharacters.setValue(10898, 10897);
            this.mirroringShapeCharacters.setValue(10899, 10900);
            this.mirroringShapeCharacters.setValue(10900, 10899);
            this.mirroringShapeCharacters.setValue(10901, 10902);
            this.mirroringShapeCharacters.setValue(10902, 10901);
            this.mirroringShapeCharacters.setValue(10903, 10904);
            this.mirroringShapeCharacters.setValue(10904, 10903);
            this.mirroringShapeCharacters.setValue(10905, 10906);
            this.mirroringShapeCharacters.setValue(10906, 10905);
            this.mirroringShapeCharacters.setValue(10907, 10908);
            this.mirroringShapeCharacters.setValue(10908, 10907);
            this.mirroringShapeCharacters.setValue(10913, 10914);
            this.mirroringShapeCharacters.setValue(10914, 10913);
            this.mirroringShapeCharacters.setValue(10918, 10919);
            this.mirroringShapeCharacters.setValue(10919, 10918);
            this.mirroringShapeCharacters.setValue(10920, 10921);
            this.mirroringShapeCharacters.setValue(10921, 10920);
            this.mirroringShapeCharacters.setValue(10922, 10923);
            this.mirroringShapeCharacters.setValue(10923, 10922);
            this.mirroringShapeCharacters.setValue(10924, 10925);
            this.mirroringShapeCharacters.setValue(10925, 10924);
            this.mirroringShapeCharacters.setValue(10927, 10928);
            this.mirroringShapeCharacters.setValue(10928, 10927);
            this.mirroringShapeCharacters.setValue(10931, 10932);
            this.mirroringShapeCharacters.setValue(10932, 10931);
            this.mirroringShapeCharacters.setValue(10939, 10940);
            this.mirroringShapeCharacters.setValue(10940, 10939);
            this.mirroringShapeCharacters.setValue(10941, 10942);
            this.mirroringShapeCharacters.setValue(10942, 10941);
            this.mirroringShapeCharacters.setValue(10943, 10944);
            this.mirroringShapeCharacters.setValue(10944, 10943);
            this.mirroringShapeCharacters.setValue(10945, 10946);
            this.mirroringShapeCharacters.setValue(10946, 10945);
            this.mirroringShapeCharacters.setValue(10947, 10948);
            this.mirroringShapeCharacters.setValue(10948, 10947);
            this.mirroringShapeCharacters.setValue(10949, 10950);
            this.mirroringShapeCharacters.setValue(10950, 10949);
            this.mirroringShapeCharacters.setValue(10957, 10958);
            this.mirroringShapeCharacters.setValue(10958, 10957);
            this.mirroringShapeCharacters.setValue(10959, 10960);
            this.mirroringShapeCharacters.setValue(10960, 10959);
            this.mirroringShapeCharacters.setValue(10961, 10962);
            this.mirroringShapeCharacters.setValue(10962, 10961);
            this.mirroringShapeCharacters.setValue(10963, 10964);
            this.mirroringShapeCharacters.setValue(10964, 10963);
            this.mirroringShapeCharacters.setValue(10965, 10966);
            this.mirroringShapeCharacters.setValue(10966, 10965);
            this.mirroringShapeCharacters.setValue(10974, 8870);
            this.mirroringShapeCharacters.setValue(10979, 8873);
            this.mirroringShapeCharacters.setValue(10980, 8872);
            this.mirroringShapeCharacters.setValue(10981, 8875);
            this.mirroringShapeCharacters.setValue(10988, 10989);
            this.mirroringShapeCharacters.setValue(10989, 10988);
            this.mirroringShapeCharacters.setValue(10999, 11000);
            this.mirroringShapeCharacters.setValue(11000, 10999);
            this.mirroringShapeCharacters.setValue(11001, 11002);
            this.mirroringShapeCharacters.setValue(11002, 11001);
            this.mirroringShapeCharacters.setValue(12296, 12297);
            this.mirroringShapeCharacters.setValue(12297, 12296);
            this.mirroringShapeCharacters.setValue(12298, 12299);
            this.mirroringShapeCharacters.setValue(12299, 12298);
            this.mirroringShapeCharacters.setValue(12300, 12301);
            this.mirroringShapeCharacters.setValue(12301, 12300);
            this.mirroringShapeCharacters.setValue(12302, 12303);
            this.mirroringShapeCharacters.setValue(12303, 12302);
            this.mirroringShapeCharacters.setValue(12304, 12305);
            this.mirroringShapeCharacters.setValue(12305, 12304);
            this.mirroringShapeCharacters.setValue(12308, 12309);
            this.mirroringShapeCharacters.setValue(12309, 12308);
            this.mirroringShapeCharacters.setValue(12310, 12311);
            this.mirroringShapeCharacters.setValue(12311, 12310);
            this.mirroringShapeCharacters.setValue(12312, 12313);
            this.mirroringShapeCharacters.setValue(12313, 12312);
            this.mirroringShapeCharacters.setValue(12314, 12315);
            this.mirroringShapeCharacters.setValue(12315, 12314);
            this.mirroringShapeCharacters.setValue(65288, 65289);
            this.mirroringShapeCharacters.setValue(65289, 65288);
            this.mirroringShapeCharacters.setValue(65308, 65310);
            this.mirroringShapeCharacters.setValue(65310, 65308);
            this.mirroringShapeCharacters.setValue(65339, 65341);
            this.mirroringShapeCharacters.setValue(65341, 65339);
            this.mirroringShapeCharacters.setValue(65371, 65373);
            this.mirroringShapeCharacters.setValue(65373, 65371);
            this.mirroringShapeCharacters.setValue(65375, 65376);
            this.mirroringShapeCharacters.setValue(65376, 65375);
            this.mirroringShapeCharacters.setValue(65378, 65379);
            this.mirroringShapeCharacters.setValue(65379, 65378);
        }
        //#endregion
    }
    export class RtlCharacters {
        //#region fields
        /// <summary>
        /// Specifies the character types.
        /// </summary>
        private  types : number[] = [];
        /// <summary>
        /// Specifies the text order (RTL or LTR).
        /// </summary>
        private  textOrder : number = -1;
        /// <summary>
        /// Specifies the text length.
        /// </summary>
        private  length :  number;
        /// <summary>
        /// Specifies the resultant types.
        /// </summary>
        private  result : number[];
        /// <summary>
        /// Specifies the resultant levels.
        /// </summary>
        private  levels : number[];
        /// <summary>
        /// Specifies the RTL character types.
        /// </summary>
        /* tslint:disable-next-line:prefer-array-literal */
        public  rtlCharacterTypes : number[] = new Array(65536);
        //#endregion
        //#region constants
        /// <summary>
        /// Left-to-Right (Non-European or non-Arabic digits).
        /// </summary>
        private readonly L : number = 0;
        /// <summary>
        /// Left-to-Right Embedding
        /// </summary>
        private readonly LRE : number = 1;
        /// <summary>
        /// Left-to-Right Override
        /// </summary>
        private readonly LRO : number = 2;
        /// <summary>
        /// Right-to-Left (Hebrew alphabet, and related punctuation).
        /// </summary>
        private readonly R : number = 3;
        /// <summary>
        /// Right-to-Left Arabic 
        /// </summary>
        private  readonly AL : number = 4;
        /// <summary>
        /// Right-to-Left Embedding.
        /// </summary>
        private  readonly RLE : number = 5;
        /// <summary>
        /// Right-to-Left Override
        /// </summary>
        private readonly RLO : number = 6;
        /// <summary>
        /// Pop Directional Format
        /// </summary>
        private readonly PDF : number = 7;
        /// <summary>
        /// European Number (European digits, Eastern Arabic-Indic digits).
        /// </summary>
        private readonly EN : number = 8;
        /// <summary>
        /// European Number Separator (Plus sign, Minus sign).
        /// </summary>
        private readonly ES : number  = 9;
        /// <summary>
        /// European Number Terminator (Degree sign, currency symbols).
        /// </summary>
        private readonly ET : number  = 10;
        /// <summary>
        /// Arabic Number (Arabic-Indic digits, Arabic decimal and thousands separators).
        /// </summary>
        private readonly AN : number  = 11;
        /// <summary>
        /// Common Number Separator (Colon, Comma, Full Stop, No-Break Space.
        /// </summary>
        private readonly CS : number  = 12;
        /// <summary>
        /// Nonspacing Mark (Characters with the General_Category values).
        /// </summary>
        private readonly NSM : number  = 13;
        /// <summary>
        /// Boundary Neutral (Default ignorables, non-characters, and control characters, other than those explicitly given other types.)
        /// </summary>
        private readonly BN : number  = 14;
        /// <summary>
        /// Paragraph Separator (Paragraph separator, appropriate Newline Functions, higher-level protocol paragraph determination).
        /// </summary>
        private readonly B : number  = 15;
        /// <summary>
        /// 	Segment Separator (tab).
        /// </summary>
        private readonly S : number  = 16;
        /// <summary>
        /// Whitespace (Space, Figure space, Line separator, Form feed, General Punctuation spaces).
        /// </summary>
        private readonly WS : number  = 17;
        /// <summary>
        /// Other Neutrals (All other characters, including object replacement character).
        /// </summary>
        private readonly ON : number = 18;
        /// <summary>
        /// RTL character types.
        /// </summary>
        private readonly charTypes : number[] = [
            this.L, this.EN, this.BN, this.ES, this.ES, this.S, this.ET, this.ET, this.B, this.AN, this.AN, this.S, this.CS, this.CS,
            this.WS, this.NSM, this.NSM, this.B, this.BN,  27, this.BN,  28,  30, this.B,  31,  31, this.S,  32,  32, this.WS,  33,  34,
            this.ON,  35,  37, this.ET, 38,  42, this.ON,  43,  43, this.ET, 44, 44, this.CS,  45,  45, this.ET,  46,  46, this.CS,
            47,  47, this.CS, 48,  57, this.EN,  58,  58, this.CS,  59,  64, this.ON,  65,  90, this.L,  91,  96, this.ON, 97, 122, this.L,
             123,  126, this.ON,  127,  132, this.BN,  133,  133, this.B,  134,  159, this.BN,  160,  160, this.CS,
             161,  161, this.ON,  162,  165, this.ET,  166,  169, this.ON,  170,  170, this.L,  171,  175, this.ON,
             176,  177, this.ET,  178,  179, this.EN,  180,  180, this.ON,  181,  181, this.L,  182,  184, this.ON,
             185,  185, this.EN,  186,  186, this.L,  187,  191, this.ON,  192,  214, this.L,  215,  215, this.ON,
             216,  246, this.L,  247,  247, this.ON,  248,  696, this.L,  697,  698, this.ON,  699,  705, this.L,
             706,  719, this.ON,  720,  721, this.L,  722,  735, this.ON,  736,  740, this.L,  741,  749, this.ON,
             750,  750, this.L,  751,  767, this.ON,  768,  855, this.NSM,  856,  860, this.L,  861,  879, this.NSM,
             880,  883, this.L,  884,  885, this.ON,  886,  893, this.L,  894,  894, this.ON,  895,  899, this.L,
             900,  901, this.ON,  902,  902, this.L,  903,  903, this.ON,  904,  1013, this.L,  1014,  1014, this.ON,
             1015,  1154, this.L,  1155,  1158, this.NSM,  1159,  1159, this.L,  1160,  1161, this.NSM,
             1162,  1417, this.L,  1418,  1418, this.ON,  1419,  1424, this.L,  1425,  1441, this.NSM,
             1442,  1442, this.L,  1443,  1465, this.NSM,  1466,  1466, this.L,  1467,  1469, this.NSM,
             1470,  1470, this.R,  1471,  1471, this.NSM,  1472,  1472, this.R,  1473,  1474, this.NSM,
             1475,  1475, this.R,  1476,  1476, this.NSM,  1477,  1487, this.L,  1488,  1514, this.R,
             1515,  1519, this.L,  1520,  1524, this.R,  1525,  1535, this.L,  1536,  1539, this.AL,
             1540,  1547, this.L,  1548,  1548, this.CS,  1549,  1549, this.AL,  1550,  1551, this.ON,
             1552,  1557, this.NSM,  1558,  1562, this.L,  1563,  1563, this.AL,  1564,  1566, this.L,
             1567,  1567, this.AL,  1568,  1568, this.L,  1569,  1594, this.AL,  1595,  1599, this.L,
             1600,  1610, this.AL,  1611,  1624, this.NSM,  1625,  1631, this.L,  1632,  1641, this.AN,
             1642,  1642, this.ET,  1643,  1644, this.AN,  1645,  1647, this.AL,  1648,  1648, this.NSM,
             1649,  1749, this.AL,  1750,  1756, this.NSM,  1757,  1757, this.AL,  1758,  1764, this.NSM,
             1765,  1766, this.AL,  1767,  1768, this.NSM,  1769,  1769, this.ON,  1770,  1773, this.NSM,
             1774,  1775, this.AL,  1776,  1785, this.EN,  1786,  1805, this.AL,  1806,  1806, this.L,
             1807,  1807, this.BN,  1808,  1808, this.AL,  1809,  1809, this.NSM,  1810,  1839, this.AL,
             1840,  1866, this.NSM,  1867,  1868, this.L,  1869,  1871, this.AL,  1872,  1919, this.L,
             1920,  1957, this.AL,  1958,  1968, this.NSM,  1969,  1969, this.AL,  1970,  2304, this.L,
             2305,  2306, this.NSM,  2307,  2363, this.L,  2364,  2364, this.NSM,  2365,  2368, this.L,
             2369,  2376, this.NSM,  2377,  2380, this.L,  2381,  2381, this.NSM,  2382,  2384, this.L,
             2385,  2388, this.NSM,  2389,  2401, this.L,  2402,  2403, this.NSM,  2404,  2432, this.L,
             2433,  2433, this.NSM,  2434,  2491, this.L,  2492,  2492, this.NSM,  2493,  2496, this.L,
             2497,  2500, this.NSM,  2501,  2508, this.L,  2509,  2509, this.NSM,  2510,  2529, this.L,
             2530,  2531, this.NSM,  2532,  2545, this.L,  2546,  2547, this.ET,  2548,  2560, this.L,
             2561,  2562, this.NSM,  2563,  2619, this.L,  2620,  2620, this.NSM,  2621,  2624, this.L,
             2625,  2626, this.NSM,  2627,  2630, this.L,  2631,  2632, this.NSM,  2633,  2634, this.L,
             2635,  2637, this.NSM,  2638,  2671, this.L,  2672,  2673, this.NSM,  2674,  2688, this.L,
             2689,  2690, this.NSM,  2691,  2747, this.L,  2748,  2748, this.NSM,  2749,  2752, this.L,
             2753,  2757, this.NSM,  2758,  2758, this.L,  2759,  2760, this.NSM,  2761,  2764, this.L,
             2765,  2765, this.NSM,  2766,  2785, this.L,  2786,  2787, this.NSM,  2788,  2800, this.L,
             2801,  2801, this.ET,  2802,  2816, this.L,  2817,  2817, this.NSM,  2818,  2875, this.L,
             2876,  2876, this.NSM,  2877,  2878, this.L,  2879,  2879, this.NSM,  2880,  2880, this.L,
             2881,  2883, this.NSM,  2884,  2892, this.L,  2893,  2893, this.NSM,  2894,  2901, this.L,
             2902,  2902, this.NSM,  2903,  2945, this.L,  2946,  2946, this.NSM,  2947,  3007, this.L,
             3008,  3008, this.NSM,  3009,  3020, this.L,  3021,  3021, this.NSM,  3022,  3058, this.L,
             3059,  3064, this.ON,  3065,  3065, this.ET,  3066,  3066, this.ON,  3067,  3133, this.L,
             3134,  3136, this.NSM,  3137,  3141, this.L,  3142,  3144, this.NSM,  3145,  3145, this.L,
             3146,  3149, this.NSM,  3150,  3156, this.L,  3157,  3158, this.NSM,  3159,  3259, this.L,
             3260,  3260, this.NSM,  3261,  3275, this.L,  3276,  3277, this.NSM,  3278,  3392, this.L,
             3393,  3395, this.NSM,  3396,  3404, this.L,  3405,  3405, this.NSM,  3406,  3529, this.L,
             3530,  3530, this.NSM,  3531,  3537, this.L,  3538,  3540, this.NSM,  3541,  3541, this.L,
             3542,  3542, this.NSM,  3543,  3632, this.L,  3633,  3633, this.NSM,  3634,  3635, this.L,
             3636,  3642, this.NSM,  3643,  3646, this.L,  3647,  3647, this.ET,  3648,  3654, this.L,
             3655,  3662, this.NSM,  3663,  3760, this.L,  3761,  3761, this.NSM,  3762,  3763, this.L,
             3764,  3769, this.NSM,  3770,  3770, this.L,  3771,  3772, this.NSM,  3773,  3783, this.L,
             3784,  3789, this.NSM,  3790,  3863, this.L,  3864,  3865, this.NSM,  3866,  3892, this.L,
             3893,  3893, this.NSM,  3894,  3894, this.L,  3895,  3895, this.NSM,  3896,  3896, this.L,
             3897,  3897, this.NSM,  3898,  3901, this.ON,  3902,  3952, this.L,  3953,  3966, this.NSM,
             3967,  3967, this.L,  3968,  3972, this.NSM,  3973,  3973, this.L,  3974,  3975, this.NSM,
             3976,  3983, this.L,  3984,  3991, this.NSM,  3992,  3992, this.L,  3993,  4028, this.NSM,
             4029,  4037, this.L,  4038,  4038, this.NSM,  4039,  4140, this.L,  4141,  4144, this.NSM,
             4145,  4145, this.L,  4146,  4146, this.NSM,  4147,  4149, this.L,  4150,  4151, this.NSM,
             4152,  4152, this.L,  4153,  4153, this.NSM,  4154,  4183, this.L,  4184,  4185, this.NSM,
             4186,  5759, this.L,  5760,  5760, this.WS,  5761,  5786, this.L,  5787,  5788, this.ON,
             5789,  5905, this.L,  5906,  5908, this.NSM,  5909,  5937, this.L,  5938,  5940, this.NSM,
             5941,  5969, this.L,  5970,  5971, this.NSM,  5972,  6001, this.L,  6002,  6003, this.NSM,
             6004,  6070, this.L,  6071,  6077, this.NSM,  6078,  6085, this.L,  6086,  6086, this.NSM,
             6087,  6088, this.L,  6089,  6099, this.NSM,  6100,  6106, this.L,  6107,  6107, this.ET,
             6108,  6108, this.L,  6109,  6109, this.NSM,  6110,  6127, this.L,  6128,  6137, this.ON,
             6138,  6143, this.L,  6144,  6154, this.ON,  6155,  6157, this.NSM,  6158,  6158, this.WS,
             6159,  6312, this.L,  6313,  6313, this.NSM,  6314,  6431, this.L,  6432,  6434, this.NSM,
             6435,  6438, this.L,  6439,  6443, this.NSM,  6444,  6449, this.L,  6450,  6450, this.NSM,
             6451,  6456, this.L,  6457,  6459, this.NSM,  6460,  6463, this.L,  6464,  6464, this.ON,
             6465,  6467, this.L,  6468,  6469, this.ON,  6470,  6623, this.L,  6624,  6655, this.ON,
             6656,  8124, this.L,  8125,  8125, this.ON,  8126,  8126, this.L,  8127,  8129, this.ON,
             8130,  8140, this.L,  8141,  8143, this.ON,  8144,  8156, this.L,  8157,  8159, this.ON,
             8160,  8172, this.L,  8173,  8175, this.ON,  8176,  8188, this.L,  8189,  8190, this.ON,
             8191,  8191, this.L,  8192,  8202, this.WS,  8203,  8205, this.BN,  8206,  8206, this.L,
             8207,  8207, this.R,  8208,  8231, this.ON,  8232,  8232, this.WS,  8233,  8233, this.B,
             8234,  8234, this.LRE,  8235,  8235, this.RLE,  8236,  8236, this.PDF,  8237,  8237, this.LRO,
             8238,  8238, this.RLO,  8239,  8239, this.WS,  8240,  8244, this.ET,  8245,  8276, this.ON,
             8277,  8278, this.L,  8279,  8279, this.ON,  8280,  8286, this.L,  8287,  8287, this.WS,
             8288,  8291, this.BN,  8292,  8297, this.L,  8298,  8303, this.BN,  8304,  8304, this.EN,
             8305,  8307, this.L,  8308,  8313, this.EN,  8314,  8315, this.ET,  8316,  8318, this.ON,
             8319,  8319, this.L,  8320,  8329, this.EN,  8330,  8331, this.ET,  8332,  8334, this.ON,
             8335,  8351, this.L,  8352,  8369, this.ET,  8370,  8399, this.L,  8400,  8426, this.NSM,
             8427,  8447, this.L,  8448,  8449, this.ON,  8450,  8450, this.L,  8451,  8454, this.ON,
             8455,  8455, this.L,  8456,  8457, this.ON,  8458,  8467, this.L,  8468,  8468, this.ON,
             8469,  8469, this.L,  8470,  8472, this.ON,  8473,  8477, this.L,  8478,  8483, this.ON,
             8484,  8484, this.L,  8485,  8485, this.ON,  8486,  8486, this.L,  8487,  8487, this.ON,
             8488,  8488, this.L,  8489,  8489, this.ON,  8490,  8493, this.L,  8494,  8494, this.ET,
             8495,  8497, this.L,  8498,  8498, this.ON,  8499,  8505, this.L,  8506,  8507, this.ON,
             8508,  8511, this.L,  8512,  8516, this.ON,  8517,  8521, this.L,  8522,  8523, this.ON,
             8524,  8530, this.L,  8531,  8543, this.ON,  8544,  8591, this.L,  8592,  8721, this.ON,
             8722,  8723, this.ET,  8724,  9013, this.ON,  9014,  9082, this.L,  9083,  9108, this.ON,
             9109,  9109, this.L,  9110,  9168, this.ON,  9169,  9215, this.L,  9216,  9254, this.ON,
             9255,  9279, this.L,  9280,  9290, this.ON,  9291,  9311, this.L,  9312,  9371, this.EN,
             9372,  9449, this.L,  9450,  9450, this.EN,  9451,  9751, this.ON,  9752,  9752, this.L,
             9753,  9853, this.ON,  9854,  9855, this.L,  9856,  9873, this.ON,  9874,  9887, this.L,
             9888,  9889, this.ON,  9890,  9984, this.L,  9985,  9988, this.ON,  9989,  9989, this.L,
             9990,  9993, this.ON,  9994,  9995, this.L,  9996,  10023, this.ON,  10024,  10024, this.L,
             10025,  10059, this.ON,  10060,  10060, this.L,  10061,  10061, this.ON,  10062,  10062, this.L,
             10063,  10066, this.ON,  10067,  10069, this.L,  10070,  10070, this.ON,  10071,  10071, this.L,
             10072,  10078, this.ON,  10079,  10080, this.L,  10081,  10132, this.ON,  10133,  10135, this.L,
             10136,  10159, this.ON,  10160,  10160, this.L,  10161,  10174, this.ON,  10175,  10191, this.L,
             10192,  10219, this.ON,  10220,  10223, this.L,  10224,  11021, this.ON,  11022,  11903, this.L,
             11904,  11929, this.ON,  11930,  11930, this.L,  11931,  12019, this.ON,  12020,  12031, this.L,
             12032,  12245, this.ON,  12246,  12271, this.L,  12272,  12283, this.ON,  12284,  12287, this.L,
             12288,  12288, this.WS,  12289,  12292, this.ON,  12293,  12295, this.L,  12296,  12320, this.ON,
             12321,  12329, this.L,  12330,  12335, this.NSM,  12336,  12336, this.ON,  12337,  12341, this.L,
             12342,  12343, this.ON,  12344,  12348, this.L,  12349,  12351, this.ON,  12352,  12440, this.L,
             12441,  12442, this.NSM,  12443,  12444, this.ON,  12445,  12447, this.L,  12448,  12448, this.ON,
             12449,  12538, this.L,  12539,  12539, this.ON,  12540,  12828, this.L,  12829,  12830, this.ON,
             12831,  12879, this.L,  12880,  12895, this.ON,  12896,  12923, this.L,  12924,  12925, this.ON,
             12926,  12976, this.L,  12977,  12991, this.ON,  12992,  13003, this.L,  13004,  13007, this.ON,
             13008,  13174, this.L,  13175,  13178, this.ON,  13179,  13277, this.L,  13278,  13279, this.ON,
             13280,  13310, this.L,  13311,  13311, this.ON,  13312,  19903, this.L,  19904,  19967, this.ON,
             19968,  42127, this.L,  42128,  42182, this.ON,  42183,  64284, this.L,  64285,  64285, this.R,
             64286,  64286, this.NSM,  64287,  64296, this.R,  64297,  64297, this.ET,  64298,  64310, this.R,
             64311,  64311, this.L,  64312,  64316, this.R,  64317,  64317, this.L,  64318,  64318, this.R,
             64319,  64319, this.L,  64320,  64321, this.R,  64322,  64322, this.L,  64323,  64324, this.R,
             64325,  64325, this.L,  64326,  64335, this.R,  64336,  64433, this.AL,  64434,  64466, this.L,
             64467,  64829, this.AL,  64830,  64831, this.ON,  64832,  64847, this.L,  64848,  64911, this.AL,
             64912,  64913, this.L,  64914,  64967, this.AL,  64968,  65007, this.L,  65008,  65020, this.AL,
             65021,  65021, this.ON,  65022,  65023, this.L,  65024,  65039, this.NSM,  65040,  65055, this.L,
             65056,  65059, this.NSM,  65060,  65071, this.L,  65072,  65103, this.ON,  65104,  65104, this.CS,
             65105,  65105, this.ON,  65106,  65106, this.CS,  65107,  65107, this.L,  65108,  65108, this.ON,
             65109,  65109, this.CS,  65110,  65118, this.ON,  65119,  65119, this.ET,  65120,  65121, this.ON,
             65122,  65123, this.ET,  65124,  65126, this.ON,  65127,  65127, this.L,  65128,  65128, this.ON,
             65129,  65130, this.ET,  65131,  65131, this.ON,  65132,  65135, this.L,  65136,  65140, this.AL,
             65141,  65141, this.L,  65142,  65276, this.AL,  65277,  65278, this.L,  65279,  65279, this.BN,
             65280,  65280, this.L,  65281,  65282, this.ON,  65283,  65285, this.ET,  65286,  65290, this.ON,
             65291,  65291, this.ET,  65292,  65292, this.CS,  65293,  65293, this.ET,  65294,  65294, this.CS,
             65295,  65295, this.ES,  65296,  65305, this.EN,  65306,  65306, this.CS,  65307,  65312, this.ON,
             65313,  65338, this.L,  65339,  65344, this.ON,  65345,  65370, this.L,  65371,  65381, this.ON,
             65382,  65503, this.L,  65504,  65505, this.ET,  65506,  65508, this.ON,  65509,  65510, this.ET,
             65511,  65511, this.L,  65512,  65518, this.ON,  65519,  65528, this.L,  65529,  65531, this.BN,
             65532,  65533, this.ON,  65534,  65535, this.L];
        //#endregion
        //#region constructors
        public constructor() {
            for (let i : number = 0; i < this.charTypes.length; ++i) {
                let start : number = this.charTypes[i];
                let end : number = this.charTypes[++i];
                let b : number = this.charTypes[++i];
                while (start <= end) {
                    this.rtlCharacterTypes[start++] = b;
                }
            }
        }
        //#endregion

        //#region implementation
        public getVisualOrder( inputText : string, isRtl :  boolean) : number[] {
            this.types = this.getCharacterCode(inputText);
            this.textOrder = isRtl ? this.LRE : this.L;
            this.doVisualOrder();
            let result : number[] = [];
            for (let i : number = 0; i < this.levels.length; i++) {
                result[i] = this.levels[i];
            }
            return result;
        }
        private getCharacterCode( text : string) : number[] {
            let characterCodes : number[] = [];
            for (let i : number = 0; i < text.length; i++) {
                characterCodes[i] = this.rtlCharacterTypes[text[i].charCodeAt(0)];
            }
            return characterCodes;
        }
        private setDefaultLevels() : void {
            for (let i : number = 0; i < this.length; i++) {
                this.levels[i] = this.textOrder;
            }
        }
        private setLevels(): void {
            this.setDefaultLevels();
            for (let n : number = 0; n < this.length; ++n) {
                let level : number = this.levels[n];
                if ((level & 0x80) !== 0) {
                    level &= 0x7f;
                    this.result[n] = ((level & 0x1) === 0) ? this.L : this.R;
                }
                this.levels[n] = level;
            }
        }
        private updateLevels( index : number, level : number,  length : number) : void {
            if ((level & 1) === 0) {
                for (let i : number = index; i < length; ++i) {
                    if (this.result[i] === this.R) {
                        this.levels[i] += 1;
                    } else if (this.result[i] !== this.L) {
                        this.levels[i] += 2;
                    }
                }
            } else {
                for (let i : number = index; i < length; ++i) {
                    if (this.result[i] !== this.R) {
                        this.levels[i] += 1;
                    }
                }
            }
        }
        private doVisualOrder() : void {
            this.length = this.types.length;
            this.result = this.types;
            this.levels = [];
            this.setLevels();
            this.length = this.getEmbeddedCharactersLength();
            let preview : number = this.textOrder;
            let i : number = 0;
            while (i < this.length) {
                let level : number = this.levels[i];
                let preType : number = ((Math.max(preview, level) & 0x1) === 0) ? this.L : this.R;
                let length : number = i + 1;
                while (length < this.length && this.levels[length] === level) {
                    ++length;
                }
                let success : number = length < this.length ? this.levels[length] : this.textOrder;
                let type : number = ((Math.max(success, level) & 0x1) === 0) ? this.L : this.R;
                this.checkNSM(i, length, level, preType, type);
                this.updateLevels(i, level, length);
                preview = level;
                i = length;
            }
            this.checkEmbeddedCharacters(this.length);
        }
        private getEmbeddedCharactersLength() : number {
            let index : number = 0;
            for (let i : number = 0; i < this.length; ++i) {
                if (!(this.types[i] === this.LRE || this.types[i] === this.RLE || this.types[i] === this.LRO ||
                                    this.types[i] === this.RLO || this.types[i] === this.PDF || this.types[i] === this.BN)) {
                    this.result[index] = this.result[i];
                    this.levels[index] = this.levels[i];
                    index++;
                }
            }
            return index;
        }
        private  checkEmbeddedCharacters( length : number) : void {
            for (let i : number = this.types.length - 1; i >= 0; --i) {
                if (this.types[i] === this.LRE || this.types[i] === this.RLE || this.types[i] === this.LRO ||
                                this.types[i] === this.RLO || this.types[i] === this.PDF || this.types[i] === this.BN) {
                    this.result[i] = this.types[i];
                    this.levels[i] = -1;
                } else {
                    length -= 1;
                    this.result[i] = this.result[length];
                    this.levels[i] = this.levels[length];
                }
            }
            for (let i : number = 0; i < this.types.length; i++) {
                if (this.levels[i] === -1) {
                    if (i === 0) {
                        this.levels[i] = this.textOrder;
                    } else {
                        this.levels[i] = this.levels[i - 1];
                    }
                }
            }
        }
        private  checkNSM( index : number,  length : number,  level : number,  startType : number,  endType : number) : void {
            let charType : number = startType;
            for (let i : number = index; i < length; ++i) {
                if (this.result[i] === this.NSM) {
                    this.result[i] = charType;
                } else {
                    charType = this.result[i];
                }
            }
            this.checkEuropeanDigits(index, length, level, startType, endType);
        }
        private checkEuropeanDigits( index : number, length : number,  level : number,  startType : number,  endType : number) : void {
            for (let i : number = index; i < length; ++i) {
                if (this.result[i] === this.EN) {
                    for (let j : number = i - 1; j >= index; --j) {
                        if (this.result[j] === this.L || this.result[j] === this.R || this.result[j] === this.AL) {
                            if (this.result[j] === this.AL) {
                                this.result[i] = this.AN;
                            }
                            break;
                        }
                    }
                }
            }
            this.checkArabicCharacters(index, length, level, startType, endType);
        }
        private checkArabicCharacters( index : number,  length : number,  level: number,  startType : number,  endType: number) : void {
            for (let i : number = index; i < length; ++i) {
                if (this.result[i] === this.AL) {
                    this.result[i] = this.R;
                }
            }
            this.checkEuropeanNumberSeparator(index, length, level, startType, endType);
        }
        private checkEuropeanNumberSeparator(index : number, length : number, level : number, startType : number, endType : number) : void {
            for (let i : number = index + 1; i < length - 1; ++i) {
                if (this.result[i] === this.ES || this.result[i] === this.CS) {
                    let preview : number = this.result[i - 1];
                    let success : number = this.result[i + 1];
                    if (preview === this.EN && success === this.EN) {
                        this.result[i] = this.EN;
                    } else if (this.result[i] === this.CS && preview === this.AN && success === this.AN) {
                        this.result[i] = this.AN;
                    }
                }
            }
            this.checkEuropeanNumberTerminator(index, length, level, startType, endType);
        }
        private checkEuropeanNumberTerminator( index: number, length : number, level: number, startType: number, endType: number) : void {
            for (let i : number = index; i < length; ++i) {
                if (this.result[i] === this.ET) {
                    let s : number = i;
                    let b : number[] = [];
                    b.push(this.ET);
                    let l : number = this.getLength(s, length, b);
                    let data : number = s === index ? startType : this.result[s - 1];
                    if (data !== this.EN) {
                        data = (l === length) ? endType : this.result[l];
                    }
                    if (data === this.EN) {
                        for (let j : number = s; j < l; ++j) {
                            this.result[j] = this.EN;
                        }
                    }
                    i = l;
                }
            }
            this.checkOtherNeutrals(index, length, level, startType, endType);
        }
        private checkOtherNeutrals( index : number, length : number, level : number, startType : number, endType: number) : void {
            for (let i : number = index; i < length; ++i) {
                if (this.result[i] === this.ES || this.result[i] === this.ET || this.result[i] === this.CS) {
                    this.result[i] = this.ON;
                }
            }
            this.checkOtherCharacters(index, length, level, startType, endType);
        }
        private checkOtherCharacters( index : number,  length : number, level : number, startType : number, endType: number) : void {
            for (let i : number = index; i < length; ++i) {
                if (this.result[i] === this.EN) {
                    let pst : number = startType;
                    for (let j : number = i - 1; j >= index; --j) {
                        if (this.result[j] === this.L || this.result[j] === this.R) {
                            pst = this.result[j];
                            break;
                        }
                    }
                    if (pst === this.L) {
                        this.result[i] = this.L;
                    }
                }
            }
            this.checkCommanCharacters(index, length, level, startType, endType);
        }
        private getLength( index : number, length : number, validSet : number[]) : number {
            --index;
            while (++index < length) {
                let t : number = this.result[index];
                for (let i : number = 0; i < validSet.length; ++i) {
                    if (t === validSet[i]) {
                        index = this.getLength(++index, length, validSet);
                    }
                }
                return index;
            }
            return length;
        }
        private checkCommanCharacters( index : number, length : number, level : number, startType : number, endType : number) : void {
            for (let i : number = index; i < length; ++i) {
                if (this.result[i] === this.WS || this.result[i] === this.ON || this.result[i] === this.B ||
                                this.result[i] === this.S) {
                    let s : number = i;
                    let byte : number[] = [this.B, this.S, this.WS, this.ON];
                    let l  : number = this.getLength(s, length, byte);
                    let lt : number = 0;
                    let tt : number = 0;
                    let rt : number = 0;
                    if (s === index) {
                        lt = startType;
                    } else {
                        lt = this.result[s - 1];
                        if (lt === this.AN) {
                            lt = this.R;
                        } else if (lt === this.EN) {
                            lt = this.R;
                        }
                    }
                    if (l === length) {
                        tt = endType;
                    } else {
                        tt = this.result[l];
                        if (tt === this.AN) {
                            tt = this.R;
                        } else if (tt === this.EN) {
                            tt = this.R;
                        }
                    }
                    if (lt === tt) {
                        rt = lt;
                    } else {
                        rt = ((level & 0x1) === 0) ? this.L : this.R;
                    }
                    for (let j : number = s; j < l; ++j) {
                        this.result[j] = rt;
                    }
                    i = l;
                }
            }
        }
        //#endregion
    }
