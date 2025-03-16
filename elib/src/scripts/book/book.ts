import { BookReader } from './bookReader';

let reader: BookReader | null = null;

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
  }
});

const [next, prev] = document.querySelectorAll('button');

next?.addEventListener('click', async () => {
  console.log('[UI] Prev button clicked');
  await reader?.prevPage();
});

prev?.addEventListener('click', async () => {
  console.log('[UI] Next button clicked');
  await reader?.nextPage();
});
