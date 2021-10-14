export interface Part {
  id: string;
  order: number;
  type: number;
  content: string;
  isNew?: boolean;
  isEdited?: boolean;
  isDeleted?: boolean;
}

export type PartUM = Part;

export type PartDM = Part;
