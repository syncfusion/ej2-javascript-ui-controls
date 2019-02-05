/**
 * ArabicShapeRenderer.ts class for EJ2-PDF
 */
import { Dictionary} from './../../../collections/dictionary';
export class ArabicShapeRenderer {
        //#region Constants
        private readonly arabicCharTable : string[][] = [['\u0621', '\uFE80'], ['\u0622', '\uFE81', '\uFE82'],
            ['\u0623', '\uFE83', '\uFE84'],
            ['\u0624', '\uFE85', '\uFE86'],
            ['\u0625', '\uFE87', '\uFE88'],
            ['\u0626', '\uFE89', '\uFE8A', '\uFE8B', '\uFE8C'],
            ['\u0627', '\uFE8D', '\uFE8E'],
            ['\u0628', '\uFE8F', '\uFE90', '\uFE91', '\uFE92'],
            ['\u0629', '\uFE93', '\uFE94'],
            ['\u062A', '\uFE95', '\uFE96', '\uFE97', '\uFE98'],
            ['\u062B', '\uFE99', '\uFE9A', '\uFE9B', '\uFE9C'],
            ['\u062C', '\uFE9D', '\uFE9E', '\uFE9F', '\uFEA0'],
            ['\u062D', '\uFEA1', '\uFEA2', '\uFEA3', '\uFEA4'],
            ['\u062E', '\uFEA5', '\uFEA6', '\uFEA7', '\uFEA8'],
            ['\u062F', '\uFEA9', '\uFEAA'],
            ['\u0630', '\uFEAB', '\uFEAC'],
            ['\u0631', '\uFEAD', '\uFEAE'],
            ['\u0632', '\uFEAF', '\uFEB0'],
            ['\u0633', '\uFEB1', '\uFEB2', '\uFEB3', '\uFEB4'],
            ['\u0634', '\uFEB5', '\uFEB6', '\uFEB7', '\uFEB8'],
            ['\u0635', '\uFEB9', '\uFEBA', '\uFEBB', '\uFEBC'],
            ['\u0636', '\uFEBD', '\uFEBE', '\uFEBF', '\uFEC0'],
            ['\u0637', '\uFEC1', '\uFEC2', '\uFEC3', '\uFEC4'],
            ['\u0638', '\uFEC5', '\uFEC6', '\uFEC7', '\uFEC8'],
            ['\u0639', '\uFEC9', '\uFECA', '\uFECB', '\uFECC'],
            ['\u063A', '\uFECD', '\uFECE', '\uFECF', '\uFED0'],
            ['\u0640', '\u0640', '\u0640', '\u0640', '\u0640'],
            ['\u0641', '\uFED1', '\uFED2', '\uFED3', '\uFED4'],
            ['\u0642', '\uFED5', '\uFED6', '\uFED7', '\uFED8'],
            ['\u0643', '\uFED9', '\uFEDA', '\uFEDB', '\uFEDC'],
            ['\u0644', '\uFEDD', '\uFEDE', '\uFEDF', '\uFEE0'],
            ['\u0645', '\uFEE1', '\uFEE2', '\uFEE3', '\uFEE4'],
            ['\u0646', '\uFEE5', '\uFEE6', '\uFEE7', '\uFEE8'],
            ['\u0647', '\uFEE9', '\uFEEA', '\uFEEB', '\uFEEC'],
            ['\u0648', '\uFEED', '\uFEEE'],
            ['\u0649', '\uFEEF', '\uFEF0', '\uFBE8', '\uFBE9'],
            ['\u064A', '\uFEF1', '\uFEF2', '\uFEF3', '\uFEF4'],
            ['\u0671', '\uFB50', '\uFB51'],
            ['\u0679', '\uFB66', '\uFB67', '\uFB68', '\uFB69'],
            ['\u067A', '\uFB5E', '\uFB5F', '\uFB60', '\uFB61'],
            ['\u067B', '\uFB52', '\uFB53', '\uFB54', '\uFB55'],
            ['\u067E', '\uFB56', '\uFB57', '\uFB58', '\uFB59'],
            ['\u067F', '\uFB62', '\uFB63', '\uFB64', '\uFB65'],
            ['\u0680', '\uFB5A', '\uFB5B', '\uFB5C', '\uFB5D'],
            ['\u0683', '\uFB76', '\uFB77', '\uFB78', '\uFB79'],
            ['\u0684', '\uFB72', '\uFB73', '\uFB74', '\uFB75'],
            ['\u0686', '\uFB7A', '\uFB7B', '\uFB7C', '\uFB7D'],
            ['\u0687', '\uFB7E', '\uFB7F', '\uFB80', '\uFB81'],
            ['\u0688', '\uFB88', '\uFB89'],
            ['\u068C', '\uFB84', '\uFB85'],
            ['\u068D', '\uFB82', '\uFB83'],
            ['\u068E', '\uFB86', '\uFB87'],
            ['\u0691', '\uFB8C', '\uFB8D'],
            ['\u0698', '\uFB8A', '\uFB8B'],
            ['\u06A4', '\uFB6A', '\uFB6B', '\uFB6C', '\uFB6D'],
            ['\u06A6', '\uFB6E', '\uFB6F', '\uFB70', '\uFB71'],
            ['\u06A9', '\uFB8E', '\uFB8F', '\uFB90', '\uFB91'],
            ['\u06AD', '\uFBD3', '\uFBD4', '\uFBD5', '\uFBD6'],
            ['\u06AF', '\uFB92', '\uFB93', '\uFB94', '\uFB95'],
            ['\u06B1', '\uFB9A', '\uFB9B', '\uFB9C', '\uFB9D'],
            ['\u06B3', '\uFB96', '\uFB97', '\uFB98', '\uFB99'],
            ['\u06BA', '\uFB9E', '\uFB9F'],
            ['\u06BB', '\uFBA0', '\uFBA1', '\uFBA2', '\uFBA3'],
            ['\u06BE', '\uFBAA', '\uFBAB', '\uFBAC', '\uFBAD'],
            ['\u06C0', '\uFBA4', '\uFBA5'],
            ['\u06C1', '\uFBA6', '\uFBA7', '\uFBA8', '\uFBA9'],
            ['\u06C5', '\uFBE0', '\uFBE1'],
            ['\u06C6', '\uFBD9', '\uFBDA'],
            ['\u06C7', '\uFBD7', '\uFBD8'],
            ['\u06C8', '\uFBDB', '\uFBDC'],
            ['\u06C9', '\uFBE2', '\uFBE3'],
            ['\u06CB', '\uFBDE', '\uFBDF'],
            ['\u06CC', '\uFBFC', '\uFBFD', '\uFBFE', '\uFBFF'],
            ['\u06D0', '\uFBE4', '\uFBE5', '\uFBE6', '\uFBE7'],
            ['\u06D2', '\uFBAE', '\uFBAF'],
            ['\u06D3', '\uFBB0', '\uFBB1']
        ];
        private readonly alef : string = '\u0627';
        private readonly alefHamza : string = '\u0623';
        private readonly alefHamzaBelow : string = '\u0625';
        private readonly alefMadda : string = '\u0622';
        private readonly lam : string = '\u0644';
        private readonly hamza : string = '\u0621';
        private readonly zeroWidthJoiner : string = '\u200D';
        private readonly hamzaAbove : string = '\u0654';
        private readonly hamzaBelow : string = '\u0655';
        private readonly wawHamza : string = '\u0624';
        private readonly yehHamza : string = '\u0626';
        private readonly waw : string = '\u0648';
        private readonly alefMaksura : string = '\u0649';
        private readonly yeh : string = '\u064A';
        private readonly farsiYeh : string = '\u06CC';
        private readonly shadda : string = '\u0651';
        private readonly madda : string = '\u0653';
        private readonly lwa : string = '\uFEFB';
        private readonly lwawh : string = '\uFEF7';
        private readonly lwawhb : string = '\uFEF9';
        private readonly lwawm : string = '\uFEF5';
        private readonly bwhb : string = '\u06D3';
        private readonly fathatan : string = '\u064B';
        private readonly superScriptalef : string = '\u0670';
        private readonly vowel : number = 0x1;
       // #endregion
        //#region Fields
        private  arabicMapTable : Dictionary<string, string[]>  = new Dictionary<string, string[]>();
        //#endregion
        //#region Constructor
        public constructor() {
            for (let i : number = 0; i < this.arabicCharTable.length; i++) {
                this.arabicMapTable.setValue(this.arabicCharTable[i][0], this.arabicCharTable[i]);
            }
        }
        //#endregion
        //#region implementation
        private getCharacterShape( input : string, index : number) : string {
            if ((input >= this.hamza) && (input <= this.bwhb)) {
                let value : string[] = [];
                if (this.arabicMapTable.getValue(input)) {
                    value = this.arabicMapTable.getValue(input);
                    return value[index + 1];
                }
            } else if (input >= this.lwawm && input <= this.lwa) {
                return (input) as string;
            }
            return input;
        }
        public shape( text : string, level : number) : string {
            let builder : string = '';
            let str2 : string = '';
            for (let i : number = 0; i < text.length; i++) {
                let c : string = text[i];
                if (c >= '؀'  && c <= 'ۿ') {
                //if(c>= 0x0600.toString() && c<= 0x06FF.toString()) {
                    str2 = str2 + c;
                } else {
                    if (str2.length > 0) {
                        let st : string = this.doShape(str2.toString(), 0);
                        builder = builder + st;
                        str2 = '';
                    }
                    builder = builder + c;
                }
            }
            if (str2.length > 0) {
                let st : string = this.doShape(str2.toString(), 0);
                builder = builder + st;
            }
            return builder.toString();
        }
        private doShape(input : string, level: number) : string {
            let str : string = '';
            let ligature : number = 0;
            let len : number = 0;
            let i : number = 0;
            let next : string = '';
            let previous : ArabicShape = new ArabicShape();
            let present : ArabicShape = new ArabicShape();
            while (i < input.length) {
                next = input[i++];
                ligature = this.ligature(next, present);
                if (ligature === 0) {
                    let shapeCount : number = this.getShapeCount(next);
                    len = (shapeCount === 1) ? 0 : 2;
                    if (previous.Shapes > 2) {
                        len += 1;
                    }
                    len = len % (present.Shapes);
                    present.Value = this.getCharacterShape(present.Value, len);
                    str = this.append(str, previous, level);
                    previous = present;
                    present = new ArabicShape();
                    present.Value = next;
                    present.Shapes = shapeCount;
                    present.Ligature++;
                }
            }
            len = (previous.Shapes > 2) ? 1 : 0;
            len = len % (present.Shapes);
            present.Value = this.getCharacterShape(present.Value, len);
            str = this.append(str, previous, level);
            str = this.append(str, present, level);
            return str.toString();
        }
        private append( builder : string, shape : ArabicShape, level : number) : string {
            if (shape.Value !== '') {
                builder = builder + shape.Value;
                shape.Ligature -= 1;
                if (shape.Type !== '') {
                    if ((level &  this.vowel) === 0) {
                        builder = builder + shape.Type;
                        shape.Ligature -= 1;
                    } else {
                        shape.Ligature -= 1;
                    }
                }
                if (shape.vowel !== '') {
                    if ((level &  this.vowel) === 0) {
                        builder = builder + shape.vowel;
                        shape.Ligature -= 1;
                    } else {
                        shape.Ligature -= 1;
                    }
                }
            }
            return builder;
        }
        private ligature(value : string, shape : ArabicShape): number {
            if (shape.Value !== '') {
                let result : number = 0;
                if ((value >=  this.fathatan && value <=  this.hamzaBelow) || value === this.superScriptalef) {
                    result = 1;
                    if ((shape.vowel !== '') && (value !==  this.shadda)) {
                        result = 2;
                    }
                    if (value ===  this.shadda) {
                        if (shape.Type == null) {
                            shape.Type =  this.shadda;
                        } else {
                            return 0;
                        }
                    } else if (value ===  this.hamzaBelow) {
                        if (shape.Value ===  this.alef) {
                            shape.Value =  this.alefHamzaBelow;
                            result = 2;
                        } else if (value ===  this.lwa) {
                            shape.Value =  this.lwawhb;
                            result = 2;
                        } else {
                            shape.Type =  this.hamzaBelow;
                        }
                    } else if (value ===  this.hamzaAbove) {
                        if (shape.Value ===  this.alef) {
                            shape.Value =  this.alefHamza;
                            result = 2;
                        } else if (shape.Value ===  this.lwa) {
                            shape.Value =  this.lwawh;
                            result = 2;
                        } else if (shape.Value ===  this.waw) {
                            shape.Value =  this.wawHamza;
                            result = 2;
                        } else if (shape.Value ===  this.yeh || shape.Value ===  this.alefMaksura || shape.Value ===  this.farsiYeh) {
                            shape.Value = this.yehHamza;
                            result = 2;
                        } else {
                            shape.Type =  this.hamzaAbove;
                        }
                    } else if (value === this.madda) {
                        if (shape.Value ===  this.alef) {
                            shape.Value =  this.alefMadda;
                            result = 2;
                        }
                    } else {
                        shape.vowel = value;
                    }
                    if (result === 1) {
                        shape.Ligature++;
                    }
                    return result;
                }
                if (shape.vowel !== '') {
                     return 0;
                }
                if (shape.Value ===  this.lam) {
                    if (value ===  this.alef) {
                        shape.Value = this.lwa;
                        shape.Shapes = 2;
                        result = 3;
                    } else if (value === this.alefHamza) {
                        shape.Value = this.lwawh;
                        shape.Shapes = 2;
                        result = 3;
                    } else if (value === this.alefHamzaBelow) {
                        shape.Value = this.lwawhb;
                        shape.Shapes = 2;
                        result = 3;
                    } else if (value === this.alefMadda) {
                        shape.Value = this.lwawm;
                        shape.Shapes = 2;
                        result = 3;
                    }
                }
                // else if (shape.Value === '') {
                //     shape.Value = value;
                //     shape.Shapes = this.getShapeCount(value);
                //     result = 1;
                // }
                return result;
            } else {
                return 0;
            }
        }
        private getShapeCount(shape : string): number {
            if ((shape >= this.hamza) && (shape <= this.bwhb) && !((shape >= this.fathatan && shape <= this.hamzaBelow)
                        || shape === this.superScriptalef)) {
                let c : string[] = [];
                if (this.arabicMapTable.getValue(shape)) {
                    c = this.arabicMapTable.getValue(shape);
                    return c.length - 1;
                }
            } else if (shape === this.zeroWidthJoiner) {
                return 4;
            }
            return 1;
        }
    }
        //#endregion
        //#region Internals
        export class ArabicShape {
            //#region Fields
            private  shapeValue : string = '';
            private  shapeType : string = '';
            private  shapeVowel : string = '';
            private  shapeLigature : number = 0;
            private  shapeShapes : number = 1;
            //#endregion
            //#region Properties 
            /**
             * Gets or sets the values.
             * @private
             */
            public get Value() : string {
                return this.shapeValue;
            }
            public set Value(value : string) {
                this.shapeValue = value;
            }
            /**
             * Gets or sets the values.
             * @private
             */
            public get Type() : string {
                return this.shapeType;
            }
            public set Type(value : string) {
                this.shapeType = value;
            }
            /**
             * Gets or sets the values.
             * @private
             */
            public get vowel() : string {
                return this.shapeVowel;
            }
            public set vowel(value : string) {
                this.shapeVowel = value;
            }
            /**
             * Gets or sets the values.
             * @private
             */
            public get Ligature() : number {
                return this.shapeLigature;
            }
            public set Ligature(value : number) {
                this.shapeLigature = value;
            }
            /**
             * Gets or sets the values.
             * @private
             */
            public get Shapes() : number {
                return this.shapeShapes;
            }
            public set Shapes(value : number) {
                this.shapeShapes = value;
            }
            //#endregion
    }
        //#endregion
