import React from 'react';
import { useElibStore } from '../../store/store';
import { CertificateCard } from '../features/CertificateCard/CertificateCard';

export const CertificatesPage = (): React.JSX.Element => {
  const { certificates, addCertificates } = useElibStore();

  React.useEffect(() => {
    if (certificates.length === 0) {
      addCertificates();
    }
  }, [certificates, addCertificates]);

  return (
    <main className="flex-1 p-5">
      <div className="flex justify-center p-4">
        <div className="flex items-center justify-between border rounded p-5">
          <h2 className="text-center text-4xl">Дарите знания!</h2>
          <div className="overflow-hidden">
            <img
              className="w-full"
              src="/images/posters/book-present.svg"
              alt="banner logo"
            />
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4 p-4">
        {certificates.map(certificate => (
          <CertificateCard
            key={certificate.id}
            name={certificate.name}
            text={certificate.text}
            img={certificate.img}
          />
        ))}
      </div>
    </main>
  );
};
