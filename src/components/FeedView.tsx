import React, { Fragment } from "react";
import { RouteComponentProps } from "react-router-dom";
import axios from "axios";
import {
  Row,
  ListGroup,
  Button,
  Col,
  Form,
  FormControl,
  Pagination
} from "react-bootstrap";
import Octicon, { Sync, GitCompare } from "@primer/octicons-react";

import { BACKEND_API_URL } from "../constants/BackendConstants";
import { Feed } from "../models/Feed";
import { Episode } from "../models/Episode";
import { FastJsonResponseObject } from "../models/FastJsonResponseObject";
import { FastJsonResponseArray } from "../models/FastJsonResponseArray";

import "./FeedView.css";
import { EpisodeLine, EpisodeLineState } from "./EpisodeLine";
import { PaginationDetails } from "../models/Pagination";

export class FeedView extends React.Component<
  RouteComponentProps<FeedViewProp>,
  FeedViewState
> {
  constructor(props: RouteComponentProps<FeedViewProp>) {
    super(props);
    this.state = new FeedViewState();
  }

  render() {
    const currentPage = Number.parseInt(
      (this.state.paginationDetails?.current_page || 1).toString()
    );
    const previousPage = currentPage > 1 ? currentPage - 1 : 1;
    const nextPage =
      currentPage ==
      Number.parseInt(
        (this.state.paginationDetails?.total_pages || 1).toString()
      )
        ? currentPage
        : currentPage + 1;

    let feedDisplay;

    if (this.state.loading) {
      feedDisplay = (
        <Row className="justify-content-md-center">
          <Col md="auto">
            <Octicon size="large" icon={Sync} className="load-animation" />
          </Col>
        </Row>
      );
    } else {
      feedDisplay = (
        <Row>
          <ListGroup className="feed-list">
            {this.state.episodes?.map(episode => {
              return <EpisodeLine episode={episode} />;
            })}
          </ListGroup>
        </Row>
      );
    }

    return (
      <Fragment>
        <Row>
          <h1>{this.state.feed?.name}</h1>
        </Row>
        <Row>
          <Col md={9} xs={9}>
            <h3>Episodes</h3>
          </Col>
          <Col md={3} xs={3}>
            <div className="btn-group refresh-button">
              <Button onClick={() => this.refresh()} variant="link">
                <Octicon icon={Sync} size={28} />
              </Button>
              <Button onClick={() => this.sync()} variant="link">
                <Octicon icon={GitCompare} size={28} />
              </Button>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={9} xs={9}>
            <Form
              onSubmit={(e: React.FormEvent) => this.search(e)}
              className="search-form"
            >
              <FormControl
                placeholder="Search"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.searchChange(e)}
              />
            </Form>
          </Col>
          <Col md={3} xs={3}>
            <Pagination>
              <Pagination.First onClick={() => this.pageChange(1)} />
              <Pagination.Prev onClick={() => this.pageChange(previousPage)} />
              <Pagination.Item
                disabled
              >{`Page ${this.state.paginationDetails?.current_page} of ${this.state.paginationDetails?.total_pages}`}</Pagination.Item>
              <Pagination.Next onClick={() => this.pageChange(nextPage)} />
              <Pagination.Last
                onClick={() =>
                  this.pageChange(
                    this.state.paginationDetails?.total_pages || 1
                  )
                }
              />
            </Pagination>
          </Col>
        </Row>
        {feedDisplay}
      </Fragment>
    );
  }

  componentDidMount() {
    this.setState(prevState => ({ ...prevState, loading: true }));

    const feed_url = BACKEND_API_URL + "/feeds/" + this.props.match.params.id;
    axios
      .get<FastJsonResponseObject<Feed>>(feed_url)
      .then(response =>
        this.setState(new FeedViewState(response.data.data.attributes))
      );
    axios
      .get<FastJsonResponseArray<Episode>>(feed_url + "/episodes/")
      .then(response =>
        this.setState(prevState => {
          const episodes = response.data.data.map(data => data.attributes);
          return {
            ...prevState,
            episodes: episodes,
            paginationDetails: response.data.meta,
            loading: false
          };
        })
      );
  }

  refresh() {
    this.setState(prevState => ({ ...prevState, loading: true }));

    const feed_url = BACKEND_API_URL + "/feeds/" + this.props.match.params.id;
    axios
      .get<FastJsonResponseArray<Episode>>(feed_url + "/episodes/")
      .then(response => {
        this.setState(prevState => {
          const episodes = response.data.data.map(
            response_object => response_object.attributes
          );
          return {
            ...prevState,
            loading: false,
            episodes: episodes,
            paginationDetails: response.data.meta
          };
        });
      });
  }

  sync() {
    const feed_url =
      BACKEND_API_URL + "/feeds/" + this.props.match.params.id + "/sync";
    axios.get(feed_url);
  }

  search(e: any) {
    this.setState(prevState => ({ ...prevState, loading: true }));

    e.preventDefault();
    const searchQuery = this.state.searchQuery;
    const feed_url = BACKEND_API_URL + "/feeds/" + this.props.match.params.id;
    axios
      .get<FastJsonResponseArray<Episode>>(feed_url + "/episodes/", {
        params: {
          "q[number_cont]": searchQuery,
          "q[name_cont]": searchQuery,
          "q[show_notes_cont]": searchQuery
        }
      })
      .then(response => {
        this.setState(prevState => {
          const episodes = response.data.data.map(
            response_object => response_object.attributes
          );
          return {
            ...prevState,
            loading: false,
            episodes: episodes,
            paginationDetails: response.data.meta
          };
        });
      });
  }

  searchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const searchQuery = e.currentTarget.value;
    this.setState((prevState: Readonly<FeedViewState>) => {
      return { ...prevState, searchQuery: searchQuery };
    });
  }

  pageChange(toPage: number) {
    if (toPage == this.state.paginationDetails?.current_page) {
      return;
    }

    this.setState(prevState => ({ ...prevState, loading: true }));

    const searchQuery = this.state.searchQuery;
    const feed_url = BACKEND_API_URL + "/feeds/" + this.props.match.params.id;
    axios
      .get<FastJsonResponseArray<Episode>>(feed_url + "/episodes/", {
        params: {
          "q[number_cont]": searchQuery,
          "q[name_cont]": searchQuery,
          "q[show_notes_cont]": searchQuery,
          page_number: toPage
        }
      })
      .then(response => {
        this.setState(prevState => {
          const episodes = response.data.data.map(
            response_object => response_object.attributes
          );
          return {
            ...prevState,
            loading: false,
            episodes: episodes,
            paginationDetails: response.data.meta
          };
        });
      });
  }
}

export class FeedViewProp {
  id: string;

  constructor(id: string | undefined) {
    this.id = id || "";
  }
}

export class FeedViewState {
  constructor(
    public feed?: Feed,
    public episodes?: Episode[],
    public loading?: boolean,
    public searchQuery?: string,
    public paginationDetails?: PaginationDetails
  ) {}
}
