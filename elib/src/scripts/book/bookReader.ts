import ePub from 'epubjs';

export class BookReader {
  private rendition: ePub.Rendition | null;
  private isReady: boolean;
  private book: ePub.Book;

  constructor(bookPath: string) {
    console.log('[Constructor] Initializing with book path:', bookPath);
    this.book = ePub(bookPath);
    this.rendition = null;
    this.isReady = false;

    this.book.on('error', (error: unknown) => {
      console.error('[Book Error]', error);
    });
  }

  async init() {
    try {
      console.log('[Init] Starting initialization...');
      await this.book.ready;
      console.log('[Init] Book metadata:', (this.book as any).metadata);
      console.log('[Init] Creating rendition...');
      this.rendition = this.book.renderTo('area', {
        allowScriptedContent: true,
        height: '100%',
        spread: 'none',
        width: '100%',
      });

      console.log('[Init] Displaying content...');
      await this.rendition.display();

      this.isReady = true;
      console.log('[Init] Rendition ready:', this.rendition);
      console.log('[Init] Current location:', this.rendition.currentLocation());
    } catch (error) {
      console.error('[Init Error]', error);
      throw error;
    }
  }

  async prevPage() {
    console.log('[Navigation] Attempting previous page...');

    if (!this.isReady) {
      console.warn('[Navigation] Reader not ready!');

      return;
    }

    try {
      await this.rendition?.prev();
      console.log(
        '[Navigation] New location:',
        this.rendition?.currentLocation(),
      );
    } catch (error) {
      console.error('[Navigation Error]', error);
    }
  }

  async nextPage() {
    console.log('[Navigation] Attempting next page...');

    if (!this.isReady) {
      console.warn('[Navigation] Reader not ready!');

      return;
    }

    try {
      await this.rendition?.next();
      console.log(
        '[Navigation] New location:',
        this.rendition?.currentLocation(),
      );
    } catch (error) {
      console.error('[Navigation Error]', error);
    }
  }
}
