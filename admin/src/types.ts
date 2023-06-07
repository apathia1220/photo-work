export interface ITableDataItem {
  id: number;
  photoOrder: number;
  photoSrc: string;
  status: number;
  isTop: number;
}

export interface IPhotoOrderItem {
  id: number | string;
  photoOrder: number;
}
