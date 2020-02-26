export class FastJsonResponseData<ResponseType> {
  attributes: ResponseType;
  id: number;
  type: string;

  constructor(attributes: ResponseType, id: number, type: string) {
    this.attributes = attributes;
    this.id = id;
    this.type = type;
  }
}
