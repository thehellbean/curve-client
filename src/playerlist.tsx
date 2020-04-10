import React from "react";
import { connect } from "react-redux";
import { State, LobbyPlayer } from "./state";
import "./PlayerList.css";

const mapStateToProps = (state: State) => {
  return {
    players: state.players
  };
};

interface PlayerListProps {
  players: LobbyPlayer[];
}

class PlayerList extends React.Component<PlayerListProps, {}> {
  render() {
    return (
      <ul id="playerlist">
        {this.props.players.map((player: LobbyPlayer) => {
          return (
            <li
              className={`player ${player.alive ? "alive" : "dead"}
                                            ${
                                              player.connected
                                                ? ""
                                                : "disconnected"
                                            }`}
            >
              <div
                className={"playerRep"}
                style={{ backgroundColor: player.color }}
              ></div>
              <span className="playerName">{player.name}</span>
              <span className="score">{ player.score }</span>
            </li>
          );
        })}
      </ul>
    );
  }
}

export default connect(mapStateToProps)(PlayerList);
