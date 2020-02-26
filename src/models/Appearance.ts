import { Host } from "./Host";

export class Appearance {
  constructor(
    public id: number,
    public name: string,
    public speaking_time: number | undefined
  ) {}
}
