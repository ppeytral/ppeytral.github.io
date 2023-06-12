import { Card } from "./Card.js";
import { Player } from "./player.js";
import { Table } from "./table.js";

export class Dealer {
	public table: Table;
	public hand: Card[][] = [];

	constructor(table: Table) {
		this.table = table;
		this.hand.push([]);
	}

	deal() {
		let everyone: (Dealer | Player)[]= this.table.players.map(x => x);
		everyone.push(this);

		let len = everyone.length;
		for (let i=0; i<2; i++) {
			for (const player of everyone) {
				if(!(i === 1 && player instanceof Dealer)) {
					player.addCard(this.table.cardStack.shift()!,0)
				}
			}
		}
	}

	//TODO : MAKE IT BETTER
	dealCardTo(player: Player | Dealer) {
		/*Worst case scenario: every player splits so we need nbOfPlayers*4 + 2 cards to play a game*/
		let minNbOfCards = this.table.players.length * 4 + 2;
		if (this.table.cardStack.length > minNbOfCards) {
			for (let i = 0; i < player.hand.length; i++) {
				let card = this.table.cardStack.shift()!;
				player.addCard(card, i);
			}
		}
		else {
			console.log('Not enough cards to play a game. Need to shuffle a new set of cards!');
			this.table.newCardStack();
			this.table.shuffleCardStack();
		}
	}


	addCard(card: Card, handNb: number): void {
		this.hand[handNb].push(card);
	}

	getHand(): string[] {
		let result = [];

		for (const card of this.hand[0]) {
			result.push(card.value)
		}

		return result
	}

	throwCards(): void {
		this.hand = [[]];
	}

	showHand(): void {
		let hand = '';

		for (const card of this.hand[0]) {
			hand += card.getCard();
			hand += ' '
		}
		console.log(`\x1b[1;3;31mBank\x1b[m has been dealt this hand: ${hand}`)
	}

	getHandValue() {
		let nbCards 	= ['2', '3', '4', '5', '6', '7', '8', '9'];
		let faceCards 	= ['10', 'J', 'Q', 'K'];
		let result: number = 0;

		for (const card of this.hand[0]) {
			if (nbCards.includes(card.value)) {
				result += Number(card.value);
			}
			else if (faceCards.includes(card.value)) {
				result += 10;
			}
			else if (card.value === 'A') {
				if (result <=10) {
					result += 11;
				}
				else {
					result += 1;
				}
			}
		}
		return result;
	}
}
