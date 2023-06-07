import axios from "axios";
import { IPhotoOrderItem } from "../types";

const instance = axios.create({
  baseURL: "/api",
});

export const getPhotoList = (size: number, current: number) => {
  return instance.get(`/photos/all?size=${size}&current=${current}`);
};

export const updateTopPhoto = (id: number) => {
  return instance.post(
    "/photos/top",
    { id, isTop: 1 },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const updatePhotoStatus = (id: number, status: number) => {
  return instance.post(
    "/photos/review",
    { id, status },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const updatePhotoOrder = async (photoItem: IPhotoOrderItem[]) => {
  return instance.put(
    "/photos/update",
    { photos: photoItem },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const deletePhotos = async (ids: number[]) => {
  return instance.delete("/photos/del", { data: ids });
};
