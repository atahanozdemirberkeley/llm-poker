from flask import Flask, request, jsonify
from flask_cors import CORS
from texasholdem.game.game import TexasHoldEm
from texasholdem import ActionType
from texasholdem.game.player_state import PlayerState
import random

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

SMALL_BLIND = 1
BIG_BLIND = 2
BUY_IN = 200
MAX_PLAYERS = 2  # For heads-up play

game = None

def create_new_game():
    global game
    game = TexasHoldEm(buyin=BUY_IN, small_blind=SMALL_BLIND, big_blind=BIG_BLIND, max_players=MAX_PLAYERS)
    game.start_hand()

def ai_action():
    moves = game.get_available_moves()
    if ActionType.CHECK in moves.action_types:
        return ActionType.CHECK, None
    else:
        return ActionType.CALL, None

app.route('/api/start_game', methods=['POST'])
def start_game():
    create_new_game()
    return get_game_state()

@app.route('/api/player_action', methods=['POST'])
def player_action():
    action = request.json['action']
    amount = request.json.get('amount')
    
    action_type = ActionType[action.upper()]
    game.take_action(action_type, total=amount)
    
    if game.is_hand_running():
        ai_action_type, ai_amount = ai_action()
        game.take_action(ai_action_type, total=ai_amount)
    
    return get_game_state()

def get_game_state():
    if not game or not game.is_game_running():
        return jsonify({"error": "Game not started"}), 400

    player = game.players[0]
    ai = game.players[1]
    
    return jsonify({
        "playerStack": player.chips,
        "opponentStack": ai.chips,
        "playerCards": [str(card) for card in game.hands[0]] if game.hands else [],
        "communityCards": [str(card) for card in game.community_cards],
        "pot": game.pots[game._last_pot_id()].amount,
        "current_bet": game.current_bet,
        "player_turn": game.current_player == 0,
        "stage": game.hand_phase.name,
        "is_game_over": not game.is_hand_running()
    })

if __name__ == '__main__':
    app.run(debug=True)