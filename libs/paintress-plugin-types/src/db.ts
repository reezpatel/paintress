import { Kysely } from 'kysely';

export type Shape = {
  id: string;
  name: string;

  columns: Array<{
    id: Omit<string, 'id'>;
    name: string;
    type: 'integer' | 'real' | 'text' | 'blob';
    metadata: Record<string, unknown>;
    deleted: boolean;
  }>;

  deleted: boolean;
};

export interface PaintressDB {
  getShapes: () => Promise<Shape[]>;
  registerShape: (shape: Shape) => Promise<void>;
  getShapeById: (id: string) => Promise<Shape | undefined>;
  selectFrom: (id: string) => Kysely<Shape>['selectFrom'];
  insertInto: (id: string) => Kysely<Shape>['insertInto'];
  deleteFrom: (id: string) => Kysely<Shape>['deleteFrom'];
}
