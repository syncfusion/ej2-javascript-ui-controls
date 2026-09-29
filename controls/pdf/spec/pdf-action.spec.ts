import { PdfAction, PdfFieldActions, PdfGoToAction, PdfJavaScriptAction } from '../src/pdf/core/pdf-action';
import { PdfDocument } from '../src/pdf/core/pdf-document';
import { PdfDestination, PdfPage } from '../src/pdf/core/pdf-page';
import { PdfButtonField } from '../src/pdf/core/form/field';
import { PdfDestinationMode } from '../src/pdf/core/enumerator';
import { PdfWidgetAnnotation } from '../src/pdf/core/annotations/annotation';
import { _PdfDictionary, _PdfName, _PdfReference } from '../src/pdf/core/pdf-primitives';

function makeActionsForUpdate(document: PdfDocument, page: PdfPage): {actions: PdfFieldActions; widgetDictionary: _PdfDictionary;} {
    const field: PdfButtonField = new PdfButtonField(
        page, 'btn1', { x: 50, y: 50, width: 100, height: 20 }
    );
    document.form.add(field);
    const widget: PdfWidgetAnnotation = field.itemAt(0);
    const widgetDictionary: _PdfDictionary = widget._dictionary;
    const actions: PdfFieldActions = field.actions;
    return { actions, widgetDictionary};
}

function makeGoToActionWithMode(page: PdfPage, mode: PdfDestinationMode): PdfGoToAction {
    let destination: PdfDestination;
    switch (mode) {
        case PdfDestinationMode.location:
            destination = new PdfDestination(page, { x: 5, y: 10 });
            break;
        case PdfDestinationMode.fitR:
            destination = new PdfDestination(page, { x: 0, y: 0, width: 100, height: 200 } as any);
            break;
        case PdfDestinationMode.fitH:
            destination = new PdfDestination(page, { x: 0, y: 0 });
            break;
        case PdfDestinationMode.fitToPage:
            destination = new PdfDestination(page);
            break;
        default:
            destination = new PdfDestination(page);
    }
    (destination as any)._destinationMode = mode;
    const action: PdfGoToAction = new PdfGoToAction(destination);
    return action;
}
function makeGetFieldActionHarness(opts?: {
    fieldDictionary?: _PdfDictionary;
    includeJS?: boolean;
    sName?: string;
    includeAA?: boolean;
}): {
    actions: PdfFieldActions;
    fieldDictionary: _PdfDictionary;
} {
    const fieldDictionary: _PdfDictionary = (opts && opts.fieldDictionary) ? opts.fieldDictionary : new _PdfDictionary();
    if (!(opts && opts.includeAA === false)) {
        const aa: _PdfDictionary = new _PdfDictionary();
        const actionDict: _PdfDictionary = new _PdfDictionary();
        const sName: string = (opts && opts.sName) ? opts.sName : 'JavaScript';
        actionDict.update('S', new _PdfName(sName));
        if (!(opts && opts.includeJS === false)) {
            actionDict.update('JS', 'alert(2);');
        }
        aa.set('K', actionDict);
        fieldDictionary.update('AA', aa);
    }
    const field: any = { _dictionary: fieldDictionary };
    const actions: PdfFieldActions = new PdfFieldActions(field as any);
    return { actions, fieldDictionary };
}

describe('1038509 mouseEnter getter', () => {
    it('1038509 mouseEnter getter caches result', () => {
        const field: any = { _kidsCount: 0, itemAt: (): PdfAction => new PdfAction() };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const fakeResolved: PdfAction = new PdfAction();
        let callCount: number = 0;
        actions._getPdfAction = (_key: string): PdfAction => {
            callCount++;
            return fakeResolved;
        };
        const first: PdfAction = actions.mouseEnter;
        const second: PdfAction = actions.mouseEnter;
        expect(first).toBe(fakeResolved);
        expect(second).toBe(fakeResolved);
        expect(callCount).toBe(1);
        expect(actions._mouseEnter).toBe(fakeResolved);
    });

    it('1038509 mouseEnter getter uses key E', () => {
        const field: any = { _kidsCount: 0, itemAt: (): PdfAction => new PdfAction() };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const seenKeys: string[] = [];
        actions._getPdfAction = (key: string): PdfAction => {
            seenKeys.push(key);
            return new PdfAction();
        };
        const result: PdfAction = actions.mouseEnter;
        expect(result).toBeDefined();
        expect(seenKeys.length).toBe(1);
        expect(seenKeys[0]).toBe('E');
        expect(seenKeys[0]).not.toBe('');
        expect(seenKeys[0].length).toBe(1);
    });

    it('1038509 mouseEnter getter returns cached', () => {
        const field: any = { _kidsCount: 0, itemAt: (): PdfAction => new PdfAction() };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const cached: PdfAction = new PdfAction();
        actions._mouseEnter = cached;
        let callCount: number = 0;
        actions._getPdfAction = (_key: string): PdfAction => {
            callCount++;
            return new PdfAction();
        };
        const result: PdfAction = actions.mouseEnter;
        expect(result).toBe(cached);
        expect(callCount).toBe(0);
    });

    it('1038509 mouseEnter getter stores result', () => {
        const field: any = { _kidsCount: 0, itemAt: (): PdfAction => new PdfAction() };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const fallback: PdfAction = new PdfAction();
        actions._getPdfAction = (_key: string): PdfAction => {
            return fallback;
        };
        const result: PdfAction = actions.mouseEnter;
        expect(result).toBe(fallback);
        expect(actions._mouseEnter).toBe(fallback);
    });
});

describe('1038509 mouseEnter setter', () => {
    it('1038509 mouseEnter setter assigns and updates', () => {
        const field: any = {
            _kidsCount: 0,
            itemAt: (): PdfAction => new PdfAction(),
            _dictionary: new _PdfDictionary()
        };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        let updateCalls: number = 0;
        const seenKey: { value: string } = { value: '' };
        actions._updateAction = (_a: PdfAction, key: string): void => {
            updateCalls++;
            seenKey.value = key;
        };
        const newAction: PdfAction = new PdfAction();
        actions.mouseEnter = newAction;
        expect(actions._mouseEnter).toBe(newAction);
        expect(updateCalls).toBe(1);
        expect(seenKey.value).toBe('E');
    });

    it('1038509 mouseEnter setter ignores zero', () => {
        const field: any = {
            _kidsCount: 0,
            itemAt: (): PdfAction => new PdfAction(),
            _dictionary: new _PdfDictionary()
        };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const initial: PdfAction = new PdfAction();
        actions._mouseEnter = initial;
        let updateCalls: number = 0;
        actions._updateAction = (_a: PdfAction, _k: string): void => { updateCalls++; };
        actions.mouseEnter = 0 as any;
        expect(actions._mouseEnter).toBe(initial);
        expect(updateCalls).toBe(0);
    });

    it('1038509 mouseEnter setter ignores empty string', () => {
        const field: any = {
            _kidsCount: 0,
            itemAt: (): PdfAction => new PdfAction(),
            _dictionary: new _PdfDictionary()
        };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const initial: PdfAction = new PdfAction();
        actions._mouseEnter = initial;
        let updateCalls: number = 0;
        actions._updateAction = (_a: PdfAction, _k: string): void => { updateCalls++; };
        actions.mouseEnter = '' as any;
        expect(actions._mouseEnter).toBe(initial);
        expect(updateCalls).toBe(0);
    });

    it('1038509 mouseEnter setter routes new action', () => {
        const field: any = {
            _kidsCount: 0,
            itemAt: (): PdfAction => new PdfAction(),
            _dictionary: new _PdfDictionary()
        };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const calls: { action: PdfAction; key: string }[] = [];
        actions._updateAction = (a: PdfAction, key: string): void => {
            calls.push({ action: a, key });
        };
        const newAction: PdfAction = new PdfAction();
        actions.mouseEnter = newAction;
        expect(actions._mouseEnter).toBe(newAction);
        expect(calls.length).toBe(1);
        expect(calls[0].action).toBe(newAction);
        expect(calls[0].key).toBe('E');
        expect(calls[0].key).not.toBe('');
    });
});

describe('1038509 mouseLeave', () => {
    it('1038509 mouseLeave getter caches result', () => {
        const field: any = { _kidsCount: 0, itemAt: (): PdfAction => new PdfAction() };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const fakeResolved: PdfAction = new PdfAction();
        let callCount: number = 0;
        actions._getPdfAction = (_key: string): PdfAction => {
            callCount++;
            return fakeResolved;
        };
        const first: PdfAction = actions.mouseLeave;
        const second: PdfAction = actions.mouseLeave;
        expect(first).toBe(fakeResolved);
        expect(second).toBe(fakeResolved);
        expect(callCount).toBe(1);
        expect(actions._mouseLeave).toBe(fakeResolved);
    });

    it('1038509 mouseLeave getter uses key X', () => {
        const field: any = { _kidsCount: 0, itemAt: (): PdfAction => new PdfAction() };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const seenKeys: string[] = [];
        actions._getPdfAction = (key: string): PdfAction => {
            seenKeys.push(key);
            return new PdfAction();
        };
        actions.mouseLeave;
        expect(seenKeys.length).toBe(1);
        expect(seenKeys[0]).toBe('X');
        expect(seenKeys[0]).not.toBe('');
    });

    it('1038509 mouseLeave getter returns cached', () => {
        const field: any = { _kidsCount: 0, itemAt: (): PdfAction => new PdfAction() };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const cached: PdfAction = new PdfAction();
        actions._mouseLeave = cached;
        let callCount: number = 0;
        actions._getPdfAction = (_key: string): PdfAction => {
            callCount++;
            return new PdfAction();
        };
        const result: PdfAction = actions.mouseLeave;
        expect(result).toBe(cached);
        expect(callCount).toBe(0);
    });

    it('1038509 mouseLeave setter assigns and updates', () => {
        const field: any = { _kidsCount: 0, itemAt: (): PdfAction => new PdfAction(), _dictionary: new _PdfDictionary() };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const calls: { key: string }[] = [];
        actions._updateAction = (_a: PdfAction, key: string): void => { calls.push({ key }); };
        const newAction: PdfAction = new PdfAction();
        actions.mouseLeave = newAction;
        expect(actions._mouseLeave).toBe(newAction);
        expect(calls.length).toBe(1);
        expect(calls[0].key).toBe('X');
    });

    it('1038509 mouseLeave setter ignores falsy', () => {
        const field: any = { _kidsCount: 0, itemAt: (): PdfAction => new PdfAction(), _dictionary: new _PdfDictionary() };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const initial: PdfAction = new PdfAction();
        actions._mouseLeave = initial;
        let updateCalls: number = 0;
        actions._updateAction = (_a: PdfAction, _k: string): void => { updateCalls++; };
        actions.mouseLeave = 0 as any;
        expect(actions._mouseLeave).toBe(initial);
        expect(updateCalls).toBe(0);
        actions.mouseLeave = '' as any;
        expect(actions._mouseLeave).toBe(initial);
        expect(updateCalls).toBe(0);
    });
});

describe('1038509 mouseUp', () => {
    it('1038509 mouseUp getter caches result', () => {
        const field: any = { _kidsCount: 0, itemAt: (): PdfAction => new PdfAction() };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const fakeResolved: PdfAction = new PdfAction();
        let callCount: number = 0;
        actions._getPdfAction = (_key: string): PdfAction => {
            callCount++;
            return fakeResolved;
        };
        const first: PdfAction = actions.mouseUp;
        const second: PdfAction = actions.mouseUp;
        expect(first).toBe(fakeResolved);
        expect(second).toBe(fakeResolved);
        expect(callCount).toBe(1);
        expect(actions._mouseUp).toBe(fakeResolved);
    });

    it('1038509 mouseUp getter uses key U', () => {
        const field: any = { _kidsCount: 0, itemAt: (): PdfAction => new PdfAction() };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const seenKeys: string[] = [];
        actions._getPdfAction = (key: string): PdfAction => {
            seenKeys.push(key);
            return new PdfAction();
        };
        actions.mouseUp;
        expect(seenKeys.length).toBe(1);
        expect(seenKeys[0]).toBe('U');
        expect(seenKeys[0]).not.toBe('');
    });

    it('1038509 mouseUp getter returns cached', () => {
        const field: any = { _kidsCount: 0, itemAt: (): PdfAction => new PdfAction() };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const cached: PdfAction = new PdfAction();
        actions._mouseUp = cached;
        let callCount: number = 0;
        actions._getPdfAction = (_key: string): PdfAction => {
            callCount++;
            return new PdfAction();
        };
        const result: PdfAction = actions.mouseUp;
        expect(result).toBe(cached);
        expect(callCount).toBe(0);
    });

    it('1038509 mouseUp setter assigns and updates', () => {
        const field: any = { _kidsCount: 0, itemAt: (): PdfAction => new PdfAction(), _dictionary: new _PdfDictionary() };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const calls: { key: string }[] = [];
        actions._updateAction = (_a: PdfAction, key: string): void => { calls.push({ key }); };
        const newAction: PdfAction = new PdfAction();
        actions.mouseUp = newAction;
        expect(actions._mouseUp).toBe(newAction);
        expect(calls.length).toBe(1);
        expect(calls[0].key).toBe('U');
    });

    it('1038509 mouseUp setter ignores falsy', () => {
        const field: any = { _kidsCount: 0, itemAt: (): PdfAction => new PdfAction(), _dictionary: new _PdfDictionary() };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const initial: PdfAction = new PdfAction();
        actions._mouseUp = initial;
        let updateCalls: number = 0;
        actions._updateAction = (_a: PdfAction, _k: string): void => { updateCalls++; };
        actions.mouseUp = 0 as any;
        expect(actions._mouseUp).toBe(initial);
        expect(updateCalls).toBe(0);
        actions.mouseUp = '' as any;
        expect(actions._mouseUp).toBe(initial);
        expect(updateCalls).toBe(0);
    });
});

describe('1038509 mouseDown', () => {
    it('1038509 mouseDown getter caches result', () => {
        const field: any = { _kidsCount: 0, itemAt: (): PdfAction => new PdfAction() };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const fakeResolved: PdfAction = new PdfAction();
        let callCount: number = 0;
        actions._getPdfAction = (_key: string): PdfAction => {
            callCount++;
            return fakeResolved;
        };
        const first: PdfAction = actions.mouseDown;
        const second: PdfAction = actions.mouseDown;
        expect(first).toBe(fakeResolved);
        expect(second).toBe(fakeResolved);
        expect(callCount).toBe(1);
        expect(actions._mouseDown).toBe(fakeResolved);
    });

    it('1038509 mouseDown getter uses key D', () => {
        const field: any = { _kidsCount: 0, itemAt: (): PdfAction => new PdfAction() };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const seenKeys: string[] = [];
        actions._getPdfAction = (key: string): PdfAction => {
            seenKeys.push(key);
            return new PdfAction();
        };
        actions.mouseDown;
        expect(seenKeys.length).toBe(1);
        expect(seenKeys[0]).toBe('D');
        expect(seenKeys[0]).not.toBe('');
    });

    it('1038509 mouseDown getter returns cached', () => {
        const field: any = { _kidsCount: 0, itemAt: (): PdfAction => new PdfAction() };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const cached: PdfAction = new PdfAction();
        actions._mouseDown = cached;
        let callCount: number = 0;
        actions._getPdfAction = (_key: string): PdfAction => {
            callCount++;
            return new PdfAction();
        };
        const result: PdfAction = actions.mouseDown;
        expect(result).toBe(cached);
        expect(callCount).toBe(0);
    });

    it('1038509 mouseDown setter assigns and updates', () => {
        const field: any = { _kidsCount: 0, itemAt: (): PdfAction => new PdfAction(), _dictionary: new _PdfDictionary() };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const calls: { key: string }[] = [];
        actions._updateAction = (_a: PdfAction, key: string): void => { calls.push({ key }); };
        const newAction: PdfAction = new PdfAction();
        actions.mouseDown = newAction;
        expect(actions._mouseDown).toBe(newAction);
        expect(calls.length).toBe(1);
        expect(calls[0].key).toBe('D');
    });

    it('1038509 mouseDown setter ignores falsy', () => {
        const field: any = { _kidsCount: 0, itemAt: (): PdfAction => new PdfAction(), _dictionary: new _PdfDictionary() };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const initial: PdfAction = new PdfAction();
        actions._mouseDown = initial;
        let updateCalls: number = 0;
        actions._updateAction = (_a: PdfAction, _k: string): void => { updateCalls++; };
        actions.mouseDown = 0 as any;
        expect(actions._mouseDown).toBe(initial);
        expect(updateCalls).toBe(0);
        actions.mouseDown = '' as any;
        expect(actions._mouseDown).toBe(initial);
        expect(updateCalls).toBe(0);
    });
});

describe('1038509 gotFocus', () => {
    it('1038509 gotFocus getter caches result', () => {
        const field: any = { _kidsCount: 0, itemAt: (): PdfAction => new PdfAction() };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const fakeResolved: PdfAction = new PdfAction();
        let callCount: number = 0;
        actions._getPdfAction = (_key: string): PdfAction => {
            callCount++;
            return fakeResolved;
        };
        const first: PdfAction = actions.gotFocus;
        const second: PdfAction = actions.gotFocus;
        expect(first).toBe(fakeResolved);
        expect(second).toBe(fakeResolved);
        expect(callCount).toBe(1);
        expect(actions._gotFocus).toBe(fakeResolved);
    });

    it('1038509 gotFocus getter uses key Fo', () => {
        const field: any = { _kidsCount: 0, itemAt: (): PdfAction => new PdfAction() };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const seenKeys: string[] = [];
        actions._getPdfAction = (key: string): PdfAction => {
            seenKeys.push(key);
            return new PdfAction();
        };
        actions.gotFocus;
        expect(seenKeys.length).toBe(1);
        expect(seenKeys[0]).toBe('Fo');
        expect(seenKeys[0]).not.toBe('');
    });

    it('1038509 gotFocus getter returns cached', () => {
        const field: any = { _kidsCount: 0, itemAt: (): PdfAction => new PdfAction() };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const cached: PdfAction = new PdfAction();
        actions._gotFocus = cached;
        let callCount: number = 0;
        actions._getPdfAction = (_key: string): PdfAction => {
            callCount++;
            return new PdfAction();
        };
        const result: PdfAction = actions.gotFocus;
        expect(result).toBe(cached);
        expect(callCount).toBe(0);
    });

    it('1038509 gotFocus setter assigns and updates', () => {
        const field: any = { _kidsCount: 0, itemAt: (): PdfAction => new PdfAction(), _dictionary: new _PdfDictionary() };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const calls: { key: string }[] = [];
        actions._updateAction = (_a: PdfAction, key: string): void => { calls.push({ key }); };
        const newAction: PdfAction = new PdfAction();
        actions.gotFocus = newAction;
        expect(actions._gotFocus).toBe(newAction);
        expect(calls.length).toBe(1);
        expect(calls[0].key).toBe('Fo');
    });

    it('1038509 gotFocus setter ignores falsy', () => {
        const field: any = { _kidsCount: 0, itemAt: (): PdfAction => new PdfAction(), _dictionary: new _PdfDictionary() };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const initial: PdfAction = new PdfAction();
        actions._gotFocus = initial;
        let updateCalls: number = 0;
        actions._updateAction = (_a: PdfAction, _k: string): void => { updateCalls++; };
        actions.gotFocus = 0 as any;
        expect(actions._gotFocus).toBe(initial);
        expect(updateCalls).toBe(0);
        actions.gotFocus = '' as any;
        expect(actions._gotFocus).toBe(initial);
        expect(updateCalls).toBe(0);
    });
});

describe('1038509 lostFocus', () => {
    it('1038509 lostFocus getter caches result', () => {
        const field: any = { _kidsCount: 0, itemAt: (): PdfAction => new PdfAction() };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const fakeResolved: PdfAction = new PdfAction();
        let callCount: number = 0;
        actions._getPdfAction = (_key: string): PdfAction => {
            callCount++;
            return fakeResolved;
        };
        const first: PdfAction = actions.lostFocus;
        const second: PdfAction = actions.lostFocus;
        expect(first).toBe(fakeResolved);
        expect(second).toBe(fakeResolved);
        expect(callCount).toBe(1);
        expect(actions._lostFocus).toBe(fakeResolved);
    });

    it('1038509 lostFocus getter uses key Bl', () => {
        const field: any = { _kidsCount: 0, itemAt: (): PdfAction => new PdfAction() };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const seenKeys: string[] = [];
        actions._getPdfAction = (key: string): PdfAction => {
            seenKeys.push(key);
            return new PdfAction();
        };
        actions.lostFocus;
        expect(seenKeys.length).toBe(1);
        expect(seenKeys[0]).toBe('Bl');
        expect(seenKeys[0]).not.toBe('');
    });

    it('1038509 lostFocus getter returns cached', () => {
        const field: any = { _kidsCount: 0, itemAt: (): PdfAction => new PdfAction() };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const cached: PdfAction = new PdfAction();
        actions._lostFocus = cached;
        let callCount: number = 0;
        actions._getPdfAction = (_key: string): PdfAction => {
            callCount++;
            return new PdfAction();
        };
        const result: PdfAction = actions.lostFocus;
        expect(result).toBe(cached);
        expect(callCount).toBe(0);
    });

    it('1038509 lostFocus setter assigns and updates', () => {
        const field: any = { _kidsCount: 0, itemAt: (): PdfAction => new PdfAction(), _dictionary: new _PdfDictionary() };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const calls: { key: string }[] = [];
        actions._updateAction = (_a: PdfAction, key: string): void => { calls.push({ key }); };
        const newAction: PdfAction = new PdfAction();
        actions.lostFocus = newAction;
        expect(actions._lostFocus).toBe(newAction);
        expect(calls.length).toBe(1);
        expect(calls[0].key).toBe('Bl');
    });

    it('1038509 lostFocus setter ignores falsy', () => {
        const field: any = { _kidsCount: 0, itemAt: (): PdfAction => new PdfAction(), _dictionary: new _PdfDictionary() };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const initial: PdfAction = new PdfAction();
        actions._lostFocus = initial;
        let updateCalls: number = 0;
        actions._updateAction = (_a: PdfAction, _k: string): void => { updateCalls++; };
        actions.lostFocus = 0 as any;
        expect(actions._lostFocus).toBe(initial);
        expect(updateCalls).toBe(0);
        actions.lostFocus = '' as any;
        expect(actions._lostFocus).toBe(initial);
        expect(updateCalls).toBe(0);
    });
});

describe('1038509 keyPressed', () => {
    it('1038509 keyPressed getter caches result', () => {
        const field: any = { _dictionary: new _PdfDictionary() };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const fakeResolved: PdfJavaScriptAction = new PdfJavaScriptAction('js');
        expect(fakeResolved._dictionary.has('S')).toBeTruthy();
        let name: string = fakeResolved._dictionary.get('S').name;
        expect(name).toEqual('JavaScript');
        fakeResolved.script = 'AFDate_Validate("dd/mm/yyyy")';
        let value = fakeResolved.script;
        expect(value).toEqual('AFDate_Validate("dd/mm/yyyy")');
        let callCount: number = 0;
        actions._getFieldAction = (_key: string): PdfJavaScriptAction => {
            callCount++;
            return fakeResolved;
        };
        const first: PdfJavaScriptAction = actions.keyPressed;
        const second: PdfJavaScriptAction = actions.keyPressed;
        expect(first).toBe(fakeResolved);
        expect(second).toBe(fakeResolved);
        expect(callCount).toBe(1);
        expect(actions._keyPressed).toBe(fakeResolved);
    });

    it('1038509 keyPressed getter uses key K', () => {
        const field: any = { _dictionary: new _PdfDictionary() };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const seenKeys: string[] = [];
        actions._getFieldAction = (key: string): PdfJavaScriptAction => {
            seenKeys.push(key);
            return new PdfJavaScriptAction('js');
        };
        actions.keyPressed;
        expect(seenKeys.length).toBe(1);
        expect(seenKeys[0]).toBe('K');
        expect(seenKeys[0]).not.toBe('');
    });

    it('1038509 keyPressed getter returns cached', () => {
        const field: any = { _dictionary: new _PdfDictionary() };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const cached: PdfJavaScriptAction = new PdfJavaScriptAction('cached');
        actions._keyPressed = cached;
        let callCount: number = 0;
        actions._getFieldAction = (_key: string): PdfJavaScriptAction => {
            callCount++;
            return new PdfJavaScriptAction('x');
        };
        const result: PdfJavaScriptAction = actions.keyPressed;
        expect(result).toBe(cached);
        expect(callCount).toBe(0);
    });

    it('1038509 keyPressed setter assigns and updates', () => {
        const field: any = { _dictionary: new _PdfDictionary() };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const calls: { key: string }[] = [];
        actions._updateFieldAction = (_a: PdfJavaScriptAction, key: string): void => { calls.push({ key }); };
        const newAction: PdfJavaScriptAction = new PdfJavaScriptAction('script');
        actions.keyPressed = newAction;
        expect(actions._keyPressed).toBe(newAction);
        expect(calls.length).toBe(1);
        expect(calls[0].key).toBe('K');
    });

    it('1038509 keyPressed setter ignores falsy', () => {
        const field: any = { _dictionary: new _PdfDictionary() };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const initial: PdfJavaScriptAction = new PdfJavaScriptAction('initial');
        actions._keyPressed = initial;
        let updateCalls: number = 0;
        actions._updateFieldAction = (_a: PdfJavaScriptAction, _k: string): void => { updateCalls++; };
        actions.keyPressed = 0 as any;
        expect(actions._keyPressed).toBe(initial);
        expect(updateCalls).toBe(0);
        actions.keyPressed = '' as any;
        expect(actions._keyPressed).toBe(initial);
        expect(updateCalls).toBe(0);
    });
});

describe('1038509 format', () => {
    it('1038509 format getter caches result', () => {
        const field: any = { _dictionary: new _PdfDictionary() };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const fakeResolved: PdfJavaScriptAction = new PdfJavaScriptAction('fmt');
        let callCount: number = 0;
        actions._getFieldAction = (_key: string): PdfJavaScriptAction => {
            callCount++;
            return fakeResolved;
        };
        const first: PdfJavaScriptAction = actions.format;
        const second: PdfJavaScriptAction = actions.format;
        expect(first).toBe(fakeResolved);
        expect(second).toBe(fakeResolved);
        expect(callCount).toBe(1);
        expect(actions._format).toBe(fakeResolved);
    });

    it('1038509 format getter uses key F', () => {
        const field: any = { _dictionary: new _PdfDictionary() };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const seenKeys: string[] = [];
        actions._getFieldAction = (key: string): PdfJavaScriptAction => {
            seenKeys.push(key);
            return new PdfJavaScriptAction('fmt');
        };
        actions.format;
        expect(seenKeys.length).toBe(1);
        expect(seenKeys[0]).toBe('F');
        expect(seenKeys[0]).not.toBe('');
    });

    it('1038509 format getter returns cached', () => {
        const field: any = { _dictionary: new _PdfDictionary() };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const cached: PdfJavaScriptAction = new PdfJavaScriptAction('cached');
        actions._format = cached;
        let callCount: number = 0;
        actions._getFieldAction = (_key: string): PdfJavaScriptAction => {
            callCount++;
            return new PdfJavaScriptAction('x');
        };
        const result: PdfJavaScriptAction = actions.format;
        expect(result).toBe(cached);
        expect(callCount).toBe(0);
    });

    it('1038509 format setter assigns and updates', () => {
        const field: any = { _dictionary: new _PdfDictionary() };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const calls: { key: string }[] = [];
        actions._updateFieldAction = (_a: PdfJavaScriptAction, key: string): void => { calls.push({ key }); };
        const newAction: PdfJavaScriptAction = new PdfJavaScriptAction('fmt');
        actions.format = newAction;
        expect(actions._format).toBe(newAction);
        expect(calls.length).toBe(1);
        expect(calls[0].key).toBe('F');
    });

    it('1038509 format setter ignores falsy', () => {
        const field: any = { _dictionary: new _PdfDictionary() };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const initial: PdfJavaScriptAction = new PdfJavaScriptAction('initial');
        actions._format = initial;
        let updateCalls: number = 0;
        actions._updateFieldAction = (_a: PdfJavaScriptAction, _k: string): void => { updateCalls++; };
        actions.format = 0 as any;
        expect(actions._format).toBe(initial);
        expect(updateCalls).toBe(0);
        actions.format = '' as any;
        expect(actions._format).toBe(initial);
        expect(updateCalls).toBe(0);
    });
});

describe('1038509 validate', () => {
    it('1038509 validate getter caches result', () => {
        const field: any = { _dictionary: new _PdfDictionary() };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const fakeResolved: PdfJavaScriptAction = new PdfJavaScriptAction('v');
        let callCount: number = 0;
        actions._getFieldAction = (_key: string): PdfJavaScriptAction => {
            callCount++;
            return fakeResolved;
        };
        const first: PdfJavaScriptAction = actions.validate;
        const second: PdfJavaScriptAction = actions.validate;
        expect(first).toBe(fakeResolved);
        expect(second).toBe(fakeResolved);
        expect(callCount).toBe(1);
        expect(actions._validate).toBe(fakeResolved);
    });

    it('1038509 validate getter uses key V', () => {
        const field: any = { _dictionary: new _PdfDictionary() };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const seenKeys: string[] = [];
        actions._getFieldAction = (key: string): PdfJavaScriptAction => {
            seenKeys.push(key);
            return new PdfJavaScriptAction('v');
        };
        actions.validate;
        expect(seenKeys.length).toBe(1);
        expect(seenKeys[0]).toBe('V');
        expect(seenKeys[0]).not.toBe('');
    });

    it('1038509 validate getter returns cached', () => {
        const field: any = { _dictionary: new _PdfDictionary() };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const cached: PdfJavaScriptAction = new PdfJavaScriptAction('cached');
        actions._validate = cached;
        let callCount: number = 0;
        actions._getFieldAction = (_key: string): PdfJavaScriptAction => {
            callCount++;
            return new PdfJavaScriptAction('x');
        };
        const result: PdfJavaScriptAction = actions.validate;
        expect(result).toBe(cached);
        expect(callCount).toBe(0);
    });

    it('1038509 validate setter assigns and updates', () => {
        const field: any = { _dictionary: new _PdfDictionary() };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const calls: { key: string }[] = [];
        actions._updateFieldAction = (_a: PdfJavaScriptAction, key: string): void => { calls.push({ key }); };
        const newAction: PdfJavaScriptAction = new PdfJavaScriptAction('v');
        actions.validate = newAction;
        expect(actions._validate).toBe(newAction);
        expect(calls.length).toBe(1);
        expect(calls[0].key).toBe('V');
    });

    it('1038509 validate setter ignores falsy', () => {
        const field: any = { _dictionary: new _PdfDictionary() };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const initial: PdfJavaScriptAction = new PdfJavaScriptAction('initial');
        actions._validate = initial;
        let updateCalls: number = 0;
        actions._updateFieldAction = (_a: PdfJavaScriptAction, _k: string): void => { updateCalls++; };
        actions.validate = 0 as any;
        expect(actions._validate).toBe(initial);
        expect(updateCalls).toBe(0);
        actions.validate = '' as any;
        expect(actions._validate).toBe(initial);
        expect(updateCalls).toBe(0);
    });
});

describe('1038509 _updateAction line 909 guard', () => {
    it('1038509 _updateAction skips when widget null', () => {
        const field: any = {
            _kidsCount: 1,
            itemAt: (_i: number): PdfWidgetAnnotation => 0 as any
        };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const action: PdfGoToAction = makeGoToActionWithMode(page, PdfDestinationMode.location);
        let name: string = action._dictionary.get('S').name;
        expect(name).toEqual('GoTo');
        const before: _PdfDictionary = action._dictionary;
        actions._updateAction(action, 'E');
        expect(action._dictionary).toBe(before);
        expect(before.has('D')).toBe(false);
        document.destroy();
    });

    it('1038509 _updateAction skips when widget dictionary null', () => {
        const widget: any = { _dictionary: 0 as any };
        const field: any = {
            _kidsCount: 1,
            itemAt: (_i: number): any => widget
        };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const action: PdfGoToAction = makeGoToActionWithMode(page, PdfDestinationMode.location);
        actions._updateAction(action, 'E');
        expect(action._dictionary.has('D')).toBe(false);
        document.destroy();
    });

    it('1038509 _updateAction skips non GoTo action', () => {     
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const { actions, widgetDictionary } = makeActionsForUpdate(document, page);
        const jsAction: PdfJavaScriptAction = new PdfJavaScriptAction('var x = 1;');
        actions._updateAction(jsAction, 'E');
        expect(widgetDictionary.has('AA')).toBe(false);
        expect(jsAction._dictionary.has('D')).toBe(false);
        document.destroy();
    });

    it('1038509 _updateAction enters for valid widget', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const { actions, widgetDictionary } = makeActionsForUpdate(document, page);
        const action: PdfGoToAction = makeGoToActionWithMode(page, PdfDestinationMode.location);
        actions._updateAction(action, 'E');
        expect(widgetDictionary.has('AA')).toBe(true);
        expect(action._dictionary.has('D')).toBe(true);
        document.destroy();
    });
});

describe('1038509 _updateAction destination-mode branches', () => {
    it('1038509 location mode uses key D and name XYZ', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const { actions, widgetDictionary } = makeActionsForUpdate(document, page);
        const action: PdfGoToAction = makeGoToActionWithMode(page, PdfDestinationMode.location);
        actions._updateAction(action, 'E');
        expect(action._dictionary.has('D')).toBe(true);
        const dValue: any[] = action._dictionary.get('D') as any[];
        expect(Array.isArray(dValue)).toBe(true);
        const modeName: _PdfName = dValue[1] as _PdfName;
        expect(modeName).toBeDefined();
        expect(modeName.name).toBe('XYZ');
        expect(modeName.name).not.toBe('');
        expect(widgetDictionary.has('AA')).toBe(true);
        document.destroy();
    });

    it('1038509 fitR mode uses key D and name FitR', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const { actions, widgetDictionary } = makeActionsForUpdate(document, page);
        const action: PdfGoToAction = makeGoToActionWithMode(page, PdfDestinationMode.fitR);
        actions._updateAction(action, 'E');
        expect(action._dictionary.has('D')).toBe(true);
        const dValue: any[] = action._dictionary.get('D') as any[];
        expect(Array.isArray(dValue)).toBe(true);
        expect(dValue.length).toBe(6);
        const modeName: _PdfName = dValue[1] as _PdfName;
        expect(modeName).toBeDefined();
        expect(modeName.name).toBe('FitR');
        expect(modeName.name).not.toBe('');
        expect(widgetDictionary.has('AA')).toBe(true);
        document.destroy();
    });

    it('1038509 fitH mode uses key D and name FitH', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const { actions, widgetDictionary } = makeActionsForUpdate(document, page);
        const action: PdfGoToAction = makeGoToActionWithMode(page, PdfDestinationMode.fitH);
        actions._updateAction(action, 'E');
        expect(action._dictionary.has('D')).toBe(true);
        const dValue: any[] = action._dictionary.get('D') as any[];
        expect(Array.isArray(dValue)).toBe(true);
        const modeName: _PdfName = dValue[1] as _PdfName;
        expect(modeName).toBeDefined();
        expect(modeName.name).toBe('FitH');
        expect(widgetDictionary.has('AA')).toBe(true);
        document.destroy();
    });

    it('1038509 fitToPage mode uses key D and name Fit', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const { actions, widgetDictionary } = makeActionsForUpdate(document, page);
        const action: PdfGoToAction = makeGoToActionWithMode(page, PdfDestinationMode.fitToPage);
        actions._updateAction(action, 'E');
        expect(action._dictionary.has('D')).toBe(true);
        const dValue: any[] = action._dictionary.get('D') as any[];
        expect(Array.isArray(dValue)).toBe(true);
        const modeName: _PdfName = dValue[1] as _PdfName;
        expect(modeName).toBeDefined();
        expect(modeName.name).toBe('Fit');
        expect(widgetDictionary.has('AA')).toBe(true);
        document.destroy();
    });

    it('1038509 unknown mode skips action dictionary update', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const { actions, widgetDictionary } = makeActionsForUpdate(document, page);
        const action: PdfGoToAction = makeGoToActionWithMode(page, PdfDestinationMode.location);
        (action._destination as any)._destinationMode = 9999;
        const before: boolean = action._dictionary.has('D');
        actions._updateAction(action, 'E');
        expect(action._dictionary.has('D')).toBe(before);
        expect(widgetDictionary.has('AA')).toBe(true);
        document.destroy();
    });
});

describe('1038509 _updateAction line 916 fitR', () => {
    it('1038509 fitR branch uses key D', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const { actions } = makeActionsForUpdate(document, page);
        const action: PdfGoToAction = makeGoToActionWithMode(page, PdfDestinationMode.fitR);
        actions._updateAction(action, 'E');
        expect(action._dictionary.has('D')).toBe(true);
        expect(action._dictionary.has('')).toBe(false);
        const dValue: any[] = action._dictionary.get('D') as any[];
        expect(Array.isArray(dValue)).toBe(true);
        expect(dValue.length).toBe(6);
        document.destroy();
    });

    it('1038509 fitR branch stores name FitR', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const { actions } = makeActionsForUpdate(document, page);
        const action: PdfGoToAction = makeGoToActionWithMode(page, PdfDestinationMode.fitR);
        actions._updateAction(action, 'E');
        const dValue: any[] = action._dictionary.get('D') as any[];
        const modeName: _PdfName = dValue[1] as _PdfName;
        expect(modeName).toBeDefined();
        expect(modeName.name).toBe('FitR');
        expect(modeName.name).not.toBe('');
        expect(modeName.name.length).toBe(4);
        document.destroy();
    });
});

describe('1038509 _updateAction line 923/924 finalization', () => {
    it('1038509 AA dictionary updated flag set true', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const { actions, widgetDictionary } = makeActionsForUpdate(document, page);
        const action: PdfGoToAction = makeGoToActionWithMode(page, PdfDestinationMode.location);
        actions._updateAction(action, 'E');
        const aaEntry: _PdfDictionary = widgetDictionary.get('AA') as _PdfDictionary;
        expect(aaEntry).toBeDefined();
        expect(aaEntry._updated).toBe(true);
        document.destroy();
    });

    it('1038509 widget dictionary uses key AA', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const { actions, widgetDictionary } = makeActionsForUpdate(document, page);
        const action: PdfGoToAction = makeGoToActionWithMode(page, PdfDestinationMode.location);
        actions._updateAction(action, 'E');
        expect(widgetDictionary.has('AA')).toBe(true);
        expect(widgetDictionary.has('')).toBe(false);
        document.destroy();
    });

    it('1038509 AA dictionary stores action under setter key', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const { actions, widgetDictionary } = makeActionsForUpdate(document, page);
        const action: PdfGoToAction = makeGoToActionWithMode(page, PdfDestinationMode.location);
        actions._updateAction(action, 'E');
        const aaEntry: _PdfDictionary = widgetDictionary.get('AA') as _PdfDictionary;
        expect(aaEntry.has('E')).toBe(true);
        expect(aaEntry.has('')).toBe(false);
        const stored: _PdfDictionary = aaEntry.get('E') as _PdfDictionary;
        expect(stored).toBe(action._dictionary);
        document.destroy();
    });
});

describe('1038509 _updateAction line 907 _kidsCount guard', () => {
    it('1038509 kids count zero skips inner block', () => {
        let itemAtCalled: boolean = false;
        const field: any = {
            _kidsCount: 0,
            itemAt: (_i: number): any => {
                itemAtCalled = true;
                return 0;
            }
        };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const action: PdfGoToAction = makeGoToActionWithMode(page, PdfDestinationMode.location);
        const before: boolean = action._dictionary.has('D');
        actions._updateAction(action, 'E');
        expect(itemAtCalled).toBe(false);
        expect(action._dictionary.has('D')).toBe(before);
        document.destroy();
    });

    it('1038509 kids count one enters inner block', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const { actions, widgetDictionary } = makeActionsForUpdate(document, page);
        const action: PdfGoToAction = makeGoToActionWithMode(page, PdfDestinationMode.location);
        actions._updateAction(action, 'E');
        expect(widgetDictionary.has('AA')).toBe(true);
        expect(action._dictionary.has('D')).toBe(true);
        document.destroy();
    });

    it('1038509 null widget skipped regardless of kids count', () => {
        const field: any = {
            _kidsCount: 5,
            itemAt: (_i: number): any => 0
        };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const action: PdfGoToAction = makeGoToActionWithMode(page, PdfDestinationMode.location);
        const before: boolean = action._dictionary.has('D');
        actions._updateAction(action, 'E');
        expect(action._dictionary.has('D')).toBe(before);
        document.destroy();
    });
});

describe('1038509 _getPdfAction lines 935-955', () => {
    it('1038509 _getPdfAction returns undefined when no dictionary', () => {
        const widget: any = { _dictionary: null };
        const field: any = {
            _kidsCount: 1,
            itemAt: (_i: number) => widget
        };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const result: PdfAction = (actions as any)._getPdfAction('E');
        expect(result).toBeUndefined();
    });

    it('1038509 _getPdfAction returns undefined when no AA', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const { actions } = makeActionsForUpdate(document, page);
        const result: PdfAction = (actions as any)._getPdfAction('E');
        expect(result).toBeUndefined();
        document.destroy();
    });

    it('1038509 _getPdfAction uses exact key AA', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const { actions, widgetDictionary } = makeActionsForUpdate(document, page);
        (actions as any)._getPdfAction('E');
        expect(widgetDictionary.has('AA')).toBe(false);
        expect(widgetDictionary.has('')).toBe(false);
        document.destroy();
    });

    it('1038509 _getPdfAction uses passed in key', () => {
        const widgetDictionary: _PdfDictionary = new _PdfDictionary();
        const aa: _PdfDictionary = new _PdfDictionary();
        aa.update('E', new _PdfDictionary());
        widgetDictionary.update('AA', aa);
        const widget: any = { _dictionary: widgetDictionary };
        const field: any = {
            _kidsCount: 1,
            itemAt: (_i: number) => widget
        };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const result: PdfAction = (actions as any)._getPdfAction('X');
        expect(result).toBeUndefined();
    });

    it('1038509 _getPdfAction resolves GoTo action', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfButtonField = new PdfButtonField(
            page, 'btn1', { x: 50, y: 50, width: 100, height: 20 }
        );
        document.form.add(field);
        const widget: any = field.itemAt(0);
        const widgetDictionary: _PdfDictionary = widget._dictionary;
        const inner: _PdfDictionary = new _PdfDictionary();
        inner.update('S', new _PdfName('GoTo'));
        const fakeRef: _PdfReference = new _PdfReference(0, 0);
        inner.update('D', [fakeRef, new _PdfName('Fit')]);
        const aa: _PdfDictionary = new _PdfDictionary();
        aa.set('E', inner);
        widgetDictionary.update('AA', aa);
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const result: PdfAction = (actions as any)._getPdfAction('E');
        expect(result).toBeDefined();
        expect(result instanceof PdfGoToAction).toBe(true);
        document.destroy();
    });

    it('1038509 _getPdfAction returns undefined when no S', () => {
        const widgetDictionary: _PdfDictionary = new _PdfDictionary();
        const inner: _PdfDictionary = new _PdfDictionary();
        const aa: _PdfDictionary = new _PdfDictionary();
        aa.set('E', inner);
        widgetDictionary.update('AA', aa);
        const widget: any = { _dictionary: widgetDictionary };
        const field: any = {
            _kidsCount: 1,
            itemAt: (_i: number) => widget
        };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const result: PdfAction = (actions as any)._getPdfAction('E');
        expect(result).toBeUndefined();
    });

    it('1038509 _getPdfAction returns undefined when S not GoTo', () => {
        const widgetDictionary: _PdfDictionary = new _PdfDictionary();
        const inner: _PdfDictionary = new _PdfDictionary();
        inner.update('S', new _PdfName('ResetForm'));
        const aa: _PdfDictionary = new _PdfDictionary();
        aa.set('E', inner);
        widgetDictionary.update('AA', aa);
        const widget: any = { _dictionary: widgetDictionary };
        const field: any = {
            _kidsCount: 1,
            itemAt: (_i: number) => widget
        };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const result: PdfAction = (actions as any)._getPdfAction('E');
        expect(result).toBeUndefined();
    });
});

describe('1038509 _updateFieldAction lines 964-989', () => {
    it('1038509 _updateFieldAction no field skips update', () => {
        const actions: PdfFieldActions = new PdfFieldActions(undefined as any);
        const action: PdfJavaScriptAction = new PdfJavaScriptAction('alert(1);');
        expect(() => (actions as any)._updateFieldAction(action, 'K')).not.toThrow();
    });

    it('1038509 _updateFieldAction no dictionary skips update', () => {
        const field: any = {};
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const action: PdfJavaScriptAction = new PdfJavaScriptAction('alert(1);');
        expect(() => (actions as any)._updateFieldAction(action, 'K')).not.toThrow();
    });

    it('1038509 _updateFieldAction null action skips update', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const { actions } =  makeActionsForUpdate(document, page);
        expect(() => (actions as any)._updateFieldAction(null as any, 'K')).not.toThrow();
        expect(() => (actions as any)._updateFieldAction(undefined as any, 'K')).not.toThrow();
        document.destroy();
    });

    it('1038509 _updateFieldAction empty key skips update', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const { actions } =  makeActionsForUpdate(document, page);
        const action: PdfJavaScriptAction = new PdfJavaScriptAction('alert(1);');
        expect(() => (actions as any)._updateFieldAction(action, '')).not.toThrow();
        const post: any = (actions as any)._field._dictionary;
        expect(post.has('AA')).toBe(false);
        document.destroy();
    });

    it('1038509 _updateFieldAction creates AA with exact key', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfButtonField = new PdfButtonField(page, 'btn1', { x: 50, y: 50, width: 100, height: 20 });
        document.form.add(field);
        const actions = field.actions;
        const widgetDictionary = field._dictionary;
        const action: PdfJavaScriptAction = new PdfJavaScriptAction('alert(1);');
        (actions as any)._updateFieldAction(action, 'K');
        expect(widgetDictionary.has('AA')).toBe(true);
        const aa: _PdfDictionary = widgetDictionary.get('AA') as _PdfDictionary;
        expect(aa).toBeDefined();
        expect(aa.has('K')).toBe(true);
        expect(aa.has('')).toBe(false);
		document.destroy();
    });

    it('1038509 _updateFieldAction reuses existing AA dictionary', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfButtonField = new PdfButtonField(page, 'btn1', { x: 50, y: 50, width: 100, height: 20 });
        document.form.add(field);
        const actions = field.actions;
        const widgetDictionary = field._dictionary;
        const existing: _PdfDictionary = new _PdfDictionary();
        existing.update('Sentinel', new _PdfName('keep-me'));
        widgetDictionary.update('AA', existing);
        const action: PdfJavaScriptAction = new PdfJavaScriptAction('alert(1);');
        (actions as any)._updateFieldAction(action, 'K');
        const aa: _PdfDictionary = widgetDictionary.get('AA') as _PdfDictionary;
        expect(aa.has('Sentinel')).toBe(true);
        expect(aa.get('Sentinel') instanceof _PdfName).toBe(true);
        expect(aa.has('K')).toBe(true);
		document.destroy();
    });

    it('1038509 _updateFieldAction replaces non dictionary AA', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfButtonField = new PdfButtonField(page, 'btn1', { x: 50, y: 50, width: 100, height: 20 });
        document.form.add(field);
        const actions = field.actions;
        const widgetDictionary = field._dictionary;
        widgetDictionary.set('AA', 'not-a-dictionary');
        const action: PdfJavaScriptAction = new PdfJavaScriptAction('alert(1);');
        (actions as any)._updateFieldAction(action, 'K');
        const aa: any = widgetDictionary.get('AA');
        expect(aa instanceof _PdfDictionary).toBe(true);
        expect(aa.has('K')).toBe(true);
		document.destroy();
    });

    it('1038509 _updateFieldAction writes JS only when non empty', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfButtonField = new PdfButtonField(page, 'btn1', { x: 50, y: 50, width: 100, height: 20 });
        document.form.add(field);
        const actions = field.actions;
        const widgetDictionary = field._dictionary;
        const actionNonEmpty: PdfJavaScriptAction = new PdfJavaScriptAction('alert(1);');
        (actions as any)._updateFieldAction(actionNonEmpty, 'K');
        expect(actionNonEmpty._dictionary.has('JS')).toBe(true);
        expect(actionNonEmpty._dictionary.get('JS')).toBe('alert(1);');
        const actionEmpty: PdfJavaScriptAction = new PdfJavaScriptAction('');
        (actionEmpty as any)._dictionary = new _PdfDictionary();
        (actions as any)._updateFieldAction(actionEmpty, 'K');
        expect(actionEmpty._dictionary.has('JS')).toBe(false);
		document.destroy();
    });

    it('1038509 _updateFieldAction sets updated flag', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfButtonField = new PdfButtonField(page, 'btn1', { x: 50, y: 50, width: 100, height: 20 });
        document.form.add(field);
        const actions = field.actions;
        const widgetDictionary = field._dictionary;
        const action: PdfJavaScriptAction = new PdfJavaScriptAction('alert(1);');
        (action as any)._dictionary._updated = false;
        widgetDictionary._updated = false;
        (actions as any)._updateFieldAction(action, 'K');
        expect(action._dictionary._updated).toBe(true);
        const aa: _PdfDictionary = widgetDictionary.get('AA') as _PdfDictionary;
        expect(aa._updated).toBe(true);
        expect(widgetDictionary._updated).toBe(true);
		document.destroy();
    });

    it('1038509 _updateFieldAction uses key AA', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfButtonField = new PdfButtonField(page, 'btn1', { x: 50, y: 50, width: 100, height: 20 });
        document.form.add(field);
        const actions = field.actions;
        const widgetDictionary = field._dictionary;
        const action: PdfJavaScriptAction = new PdfJavaScriptAction('alert(1);');
        (actions as any)._updateFieldAction(action, 'K');
        expect(widgetDictionary.has('AA')).toBe(true);
        expect(widgetDictionary.has('')).toBe(false);
		document.destroy();
    });
});

describe('1038509 _getFieldAction lines 991-1013', () => {
    it('1038509 _getFieldAction no field returns undefined', () => {
        const actions: PdfFieldActions = new PdfFieldActions(undefined as any);
        const result: PdfJavaScriptAction = (actions as any)._getFieldAction('K');
        expect(result).toBeUndefined();
    });

    it('1038509 _getFieldAction no dictionary returns undefined', () => {
        const field: any = {};
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const result: PdfJavaScriptAction = (actions as any)._getFieldAction('K');
        expect(result).toBeUndefined();
    });

    it('1038509 _getFieldAction empty key returns undefined', () => {
        const { actions } = makeGetFieldActionHarness();
        const result: PdfJavaScriptAction = (actions as any)._getFieldAction('');
        expect(result).toBeUndefined();
    });

    it('1038509 _getFieldAction no AA returns undefined', () => {
        const fieldDictionary: _PdfDictionary = new _PdfDictionary();
        const field: any = { _dictionary: fieldDictionary };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const result: PdfJavaScriptAction = (actions as any)._getFieldAction('K');
        expect(result).toBeUndefined();
    });

    it('1038509 _getFieldAction looks up AA with exact key', () => {
        const { actions, fieldDictionary } = makeGetFieldActionHarness({ includeAA: true });
        const result: PdfJavaScriptAction = (actions as any)._getFieldAction('X');
        expect(result).toBeUndefined();
        const aa: _PdfDictionary = fieldDictionary.get('AA') as _PdfDictionary;
        expect(aa.has('K')).toBe(true);
    });

    it('1038509 _getFieldAction aa not dictionary returns undefined', () => {
        const fieldDictionary: _PdfDictionary = new _PdfDictionary();
        fieldDictionary.set('AA', 'plain-string');
        const field: any = { _dictionary: fieldDictionary };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const result: PdfJavaScriptAction = (actions as any)._getFieldAction('K');
        expect(result).toBeUndefined();
    });

    it('1038509 _getFieldAction aa missing key returns undefined', () => {
        const { actions } = makeGetFieldActionHarness();
        const result: PdfJavaScriptAction = (actions as any)._getFieldAction('V');
        expect(result).toBeUndefined();
    });

    it('1038509 _getFieldAction action not dictionary returns undefined', () => {
        const fieldDictionary: _PdfDictionary = new _PdfDictionary();
        const aa: _PdfDictionary = new _PdfDictionary();
        aa.set('K', 'plain-string');
        fieldDictionary.update('AA', aa);
        const field: any = { _dictionary: fieldDictionary };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const result: PdfJavaScriptAction = (actions as any)._getFieldAction('K');
        expect(result).toBeUndefined();
    });

    it('1038509 _getFieldAction action no S returns undefined', () => {
        const fieldDictionary: _PdfDictionary = new _PdfDictionary();
        const aa: _PdfDictionary = new _PdfDictionary();
        const inner: _PdfDictionary = new _PdfDictionary();
        inner.update('JS', 'alert(3);');
        aa.set('K', inner);
        fieldDictionary.update('AA', aa);
        const field: any = { _dictionary: fieldDictionary };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const result: PdfJavaScriptAction = (actions as any)._getFieldAction('K');
        expect(result).toBeUndefined();
    });

    it('1038509 _getFieldAction S not JavaScript returns undefined', () => {
        const { actions } = makeGetFieldActionHarness({
            includeAA: true,
            sName: 'ResetForm'
        });
        const result: PdfJavaScriptAction = (actions as any)._getFieldAction('K');
        expect(result).toBeUndefined();
    });

    it('1038509 _getFieldAction S JavaScript no JS returns undefined', () => {
        const fieldDictionary: _PdfDictionary = new _PdfDictionary();
        const aa: _PdfDictionary = new _PdfDictionary();
        const inner: _PdfDictionary = new _PdfDictionary();
        inner.update('S', new _PdfName('JavaScript'));
        aa.set('K', inner);
        fieldDictionary.update('AA', aa);
        const field: any = { _dictionary: fieldDictionary };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        const result: PdfJavaScriptAction = (actions as any)._getFieldAction('K');
        expect(result).toBeUndefined();
    });

    it('1038509 _getFieldAction returns JavaScript action with script', () => {
        const { actions } = makeGetFieldActionHarness({
            includeAA: true,
            sName: 'JavaScript',
            includeJS: true
        });
        const result: PdfJavaScriptAction = (actions as any)._getFieldAction('K');
        expect(result).toBeDefined();
        expect(result instanceof PdfJavaScriptAction).toBe(true);
        expect(result._script).toBe('alert(2);');
    });

    it('1038509 _getFieldAction sets inner dictionary on result', () => {
        const { actions, fieldDictionary } = makeGetFieldActionHarness({
            includeAA: true,
            sName: 'JavaScript',
            includeJS: true
        });
        const result: PdfJavaScriptAction = (actions as any)._getFieldAction('K');
        expect(result).toBeDefined();
        const aa: _PdfDictionary = fieldDictionary.get('AA') as _PdfDictionary;
        const inner: _PdfDictionary = aa.get('K') as _PdfDictionary;
        expect(result._dictionary).toBe(inner);
    });
});

describe('1038509 PdfAction._initialize', () => {
    it('1038509 _initialize creates fresh dictionary', () => {
        const action: PdfAction = new PdfAction();
        action._initialize();
        const dictionary: _PdfDictionary = action._dictionary;
        expect(dictionary.has('Type')).toBeTruthy();
        const name: string = dictionary.get('Type').name;
        expect(name).toEqual('Action');
    });
    it('1038509 next setter uses exact key Next', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const first: PdfAction = new PdfAction();
        first._initialize();
        first._page = page;
        const second: PdfAction = new PdfAction();
        second._initialize();
        second._page = page;
        first.next = second;
        let value = first.next;
        expect(value).toEqual(second);
        expect(first._dictionary.has('Next')).toBe(true);
    });
});

describe('1038509 PdfGoToAction constructor dispatch', () => {
    it('1038509 GoToAction constructor uses PdfDestination', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const destination: PdfDestination = new PdfDestination(page, { x: 7, y: 11 });
        const action: PdfGoToAction = new PdfGoToAction(destination);
        expect(action._destination).toBe(destination);
        expect(action._page).toBe(page);
        document.destroy();
    });

    it('1038509 GoToAction constructor uses PdfPage', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const action: PdfGoToAction = new PdfGoToAction(page);
        expect(action._page).toBe(page);
        document.destroy();
    });
});

describe('1038509 PdfGoToAction.destination setter', () => {
    it('1038509 GoToAction destination setter assigns value', () => {
        const document: PdfDocument = new PdfDocument();
        const page1: PdfPage = document.addPage();
        const page2: PdfPage = document.addPage();
        const action: PdfGoToAction = new PdfGoToAction(page1);
        const original: PdfDestination = action._destination;
        const newDestination: PdfDestination = new PdfDestination(page2, { x: 5, y: 6 });
        action.destination = newDestination;
        expect(action._destination).toBe(newDestination);
        expect(action._destination).not.toBe(original);
        let destination: PdfDestination = new PdfDestination(page1, {x: 0, y: 0});
        expect(original).toEqual(destination);
        document.destroy();
    });
});

describe('1038509 _getFieldAction lines 996/1003', () => {
    it('1038509 line 996 has uses exact key AA', () => {
        const { actions, fieldDictionary} = makeGetFieldActionHarness({ includeAA: false });
        const seenKeys: string[] = [];
        const origHas: (k: string) => boolean = fieldDictionary.has.bind(fieldDictionary);
        fieldDictionary.has = (k: string): boolean => { seenKeys.push(k); return origHas(k); };
        const result: PdfJavaScriptAction = (actions as any)._getFieldAction('K');
        expect(result).toBeUndefined();
        expect(seenKeys).toContain('AA');
    });
    it('1038509 line 1003 returns JavaScript action with script', () => {
        const { actions, fieldDictionary } = makeGetFieldActionHarness({ includeAA: true, sName: 'JavaScript', includeJS: true });
        const result: PdfJavaScriptAction = (actions as any)._getFieldAction('K');
        const action: PdfJavaScriptAction = new PdfJavaScriptAction('');
        action.script = 'alert(2);';
        action._dictionary.update('JS', 'alert(2);');
        delete action._dictionary._map.Type;
        expect(action).toEqual(result);
        const aa: any = fieldDictionary.get('AA');
        const inner: any = aa.get('K');
        const expected: PdfJavaScriptAction = new PdfJavaScriptAction('alert(2);');
        expected._dictionary = inner;
        expect(result).toEqual(expected);
        expect(result._script).toBe('alert(2);');
        expect(result._script).not.toBe('Stryker was here!');
        expect(result._dictionary).toBe(inner);
    });
});

describe('1038509 _getPdfAction line 940-948 boundary', () => {
    function buildHarnessWithAA(key: string, inner: _PdfDictionary | null): {
        actions: PdfFieldActions;
        widget: any;
        widgetDictionary: _PdfDictionary;
    } {
        const widgetDictionary: _PdfDictionary = new _PdfDictionary();
        const aa: _PdfDictionary = new _PdfDictionary();
        if (inner !== null) {
            aa.set(key, inner);
        }
        widgetDictionary.update('AA', aa);
        const widget: any = { _dictionary: widgetDictionary };
        const field: any = {
            _kidsCount: 1,
            itemAt: (_i: number): PdfWidgetAnnotation => widget as PdfWidgetAnnotation
        };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        return { actions, widget, widgetDictionary };
    }

    it('1038509 line 940 returns undefined when AA missing key', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const { actions } = makeActionsForUpdate(document, page);
        const result: PdfAction = (actions as any)._getPdfAction('E');
        expect(result).toBeUndefined();
        document.destroy();
    });

    it('1038509 line 940 null action does not enter body', () => {
        const widgetDictionary: _PdfDictionary = new _PdfDictionary();
        widgetDictionary.set('AA', null);
        const widget: any = { _dictionary: widgetDictionary };
        const field: any = {
            _kidsCount: 1,
            itemAt: (_i: number) => widget
        };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        expect(() => (actions as any)._getPdfAction('E')).not.toThrow();
        const result: PdfAction = (actions as any)._getPdfAction('E');
        expect(result).toBeUndefined();
    });

    it('1038509 line 942 null inner dictionary returns undefined', () => {
        const widgetDictionary: _PdfDictionary = new _PdfDictionary();
        const aa: _PdfDictionary = new _PdfDictionary();
        aa.set('E', null);
        widgetDictionary.update('AA', aa);
        const widget: any = { _dictionary: widgetDictionary };
        const field: any = {
            _kidsCount: 1,
            itemAt: (_i: number) => widget
        };
        const actions: PdfFieldActions = new PdfFieldActions(field as any);
        expect(() => (actions as any)._getPdfAction('E')).not.toThrow();
        const result: PdfAction = (actions as any)._getPdfAction('E');
        expect(result).toBeUndefined();
    });

    it('1038509 line 942 uses exact key S', () => {
        const inner: _PdfDictionary = new _PdfDictionary();
        const seenKeys: string[] = [];
        const origHas: (k: string) => boolean = inner.has.bind(inner);
        inner.has = (k: string): boolean => { seenKeys.push(k); return origHas(k); };
        const { actions } = buildHarnessWithAA('E', inner);
        (actions as any)._getPdfAction('E');
        expect(seenKeys).toContain('S');
        expect(seenKeys).not.toContain('');
    });

    it('1038509 line 944 no S entry returns undefined', () => {
        const inner: _PdfDictionary = new _PdfDictionary();
        const { actions } = buildHarnessWithAA('E', inner);
        const result: PdfAction = (actions as any)._getPdfAction('E');
        expect(result).toBeUndefined();
    });

    it('1038509 line 944 S not GoTo returns undefined', () => {
        const inner: _PdfDictionary = new _PdfDictionary();
        inner.update('S', new _PdfName('ResetForm'));
        inner.update('D', [new _PdfReference(0, 0), new _PdfName('Fit')]);
        const { actions } = buildHarnessWithAA('E', inner);
        const result: PdfAction = (actions as any)._getPdfAction('E');
        expect(result).toBeUndefined();
    });

    it('1038509 line 944 wrong type with D returns undefined', () => {
        const inner: _PdfDictionary = new _PdfDictionary();
        inner.update('S', new _PdfName('ResetForm'));
        inner.update('D', new _PdfName('anything'));
        const { actions } = buildHarnessWithAA('E', inner);
        const result: PdfAction = (actions as any)._getPdfAction('E');
        expect(result).toBeUndefined();
    });

    it('1038509 line 944 S not GoTo with D returns undefined', () => {
        const inner: _PdfDictionary = new _PdfDictionary();
        inner.update('S', new _PdfName('ResetForm'));
        inner.update('D', [new _PdfReference(0, 0), new _PdfName('Fit')]);
        const { actions } = buildHarnessWithAA('E', inner);
        const result: PdfAction = (actions as any)._getPdfAction('E');
        expect(result).toBeUndefined();
    });

    it('1038509 line 944 S GoTo no D returns undefined', () => {
        const inner: _PdfDictionary = new _PdfDictionary();
        inner.update('S', new _PdfName('GoTo'));
        const { actions } = buildHarnessWithAA('E', inner);
        const result: PdfAction = (actions as any)._getPdfAction('E');
        expect(result).toBeUndefined();
    });

    it('1038509 line 948 destination helper uses key D', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfButtonField = new PdfButtonField(
            page, 'btn1', { x: 50, y: 50, width: 100, height: 20 }
        );
        document.form.add(field);

        const widget: any = field.itemAt(0);
        const widgetDictionary: _PdfDictionary = widget._dictionary;
        const inner: _PdfDictionary = new _PdfDictionary();
        inner.update('S', new _PdfName('GoTo'));
        inner.update('D', [page._ref, new _PdfName('Fit')]);
        const aa: _PdfDictionary = new _PdfDictionary();
        aa.set('E', inner);
        widgetDictionary.update('AA', aa);

        const actions: PdfFieldActions = field.actions;

        const result: PdfAction = (actions as any)._getPdfAction('E');

        expect(result instanceof PdfGoToAction).toBe(true);
        const goTo: PdfGoToAction = result as PdfGoToAction;
        expect(goTo._destination).toBeDefined();
        expect(goTo._destination.page).toBe(page);

        document.destroy();
    });
});

describe('1038509 _updateFieldAction line 974 script guard mutants', () => {
    it('1038509 line 974 kills if-true mutant: empty script does NOT write JS', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();        
        const { actions } =  makeActionsForUpdate(document, page);
        const actionEmpty: PdfJavaScriptAction = new PdfJavaScriptAction('');
        (actionEmpty as any)._dictionary = new _PdfDictionary();
        (actions as any)._updateFieldAction(actionEmpty, 'K');
        expect(actionEmpty._dictionary.has('JS')).toBe(false);
		document.destroy();
    });

    it('1038509 line 974 kills if-or mutant: undefined script does NOT write JS', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();        
        const { actions } =  makeActionsForUpdate(document, page);
        const actionUndefined: PdfJavaScriptAction = new PdfJavaScriptAction('seed' as any);
        (actionUndefined as any)._dictionary = new _PdfDictionary();
        (actionUndefined as any)._script = undefined;
        (actions as any)._updateFieldAction(actionUndefined, 'K');
        expect(actionUndefined._dictionary.has('JS')).toBe(false);
		document.destroy();
    });

    it('1038509 line 974 kills if-script-and-true mutant: non-empty script writes JS (and empty does not)', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();        
        const { actions } =  makeActionsForUpdate(document, page);
        const actionNonEmpty: PdfJavaScriptAction = new PdfJavaScriptAction('app.alert(1);');
        (actions as any)._updateFieldAction(actionNonEmpty, 'K');
        expect(actionNonEmpty._dictionary.has('JS')).toBe(true);
        expect(actionNonEmpty._dictionary.get('JS')).toBe('app.alert(1);');

        const actionEmpty: PdfJavaScriptAction = new PdfJavaScriptAction('');
        (actionEmpty as any)._dictionary = new _PdfDictionary();
        (actions as any)._updateFieldAction(actionEmpty, 'K');
        expect(actionEmpty._dictionary.has('JS')).toBe(false);
		document.destroy();
    });

    it('1038509 line 974 kills if-Stryker-string mutant: script "Stryker was here!" IS written as JS', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();        
        const { actions } =  makeActionsForUpdate(document, page);
        const actionStryker: PdfJavaScriptAction = new PdfJavaScriptAction('Stryker was here!');
        (actions as any)._updateFieldAction(actionStryker, 'K');
        expect(actionStryker._dictionary.has('JS')).toBe(true);
        expect(actionStryker._dictionary.get('JS')).toBe('Stryker was here!');
		document.destroy();
    });

    it('1038509 line 974 kills if-script-or mutant: null script does NOT write JS', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();        
        const { actions } =  makeActionsForUpdate(document, page);
        const actionNull: PdfJavaScriptAction = new PdfJavaScriptAction('seed' as any);
        (actionNull as any)._dictionary = new _PdfDictionary();
        (actionNull as any)._script = null;
        (actions as any)._updateFieldAction(actionNull, 'K');
        expect(actionNull._dictionary.has('JS')).toBe(false);
		document.destroy();
    });

    it('1038509 line 974 kills if-script-or mutant: empty-string script does NOT write JS', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();        
        const { actions } =  makeActionsForUpdate(document, page);
        const actionEmpty: PdfJavaScriptAction = new PdfJavaScriptAction('seed' as any);
        (actionEmpty as any)._dictionary = new _PdfDictionary();
        (actionEmpty as any)._script = '';
        (actions as any)._updateFieldAction(actionEmpty, 'K');
        expect(actionEmpty._dictionary.has('JS')).toBe(false);
		document.destroy();
    });

    it('1038509 line 974 kills if-script-or mutant: whitespace-only script IS written as JS', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();        
        const { actions } =  makeActionsForUpdate(document, page);
        const actionSpace: PdfJavaScriptAction = new PdfJavaScriptAction(' ');
        (actions as any)._updateFieldAction(actionSpace, 'K');
        expect(actionSpace._dictionary.has('JS')).toBe(true);
        expect(actionSpace._dictionary.get('JS')).toBe(' ');
		document.destroy();
    });

    it('1038509 line 974 kills if-script-and-true mutant: empty script does NOT write JS', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();        
        const { actions } =  makeActionsForUpdate(document, page);
        const actionEmpty: PdfJavaScriptAction = new PdfJavaScriptAction('seed' as any);
        (actionEmpty as any)._dictionary = new _PdfDictionary();
        (actionEmpty as any)._script = '';
        (actions as any)._updateFieldAction(actionEmpty, 'K');
        expect(actionEmpty._dictionary.has('JS')).toBe(false);
		document.destroy();
    });

    it('1038509 line 974 kills if-script-and-true mutant: non-empty script IS written and value is preserved', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();        
        const { actions } =  makeActionsForUpdate(document, page);
        const actionJs: PdfJavaScriptAction = new PdfJavaScriptAction('app.alert("X");');
        (actions as any)._updateFieldAction(actionJs, 'K');
        expect(actionJs._dictionary.has('JS')).toBe(true);
        expect(actionJs._dictionary.get('JS')).toBe('app.alert("X");');
        document.destroy();
    });
});
