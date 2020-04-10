import React from "react";
import { GameObject } from "./Game";

interface PlayerCreatorState {
  name: string;
  color: string;
}

export class PlayerCreator extends React.Component<{}, PlayerCreatorState> {
  constructor(props: any) {
    super(props);

    this.state = {
      name: "",
      color: "white"
    };

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
    this.submitPlayer = this.submitPlayer.bind(this);
  }

  handleNameChange(event: any) {
    this.setState({
      name: event.target.value
    });
  }

  handleColorChange(event: any) {
    this.setState({
      color: event.target.value
    });
  }

  private submitPlayer() {
    GameObject.socket.socket.send(
      JSON.stringify({
        type: "registerPlayer",
        content: JSON.stringify(this.state)
      })
    );
  }

  render() {
    return (
      <div id="config">
        <input
          type="text"
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <input
          type="text"
          value={this.state.color}
          onChange={this.handleColorChange}
        />
        <button onClick={this.submitPlayer}>ADD MEEEEEE</button>
      </div>
    );
  }
}
