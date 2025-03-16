const bookForm = document.getElementById('bookForm') as HTMLFormElement | null;

const handleAddBook = async (event: SubmitEvent) => {
  event.preventDefault();

  if (!bookForm) {
    console.error('Book form not found');

    return;
  }

  const formData = new FormData(bookForm);
  const file = formData.get('file') as File;
  const poster = formData.get('poster') as File;

  console.log(Object.fromEntries(formData));

  if (!file.name.endsWith('.epub')) {
    alert('Пожалуйста, загрузите файл в формате EPUB');

    return;
  }

  if (!(poster.name.endsWith('.jpg') || poster.name.endsWith('.png'))) {
    alert('Пожалуйста, загрузите обложку в формате JPG или PNG');

    return;
  }

  const response = await fetch('http://localhost:3000/add-book', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    console.warn('Ошибка при загрузке книги', await response.text());

    return;
  }

  console.log('Книга успешно загружена', await response.json());

  alert('Книга успешно загружена');
};

bookForm?.addEventListener('submit', handleAddBook);
