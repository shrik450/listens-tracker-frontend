export class Episode {
  constructor(
    public id: number,
    public number: string,
    public name: string,
    public show_notes: string,
    public comments: string,
    public url: string,
    public air_date: Date,
    public duration: number,
    public last_played_at: Date,
    public number_of_times_played: number
  ) {}
}
