import {
    PdfAction,
    PdfFieldActions,
    PdfGoToAction,
    PdfJavaScriptAction
} from '../src/pdf/core/pdf-action';
import { PdfDocument } from '../src/pdf/core/pdf-document';
import {
    PdfDestination,
    PdfPage
} from '../src/pdf/core/pdf-page';
import { PdfTextBoxField } from '../src/pdf/core/form/field';
import * as pdfActionModule from '../src/pdf/core/pdf-action';
describe('pdf-action.js survived mutants', () => {
    /**
     * Mutant ID 26
     * Location: 14:9-14:18
     * Mutation: "use strict" -> ""
     */
    it('kills mutant 26 by requiring PdfJavaScriptAction to reject invocation without new', () => {
        const constructorWithoutNew:
            (script: string) => PdfJavaScriptAction =
            PdfJavaScriptAction as unknown as
            (script: string) => PdfJavaScriptAction;
        expect(() => {
            constructorWithoutNew('event.value = 1;');
        }).toThrow();
    });
    /**
     * Mutant ID 32
     * Location: 16:36-16:48
     * Mutation: "__esModule" -> ""
     */
    it('kills mutant 32 by requiring the __esModule property to exist', () => {
        const descriptor: PropertyDescriptor | undefined =
            Object.getOwnPropertyDescriptor(
                pdfActionModule,
                '__esModule'
            );
        expect(descriptor).toBeDefined();
    });
    /**
     * Mutant ID 33
     * Location: 16:50-16:65
     * Mutation: { value: true } -> {}
     */
    it('kills mutant 33 by requiring the __esModule descriptor to contain a value', () => {
        const descriptor: PropertyDescriptor | undefined =
            Object.getOwnPropertyDescriptor(
                pdfActionModule,
                '__esModule'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor!.value).toBeDefined();
    });
    /**
     * Mutant ID 34
     * Location: 16:59-16:63
     * Mutation: true -> false
     */
    it('kills mutant 34 by requiring the __esModule value to be true', () => {
        const descriptor: PropertyDescriptor | undefined =
            Object.getOwnPropertyDescriptor(
                pdfActionModule,
                '__esModule'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor!.value).toBe(true);
    });
    /**
     * Mutant ID 44
     * PdfAction.prototype.next
     * Mutation: enumerable true -> false
     */
    it('kills mutant 44 by requiring PdfAction.next to be enumerable', () => {
        const descriptor: PropertyDescriptor | undefined =
            Object.getOwnPropertyDescriptor(
                PdfAction.prototype,
                'next'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor!.enumerable).toBe(true);
    });
    /**
     * Mutant ID 45
     * PdfAction.prototype.next
     * Mutation: configurable true -> false
     */
    it('kills mutant 45 by requiring PdfAction.next to be configurable', () => {
        const descriptor: PropertyDescriptor | undefined =
            Object.getOwnPropertyDescriptor(
                PdfAction.prototype,
                'next'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor!.configurable).toBe(true);
    });
    /**
     * Mutant ID 57
     * PdfJavaScriptAction.prototype.script
     * Mutation: enumerable true -> false
     */
    it('kills mutant 57 by requiring PdfJavaScriptAction.script to be enumerable', () => {
        const descriptor: PropertyDescriptor | undefined =
            Object.getOwnPropertyDescriptor(
                PdfJavaScriptAction.prototype,
                'script'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor!.enumerable).toBe(true);
    });
    /**
     * Mutant ID 58
     * PdfJavaScriptAction.prototype.script
     * Mutation: configurable true -> false
     */
    it('kills mutant 58 by requiring PdfJavaScriptAction.script to be configurable', () => {
        const descriptor: PropertyDescriptor | undefined =
            Object.getOwnPropertyDescriptor(
                PdfJavaScriptAction.prototype,
                'script'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor!.configurable).toBe(true);
    });
    /**
     * Mutant ID 76
     * PdfGoToAction.prototype.destination
     * Mutation: configurable true -> false
     */
    it('kills mutant 76 by requiring PdfGoToAction.destination to be configurable', () => {
        const descriptor: PropertyDescriptor | undefined =
            Object.getOwnPropertyDescriptor(
                PdfGoToAction.prototype,
                'destination'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor!.configurable).toBe(true);
    });
    /**
     * Mutant ID 92
     * PdfFieldActions.prototype.mouseEnter
     * Mutation: enumerable true -> false
     */
    it('kills mutant 92 by requiring PdfFieldActions.mouseEnter to be enumerable', () => {
        const descriptor: PropertyDescriptor | undefined =
            Object.getOwnPropertyDescriptor(
                PdfFieldActions.prototype,
                'mouseEnter'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor!.enumerable).toBe(true);
    });
    /**
     * Mutant ID 93
     * PdfFieldActions.prototype.mouseEnter
     * Mutation: configurable true -> false
     */
    it('kills mutant 93 by requiring PdfFieldActions.mouseEnter to be configurable', () => {
        const descriptor: PropertyDescriptor | undefined =
            Object.getOwnPropertyDescriptor(
                PdfFieldActions.prototype,
                'mouseEnter'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor!.configurable).toBe(true);
    });
    /**
     * Mutant ID 107
     * PdfFieldActions.prototype.mouseLeave
     * Mutation: enumerable true -> false
     */
    it('kills mutant 107 by requiring PdfFieldActions.mouseLeave to be enumerable', () => {
        const descriptor: PropertyDescriptor | undefined =
            Object.getOwnPropertyDescriptor(
                PdfFieldActions.prototype,
                'mouseLeave'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor!.enumerable).toBe(true);
    });
    /**
     * Mutant ID 108
     * PdfFieldActions.prototype.mouseLeave
     * Mutation: configurable true -> false
     */
    it('kills mutant 108 by requiring PdfFieldActions.mouseLeave to be configurable', () => {
        const descriptor: PropertyDescriptor | undefined =
            Object.getOwnPropertyDescriptor(
                PdfFieldActions.prototype,
                'mouseLeave'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor!.configurable).toBe(true);
    });
    /**
     * Mutant ID 122
     * PdfFieldActions.prototype.mouseUp
     * Mutation: enumerable true -> false
     */
    it('kills mutant 122 by requiring PdfFieldActions.mouseUp to be enumerable', () => {
        const descriptor: PropertyDescriptor | undefined =
            Object.getOwnPropertyDescriptor(
                PdfFieldActions.prototype,
                'mouseUp'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor!.enumerable).toBe(true);
    });
    /**
     * Mutant ID 123
     * PdfFieldActions.prototype.mouseUp
     * Mutation: configurable true -> false
     */
    it('kills mutant 123 by requiring PdfFieldActions.mouseUp to be configurable', () => {
        const descriptor: PropertyDescriptor | undefined =
            Object.getOwnPropertyDescriptor(
                PdfFieldActions.prototype,
                'mouseUp'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor!.configurable).toBe(true);
    });
    /**
     * Mutant ID 137
     * PdfFieldActions.prototype.mouseDown
     * Mutation: enumerable true -> false
     */
    it('kills mutant 137 by requiring PdfFieldActions.mouseDown to be enumerable', () => {
        const descriptor: PropertyDescriptor | undefined =
            Object.getOwnPropertyDescriptor(
                PdfFieldActions.prototype,
                'mouseDown'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor!.enumerable).toBe(true);
    });
    /**
     * Mutant ID 138
     * PdfFieldActions.prototype.mouseDown
     * Mutation: configurable true -> false
     */
    it('kills mutant 138 by requiring PdfFieldActions.mouseDown to be configurable', () => {
        const descriptor: PropertyDescriptor | undefined =
            Object.getOwnPropertyDescriptor(
                PdfFieldActions.prototype,
                'mouseDown'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor!.configurable).toBe(true);
    });
    /**
     * Mutant ID 152
     * PdfFieldActions.prototype.gotFocus
     * Mutation: enumerable true -> false
     */
    it('kills mutant 152 by requiring PdfFieldActions.gotFocus to be enumerable', () => {
        const descriptor: PropertyDescriptor | undefined =
            Object.getOwnPropertyDescriptor(
                PdfFieldActions.prototype,
                'gotFocus'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor!.enumerable).toBe(true);
    });
    /**
     * Mutant ID 153
     * PdfFieldActions.prototype.gotFocus
     * Mutation: configurable true -> false
     */
    it('kills mutant 153 by requiring PdfFieldActions.gotFocus to be configurable', () => {
        const descriptor: PropertyDescriptor | undefined =
            Object.getOwnPropertyDescriptor(
                PdfFieldActions.prototype,
                'gotFocus'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor!.configurable).toBe(true);
    });
    /**
     * Mutant ID 167
     * PdfFieldActions.prototype.lostFocus
     * Mutation: enumerable true -> false
     */
    it('kills mutant 167 by requiring PdfFieldActions.lostFocus to be enumerable', () => {
        const descriptor: PropertyDescriptor | undefined =
            Object.getOwnPropertyDescriptor(
                PdfFieldActions.prototype,
                'lostFocus'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor!.enumerable).toBe(true);
    });
    /**
     * Mutant ID 168
     * PdfFieldActions.prototype.lostFocus
     * Mutation: configurable true -> false
     */
    it('kills mutant 168 by requiring PdfFieldActions.lostFocus to be configurable', () => {
        const descriptor: PropertyDescriptor | undefined =
            Object.getOwnPropertyDescriptor(
                PdfFieldActions.prototype,
                'lostFocus'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor!.configurable).toBe(true);
    });
    /**
     * Mutant ID 182
     * PdfFieldActions.prototype.keyPressed
     * Mutation: enumerable true -> false
     */
    it('kills mutant 182 by requiring PdfFieldActions.keyPressed to be enumerable', () => {
        const descriptor: PropertyDescriptor | undefined =
            Object.getOwnPropertyDescriptor(
                PdfFieldActions.prototype,
                'keyPressed'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor!.enumerable).toBe(true);
    });
    /**
     * Mutant ID 183
     * PdfFieldActions.prototype.keyPressed
     * Mutation: configurable true -> false
     */
    it('kills mutant 183 by requiring PdfFieldActions.keyPressed to be configurable', () => {
        const descriptor: PropertyDescriptor | undefined =
            Object.getOwnPropertyDescriptor(
                PdfFieldActions.prototype,
                'keyPressed'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor!.configurable).toBe(true);
    });
    /**
     * Mutant ID 197
     * PdfFieldActions.prototype.format
     * Mutation: enumerable true -> false
     */
    it('kills mutant 197 by requiring PdfFieldActions.format to be enumerable', () => {
        const descriptor: PropertyDescriptor | undefined =
            Object.getOwnPropertyDescriptor(
                PdfFieldActions.prototype,
                'format'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor!.enumerable).toBe(true);
    });
    /**
     * Mutant ID 198
     * PdfFieldActions.prototype.format
     * Mutation: configurable true -> false
     */
    it('kills mutant 198 by requiring PdfFieldActions.format to be configurable', () => {
        const descriptor: PropertyDescriptor | undefined =
            Object.getOwnPropertyDescriptor(
                PdfFieldActions.prototype,
                'format'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor!.configurable).toBe(true);
    });
    /**
     * Mutant ID 212
     * PdfFieldActions.prototype.validate
     * Mutation: enumerable true -> false
     */
    it('kills mutant 212 by requiring PdfFieldActions.validate to be enumerable', () => {
        const descriptor: PropertyDescriptor | undefined =
            Object.getOwnPropertyDescriptor(
                PdfFieldActions.prototype,
                'validate'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor!.enumerable).toBe(true);
    });
    /**
     * Mutant ID 213
     * PdfFieldActions.prototype.validate
     * Mutation: configurable true -> false
     */
    it('kills mutant 213 by requiring PdfFieldActions.validate to be configurable', () => {
        const descriptor: PropertyDescriptor | undefined =
            Object.getOwnPropertyDescriptor(
                PdfFieldActions.prototype,
                'validate'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor!.configurable).toBe(true);
    });
    /**
     * Mutant ID 289
     * Location: 279:102-279:105
     * Original: new _PdfDestinationHelper(dictionary, 'D')
     * Mutation: new _PdfDestinationHelper(dictionary, '')
     */
    it('kills mutant 289 by resolving the GoTo destination from the D entry', () => {
        const document: PdfDocument = new PdfDocument();
        const sourcePage: PdfPage = document.addPage();
        const destinationPage: PdfPage = document.addPage();
        const field: PdfTextBoxField = new PdfTextBoxField(
            sourcePage,
            'goToDestinationField',
            {
                x: 20,
                y: 20,
                width: 150,
                height: 30
            }
        );
        document.form.add(field);
        const destination: PdfDestination = new PdfDestination(
            destinationPage,
            {
                x: 40,
                y: 60
            }
        );
        field.actions.mouseEnter = new PdfGoToAction(destination);
        const data: Uint8Array = document.save();
        document.destroy();
        const loadedDocument: PdfDocument = new PdfDocument(data);
        const loadedField: PdfTextBoxField =
            loadedDocument.form.fieldAt(0) as PdfTextBoxField;
        const loadedAction: PdfGoToAction =
            loadedField.actions.mouseEnter as PdfGoToAction;
        expect(loadedAction).toBeDefined();
        expect(loadedAction instanceof PdfGoToAction).toBe(true);
        expect(loadedAction.destination).toBeDefined();
        expect(loadedAction.destination.page).toBe(
            loadedDocument.getPage(1)
        );
        /*
         * The X coordinate is serialized in the GoTo action's D entry and
         * distinguishes the original implementation from Mutant 289.
         */
        expect(loadedAction.destination.location.x).toBe(40);
        /*
         * _updateAction writes page.size.height as the PDF top coordinate.
         * After parsing the destination, this maps back to client Y = 0.
         */
        expect(loadedAction.destination.location.y).toBe(0);
        loadedDocument.destroy();
    });
});