/**
 * @hidden
 */
export class BookmarkBase{
    public Title: string;
    public Id: number;
    public HasChild: boolean;
    public Child: BookmarkBase[];
    public FileName: string;
    constructor(){
        this.HasChild = false;
    }
}

/**
 * @hidden
 */
export class BookmarkDestination{
    public X: number;
    public Y: number;
    public Zoom: number;
    public PageIndex: number;
    constructor(){
        // constructor
    }
}

/**
 * @hidden
 */
export class BookmarkStyles{
    public Color: string;
    public FontStyle: string;
    public Text: string;
    public IsChild: boolean;
    constructor(){
        // constructor
    }
}
