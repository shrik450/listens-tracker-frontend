import React, { Fragment } from "react";
import { ListGroup, Button } from "react-bootstrap";
import axios from "axios";

import { Episode } from "../models/Episode";
import "./EpisodeLine.css";
import { Appearance } from "../models/Appearance";
import { AppearanceLine } from "./AppearanceLine";
import { BACKEND_API_URL } from "../constants/BackendConstants";
import { FastJsonResponseArray } from "../models/FastJsonResponseArray";
import Octicon, { Plus } from "@primer/octicons-react";

export class EpisodeLine extends React.Component<
  EpisodeLineProps,
  EpisodeLineState
> {
  constructor(props: EpisodeLineProps) {
    super(props);
    this.state = new EpisodeLineState(false);
  }

  render() {
    let actions;

    if (this.state.showPlayer) {
      actions = (
        <audio className="audio-player" controls>
          <source src={this.props.episode.url} />
        </audio>
      );
    } else {
      actions = (
        <Button onClick={() => this.handlePlayClicked()} variant="dark">
          Play
        </Button>
      );
    }

    let countString;
    const timesPlayed = this.props.episode.number_of_times_played;
    const lastPlayed = new Date(this.props.episode.last_played_at);
    if (timesPlayed > 1) {
      countString = `Played ${timesPlayed} times, last on: ${lastPlayed.toLocaleDateString()}`;
    } else if (timesPlayed) {
      countString = `Played once, on: ${lastPlayed.toLocaleDateString()}`;
    } else {
      countString = `Never Played.`;
    }

    const addButton = (
      <ListGroup.Item key={-1} className="appearance-add-button-container">
        <Button variant="outline-dark" className="appearance-add-button">
          <Octicon icon={Plus} />
        </Button>
      </ListGroup.Item>
    );

    return (
      <Fragment>
        <ListGroup.Item key={this.props.episode.id}>
          <p>
            {this.props.episode.number} | {this.props.episode.name}
          </p>
          <div className="appearances">
            <ListGroup>
              {this.state.appearances?.map((appearance, index) => {
                return (
                  <ListGroup.Item key={index}>
                    <AppearanceLine
                      appearance={appearance}
                      deleteHandler={this.deleteAppearanceFor(index)}
                    />
                  </ListGroup.Item>
                );
              })}
              {addButton}
            </ListGroup>
          </div>
          <p
            dangerouslySetInnerHTML={{ __html: this.props.episode.show_notes }}
          ></p>
          <p>{countString}</p>
          <hr />
          <div className="d-flex flex-row-reverse">{actions}</div>
        </ListGroup.Item>
      </Fragment>
    );
  }

  handlePlayClicked() {
    this.setState((prevState: EpisodeLineState) => {
      return { ...prevState, showPlayer: true };
    });
  }

  addAppearanceClicked() {
    this.setState((prevState: EpisodeLineState) => {
      return { ...prevState, addingAppearance: true };
    });
  }

  componentDidMount() {
    const episode_url = BACKEND_API_URL + "/episodes/" + this.props.episode.id;
    axios
      .get<FastJsonResponseArray<Appearance>>(episode_url + "/appearances/")
      .then(response =>
        this.setState(prevState => {
          const appearances = response.data.data.map(
            appearance => appearance.attributes
          );
          return { ...prevState, appearances: appearances };
        })
      );
  }

  deleteAppearanceFor(index: number): () => void {
    return () => {
      const id = this.state.appearances![index].id;
      axios.delete(BACKEND_API_URL + "/appearances/" + id).then(() => {
        this.setState((prevState: EpisodeLineState) => {
          const appearances = prevState.appearances;
          appearances!.splice(index, 1);
          return { ...prevState, appearances: appearances };
        });
      });
    };
  }
}

export class EpisodeLineProps {
  constructor(public episode: Episode) {}
}

export class EpisodeLineState {
  constructor(
    public showPlayer?: boolean,
    public appearances?: Appearance[],
    public addingAppearance?: boolean
  ) {}
}
