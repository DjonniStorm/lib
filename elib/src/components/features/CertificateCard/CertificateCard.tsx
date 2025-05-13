import React from 'react';

type CertificateCardProps = Omit<Certificate, 'id'>;

export const CertificateCard = ({
  img,
  text,
  name,
}: CertificateCardProps): React.JSX.Element => {
  return (
    <section className="flex justify-center border rounded p-4 lg:min-h-[300px]">
      <div className="flex justify-center">
        <img src={img} alt={img + ' logo'} className="w-full" />
      </div>
      <div className="flex flex-col justify-between items-center gap-2">
        <h3 className="text-center">{name}</h3>
        <span>{text}</span>
        <button className="btn-primary">Купить</button>
      </div>
    </section>
  );
};
