import { PageLayoutViewer } from '../src/index';

export class TestHelper {
    private static c1: HTMLCanvasElement = undefined;
    private static c2: HTMLCanvasElement = undefined;
    private static c3: HTMLCanvasElement = undefined;
    private static c4: HTMLCanvasElement = undefined;

    static get containerCanvas(): HTMLCanvasElement {
        if (TestHelper.c1 === undefined) {
            let viewer: PageLayoutViewer = new PageLayoutViewer(undefined);
            TestHelper.c1 = (viewer as any).containerCanvasIn;
            viewer.destroy();
        }
        return TestHelper.c1;
    }
    static get selectionCanvas(): HTMLCanvasElement {
        if (TestHelper.c2 === undefined) {
            let viewer: PageLayoutViewer = new PageLayoutViewer(undefined);
            TestHelper.c2 = (viewer as any).selectionCanvasIn;
            viewer.destroy();
        }
        return TestHelper.c2;
    }
    static get pageCanvas(): HTMLCanvasElement {
        if (TestHelper.c3 === undefined) {
            let viewer: PageLayoutViewer = new PageLayoutViewer(undefined);
            TestHelper.c3 = (viewer.render as any).pageCanvasIn;
            viewer.destroy();
        }
        return TestHelper.c3;
    }
    static get pageSelectionCanvas(): HTMLCanvasElement {
        if (TestHelper.c4 === undefined) {
            let viewer: PageLayoutViewer = new PageLayoutViewer(undefined);
            TestHelper.c4 = (viewer.render as any).selectionCanvasIn;
            viewer.destroy();
        }
        return TestHelper.c4;
    }
}