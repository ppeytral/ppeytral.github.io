import { Card } from "./Card.js";
import { Table } from "./table.js";

export class Player {
	public _name: string;
	public color: string = 'white'
	public table: Table;
	public currentBet: number = 0;
	public isInGame: boolean = true;
	public hand: Card[][] = [];
	public outcome: string = '';
	private bankroll: number = 100;

	constructor(name: string, color: string, table: Table) {
		this._name = name;
		this.table = table;
		this.color = color;
		this.hand.push([]);
	}

	get name(): string {
		let result: string = '';

		switch (this.color) {
			case 'white':
			result += '\x1b[1;3m' + this._name + '\x1b[m';
			break;

			case 'green':
			result = `\x1b[1;3;32m${this._name}\x1b[m`;
			break;

			case 'blue':
			result = `\x1b[1;3;34m${this._name}\x1b[m`;
			break;

			case 'yellow':
			result = `\x1b[1;3;33m${this._name}\x1b[m`;
			break;

			case 'magenta':
			result = `\x1b[1;3;35m${this._name}\x1b[m`;
			break;

			case 'cyan':
			result = `\x1b[1;3;36m${this._name}\x1b[m`;
			break;

			default:
			break;
		}
		return result;
	}

	addCard(card: Card, handNb: number): void {
		this.hand[handNb].push(card);
	}

	deposit(amount: number): void {
		this.bankroll += amount;
		console.log(`${this.name} deposited ${amount}€ in his bankroll.`)
	}

	withdraw(amount: number): void {
		this.bankroll -= amount;
	}

	getBankroll(): number {
		console.log(`${this.name} current bankroll is ${this.bankroll}€`)
		return this.bankroll;
	}

	bet(amount: number) {
		if (this.bankroll >= amount) {
			console.log(`${this.name} bet ${amount}€`)
			this.currentBet = amount;
		}
		else {
			console.log('Not enough money to place this bet!')
			this.isInGame = false;
		}
	}

	throwCards(): void {
		this.hand = [[]];
		this.outcome = '';
	}

	getHand(): string[] {
		let result: string[] = [];

		for (const card of this.hand[0]) {
			result.push(card.value)
		}
		return result
	}

	getStringHand(): string {
		let result = '';

		for (const hand of this.hand) {
			for (const card of hand) {
				result += card.value;
			}
		}
		return result;
	}

	showHand(): void {
		let nbOfHands = this.hand.length;

		for(let i = 0; i < nbOfHands; i++) {
			let hand = '';

			for (const card of this.hand[i]) {
				hand += card.getCard();
				hand += ' ';
			}
			console.log(`${this.name} got: ${hand}`);
		}
	}

	hit(): void {
		console.log(`${this.name} hits...`);
		this.table.dealer.dealCardTo(this);
		this.showHand();
	}

	stand(): void {
		console.log(`${this.name} stands...`);
	}

	//TODO : HANDLE MULTIPLE BETS
	split(): void {
		console.log(`${this.name} splits...`);
		this.hand.push([])

		this.hand[1].push(this.hand[0].pop()!);
		this.table.dealer.dealCardTo(this)
		this.showHand();
	}

	quit(): void {
		console.log(`${this.name} quits...`);
		this.isInGame = false;
	}

	double(): void {
		this.currentBet *= 2;
		this.table.dealer.dealCardTo(this);
		console.log(`${this.name} doubles, current bet is now ${this.currentBet}€...`);
		this.showHand();
	}

	play(): void {

		const DEALER_CARD = this.table.dealer.getHand()[0];
		const PLAYER_HAND_VALUE = this.getHandValue(this.hand[0]);
		const PLAYER_HAND = this.getStringHand();

		//SPECIFC HANDS//
		if (PLAYER_HAND === 'AA') {
			if (DEALER_CARD === 'A') {
				this.hit();
			}
			else {
				this.split();
			}
		}
		else if (['1010', 'JJ', 'QQ', 'KK'].includes(PLAYER_HAND)) {
			this.stand();
		}
		else if (PLAYER_HAND === '99') {
			if (['7','10','J','Q','K','A'].includes(DEALER_CARD)) {
				this.stand();
			}
			else {
				this.split();
			}
		}
		else if (PLAYER_HAND === '88') {
			if (['10','J','Q','K','A'].includes(DEALER_CARD)) {
				this.quit();
			}
			else {
				this.split();
			}
		}
		else if (PLAYER_HAND === '77') {
			if (['10','J','Q','K','A'].includes(DEALER_CARD)) {
				this.quit();
			}
			else if (['8','9'].includes(DEALER_CARD)) {
				this.hit();
			}
			else {
				this.split();
			}
		}
		else if (PLAYER_HAND === '66') {
			if (DEALER_CARD === 'A') {
				this.quit();
			}
			if (['7','8','9','10','J','Q','K'].includes(DEALER_CARD)) {
				this.hit();
			}
			else {
				this.split();
			}
		}
		else if (PLAYER_HAND === '55') {
			if (['10','J','Q','K','A'].includes(DEALER_CARD)) {
				this.hit();
			}
			else {
				this.double();
			}
		}
		else if (PLAYER_HAND === '44') {
			if (['5','6'].includes(DEALER_CARD)) {
				this.split();
			}
			else {
				this.hit();
			}
		}
		else if (PLAYER_HAND === '33') {
			if (DEALER_CARD === 'A') {
				this.quit();
			}
			else if (['8','9','10','J','Q','K'].includes(DEALER_CARD)) {
				this.hit();
			}
			else {
				this.split();
			}
		}
		else if (PLAYER_HAND === '22') {
			if (['8','9','10','J','Q','K','A'].includes(DEALER_CARD)) {
				this.hit();
			}
			else {
				this.split();
			}
		}
		else if (['A10','10A','A9','9A','A8','8A'].includes(PLAYER_HAND)) {
			this.stand();
		}
		else if (['A7','7A'].includes(PLAYER_HAND)) {
			if (['9','10','J','Q','K','A'].includes(DEALER_CARD)) {
				this.hit();
			}
			else if (['2','7','8'].includes(DEALER_CARD)) {
				this.stand();
			}
			else {
				this.double();
			}
		}
		else if (['A6','6A'].includes(PLAYER_HAND)) {
			if (['3','4','5','6'].includes(DEALER_CARD)) {
				this.double();
			}
			else {
				this.hit();
			}
		}
		else if (['A5','5A','A4','4A'].includes(PLAYER_HAND)) {
			if (['4','5','6'].includes(DEALER_CARD)) {
				this.double();
			}
			else {
				this.hit();
			}
		}
		else if (['A4','4A','A3','3A'].includes(PLAYER_HAND)) {
			if (['5','6'].includes(DEALER_CARD)) {
				this.double();
			}
			else {
				this.hit();
			}
		}
		else if (PLAYER_HAND_VALUE >= 18) {
			this.stand();
		}
		else if (PLAYER_HAND_VALUE === 17) {
			if (DEALER_CARD === 'A') {
				this.quit();
			}
			else {
				this.stand();
			}
		}
		else if (PLAYER_HAND_VALUE === 16) {
			if (['7', '8'].includes(DEALER_CARD)) {
				this.hit();
			}
			else if (['9','10','J','Q','K','A'].includes(DEALER_CARD)) {
				this.quit();
			}
			else {
				this.stand();
			}
		}
		else if ([14,15].includes(PLAYER_HAND_VALUE)) {
			if (['7','8','9'].includes(DEALER_CARD)) {
				this.hit();
			}
			else if (['10','J','Q','K','A'].includes(DEALER_CARD)) {
				this.quit();
			}
			else {
				this.stand();
			}
		}
		else if (PLAYER_HAND_VALUE === 13) {
			if (['8','9','10','J','Q','K'].includes(DEALER_CARD)) {
				this.hit();
			}
			else if (DEALER_CARD === 'A') {
				this.quit();
			}
			else {
				this.stand();
			}
		}
		else if (PLAYER_HAND_VALUE === 12) {
			if (['4','5','6'].includes(DEALER_CARD)) {
				this.stand();
			}
			else if (DEALER_CARD === 'A') {
				this.quit();
			}
			else {
				this.hit();
			}
		}
		else if ([11,10].includes(PLAYER_HAND_VALUE)) {
			if (['10','J','Q','K','A'].includes(DEALER_CARD)) {
				this.hit();
			}
			else {
				this.double();
			}
		}
		else if (PLAYER_HAND_VALUE === 9) {
			if (['3','4','5','6'].includes(DEALER_CARD)) {
				this.double();
			}
			else {
				this.hit();
			}
		}
		else if (PLAYER_HAND_VALUE === 8) {
			this.hit();
		}
		else if ([5, 6, 7].includes(PLAYER_HAND_VALUE)) {
			if (DEALER_CARD === 'A') {
				this.quit();
			}
			else {
				this.hit();
			}
		}
	}

	getHandValue(hand: Card[]) {
		let nbCards:	string[]	= ['2', '3', '4', '5', '6', '7', '8', '9'];
		let faceCards:	string[]	= ['10', 'J', 'Q', 'K'];
		let result:		number		= 0;

		for (const card of hand) {
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
