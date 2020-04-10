import { Config, DefaultConfig } from "./GameConfig";

export interface LobbyPlayer {
  id: number;
  name: string;
  color: string;
  score: number;
  local: boolean;
  alive: boolean;
  connected: boolean;
}

export interface State {
  players: LobbyPlayer[];
  config: Config;
}

export let DefaultState: State = {
  players: [],
  config: DefaultConfig
};
