import React, { Fragment } from 'react';
import { ListGroup, Button } from 'react-bootstrap';

import { Episode } from '../models/Episode';
import './EpisodeLine.css';

export class EpisodeLine extends React.Component<EpisodeLineProps, EpisodeLineState> {
  constructor(props: EpisodeLineProps) {
    super(props);
    this.state = new EpisodeLineState(false);
  }

  render() {
    let actions;

    if(this.state.showPlayer) {
      actions = <audio className="audio-player" controls>
          <source src={ this.props.episode.url } />
        </audio>
    } else {
      actions = <Button onClick={() => this.handlePlayClicked()} variant="dark">Play</Button>
    };

    return (
      <Fragment>
        <ListGroup.Item key={this.props.episode.id}>
          <p>{ this.props.episode.number } | { this.props.episode.name }</p>
          <p dangerouslySetInnerHTML={{ __html: this.props.episode.show_notes }}></p>
          <hr />
          <div className="d-flex flex-row-reverse">
            { actions }
          </div>
        </ListGroup.Item>
      </Fragment>
    )
  }

  handlePlayClicked() {
    this.setState(new EpisodeLineState(true));
  }
}

export class EpisodeLineProps {
  constructor(
    public episode: Episode
  ) { }
}

export class EpisodeLineState {
  constructor(
    public showPlayer?: boolean
  ) { }
}
