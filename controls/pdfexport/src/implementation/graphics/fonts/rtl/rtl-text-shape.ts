/**
 * ArabicShapeRenderer.ts class for EJ2-PDF
 */
import { Dictionary} from './../../../collections/dictionary';
export class ArabicShapeRenderer {
        //#region Constants
        private readonly arabicCharTable : string[][] = [];
        /**
         * Packed shaping rows with contiguous presentation forms. Each row is packed into three
         * characters: the base character, the first presentation form and the number of forms.
         * @private
         */
        /* tslint:disable-next-line:max-line-length */
        private readonly packedContiguousRows : string = '\u0621\ufe80\u0002\u0622\ufe81\u0003\u0623\ufe83\u0003\u0624\ufe85\u0003\u0625\ufe87\u0003\u0626\ufe89\u0005\u0627\ufe8d\u0003\u0628\ufe8f\u0005\u0629\ufe93\u0003\u062a\ufe95\u0005\u062b\ufe99\u0005\u062c\ufe9d\u0005\u062d\ufea1\u0005\u062e\ufea5\u0005\u062f\ufea9\u0003\u0630\ufeab\u0003\u0631\ufead\u0003\u0632\ufeaf\u0003\u0633\ufeb1\u0005\u0634\ufeb5\u0005\u0635\ufeb9\u0005\u0636\ufebd\u0005\u0637\ufec1\u0005\u0638\ufec5\u0005\u0639\ufec9\u0005\u063a\ufecd\u0005\u0641\ufed1\u0005\u0642\ufed5\u0005\u0643\ufed9\u0005\u0644\ufedd\u0005\u0645\ufee1\u0005\u0646\ufee5\u0005\u0647\ufee9\u0005\u0648\ufeed\u0003\u064a\ufef1\u0005\u0671\ufb50\u0003\u0679\ufb66\u0005\u067a\ufb5e\u0005\u067b\ufb52\u0005\u067e\ufb56\u0005\u067f\ufb62\u0005\u0680\ufb5a\u0005\u0683\ufb76\u0005\u0684\ufb72\u0005\u0686\ufb7a\u0005\u0687\ufb7e\u0005\u0688\ufb88\u0003\u068c\ufb84\u0003\u068d\ufb82\u0003\u068e\ufb86\u0003\u0691\ufb8c\u0003\u0698\ufb8a\u0003\u06a4\ufb6a\u0005\u06a6\ufb6e\u0005\u06a9\ufb8e\u0005\u06ad\ufbd3\u0005\u06af\ufb92\u0005\u06b1\ufb9a\u0005\u06b3\ufb96\u0005\u06ba\ufb9e\u0003\u06bb\ufba0\u0005\u06be\ufbaa\u0005\u06c0\ufba4\u0003\u06c1\ufba6\u0005\u06c5\ufbe0\u0003\u06c6\ufbd9\u0003\u06c7\ufbd7\u0003\u06c8\ufbdb\u0003\u06c9\ufbe2\u0003\u06cb\ufbde\u0003\u06cc\ufbfc\u0005\u06d0\ufbe4\u0005\u06d2\ufbae\u0003\u06d3\ufbb0\u0003';
        /**
         * Packed shaping rows with non-contiguous presentation forms (tatweel and alef maksura).
         * Each row is packed as its characters concatenated.
         * @private
         */
        private readonly packedSpecialRows : string = '\u0640\u0640\u0640\u0640\u0640\u0649\ufeef\ufef0\ufbe8\ufbe9';
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
            let rows : string = this.packedContiguousRows;
            for (let i : number = 0; i < rows.length; i += 3) {
                let row : string[] = [rows.charAt(i)];
                let firstForm : number = rows.charCodeAt(i + 1);
                let formCount : number = rows.charCodeAt(i + 2);
                for (let j : number = 1; j < formCount; j++) {
                    row.push(String.fromCharCode(firstForm + j - 1));
                }
                this.arabicCharTable.push(row);
            }
            rows = this.packedSpecialRows;
            for (let i : number = 0; i < rows.length; i += 5) {
                let row : string[] = [];
                for (let j : number = 0; j < 5; j++) {
                    row.push(rows.charAt(i + j));
                }
                this.arabicCharTable.push(row);
            }
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
