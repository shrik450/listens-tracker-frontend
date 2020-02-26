import { FastJsonResponseData } from "./FastJsonResponseData";

export class FastJsonResponseObject<ResponseType> {
  data: FastJsonResponseData<ResponseType>;

  constructor(data: FastJsonResponseData<ResponseType>) {
    this.data = data;
  }
}
