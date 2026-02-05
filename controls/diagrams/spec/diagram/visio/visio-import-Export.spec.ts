import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { BpmnDiagrams } from '../../../src/diagram/objects/bpmn';
import { AnnotationConstraints, ConnectorConstraints, NodeConstraints } from '../../../src/diagram/enum/enum';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { ConnectorBridging, IImportingEventArgs, ImportAndExportVisio, ShadowModel, } from '../../../src/diagram/index';
Diagram.Inject(ImportAndExportVisio, BpmnDiagrams, ConnectorBridging);

describe('Diagram Control', () => {
    describe('IMPORT VSDX', () => {

        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: 1500, height: 900,
            });
            diagram.appendTo('#diagram');
        })
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        async function onFileChange(e: any, pageIndex?: number) {
            const file = e.target.files[0];
            if (!pageIndex) {
                pageIndex = 0;
            }
            return (diagram as Diagram).importFromVisio(file, { pageIndex: pageIndex });
        }
        it('Import vsdx file-1', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/Drawing1.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'Drawing1.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any);
                    expect(diagram.nodes.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-2', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/Drawing2_prop.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'Drawing2_prop.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any);
                    expect(diagram.nodes.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-3', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/Drawing3_Theme.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'Drawing3_Theme.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any);
                    expect(diagram.nodes.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-4', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/connectors-NonthemeTest.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'connectors-NonthemeTest.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any);
                    expect(diagram.connectors.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-5', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/connectors-2.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'connectors-2.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any);
                    expect(diagram.connectors.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-6', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/connector-3.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'connector-3.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any);
                    expect(diagram.connectors.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-7', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/Drawing4.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'Drawing4.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any);
                    expect(diagram.connectors.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-8', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/Drawing5.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'Drawing5.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any);
                    expect(diagram.nodes.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-9', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/Drawing5.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'Drawing5.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 1);
                    expect(diagram.nodes.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-10', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/Drawing5.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'Drawing5.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 2);
                    expect(diagram.connectors.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-11', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/Drawing6.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'Drawing6.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any);
                    expect(diagram.nodes.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-12', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/Drawing5.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'Drawing5.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 3);
                    expect(diagram.nodes.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-13', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/Drawing7.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'Drawing7.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any);
                    (diagram as Diagram).exportToVisio();

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-14', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/VisioTheme.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'VisioTheme.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 0);
                    expect(diagram.nodes.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-15', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/VisioTheme.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'VisioTheme.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 1);
                    expect(diagram.nodes.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-16', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/VisioTheme.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'VisioTheme.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 2);
                    expect(diagram.nodes.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-17', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/VisioTheme.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'VisioTheme.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 3);
                    expect(diagram.nodes.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-18', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/VisioTheme.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'VisioTheme.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 4);
                    expect(diagram.nodes.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-19', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/VisioTheme.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'VisioTheme.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 5);
                    expect(diagram.nodes.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-20', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/VisioTheme.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'VisioTheme.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 6);
                    expect(diagram.nodes.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-21', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/Exception1.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'Exception1.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 5);
                    expect(true).toBe(true);

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-22', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/Exception2.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'Exception2.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 5);
                    expect(true).toBe(true);

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-23', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/Exception3.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'Exception3.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 5);
                    expect(true).toBe(true);

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-24', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/Exception4.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'Exception4.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 5);
                    expect(true).toBe(true);

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-25', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/VisioTheme.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'VisioTheme.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 7);
                    expect(diagram.nodes.length).toBeGreaterThan(0);

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-26', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/VisioTheme.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'VisioTheme.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 8);
                    expect(diagram.nodes.length).toBeGreaterThan(0);

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-27', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/VisioTheme.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'VisioTheme.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 9);
                    expect(diagram.nodes.length).toBeGreaterThan(0);
                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-28', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/VisioTheme.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'VisioTheme.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 10);
                    expect(diagram.nodes.length).toBeGreaterThan(0);

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-29', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/VisioTheme.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'VisioTheme.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 11);
                    expect(diagram.nodes.length).toBeGreaterThan(0);

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-30', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/VisioTheme.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'VisioTheme.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 12);
                    expect(diagram.nodes.length).toBeGreaterThan(0);

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-31', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/VisioTheme.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'VisioTheme.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 13);
                    expect(diagram.nodes.length).toBeGreaterThan(0);

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-32', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/VisioTheme.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'VisioTheme.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 14);
                    expect(diagram.nodes.length).toBeGreaterThan(0);

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-33', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/VisioTheme.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'VisioTheme.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 15);
                    expect(diagram.nodes.length).toBeGreaterThan(0);

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-34', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/VisioTheme.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'VisioTheme.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 16);
                    expect(diagram.nodes.length).toBeGreaterThan(0);

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-35', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/VisioTheme.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'VisioTheme.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 17);
                    expect(diagram.nodes.length).toBeGreaterThan(0);

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-36', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/VisioTheme.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'VisioTheme.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 18);
                    expect(diagram.nodes.length).toBeGreaterThan(0);

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-37', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/VisioTheme.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'VisioTheme.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 19);
                    expect(diagram.nodes.length).toBeGreaterThan(0);

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-38', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/VisioTheme.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'VisioTheme.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 20);
                    expect(diagram.nodes.length).toBeGreaterThan(0);

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-39', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/VisioTheme.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'VisioTheme.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 21);
                    expect(diagram.nodes.length).toBeGreaterThan(0);

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-40', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/VisioTheme.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'VisioTheme.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 22);
                    expect(diagram.nodes.length).toBeGreaterThan(0);

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-41', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/VisioTheme.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'VisioTheme.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 23);
                    expect(diagram.nodes.length).toBeGreaterThan(0);

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-42', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/VisioTheme.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'VisioTheme.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 24);
                    expect(diagram.nodes.length).toBeGreaterThan(0);
                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-43', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/VisioTheme.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'VisioTheme.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 25);
                    expect(diagram.nodes.length).toBeGreaterThan(0);

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-44', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/VisioTheme.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'VisioTheme.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 26);
                    expect(diagram.nodes.length).toBeGreaterThan(0);

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-45', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/VisioTheme.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'VisioTheme.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 27);
                    expect(diagram.nodes.length).toBeGreaterThan(0);

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-46', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/VisioTheme2.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'VisioTheme2.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 0);
                    expect(diagram.connectors.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-47', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/VisioTheme2.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'VisioTheme2.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 1);
                    expect(diagram.connectors.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-48', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/VisioTheme2.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'VisioTheme2.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 2);
                    expect(diagram.connectors.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-49', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/VisioTheme2.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'VisioTheme2.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 3);
                    expect(diagram.connectors.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-50', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/VisioTheme2.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'VisioTheme2.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 4);
                    expect(diagram.connectors.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-51', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/VisioTheme2.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'VisioTheme2.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 5);
                    expect(diagram.connectors.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-52', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/VisioTheme2.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'VisioTheme2.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 6);
                    expect(diagram.connectors.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-53', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/VisioTheme2.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'VisioTheme2.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 7);
                    expect(diagram.connectors.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-54', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/VisioTheme2.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'VisioTheme2.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 8);
                    expect(diagram.connectors.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-55', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/VisioTheme2.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'VisioTheme2.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 9);
                    expect(diagram.connectors.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-56', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/VisioTheme2.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'VisioTheme2.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 10);
                    expect(diagram.connectors.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-57', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/VisioTheme2.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'VisioTheme2.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 11);
                    expect(diagram.connectors.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-57', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/VisioTheme2.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'VisioTheme2.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 12);
                    expect(diagram.nodes.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-58', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/DefaultBezier.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'DefaultBezier.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 12);
                    expect(diagram.connectors.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-59', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/DefaultStraight.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'DefaultStraight.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 12);
                    expect(diagram.connectors.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-60', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/Theme.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'Theme.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 12);
                    expect(diagram.connectors.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-61', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/ImageNode.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'ImageNode.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 12);
                    expect(diagram.nodes.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-62', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/portconnector.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'portconnector.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 12);
                    expect(diagram.nodes.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-63', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/linearConnector.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'linearConnector.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 0);
                    expect(diagram.nodes.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-64', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/TextNodeContent.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'TextNodeContent.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 12);
                    expect(diagram.nodes.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file- Background and Shapes', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/BackgroundWithShapes.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'BackgroundWithShapes.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });
                    const warnings = await onFileChange({ target: { files: [file] } } as any);
                    expect(diagram.nodes.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();
                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Import vsdx file-65', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/LineCallout.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'LineCallout.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });

                    const warnings = await onFileChange({ target: { files: [file] } } as any, 12);
                    expect(diagram.nodes.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
    })
    describe('IMPORT VSDX - EVENT', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip();
                return;
            }
            ele = createElement('div', { id: 'diagramEvent' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: 1500, height: 900,
                diagramImporting: (arg: IImportingEventArgs) => {
                    if (arg.status === 'started') {
                        arg.selectedPage = arg.pages[1];
                    }
                },
            });
            diagram.appendTo('#diagramEvent');
        })

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        async function onFileChange(e: any, pageIndex?: number) {
            const file = e.target.files[0];
            if (!pageIndex) {
                pageIndex = 0;
            }
            return (diagram as Diagram).importFromVisio(file, { pageIndex: pageIndex });
        }

        it('Import vsdx file-Event', (done: DoneFn) => {
            (async () => {
                try {
                    const res = await fetch('/base/spec/diagram/visio/Vsdx/Drawing5.vsdx');
                    const blob = await res.blob();
                    const file = new File([blob], 'Drawing5.vsdx', {
                        type: 'application/vnd.ms-visio.drawing',
                    });
                    const warnings = await onFileChange({ target: { files: [file] } } as any);
                    expect(diagram.nodes.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();
                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
    });
    describe('Export VSDX - 1', () => {

        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramExport' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [{
                    id: 'node1',
                    offsetX: 100,
                    offsetY: 100,
                    height: 100,
                    width: 100,
                    pivot: {
                        x: 0.1
                    },
                    annotations: [{
                        id: 'annot1',
                        content: "offset",
                        constraints: AnnotationConstraints.Interaction,
                        offset: {
                            x: 0.2,
                            y: 0.8
                        },
                        style: {
                            color: 'blue',
                            fontFamily: 'TimesNewRoman',
                            bold: true,
                            italic: true,
                            textDecoration: 'LineThrough',
                            fontSize: 15,
                            opacity: 0.5
                        }
                    }]
                },
                {
                    id: 'node2',
                    offsetX: 300,
                    offsetY: 100,
                    height: 100,
                    width: 100,
                    annotations: [{
                        id: 'annot1',
                        content: "Size",
                        width: 200,
                        height: 200,
                        constraints: AnnotationConstraints.Interaction,
                        style: {
                            color: 'blue',
                            fontFamily: 'TimesNewRoman',
                            bold: true,
                            italic: true,
                            textDecoration: 'Underline',
                            fontSize: 15,
                            opacity: 0.5
                        }
                    }]
                },
                {
                    id: 'node3',
                    offsetX: 500,
                    offsetY: 100,
                    height: 100,
                    width: 100,
                    annotations: [{
                        id: 'annot1',
                        content: "Margin",
                        margin: {
                            top: 50,
                            bottom: 100,
                            left: 20,
                            right: 30
                        },
                        constraints: AnnotationConstraints.Interaction,
                        style: {
                            color: 'blue',
                            fontFamily: 'TimesNewRoman',
                            bold: true,
                            italic: true,
                            textDecoration: 'LineThrough',
                            fontSize: 20,
                            opacity: 0.5
                        }
                    }]
                },
                {
                    id: 'node4',
                    offsetX: 700,
                    offsetY: 100,
                    height: 100,
                    width: 100,
                    annotations: [{
                        id: 'annot1',
                        content: "rotateAngle",
                        constraints: AnnotationConstraints.Interaction,
                        rotateAngle: 75,
                        style: {
                            color: 'blue',
                            fontFamily: 'TimesNewRoman',
                            bold: true,
                            italic: true,
                            textDecoration: 'UnderLine',
                            opacity: 0.5
                        }
                    }]
                },
                {
                    id: 'node5',
                    offsetX: 900,
                    offsetY: 100,
                    height: 100,
                    width: 100,
                    annotations: [{
                        id: 'annot1',
                        content: "Read Only",
                        constraints: AnnotationConstraints.ReadOnly,
                        style: {
                            color: 'blue',
                            fontFamily: 'TimesNewRoman',
                            bold: true,
                            italic: true,
                            textDecoration: 'LineThrough',
                            fontSize: 15,
                            opacity: 0.5,
                        }
                    }]
                },
                {
                    id: 'node6',
                    offsetX: 1100,
                    offsetY: 100,
                    height: 100,
                    width: 100,
                    annotations: [{
                        id: 'annot1',
                        content: "Visibility",
                        visibility: false,
                        constraints: AnnotationConstraints.Interaction,
                        style: {
                            color: 'blue',
                            fontFamily: 'TimesNewRoman',
                            bold: true,
                            textDecoration: 'LineThrough',
                            fontSize: 15,
                            opacity: 0.5,
                        }
                    } as any]
                },
                {
                    id: 'node7',
                    offsetX: 100,
                    offsetY: 300,
                    height: 100,
                    width: 100,
                    annotations: [{
                        id: 'annot1',
                        content: "horizontal right vertical bottom",
                        constraints: AnnotationConstraints.Interaction,
                        horizontalAlignment: 'Right',
                        verticalAlignment: 'Bottom',
                        style: {
                            color: 'blue',
                            fontFamily: 'TimesNewRoman',
                            bold: true,
                            italic: true,
                            textDecoration: 'LineThrough',
                            fontSize: 15,
                            opacity: 0.5,
                        }
                    }]
                },
                {
                    id: 'node8',
                    offsetX: 300,
                    offsetY: 300,
                    height: 100,
                    width: 100,
                    annotations: [{
                        id: 'annot1',
                        content: "horizontal left vertical top",
                        constraints: AnnotationConstraints.Interaction,
                        horizontalAlignment: 'Left',
                        verticalAlignment: 'Top',
                        style: {
                            color: 'blue',
                            fontFamily: 'TimesNewRoman',
                            bold: true,
                            italic: true,
                            textDecoration: 'LineThrough',
                            fontSize: 15,
                            opacity: 0.5,
                        }
                    }]
                },
                {
                    id: 'node9',
                    offsetX: 500,
                    offsetY: 300,
                    height: 100,
                    width: 100,
                    annotations: [{
                        id: 'annot1',
                        content: "horizontal center vertical middle",
                        constraints: AnnotationConstraints.Interaction,
                        horizontalAlignment: 'Center',
                        verticalAlignment: 'Center',
                        style: {
                            color: 'blue',
                            fontFamily: 'TimesNewRoman',
                            bold: true,
                            italic: true,
                            textDecoration: 'LineThrough',
                            fontSize: 15,
                            opacity: 0.5,
                        }
                    }]
                },
                {
                    id: 'node10',
                    offsetX: 700,
                    offsetY: 300,
                    height: 100,
                    width: 100,
                    annotations: [{
                        constraints: AnnotationConstraints.Interaction,
                        hyperlink: {
                            link: 'https://google.com',
                            hyperlinkOpenState: 'NewWindow',
                            content: 'Google',
                            color: 'orange',
                            textDecoration: 'Underline',
                        },
                    }, ]
                },
                {
                    id: 'node11',
                    offsetX: 100,
                    offsetY: 500,
                    height: 100,
                    width: 100,
                    annotations: [{
                        id: 'annot1',
                        content: "Text Alignment Left",
                        constraints: AnnotationConstraints.Interaction,
                        style: {
                            textAlign: 'Left'
                        }
                    }]
                },
                {
                    id: 'node12',
                    offsetX: 300,
                    offsetY: 500,
                    height: 100,
                    width: 100,
                    annotations: [{
                        id: 'annot1',
                        content: "Text Alignment Right",
                        constraints: AnnotationConstraints.Interaction,
                        style: {
                            textAlign: 'Right'
                        }
                    }]
                },
                {
                    id: 'node13',
                    offsetX: 500,
                    offsetY: 500,
                    height: 100,
                    width: 100,
                    annotations: [{
                        id: 'annot1',
                        content: "Text Alignment Center",
                        constraints: AnnotationConstraints.Interaction,
                        style: {
                            textAlign: 'Center'
                        }
                    }]
                },
                {
                    id: 'node14',
                    offsetX: 700,
                    offsetY: 500,
                    height: 100,
                    width: 100,
                    annotations: [{
                        id: 'annot1',
                        content: "Text Alignment Justify",
                        constraints: AnnotationConstraints.Interaction,
                        style: {
                            textAlign: 'Justify'
                        }
                    }]
                },
            ];
            diagram = new Diagram({
                width: 1500, height: 900,
                nodes: nodes
            });
            diagram.appendTo('#diagramExport');
        })
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Export node vsdx file-1', (done: DoneFn) => {
            (async () => {
                try {
                    expect(diagram.nodes.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
    })
    describe('Export VSDX - 2', () => {

        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramExport2' });
            document.body.appendChild(ele);
            let connectors: ConnectorModel[] = [{
                    id: 'connector1',
                    type: 'Straight',
                    sourcePoint: {
                        x: 100,
                        y: 100
                    },
                    targetPoint: {
                        x: 200,
                        y: 200
                    },
                    annotations: [{
                        id: 'annot1',
                        content: "offset",
                        constraints: AnnotationConstraints.Interaction,
                        offset: 0.7,
                        style: {
                            fontFamily: 'Berlin Sans FB Demi',
                            color: 'black',
                            bold: true,
                            italic: true,
                            textDecoration: 'LineThrough',
                            fontSize: 15,
                            opacity: 0.5
                        }
                    }]
                },
                {
                    id: 'connector2',
                    type: 'Straight',
                    sourcePoint: {
                        x: 200,
                        y: 300
                    },
                    targetPoint: {
                        x: 300,
                        y: 400
                    },
                    annotations: [{
                        id: 'annot1',
                        content: "Size",
                        width: 200,
                        height: 200,
                        constraints: AnnotationConstraints.Interaction,
                        style: {
                            color: 'blue',
                            fontFamily: 'TimesNewRoman',
                            bold: true,
                            italic: true,
                            textDecoration: 'Underline',
                            fontSize: 15,
                            opacity: 0.5
                        }
                    }]
                },
                {
                    id: 'connector3',
                    type: 'Straight',
                    sourcePoint: {
                        x: 300,
                        y: 100
                    },
                    targetPoint: {
                        x: 400,
                        y: 200
                    },
                    annotations: [{
                        id: 'annot1',
                        content: "Margin",
                        margin: {
                            top: 50,
                            bottom: 100,
                            left: 20,
                            right: 30
                        },
                        constraints: AnnotationConstraints.Interaction,
                        style: {
                            color: 'blue',
                            fontFamily: 'TimesNewRoman',
                            bold: true,
                            italic: true,
                            textDecoration: 'LineThrough',
                            fontSize: 20,
                            opacity: 0.5
                        }
                    }]
                },
                {
                    id: 'connector4',
                    type: 'Straight',
                    sourcePoint: {
                        x: 400,
                        y: 300
                    },
                    targetPoint: {
                        x: 500,
                        y: 400
                    },
                    annotations: [{
                        id: 'annot1',
                        content: "rotateAngle",
                        constraints: AnnotationConstraints.Interaction,
                        rotateAngle: 75,
                        style: {
                            color: 'blue',
                            fontFamily: 'TimesNewRoman',
                            bold: true,
                            italic: true,
                            textDecoration: 'UnderLine',
                            opacity: 0.5
                        }
                    } as any]
                },
                {
                    id: 'connector5',
                    type: 'Straight',
                    sourcePoint: {
                        x: 500,
                        y: 100
                    },
                    targetPoint: {
                        x: 600,
                        y: 200
                    },
                    annotations: [{
                        id: 'annot1',
                        content: "Read Only",
                        constraints: AnnotationConstraints.ReadOnly,
                        style: {
                            color: 'blue',
                            fontFamily: 'TimesNewRoman',
                            bold: true,
                            italic: true,
                            textDecoration: 'LineThrough',
                            fontSize: 15,
                            opacity: 0.5,
                        }
                    }]
                },
                {
                    id: 'connector6',
                    type: 'Straight',
                    sourcePoint: {
                        x: 600,
                        y: 300
                    },
                    targetPoint: {
                        x: 700,
                        y: 400
                    },
                    annotations: [{
                        id: 'annot1',
                        content: "Visibility",
                        visibility: false,
                        constraints: AnnotationConstraints.Interaction,
                        style: {
                            color: 'blue',
                            fontFamily: 'TimesNewRoman',
                            bold: true,
                            textDecoration: 'LineThrough',
                            fontSize: 15,
                            opacity: 0.5,
                        }
                    }]
                },
                {
                    id: 'connector7',
                    type: 'Straight',
                    sourcePoint: {
                        x: 700,
                        y: 100
                    },
                    targetPoint: {
                        x: 800,
                        y: 200
                    },
                    annotations: [{
                        id: 'annot1',
                        content: "horizontal right vertical bottom",
                        constraints: AnnotationConstraints.Interaction,
                        horizontalAlignment: 'Right',
                        verticalAlignment: 'Bottom',
                        style: {
                            color: 'blue',
                            fontFamily: 'TimesNewRoman',
                            bold: true,
                            italic: true,
                            textDecoration: 'LineThrough',
                            fontSize: 15,
                            opacity: 0.5,
                        }
                    }]
                },
                {
                    id: 'connector8',
                    type: 'Straight',
                    sourcePoint: {
                        x: 800,
                        y: 300
                    },
                    targetPoint: {
                        x: 900,
                        y: 400
                    },
                    annotations: [{
                        id: 'annot1',
                        content: "horizontal left vertical top",
                        constraints: AnnotationConstraints.Interaction,
                        horizontalAlignment: 'Left',
                        verticalAlignment: 'Top',
                        style: {
                            color: 'blue',
                            fontFamily: 'TimesNewRoman',
                            bold: true,
                            italic: true,
                            textDecoration: 'LineThrough',
                            fontSize: 15,
                            opacity: 0.5,
                        }
                    }]
                },
                {
                    id: 'connector9',
                    type: 'Straight',
                    sourcePoint: {
                        x: 900,
                        y: 100
                    },
                    targetPoint: {
                        x: 1000,
                        y: 200
                    },
                    annotations: [{
                        id: 'annot1',
                        content: "horizontal center vertical middle",
                        constraints: AnnotationConstraints.Interaction,
                        horizontalAlignment: 'Center',
                        verticalAlignment: 'Center',
                        style: {
                            color: 'blue',
                            fontFamily: 'TimesNewRoman',
                            bold: true,
                            italic: true,
                            textDecoration: 'LineThrough',
                            fontSize: 15,
                            opacity: 0.5,
                        }
                    }]
                },
                {
                    id: 'connector10',
                    type: 'Straight',
                    sourcePoint: {
                        x: 1000,
                        y: 300
                    },
                    targetPoint: {
                        x: 1100,
                        y: 400
                    },
                    annotations: [{
                        constraints: AnnotationConstraints.Interaction,
                        hyperlink: {
                            link: 'https://google.com',
                            hyperlinkOpenState: 'NewWindow',
                            content: 'Google',
                            color: 'orange',
                            textDecoration: 'Underline',
                        }
                    }]
                },
                {
                    id: 'connector11',
                    type: 'Straight',
                    sourcePoint: {
                        x: 1100,
                        y: 100
                    },
                    targetPoint: {
                        x: 1300,
                        y: 300
                    },
                    annotations: [{
                        id: 'annot1',
                        content: "Segment Angle",
                        constraints: AnnotationConstraints.Interaction,
                        segmentAngle: true,
                        style: {
                            color: 'grey',
                            fontFamily: 'TimesNewRoman',
                            bold: true,
                            italic: true,
                            textDecoration: 'LineThrough',
                            fontSize: 15,
                            opacity: 0.5,
                        }
                    }]
                },
                {
                    id: 'connector12',
                    type: 'Straight',
                    sourcePoint: {
                        x: 100,
                        y: 500
                    },
                    targetPoint: {
                        x: 200,
                        y: 600
                    },
                    annotations: [{
                        id: 'annot1',
                        content: "Text Alignment Left",
                        constraints: AnnotationConstraints.Interaction,
                        style: {
                            textAlign: 'Left'
                        }
                    }]
                },
                {
                    id: 'connector13',
                    type: 'Straight',
                    sourcePoint: {
                        x: 300,
                        y: 500
                    },
                    targetPoint: {
                        x: 400,
                        y: 600
                    },
                    annotations: [{
                        id: 'annot1',
                        content: "Text Alignment Right",
                        constraints: AnnotationConstraints.Interaction,
                        style: {
                            textAlign: 'Right'
                        }
                    }]
                },
                {
                    id: 'connector14',
                    type: 'Straight',
                    sourcePoint: {
                        x: 500,
                        y: 500
                    },
                    targetPoint: {
                        x: 600,
                        y: 600
                    },
                    annotations: [{
                        id: 'annot1',
                        content: "Text Alignment Center",
                        constraints: AnnotationConstraints.Interaction,
                        style: {
                            textAlign: 'Center'
                        }
                    }]
                },
                {
                    id: 'connector15',
                    type: 'Straight',
                    sourcePoint: {
                        x: 700,
                        y: 500
                    },
                    targetPoint: {
                        x: 800,
                        y: 600
                    },
                    annotations: [{
                        id: 'annot1',
                        content: "Text Alignment Justify",
                        constraints: AnnotationConstraints.Interaction,
                        style: {
                            textAlign: 'Justify'
                        }
                    }]
                },
            ];
            diagram = new Diagram({
                width: 1500, height: 900,
                connectors: connectors
            });
            diagram.appendTo('#diagramExport2');
        })
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Export connector vsdx file-1', (done: DoneFn) => {
            (async () => {
                try {
                    expect(diagram.connectors.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();

                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
    })
    describe('Export VSDX - 3', () => {
        let diagram: Diagram;
        let ele: HTMLElement;


        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramImage' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    id: 'image', minWidth: 150, minHeight: 100, offsetX: 700, offsetY: 100, style: { fill: 'red' },
                    shape: { type: 'Image', source: '/base/spec/diagram/visio/images/bike.jpg'}
                },
                {
                    id: 'image2', width: 100, height: 100, offsetX: 300, offsetY: 300,
                    shape: { type: 'Image', source: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANQAAACJCAYAAABUzhYxAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAqgSURBVHhe7Z1bb1PZGYa5bPsLRurhsje96EXvetNf0Ove9S/0H1Sag0bDSGigMAGhQWJAHKqJhikjIBUwDTlB4gQmEU5IgCRAQkKc2E5sJ3aM81XPSs24doAcVrJP7yO9Sry9vfda3/e93gfvvfYhE0J441DzBCHE7pGhhPCIDCWER2QoITwiQwnhERlKCI/IUEJ4RIYSwiMylBAekaGE8IgMJYRHZCghPCJDCeERGUoIj8hQQnhEhhLCIzKUEB6RoYTwiAwlhEdkKCE8IkMJ4REZSgiPyFBCeESGEsIjMpQQHpGhhPCIDCWER2QoITwiQwnhERkqADY2zIqVmmVKVZtZrtqTpYqNLpTtx7k1S82u2t0XJet5VrKu6ZJ1ThWtc4q/m/8zjfeYh3n5DJ9lGSyLZbJs1iEOHhlqH1gu12w6t24P5tacEa6MrdjZBzk7MZC1w90Z+7AzY591L9oXd5fsRH/WTg3m7Kv7eTs7vGLnRlbs/EjBLjws2sV00S6PluzyKH83/2ca7zEP8/IZPssyWBbLZNmsg3WxTtZNG2gLbaJttFH4R4baA/m1mo1nytb9rGTfpFesLZW1T7oy9nnvorWlcq7YL6WL9t3EmnVMVqxrpmr98zX7cdEORKyLdbJu2kBbaBNto420lTbTdvpAX+iT2D0y1DZZrdbs8VLFfcufG87b5z2Ldrhn0U4P5dwW4+qTNet8UbXBVxsthR1W0VbaTNvpA32hT/SNPtJX+kzfxfaQod5Cab3mjk2uPy7YlwObW55TqZz7lr8xWbG+udctBRoX0Tf6SF/pM30nBtcmCi4mxEZsjQzVwPP8uv1navOb+uM7GTs9lLf2R6v2w/P1lqJLmogBsSAmm7HJuVgRM/ETiTcUuzRXxwt2pHfJjvVn3UH/zWkZ6H0iRsSKmBE7Ykgsk04iDcVZru8nCna4e9G+HMhZ+6OSdc9WW4pG2p6IHTEklsSU2BLjJJIYQxUqNff7zfH+rPtW/edoyXpfxvc4KCgRU2JLjIk1MSf2SSH2hprOr1t7etk+upOxr4dX7NYz7c4dlIg1MSf25IBcxJ3YGiq9ULYz9/N29F7W2sdKNrgQndPZcROxJwfkgpyQm7gSO0MNz69Z20DW2gZydu1puSW5UrAiJ+SGHJGruBEbQ/H7CJffnEzlrGOq0pJIKVwiR+SKnJG7uBB5Q80sr9v54WV3AHxdW6TIiZyRO3JILqNOZA31esOs40nRPu3K2Lfjqy2JkqIlckguySm5jSqRNNRYpmxH7y7ZuZGCDUTo2jnp3SKX5JTckuMoEjlDcT3Zkb4luzGp3bu4itySY3IdNSJjqPlC1U6lsu72g6GMtkpxFzkm1+Sc3EeFSBjq4auyuyDzio6VEidyTu6pgSgQekP1Pl919+foCofkitxTA9RC2Am1oW49Ldrx/pz1vTy4u1ylcIoaoBaoiTATWkN1PCnYyVQ+UnfASvsraoGaoDbCSigNdXuyaG2DObufaQ2qlGxRE9QGNRJGQmcohsc6PpC1lLZM0ltEbVAj1ErYCJWhHi1W3BBYPbO6T0l6t6gRaoWaCROhMRTjxHG35791Yau0TVEr1EyYxhgMjaEujeTdnZ7NQZOkd4maoXbCQigMxXDCDFPVHCxJ2o5c7cyF496qUBjqi75FuzmtXT1pd6J2qKEwELih7s2s2pkHyy1BkqSdiBqiloImcEP9417WbmsgSWmPooaopaAJ1FA8goWx3JqDI0m7EbVETQVJoIb616MVN0Bic2CSoD//5a926NCh/9PPfv4Lu3h7sGXenYjl/u3vn7VMT4KoJWoqSAI1FM8y6p5J5o+4FD5qnIYR/vDHP1nfs0LL/NtVkg1FLVFTQRKYodwPuT2LLUFJirYyFFun3/7u93Yr/fLNa7ZabL0++NVv3kxHxy5cfbNlq5sQI9WnJdVU1FSQP/QGZigGlmcIqeaAJEVbGapxC4V5MFHdGMxbf69uNEzFa6bXl5XkLRSipoJ8aEFghhqcXXUDcjQHJCna6hiqcSu01dbqg1/+2v3FSI27hryufzbphqKmqK2gCMxQPILy4sNiS0CSosYtVH0r02iERpPwmr8YDEM1H2s1mi/phqKmqK2gCMxQPKzrcjqZZ/hQ8y5f425c/bW2UDsXNUVtBUVghtIWSsdQ+6HEbqF0DNVqqGYT7fQsH9PrZ/qSaqrEHkMl/SyftD9K7Fm+pP8OJe2PEvs7FCT5SgnJvxJ9pQQk+Vo+yb8Sfy2frjaXfCrxV5uD7oeSfEj3Q/0P3bEr+ZDu2G1AY0pIe5HGlGhCox5Je5FGPdoCjcsn7UYal+8taORYaafSyLHvQWObS9uVxjbfJnr6hvQ+6ekbO0TPh5LeJj0fapfoCYZSs/QEwz2iZ+xKdekZu57QU+AlPQXeMw9fle3jOxm7Mr7aEmwp3iLn5J4aiAKRMBTMF6p2KpW1s8MrNpTRcVXcRY7JNTkn91EhMoaqc22iYEf6luzGZLklCVI8RG7JMbmOGpEzFIxlynb07pIbkGNAZwFjI3JJTsktOY4ikTQUvN7g1HrRPu3K2Lc6toq8yCG5JKfkNqpE1lB1ZpbX7fzwsh3vz9r1p9oNjJrIGbkjh+Qy6kTeUHVGF8puCKmTqZx16ALb0IsckStyRu7iQmwMVWd4fs3aBrLWNpCza9pihU7khNyQI3IVN2JnqDrphbKduZ+3o/ey1j5WssEFnbwISsSeHJALckJu4kpsDVVnOr9u7ell++hOxr4eXtEVFwcoYk3MiT05IBdxJ/aGqlOo1KznWckdAB/rz7o7PXtf6r4r3yKmxJYYE2tiTuyTQmIM1ch0bt2+nyi4uz0Zj4ABErtnqy3FIW1PxI4YMi4eMSW2xDiJJNJQjTCw/NXxgh3pXXLfqhfTRbs5rd3C94kYEStiRuyIYZCD9IeFxBuqkef5dfewrtNDOXdB5umhvLU/WrUfNBCniwGxICabscm5WBEz8RMy1Fsordfc7yNcT8Zu4SddGTuVytmldNFuTFasby6+x1/0jT7SV/pM34nB9ccFFxNiI7ZGhtomq9Wa26XpnCrZueG8uz+HR6fwTX3hYdGuPlmzzhfVSN1hTFtpM22nD/SFPtE3+khf6TN9F9tDhtoD+bWajWfK7hGU36RXrC21uSX7vHfR2lI5d/sB3/LfTaxZx2TFumaq1j9/cHcfsy7WybppA22hTbSNNtJW2kzb6QN9oU9i98hQ+wDjxHGW68HcmvuWvzK2Ymcf5OzEQNYOd2fsw86MGwKLZxmd6M+6y2++up93xX5uZMXOjxTcFoOD/sujJbs8yt/N/5nGe8zDvHyGz7IMlsUyWTbrYF2sk3XTBtpCm2hbmMayixMyVABsbJgVKzXLlKo2s1x1j2Dh2IThhFOzq254LH6/6ZouWedU0RlhU0U3jfeYh3n5DJ9lGSyLZbJs1iEOHhlKCI/IUEJ4RIYSwiMylBAekaGE8IgMJYRHZCghPCJDCeERGUoIj8hQQnhEhhLCIzKUEB6RoYTwiAwlhEdkKCE8IkMJ4REZSgiPyFBCeESGEsIjMpQQHpGhhPCIDCWER2QoITwiQwnhERlKCI/IUEJ4RIYSwiMylBAekaGE8IgMJYRH/gvGwmPrAVQNbgAAAABJRU5ErkJggg==" }
                }
            ];
            diagram = new Diagram({ width: 400, height: 400, nodes: nodes });
            diagram.appendTo('#diagramImage');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
            (diagram as any) = null; (ele as any) = null;
        });

        it('Export image vsdx file-1', (done: DoneFn) => {
            (async () => {
                try {
                    expect(diagram.nodes.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();
                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Export image vsdx file-2 with file name and page name', (done: DoneFn) => {
            (async () => {
                try {
                    expect(diagram.nodes.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio({fileName:'image.vsdx', pageName:'image'});
                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
    });
    describe('Export VSDX - 4', () => {
        let diagram: Diagram;
        let ele: HTMLElement;


        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramGroup' });
            document.body.appendChild(ele);
            let shadow1: ShadowModel = { angle: 135 };
            let nodes: NodeModel[] = [
                {
                    id: 'node1', width: 50, height: 50, offsetX: 100,
                    offsetY: 100, shadow: shadow1, constraints: NodeConstraints.Default | NodeConstraints.Shadow
                }, {
                    id: 'node2', width: 50, height: 50, offsetX: 200,
                    offsetY: 200
                },
                { id: 'group', children: ['node1', 'node2', 'connector1'] },
            ];
            let connectors: ConnectorModel[] = [
                {
                    id: 'connector1',
                    type: 'Straight',
                    sourcePoint: { x: 100, y: 100 },
                    targetPoint: { x: 200, y: 200 }
                },
                {
                    id: 'connector2', type: 'Straight', sourcePoint: { x: 100, y: 300 }, targetPoint: { x: 200, y: 400 },
                    segments: [
                        {
                            type: 'Straight',
                            point: { x: 100, y: 350 },
                        },
                        {
                            type: 'Straight',
                            point: { x: 100, y: 380 },
                        }
                    ],
                    constraints: ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb
                }
            ];
            diagram = new Diagram({ width: 400, height: 400, nodes: nodes, connectors: connectors, backgroundColor: 'brown' });
            diagram.appendTo('#diagramGroup');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
            (diagram as any) = null; (ele as any) = null;
        });

        it('Export Group vsdx file-1', (done: DoneFn) => {
            (async () => {
                try {
                    expect(diagram.nodes.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();
                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
        it('Export Group vsdx file-2 with file name and page name', (done: DoneFn) => {
            (async () => {
                try {
                    expect(diagram.nodes.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio({fileName:'Group.vsdx', pageName:'Group'});
                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
    });
    describe('Export VSDX - 5', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramAnnotation' });
            document.body.appendChild(ele);

            const nodes: NodeModel[] = [
                {
                    id: 'node1',
                    offsetX: 150,
                    offsetY: 150,
                    width: 120,
                    height: 60,
                    shape: {
                        type: 'Image',
                        source: 'https://cdn.syncfusion.com/content/identity/login_logo.svg'
                    },
                    annotations: [
                        {
                            id: 'anno1',
                            content: 'Hyperlink text',
                            offset: { x: 0.5, y: 1 },
                            horizontalAlignment: 'Right',
                            style: {bold: true, textDecoration: 'Underline' },
                            hyperlink: { content: 'https://www.syncfusion.com' },
                        },
                        {
                            id: 'anno2',
                            content: 'Underlined text',
                            offset: { x: 0.5, y: 0 },
                            horizontalAlignment: 'Left',
                            style: { textDecoration: 'Underline', italic: true, fontFamily: 'Arial' }
                        },
                        {
                            id: 'anno2',
                            content: 'Line-through text',
                            offset: { x: 0.5, y: 0.5 },
                            style: { textDecoration: 'LineThrough', fontSize: 12 }
                        }
                    ]
                }
            ];

            const connectors: ConnectorModel[] = [
                {
                    id: 'connector1',
                    type: 'Straight',
                    sourcePoint: { x: 100, y: 100 },
                    targetPoint: { x: 300, y: 100 },
                    annotations: [
                        {
                            id: 'connAnno1',
                            content: 'Connector hyperlink text',
                            horizontalAlignment: 'Left',
                            style: {textDecoration: 'Underline', fontFamily: 'Arial', bold: true, italic: true, fontSize: 12 },
                            hyperlink: { content: 'https://www.syncfusion.com' }
                        }
                    ],
                    ports: [
                        {
                            id: 'portLeft',
                            offset: 0,
                            horizontalAlignment: 'Left'
                        },
                        {
                            id: 'portRight',
                            offset: 1,
                            horizontalAlignment: 'Right'
                        }
                    ]
                }
            ];

            diagram = new Diagram({
                width: 400,
                height: 400,
                nodes: nodes,
                connectors: connectors,
                pageSettings: {
                    width: 800,
                    height: 600,
                    orientation: 'Portrait'
                },
                backgroundColor: 'white'
            });
            diagram.appendTo('#diagramAnnotation');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
            (diagram as any) = null;
            (ele as any) = null;
        });

        it('Export vsdx with annotation styling and hyperlink', (done: DoneFn) => {
            (async () => {
                try {
                    expect(diagram.nodes.length).toBeGreaterThan(0);
                    (diagram as Diagram).exportToVisio();
                    done();
                } catch (err) {
                    done.fail(err as Error);
                }
            })();
        });
    });
});