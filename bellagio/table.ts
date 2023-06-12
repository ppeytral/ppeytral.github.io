import { Card } from "./Card.js";
import { Dealer } from "./dealer.js";
import { Player } from "./player.js";

export class Table {
	public cardStack: Card[] = [];
	public players: Player[] = [];
	public dealer: Dealer;
	public nbOfDecksToPlayWith: number;

	constructor(nbOfDecksToPlayWith: number) {
		this.dealer = new Dealer(this);
		this.nbOfDecksToPlayWith = nbOfDecksToPlayWith;
	}

	newCardStack(): Card[] {
		console.log(`\x1b[1;3;31mDealer\x1b[m is shuffling ${this.nbOfDecksToPlayWith} packs of cards...`)

		let stack: Card[] = [];
		let colors = ['♥', '♠', '♦', '♣'];
		let values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

		for (const color of colors) {
			for (const value of values) {
				for (let i = 0; i < this.nbOfDecksToPlayWith; i++) {
					stack.push(new Card(color, value));
				}
			}
		}
		this.cardStack = stack;
		return stack;
	}

	shuffleCardStack(): void {
		for (let i = this.cardStack.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			const temp = this.cardStack[i];
			this.cardStack[i] = this.cardStack[j];
			this.cardStack[j] = temp;
		}
	}

	addPlayer(name: string, color: string): Player {
		let player = new Player(name, color, this);
		this.players.push(new Player(name, color, this));
		console.log(`${player.name} has joined the table...`);
		return player;
	}

	showPlayers(): void {
		console.log('There are', this.players.length, 'players at the table: ')
		let i = 0;
		for (const player of this.players) {
			console.log(i, '-', player.name);
			i++;
		}
	}

	emptyHands() {
		for (const player of this.players) {
			player.throwCards();
		}
		this.dealer.throwCards();
	}

	playGame(nbOfGames: number): void {
		this.emptyHands();
		this.dealer.throwCards();
		for (let i=0; i<nbOfGames; i++) {
			console.log('===  Game number', i, ' ===');
			this.dealer.deal();
			console.log()
			for (const player of this.players) {
				player.isInGame = true;
				player.showHand();
				player.bet(10);
				console.log();
			}
			this.dealer.showHand();
			console.log();
			for (const player of this.players) {
				if(player.isInGame) {
					player.play();
					console.log();
				}
			}
			this.dealer.dealCardTo(this.dealer);
			this.dealer.showHand();
			console.log();
			let bankScore = this.dealer.getHandValue();
			for (const player of this.players) {
				if (player.isInGame) {
					for (const hand of player.hand) {

						let playerScore = player.getHandValue(hand);

						if (playerScore > 21 || playerScore < bankScore) {
							console.log(`${player.name} has lost...`);
							player.withdraw(player.currentBet);
							console.log();
						}
						else if (playerScore === 21) {
							console.log(`${player.name} got a 21!`);
							player.deposit(player.currentBet * 1.5);
							console.log();
						}
						else if (playerScore > bankScore) {
							console.log(`${player.name} has won!`);
							player.deposit(player.currentBet);
							console.log();
						}
					}
				}
			}
		}
		console.log();
	}
}
