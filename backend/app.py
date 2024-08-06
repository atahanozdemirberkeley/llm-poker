from flask import Flask, request, jsonify
from flask_cors import CORS
from texasholdem.game.game import TexasHoldEm
from texasholdem import ActionType
from texasholdem.game.player_state import PlayerState
from texasholdem.card.card import Card
import random

app = Flask(__name__)
CORS(app)
# CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

SMALL_BLIND = 1
BIG_BLIND = 2
BUY_IN = 200
MAX_PLAYERS = 2  # For heads-up play

game = None


def create_new_game():
    global game
    game = TexasHoldEm(buyin=BUY_IN, small_blind=SMALL_BLIND, big_blind=BIG_BLIND, max_players=MAX_PLAYERS)
    game.start_hand()

@app.route('/api/start_game', methods=['POST'])
def start_game():
    create_new_game()
    if game.btn_loc == 1:
        handle_ai_turn()

    return get_game_state()


@app.route('/api/player_action', methods=['POST'])
def player_action():
    if not game or not game.is_game_running():
        return jsonify({"error": "Game not started"}), 400

    if game.current_player != 0:  # Assuming player is always 0
        return jsonify({"error": "Not player's turn"}), 400

    action = request.json['action']
    amount = request.json.get('amount')
    
    action_type = ActionType[action.upper()]
    game.take_action(action_type, total=amount)
    
    handle_ai_turn()  # Handle AI's turn after player's action
    
    return get_game_state()

def ai_action():
    moves = game.get_available_moves()
    if ActionType.CHECK in moves.action_types:
        return ActionType.CHECK, None
    else:
        return ActionType.CALL, None

def handle_ai_turn():
    while game.is_hand_running() and game.current_player == 1:  # Assuming AI is player 1
        ai_action_type, ai_amount = ai_action()
        game.take_action(ai_action_type, total=ai_amount)


def card_to_string(card: Card):
    rank_map = {0: '2', 1: '3', 2: '4', 3: '5', 4: '6', 5: '7', 6: '8', 7: '9', 8: 'T', 9: 'J', 10: 'Q', 11: 'K', 12: 'A'}
    suit_map = {1: 'S', 2: 'H', 4: 'D', 8: 'C'}
    return f"{rank_map[card.rank]}{suit_map[card.suit]}"

@app.route('/api/get_game_state', methods=['GET'])
def get_game_state():
    if not game or not game.is_game_running():
        return jsonify({"error": "Game not started"}), 400

    player = game.players[0]
    ai = game.players[1]
    
    return jsonify({
        "playerStack": player.chips,
        "opponentStack": ai.chips,
        "playerCards": [card_to_string(card) for card in game.hands[0]] if game.hands else [],
        "opponentCards": [card_to_string(card) for card in game.hands[1]] if game.hands else [],
        "communityCards": [card_to_string(card) for card in game.board],
        "pot": sum(pot.amount for pot in game.pots),
        "currentBet": BIG_BLIND,
        "playerTurn": game.current_player == 0,
        "stage": game.hand_phase.name,
        "isGameOver": not game.is_hand_running(),
        "playerPosition": game.current_player,
        "aiPosition": "BB" if game.btn_loc == 0 else "SB"
    })

if __name__ == '__main__':
    app.run(debug=True)