export class Feed {
  id: number;
  name: string;
  feed_url: string;

  constructor(id: number, name: string, feed_url: string) {
    this.id = id;
    this.name = name;
    this.feed_url = feed_url;
  }
}
