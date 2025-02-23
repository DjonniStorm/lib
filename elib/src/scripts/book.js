import ePub from 'epubjs';

class BookReader {
  constructor(bookPath) {
    console.log('[Constructor] Initializing with book path:', bookPath);
    this.book = ePub(bookPath);
    this.rendition = null;
    this.isReady = false;

    this.book.on('error', error => {
      console.error('[Book Error]', error);
    });
  }

  async init() {
    try {
      console.log('[Init] Starting initialization...');
      await this.book.ready;
      console.log('[Init] Book metadata:', this.book.metadata);
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
      await this.rendition.prev();
      console.log(
        '[Navigation] New location:',
        this.rendition.currentLocation(),
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
      await this.rendition.next();
      console.log(
        '[Navigation] New location:',
        this.rendition.currentLocation(),
      );
    } catch (error) {
      console.error('[Navigation Error]', error);
    }
  }
}

// Инициализация
let reader = null;

document.addEventListener('DOMContentLoaded', async () => {
  console.log('[DOM] Content loaded');

  try {
    const params = new URLSearchParams(window.location.search);
    const bookPath = params.get('book');

    console.log('[DOM] Book path from URL:', bookPath);

    if (!bookPath) {
      throw new Error('Add ?book= parameter to URL');
    }

    reader = new BookReader(bookPath.replace('-', '').concat('.epub'));
    console.log('[DOM] Reader instance created');

    await reader.init();
    console.log('[DOM] Reader initialization completed');
  } catch (error) {
    console.error('[DOM Error]', error);
    alert(`Fatal error: ${error.message}`);
  }
});

const [next, prev] = document.querySelectorAll('button');

next.addEventListener('click', async () => {
  console.log('[UI] Prev button clicked');
  await reader?.prevPage();
});

prev.addEventListener('click', async () => {
  console.log('[UI] Next button clicked');
  await reader?.nextPage();
});
