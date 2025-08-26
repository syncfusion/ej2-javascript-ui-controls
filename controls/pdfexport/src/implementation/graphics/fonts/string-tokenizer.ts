/**
 * StringTokenizer.ts class for EJ2-PDF
 * Utility class for working with strings.
 * @private
 */
export class StringTokenizer {
    // Constants
    /**
     * `Whitespace` symbol.
     * @private
     */
    public static readonly whiteSpace : string = ' ';
    /**
     * `tab` symbol.
     * @private
     */
    public static readonly tab : string = '\t';
    /**
     * Array of `spaces`.
     * @private
     */
    public static readonly spaces : string[] = [StringTokenizer.whiteSpace, StringTokenizer.tab];
    /**
     * `Pattern` for WhiteSpace.
     * @private
     */
    private static readonly whiteSpacePattern : string = '^[ \t]+$';
    // Fields
    /**
     * `Text` data.
     * @private
     */
    private text : string;
    /**
     * Current `position`.
     * @private
     */
    private currentPosition : number = 0;
    // Constructors
    /**
     * Initializes a new instance of the `StringTokenizer` class.
     * @private
     */
    public constructor(textValue : string) {
        if (textValue == null) {
            throw new Error('ArgumentNullException:text');
        }
        this.text = textValue;
    }
    // Properties
    /**
     * Gets text `length`.
     * @private
     */
    public get length() : number {
        return this.text.length;
    }
    public get end() : boolean {
        return (this.currentPosition === this.text.length);
    }
    /**
     * Gets or sets the position.
     * @private
     */
    public get position() : number {
        return this.currentPosition;
    }
    public set position(value : number) {
        this.currentPosition = value;
    }
    // Public methods
    /**
     * Returns number of symbols occurred in the text.
     * @private
     */
    public static getCharsCount(text : string, symbols : string) : number
    /**
     * Returns number of symbols occurred in the text.
     * @private
     */
    public static getCharsCount(text : string, symbols : string[]) : number
    public static getCharsCount(text : string, symbols : string|string[]) : number {
        if (typeof symbols === 'string') {
            if (text == null) {
                throw new Error('ArgumentNullException:wholeText');
            }
            let numSymbols : number = 0;
            let curIndex : number = 0;
            for ( ; ; ) {
                curIndex = text.indexOf(symbols, curIndex);
                if (curIndex === -1) {
                    break;
                } else {
                    numSymbols++;
                    curIndex++;
                }
            }
            return numSymbols;
        } else {
            if (text == null) {
                throw new Error('ArgumentNullException:text');
            }
            if (symbols == null) {
                throw new Error('ArgumentNullException:symbols');
            }
            let count : number = 0;
            for (let i : number = 0, len : number = text.length; i < len; i++) {
                let ch : string = text[i];
                if (this.contains(symbols, ch)) {
                    count++;
                }
            }
            return count;
        }
    }
    /**
     * Reads line of the text.
     * @private
     */
    public readLine() : string {
        let pos : number = this.currentPosition;
        while (pos < this.length) {
            let ch : string = this.text[pos];
            switch (ch) {
                case '\r':
                case '\n': {
                    let text : string = this.text.substr(this.currentPosition, pos - this.currentPosition);
                    this.currentPosition = pos + 1;
                    if (((ch === '\r') && (this.currentPosition < this.length)) && (this.text[this.currentPosition] === '\n')) {
                        this.currentPosition++;
                    }
                    return text;
                }
            }
            pos++;
        }
        // The remaining text.
        if (pos > this.currentPosition) {
            let text2 : string = this.text.substr(this.currentPosition, pos - this.currentPosition);
            this.currentPosition = pos;
            return text2;
        }
        return null;
    }
    /**
     * Reads line of the text.
     * @private
     */
    public peekLine() : string {
        let pos : number = this.currentPosition;
        let line : string = this.readLine();
        this.currentPosition = pos;
        return line;
    }
    /**
     * Reads a word from the text.
     * @private
     */
    public readWord() : string {
        let pos : number = this.currentPosition;
        while (pos < this.length) {
            let ch : string = this.text[pos];
            switch (ch) {
                case '\r':
                case '\n':
                    let textValue : string = this.text.substr(this.currentPosition, pos - this.currentPosition);
                    this.currentPosition = pos + 1;
                    if (((ch === '\r') && (this.currentPosition < this.length)) && (this.text[this.currentPosition] === '\n')) {
                        this.currentPosition++;
                    }
                    return textValue;
                case ' ':
                case '\t': {
                    if (pos === this.currentPosition) {
                        pos++;
                    }
                    let text : string = this.text.substr(this.currentPosition, pos - this.currentPosition);
                    this.currentPosition = pos;
                    return text;
                }
            }
            pos++;
        }
        // The remaining text.
        if (pos > this.currentPosition) {
            let text2 : string = this.text.substr(this.currentPosition, pos - this.currentPosition);
            this.currentPosition = pos;
            return text2;
        }
        return null;
    }
    /**
     * Peeks a word from the text.
     * @private
     */
    public peekWord() : string {
        let pos : number = this.currentPosition;
        let word : string = this.readWord();
        this.currentPosition = pos;
        return word;
    }
    /**
     * Reads char form the data.
     * @private
     */
    public read() : string
    /**
     * Reads count of the symbols.
     * @private
     */
    public read(count : number) : string
    public read(count ?: number) : string {
        if (typeof count === 'undefined') {
            let ch : string = '0';
            if (!this.end) {
                ch = this.text[this.currentPosition];
                this.currentPosition++;
            }
            return ch;
        } else {
            let num : number = 0;
            let builder : string = '';
            while (!this.end && num < count) {
                let ch : string = this.read();
                builder = builder + ch;
                num++;
            }
            return builder;
        }
    }
    /**
     * Peeks char form the data.
     * @private
     */
    public peek() : string {
        let ch : string = '0';
        if (!this.end) {
                ch = this.text[this.currentPosition];
        }
        return ch;
    }
    /**
     * Closes a reader.
     * @private
     */
    public close() : void {
        this.text = null;
    }

    public readToEnd() : string {
            let text : string;
            if (this.currentPosition === 0) {
                text = this.text;
            } else {
                text = this.text.substr(this.currentPosition, this.length - this.currentPosition);
            }
            this.currentPosition = this.length;
            return text;
    }
    //Implementation
    /**
     * Checks whether array contains a symbol.
     * @private
     */
    private static contains(array : string[], symbol : string) : boolean {
        let contains : boolean = false;
        for (let i : number = 0; i < array.length; i++) {
            if (array[i] === symbol) {
                contains = true;
                break;
            }
        }
        return contains;
    }
}