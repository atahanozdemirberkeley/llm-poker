from flask import Flask, request, jsonify
from flask_cors import CORS
from texasholdem.game.game import TexasHoldEm
from texasholdem import ActionType
from texasholdem.game.player_state import PlayerState
from texasholdem.card.card import Card
from texasholdem.evaluator.evaluator import evaluate
import random

app = Flask(__name__)
CORS(app)

SMALL_BLIND = 1
BIG_BLIND = 2
BUY_IN = 200
MAX_PLAYERS = 2  # For heads-up play

game = None

def create_new_game():
    global game
    game = TexasHoldEm(buyin=BUY_IN, small_blind=SMALL_BLIND, big_blind=BIG_BLIND, max_players=MAX_PLAYERS)
    game.start_hand()
    handle_ai_actions()  # Handle initial AI actions if necessary

def ai_action():
    moves = game.get_available_moves()
    if ActionType.CHECK in moves.action_types:
        return ActionType.CHECK, None
    elif ActionType.CALL in moves.action_types:
        return ActionType.CALL, None
    elif ActionType.FOLD in moves.action_types:
        return ActionType.FOLD, None
    else:
        return ActionType.FOLD, None

def handle_ai_actions():
    ai_actions = []
    while game.is_hand_running() and game.current_player == 1:  # Assuming AI is player 1
        ai_action_type, ai_amount = ai_action()
        game.take_action(ai_action_type, total=ai_amount)
        ai_actions.append({"action": ai_action_type.name, "amount": ai_amount})
    return ai_actions

@app.route('/api/start_game', methods=['POST'])
def start_game():
    create_new_game()
    game_state = get_game_state()
    ai_actions = handle_ai_actions()
    
    return jsonify({"gameState": game_state, "aiActions": ai_actions})

@app.route('/api/player_action', methods=['POST'])
def player_action():
    try:
        if not game or not game.is_game_running():
            return jsonify({"error": "Game not started"}), 400

        if game.current_player != 0:  # Assuming player is always 0
            return jsonify({"error": "Not player's turn"}), 400

        action = request.json['action']
        amount = request.json.get('amount')
        
        print(f"Received action: {action}, amount: {amount}")
        
        action_type = ActionType[action.upper()]
        game.take_action(action_type, total=amount)
        
        ai_actions = handle_ai_actions()
        game_state = get_game_state()
        winner = None
        pot = None
        
        if not game.is_hand_running():
            winner, pot = evaluate_winner()
        
        response = {
            "gameState": game_state, 
            "aiActions": ai_actions,
            "winner": winner,
            "pot": pot
        }
        print("Sending response:", response)
        return jsonify(response)
    except Exception as e:
        print(f"Error in player_action: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/get_game_state', methods=['GET'])
def get_game_state():
    if not game or not game.is_game_running():
        return {"error": "Game not started"}

    player = game.players[0]
    ai = game.players[1]
    
    return {
        "playerStack": player.chips,
        "opponentStack": ai.chips,
        "playerCards": [card_to_string(card) for card in game.hands[0]] if game.hands else [],
        "opponentCards": [card_to_string(card) for card in game.hands[1]] if game.hands else [],
        "communityCards": [card_to_string(card) for card in game.board],
        "pot": game.pots[0].get_total_amount(),
        "currentBet": game.pots[0].raised,
        "playerBet": game.pots[0].get_player_amount(0),
        "OpponentBet": game.pots[0].get_player_amount(1),
        "playerTurn": game.current_player == 0,
        "stage": game.hand_phase.name,
        "isGameOver": not game.is_hand_running(),
        "buttonloc": game.btn_loc,
        "availableMoves": [move.name for move in game.get_available_moves().action_types],
        "raiseRange": [game.min_raise(), player.chips],
        "chipsToCalls": game.pots[0].chips_to_call(0),  # Assuming player is always 0
        "hasPeeked": False
    }

def card_to_string(card: Card):
    rank_map = {0: '2', 1: '3', 2: '4', 3: '5', 4: '6', 5: '7', 6: '8', 7: '9', 8: 'T', 9: 'J', 10: 'Q', 11: 'K', 12: 'A'}
    suit_map = {1: 'S', 2: 'H', 4: 'D', 8: 'C'}
    return f"{rank_map[card.rank]}{suit_map[card.suit]}"

def evaluate_winner():
    player_hand = game.hands[0]
    ai_hand = game.hands[1]
    board = game.board
    
    player_score = evaluate(player_hand, board)
    ai_score = evaluate(ai_hand, board)
    
    pot = game.pots[0].get_total_amount()
    
    if player_score < ai_score:
        return "Player", pot
    elif ai_score < player_score:
        return "AI", pot
    else:
        return "Tie", pot // 2

if __name__ == '__main__':
    app.run(debug=True)