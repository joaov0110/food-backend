export interface IgetCatalog {
  id: number;
  name: string;
}

export interface IcreateCatalog {
  name: string;
  created_at: Date;
}

export interface IcreateCatalogRequest
  extends Omit<IcreateCatalog, 'created_at'> {
  point_id: string;
}

export const catalogDataToSelect = {
  id: true,
  name: true,
  created_at: true,
  updated_at: true,
};
