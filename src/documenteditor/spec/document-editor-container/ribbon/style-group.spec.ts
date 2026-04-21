import { createElement } from '@syncfusion/ej2-base';
import { DocumentEditorContainer } from '../../../src/document-editor-container/document-editor-container';
import { Ribbon } from '../../../src/document-editor-container/ribbon/ribbon';

describe('Ribbon gallery validation', () => {
  let container:DocumentEditorContainer;
  let containerElement:HTMLElement;

  beforeAll(() => {
    // Create container div for the document editor
    containerElement = document.createElement('div') as any;
    containerElement.id = 'ribbon';
    document.body.appendChild(containerElement);

    // Initialize the DocumentEditorContainer
    DocumentEditorContainer.Inject(Ribbon);
    container = new DocumentEditorContainer({ 
      height: "590px", 
      toolbarMode: 'Ribbon', 
      ribbonLayout: 'Classic' 
    });
    container.serviceUrl = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';
    container.appendTo('#ribbon') as any;
  });

  afterAll(() => {
    // Clean up
    if (container) {
      container.destroy();
      container = null;
    }
    if (containerElement) {
      document.body.removeChild(containerElement);
    }
  });
  it('style item contains title attribute or not', () => {
    const ribbonGalleryStyle = document.querySelectorAll('.e-ribbon-gallery-item');
    expect((ribbonGalleryStyle[0] as any).title).toBe('Normal');
    expect((ribbonGalleryStyle[1] as any).title).toBe('Heading 1');
  });
});