const suits = ["hearts", "diamonds", "clubs", "spades"];
const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];

export const createDeck = () => {
  return suits.flatMap((suit) => ranks.map((rank) => ({ rank, suit })));
};

export const shuffleDeck = (deck) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

export const dealCards = (numPlayers, cardsPerPlayer, communityCardCount) => {
  let deck = shuffleDeck(createDeck());
  let players = Array(numPlayers)
    .fill()
    .map(() => []);
  let communityCards = [];

  for (let i = 0; i < cardsPerPlayer; i++) {
    for (let j = 0; j < numPlayers; j++) {
      const card = deck.pop();
      card.faceUp = j !== 1;
      players[j].push(card);
    }
  }

  for (let i = 0; i < communityCardCount; i++) {
    communityCards.push(deck.pop());
  }

  return { players, communityCards };
};

export default dealCards;
