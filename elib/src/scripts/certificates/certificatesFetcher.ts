import { getCertificates } from '../api/api';

document.addEventListener('DOMContentLoaded', async () => {
  const certificates = await getCertificates();

  console.log(certificates, Object.keys(certificates).length);

  if (!certificates || Object.keys(certificates).length === 0) {
    console.warn('Книги не найдены');

    return;
  }

  const container = document.querySelector('#certificates-list');

  Object.entries(certificates).forEach(([, data]) => {
    const certificatesContainer = document.createElement('section');

    certificatesContainer.innerHTML = `
      <section class="col d-flex justify-content-center border rounded p-4">
          <div class="d-flex justify-content-center">
            <img
              class="w-100"
              src="${data.img}"
              alt="banner logo"
            />
          </div>
          <div
            class="d-flex flex-column gap-2 align-items-center justify-content-center"
          >
            <h3 class="text-center">${data.name}</h3>
            <span class="text-center"
  >${data.text}</span
            >
            <button type="button" class="btn-primary">Купить</button>
          </div>
        </section>
    `;

    container?.appendChild(certificatesContainer);
  });
});
