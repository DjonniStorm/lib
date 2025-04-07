import './components/admin/controller';

document.addEventListener('DOMContentLoaded', () => {
  const main = document.querySelector('main');

  main?.appendChild(document.createElement('admin-controller'));
});
