import React from 'react';
import { ListView } from '../features/ListView/ListView';
import { useElibStore, type Store } from '../../store/store';
import { z } from 'zod';
import { AdminForm } from '../features/AdminForm/AdminForm';
import type { Book, Certificate } from '../../types';
import { Button } from '../ui/Button';
import { UiButton } from '../ui';

const optionVariants = z.object({
  value: z.enum(['books', 'certificates']),
});

type OptionVariants = z.infer<typeof optionVariants>['value'];

export const AdminPage = (): React.JSX.Element => {
  const [currentList, setCurrentList] = React.useState<OptionVariants>(
    () => 'books',
  );
  const [selectedItem, setSelectedItem] = React.useState<Book | Certificate>();
  const [loading, setLoading] = React.useState<boolean>(() => true);

  const books = useElibStore((state: Store) => state.books);
  const certificates = useElibStore((state: Store) => state.certificates);

  const getBoth = useElibStore((state: Store) => state.getBoth);

  const deleteBook = useElibStore((state: Store) => state.removeBook);

  const deleteCertificate = useElibStore(
    (state: Store) => state.removeCertificate,
  );

  React.useEffect(() => {
    console.log('AdminPage: Loading data');
    setLoading(true);

    const loadData = async () => {
      try {
        await getBoth();
      } catch (error) {
        console.error('AdminPage: Error loading data', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [getBoth]);

  const handleListChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (optionVariants.safeParse({ value: e.target.value }).success) {
      setCurrentList(e.target.value as OptionVariants);
    }
  };

  const handleCreateItem = () => {
    console.log('click create');
    setSelectedItem(undefined);
  };

  const onItemClick = (id: number) => {
    console.log('click item', id);
    switch (currentList) {
      case 'books': {
        const book = books.find((b: Book) => b.id === id);
        setSelectedItem(book);
        break;
      }
      case 'certificates': {
        const certificate = certificates.find((c: Certificate) => c.id === id);
        setSelectedItem(certificate);
        break;
      }
      default:
        break;
    }
  };

  const handleDeleteItem = (id: number) => {
    console.log('click delete', id);
    switch (currentList) {
      case 'books': {
        deleteBook(id);
        break;
      }
      case 'certificates': {
        deleteCertificate(id);
        break;
      }
      default:
        break;
    }
  };

  return (
    <main className="flex-1 flex flex-col">
      {loading ? (
        <div className="flex items-center justify-center w-full h-full flex-1">
          <p className="text-xl">Загрузка данных...</p>
        </div>
      ) : (
        <div className="flex flex-1">
          <section className="border-r px-1 py-3 w-3/12">
            <select
              onChange={handleListChange}
              className="border flex flex-column w-full transition p-2 mb-4"
              value={currentList}
            >
              <option value="books">Книги ({books?.length || 0})</option>
              <option value="certificates">
                Сертификаты ({certificates?.length || 0})
              </option>
            </select>
            <ListView
              items={currentList === 'books' ? books : certificates}
              onItemClick={onItemClick}
              selectedId={selectedItem?.id}
              handleDeleteItem={handleDeleteItem}
            />
            <Button className="px-4 py-3" onClick={handleCreateItem}>
              Создать
            </Button>
          </section>
          <section className="flex-1 flex justify-center items-center">
            <AdminForm currentList={currentList} initialValue={selectedItem} />
            <UiButton className="bg-orange-400 border p-10 rounded" onclick={() => console.log('clicked')}>Кнопка на Svelte</UiButton>
          </section>
        </div>
      )}
    </main>
  );
};

export default AdminPage;
