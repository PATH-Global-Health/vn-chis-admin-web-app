export interface SiteType {
  id: string;
  name: string;
  createdBy: string;
}

export type SiteTypeCM = Omit<SiteType, 'id'>;

export type SiteTypeUM = SiteType;

export type SiteTypeDM = SiteType;
