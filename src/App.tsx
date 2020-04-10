import React from "react";
import "./App.css";
import { GameObject } from "./Game";
import { LobbyPlayer } from "./state";
import { connect } from "react-redux";
import { PlayerCreator } from "./playercreator";
import { Config } from "./GameConfig";
import ConfigComponent from "./config";
import PlayerList from "./playerlist";

export interface AppDispatchProps {
  newPlayer: Function;
  playerDisconnected: Function;
  updateConfig: Function;
  playerDied: Function;
  playerRemoved: Function;
  newGameStart: Function;
}

class App extends React.Component<AppDispatchProps, {}> {
  componentDidMount() {
    var canvas: any = document.getElementById("game");
    var context: any = canvas.getContext("2d");

    GameObject.canvas = canvas;
    GameObject.context = context;
    GameObject.socket.onStart = () => {
      context.clearRect(0, 0, 1500, 900);
      this.props.newGameStart();
    };
    GameObject.dispatchFunctions = this.props;
  }

  render() {
    return (
      <div className="App">
        <PlayerList />
        <ConfigComponent />
        <canvas width="800" height="800" id="game"></canvas>
        <button onClick={GameObject.socket.sendStart.bind(GameObject.socket)}>
          START
        </button>
        <PlayerCreator />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: Function) => {
  return {
    newPlayer: (player: LobbyPlayer) =>
      dispatch({ type: "NEW_PLAYER", data: player }),
    updateConfig: (config: Config) =>
      dispatch({ type: "CONFIG_UPDATE", data: config }),
    playerDisconnected: (id: number) =>
      dispatch({ type: "PLAYER_DISCONNECTED", data: id }),
    playerDied: (id: number) => dispatch({ type: "PLAYER_DIED", data: id }),
        playerRemoved: (id: number) => dispatch({ type: "PLAYER_REMOVED", data: id}),
        newGameStart: () => dispatch({ type: 'GAME_STARTED' }),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(App);
