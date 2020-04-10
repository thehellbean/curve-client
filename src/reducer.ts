import * as Actions from "./actions";
import { DefaultState, State } from "./state";

export function gameReducer(
    state: State = DefaultState,
    action: Actions.Action
) {
    let playerCopy = [];
    switch (action.type) {
        case "NEW_PLAYER":
            return { ...state, players: [...state.players, action.data] };
        case "PLAYER_DISCONNECTED":
            for (let player of state.players) {
                if (player.id === action.data) {
                    playerCopy.push({ ...player, connected: false });
                } else {
                    playerCopy.push(player);
                }
            }

            return { ...state, players: playerCopy };
        case "PLAYER_DIED":
            for (let player of state.players) {
                if (player.id === action.data) {
                    playerCopy.push({ ...player, alive: false });
                } else {
                    if (player.alive) {
                        playerCopy.push({ ...player, score: player.score + 1 });
                    } else {
                        playerCopy.push(player);
                    }
                }
            }
            return { ...state, players: playerCopy };
        case "PLAYER_REMOVED":
            for (let player of state.players) {
                if (player.id === action.data) {
                    continue;
                } else {
                    playerCopy.push(player);
                }
            }
            return { ...state, players: playerCopy };
        case "CONFIG_UPDATE":
            return { ...state, config: action.data };
        case "GAME_STARTED":
            for (let player of state.players) {
                if (player.connected) {
                    playerCopy.push({ ...player, alive: true });
                }
            }
            return { ...state, players: playerCopy };
        default:
            return state;
    }
}
