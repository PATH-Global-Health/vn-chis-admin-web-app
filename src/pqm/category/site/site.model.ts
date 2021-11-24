export interface Site {
  id: string;
  code: string;
  name: string;
  order: number;
  lat?: number;
  lng?: number;
  districtId: string;
  siteTypeId: string;
  dateCreated?: Date;
  dateUpdated?: Date;
  createdBy?: string;
}

export type SiteCM = Omit<
  Site,
  'id' | 'dateCreated' | 'dateUpdated' | 'createdBy'
>;

export type SiteUM = Omit<Site, 'dateCreated' | 'dateUpdated' | 'createdBy'>;

export type SiteDM = Omit<Site, 'dateCreated' | 'dateUpdated' | 'createdBy'>;

export interface SiteByCode {
  total: number;
  pageCount: number;
  data: Site[];
}
