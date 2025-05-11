import type { StateCreator } from 'zustand';
import type { Certificate } from '../../types';
import { devtools } from 'zustand/middleware';
import { Store } from '../store';
import {
  getCertificates,
  postCertificate,
  deleteCertificate,
  updateCertificate,
} from '../../api/api';

export type CertificatesSlice = {
  certificates: Certificate[];
  fetchCertificates: () => Promise<void>;
  addCertificate: (certificate: FormData) => Promise<Certificate>;
  updateCertificate: (id: number, certificate: FormData) => Promise<void>;
  removeCertificate: (id: string) => Promise<void>;
};

export const createCertificatesSlice: StateCreator<
  Store,
  [],
  [['zustand/devtools', never]],
  CertificatesSlice
> = devtools(
  set => ({
    certificates: [],
    fetchCertificates: async () => {
      const data = await getCertificates();
      set({ certificates: data });
    },
    addCertificate: async (certificate: FormData) => {
      const newCertificate = await postCertificate(certificate);
      set(state => ({
        certificates: [...state.certificates, newCertificate],
      }));
      return newCertificate;
    },
    updateCertificate: async (id: number, certificate: FormData) => {
      const data = await updateCertificate(certificate);
      set(state => ({
        certificates: state.certificates.map(c => (c.id === id ? data : c)),
      }));
    },
    removeCertificate: async (id: string) => {
      set(state => ({
        certificates: state.certificates.filter(c => c.id !== +id),
      }));
      await deleteCertificate(id);
    },
  }),
  {
    name: 'certificates-slice',
  },
);
