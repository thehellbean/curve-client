export interface Config {
  boardWidth: number;
  boardHeight: number;
  cellSize: number;
}

export const DefaultConfig: Config = {
  boardWidth: 800,
  boardHeight: 800,
  cellSize: 4
};
