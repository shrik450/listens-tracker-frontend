import React, { Fragment } from "react";

import Octicon, { X } from "@primer/octicons-react";
import { Button } from "react-bootstrap";

import { Appearance } from "../models/Appearance";
import "./AppearanceLine.css";

export const AppearanceLine = ({
  appearance,
  deleteHandler
}: AppearanceLineProps) => {
  const deleteAction = () => {};
  return (
    <div className="appearance">
      <span className="appearance-name">{appearance.name}</span>
      <span className="appearance-cross">
        <Button variant="outline-danger" onClick={deleteHandler}>
          <Octicon icon={X} />
        </Button>
      </span>
    </div>
  );
};

class AppearanceLineProps {
  constructor(
    public appearance: Appearance,
    public deleteHandler: () => void
  ) {}
}
