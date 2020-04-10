import { LobbyPlayer } from "./state";
import { Config } from "./GameConfig";

export interface NewPlayer {
  type: "NEW_PLAYER";
  data: LobbyPlayer;
}

export interface ConfigUpdate {
  type: "CONFIG_UPDATE";
  data: Config;
}

export interface PlayerDisconnected {
  type: "PLAYER_DISCONNECTED";
  data: number;
}

export interface PlayerDied {
  type: "PLAYER_DIED";
  data: number;
}

export interface PlayerRemoved {
  type: "PLAYER_REMOVED";
  data: number;
}

export interface NewGameStart {
  type: "GAME_STARTED";
}

export type Action =
  | NewPlayer
  | ConfigUpdate
  | PlayerDisconnected
  | PlayerDied
  | PlayerRemoved
  | NewGameStart;
