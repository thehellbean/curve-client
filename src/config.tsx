import React from "react";
import { connect } from "react-redux";
import { State } from "./state";
import { GameObject } from "./Game";
import "./ConfigComponent.css";

const mapStateToProps = (state: State) => {
  return {
    width: state.config.boardWidth,
    height: state.config.boardHeight,
    cellSize: state.config.cellSize
  };
};

interface ConfigProps {
  width: number;
  height: number;
  cellSize: number;
}

interface ConfigState {
  boardWidth: number;
  boardHeight: number;
  cellSize: number;
}

class ConfigComponent extends React.Component<ConfigProps, ConfigState> {
  updateConfig() {
    console.log(JSON.stringify(this.state));
    GameObject.socket.socket.send(
      JSON.stringify({
        type: "updateConfig",
        content: JSON.stringify(this.state)
      })
    );
  }

  updateWidth(event: any) {
    this.setState({
      boardWidth: Number(event.target.value)
    });
  }

  updateHeight(event: any) {
    this.setState({
      boardHeight: Number(event.target.value)
    });
  }

  updateCellSize(event: any) {
    this.setState({
      cellSize: Number(event.target.value)
    });
  }

  componentWillReceiveProps(nextProps: ConfigProps) {
    this.setState({
      boardWidth: nextProps.width,
      boardHeight: nextProps.height,
      cellSize: nextProps.cellSize
    });
  }

  constructor(props: ConfigProps) {
    super(props);

    this.state = {
      boardWidth: this.props.width,
      boardHeight: this.props.height,
      cellSize: this.props.cellSize
    };

    this.updateConfig = this.updateConfig.bind(this);
    this.updateWidth = this.updateWidth.bind(this);
    this.updateHeight = this.updateHeight.bind(this);
    this.updateCellSize = this.updateCellSize.bind(this);
  }

  render() {
    return (
      <div id="config">
        <h1>CURRENT CONFIG</h1>

        <label htmlFor="width">Width</label>
        <br />
        <input
          type="number"
          onChange={this.updateWidth}
          value={this.state.boardWidth}
          name="width"
        />
        <br />
        <label htmlFor="height">Height</label>
        <br />
        <input
          type="number"
          value={this.state.boardHeight}
          onChange={this.updateHeight}
          name="height"
        />
        <br />
        <label htmlFor="cell">Cell Size</label>
        <br />
        <input
          type="number"
          value={this.state.cellSize}
          onChange={this.updateCellSize}
          name="cell"
        />
        <br />
        <button onClick={this.updateConfig}>Save</button>
      </div>
    );
  }
}

export default connect(mapStateToProps)(ConfigComponent);
