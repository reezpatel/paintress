import { Paginated } from './common.js';

export type Blob = {
  id: string;
  namespace: string;
  originalName: string;
  size: number;
  mimeType: string;
  createdAt: Date;
  updatedAt: Date;
  metadata: Record<string, string>;
};

export interface PaintressBlob {
  getBlob: (id: string) => Promise<Blob>;
  getBlobs: (namespace?: string) => Promise<Paginated<Blob[]>>;
  createResourceUrl: (id: string) => Promise<string>;
}
