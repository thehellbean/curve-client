import { Config, DefaultConfig } from "./GameConfig";
import { WebsocketManager } from "./websocket";
import { GameState, Cell } from "./GameState";
import { AppDispatchProps } from "./App";
import Keymap from "./keymap";

export class Game {
  config: Config;
  keymap: Keymap;
  socket: WebsocketManager;
  gameState: GameState;
  cellsToDraw: Cell[];
  dispatchFunctions: AppDispatchProps | undefined;
  context: CanvasRenderingContext2D | undefined;
  canvas: HTMLCanvasElement | undefined;

  constructor(config: Config) {
    this.cellsToDraw = [];
    this.config = config;
    this.keymap = {
      right: {
        39: {}
      },
      left: {
        37: {}
      }
    };

    this.gameState = {
      gameFrame: 0
    };

    let handlers = {
      gameState: this.forceStateUpdate.bind(this),
      partialState: this.updatePartialState.bind(this),
      registerPlayer: (message: any) => {
        this.addNewPlayer(JSON.parse(message.content));
      },
      updateConfig: this.updateConfig.bind(this),
      playerDisconnected: this.playerDisconnected.bind(this),
      playerDied: this.playerDied.bind(this),
      playerRemoved: this.playerRemoved.bind(this)
    };

    this.socket = new WebsocketManager(handlers);
  }

  public sendKeyPress(
    key: "left" | "right",
    mode: "keyup" | "keydown",
    gameFrame: number
  ) {
    console.log("Sending message!");
    this.socket.socket.send(
      JSON.stringify({
        type: mode,
        gameFrame: gameFrame,
        content: key
      })
    );
  }

  public playerDied(message: any) {
    if (this.dispatchFunctions !== undefined) {
      this.dispatchFunctions.playerDied(message.playerId);
    }
  }

  public playerRemoved(message: any) {
    if (this.dispatchFunctions !== undefined) {
      this.dispatchFunctions.playerRemoved(message.playerId);
    }
  }

  public updateConfig(message: any) {
    let newConfig = JSON.parse(message.content);
    this.config = newConfig;

    if (this.dispatchFunctions !== undefined) {
      this.dispatchFunctions.updateConfig(this.config);
    }

    if (this.canvas !== undefined) {
      if (
        this.canvas.width !== this.config.boardWidth ||
        this.canvas.height !== this.config.boardHeight
      ) {
        this.canvas.width = this.config.boardWidth;
        this.canvas.height = this.config.boardHeight;
      }
    }
  }

  public forceStateUpdate(message: any) {
    let newState: any = JSON.parse(message.content);
    this.gameState.gameFrame = newState.gameFrame;

    newState.players.forEach((player: any) => {
      this.addNewPlayer(player);
    });
  }

  public playerDisconnected(message: any) {
    console.log(message);
    if (this.dispatchFunctions !== undefined) {
      this.dispatchFunctions.playerDisconnected(message.playerId);
    }
  }

  private addNewPlayer(player: any) {
    if (this.dispatchFunctions === undefined) {
      return;
    }

    this.dispatchFunctions.newPlayer({
      id: player.id,
      color: player.color,
      name: player.name,
      alive: true,
      connected: player.connected,
      score: player.score
    });
  }

  public updatePartialState(message: any) {
    let partialState: any = JSON.parse(message.content);
    this.gameState.gameFrame = partialState.gameFrame;

    this.cellsToDraw = partialState.cells.map((cell: any) => ({
      x: cell.x,
      y: cell.y,
      color: cell.color
    }));

    this.processFrame();
  }

  public processFrame() {
    let self: Game = this;
    this.cellsToDraw.forEach(function(cell: Cell) {
      if (self.context !== undefined) {
        self.context.fillStyle = cell.color;
        self.context.strokeStyle = cell.color;

        self.context.fillRect(
          cell.x,
          cell.y,
          self.config.cellSize,
          self.config.cellSize
        );

        self.context.strokeRect(
          cell.x,
          cell.y,
          self.config.cellSize,
          self.config.cellSize
        );
      }
    });

    this.cellsToDraw = [];
  }
}

export let GameObject: Game = new Game({ ...DefaultConfig });
let anyKeyPressed: boolean = false;

document.addEventListener("keydown", function(e) {
  // prevents sending multiple keydown events when holding key
  if (anyKeyPressed) {
    return;
  }

  anyKeyPressed = true;
  if (e.which in GameObject.keymap.left) {
    GameObject.keymap.left[e.which].leftKeyPressed = true;
    GameObject.sendKeyPress("left", "keydown", GameObject.gameState.gameFrame);
  } else if (e.which in GameObject.keymap.right) {
    GameObject.sendKeyPress("right", "keydown", GameObject.gameState.gameFrame);
    GameObject.keymap.right[e.which].rightKeyPressed = true;
  }
});

document.addEventListener("keyup", function(e) {
  anyKeyPressed = false;
  if (e.which in GameObject.keymap.left) {
    GameObject.sendKeyPress("left", "keyup", GameObject.gameState.gameFrame);
    GameObject.keymap.left[e.which].leftKeyPressed = false;
  } else if (e.which in GameObject.keymap.right) {
    GameObject.keymap.right[e.which].rightKeyPressed = false;
    GameObject.sendKeyPress("right", "keyup", GameObject.gameState.gameFrame);
  }
});
