import { PageLayoutViewer, DocumentHelper } from '../src/index';

export class TestHelper {
    private static c1: HTMLCanvasElement = undefined;
    private static c2: HTMLCanvasElement = undefined;
    private static c3: HTMLCanvasElement = undefined;
    private static c4: HTMLCanvasElement = undefined;

    static get containerCanvas(): HTMLCanvasElement {
        if (TestHelper.c1 === undefined) {
            let documentHelper: DocumentHelper = new DocumentHelper(undefined);
            TestHelper.c1 = (documentHelper as any).containerCanvasIn;
            documentHelper.destroy();
        }
        return TestHelper.c1;
    }
    static get selectionCanvas(): HTMLCanvasElement {
        if (TestHelper.c2 === undefined) {
            let documentHelper: DocumentHelper = new DocumentHelper(undefined);
            TestHelper.c2 = (documentHelper as any).selectionCanvasIn;
            documentHelper.destroy();
        }
        return TestHelper.c2;
    }
    static get pageCanvas(): HTMLCanvasElement {
        if (TestHelper.c3 === undefined) {
            let documentHelper: DocumentHelper = new DocumentHelper(undefined);
            TestHelper.c3 = (documentHelper.render as any).pageCanvasIn;
            documentHelper.destroy();
        }
        return TestHelper.c3;
    }
    static get pageSelectionCanvas(): HTMLCanvasElement {
        if (TestHelper.c4 === undefined) {
            let documentHelper: DocumentHelper = new DocumentHelper(undefined);
            TestHelper.c4 = (documentHelper.render as any).selectionCanvasIn;
            documentHelper.destroy();
        }
        return TestHelper.c4;
    }
}
