import { Card } from "./Card.js";
import { Dealer } from "./dealer.js";
import { Player } from "./player.js";
import { Table } from "./table.js";

export function calculateSpriteOffset(card: Card) {
	let color = card.color;
	let value = card.value;
	let result = [];
	const cardHeight = 64;
	const cardWidth = 48;
	
	switch(value) {
		case 'A':
		result.push(0);
		break;
		
		case 'J':
		result.push(2+10*(1+cardWidth));
		break;
		
		case 'Q':
		result.push(2+11*(1+cardWidth));
		break;
		
		case 'K':
		result.push(2+12*(1+cardWidth));
		break;
		
		default:
		result.push(2 + (parseInt(value)-1) * (cardWidth+1))
		break;
	}
	
	switch (color) {
		case '♥':
		result.push(2*cardHeight);
		break;
		
		case '♠':
		result.push(3*cardHeight);
		break;
		
		case '♦':
		result.push(cardHeight);
		break;
		
		default:
		result.push(0);
		break;
	}
	
	
	return result;
}

export function generateHTMLPlayersInfos(table:Table) {
	let i = 1;
	let players = table.players;
	
	for (const player of players) {
		let wrapper = document.querySelector('#playerInfosWrapper');
		
		let hPlayer = document.createElement('div');
		
		hPlayer.setAttribute('class', 'playerInfos');
		hPlayer.setAttribute('id', `player${i}`);
		let hPlayerName = document.createElement('div');
		hPlayerName.setAttribute('class','name');
		hPlayerName.setAttribute('id',`player${i}name`);
		hPlayer.innerHTML = player._name;
		
		let hBankroll = document.createElement('div');
		hBankroll.setAttribute('class','bankroll');
		hBankroll.setAttribute('id',`player${i}bankroll`);
		hBankroll.innerHTML = `${player.getBankroll()}€`;

		let hStatus = document.createElement('div');
		hStatus.setAttribute('class', 'outcome');
		hStatus.setAttribute('id', `player${i}outcome`)
		hStatus.innerHTML = player.outcome;
		
		hPlayer.appendChild(hPlayerName);
		hPlayer.appendChild(hBankroll);
		hPlayer.appendChild(hStatus);
		wrapper?.appendChild(hPlayer);
		i++;
	}
}

export function generateHTMLCard(card:Card, nbOfPlayer: number, nbOfHand: number, nbOfCard: number): HTMLElement {
	let hCard = document.createElement('div');
	let offset = calculateSpriteOffset(card);
	
	hCard.setAttribute('class', `card`);
	hCard.setAttribute('id', `player${nbOfPlayer}hand${nbOfHand}card${nbOfCard}`);
	hCard.style.background = `url(../assets/Deck.png) -${offset[0]}px -${offset[1]}px`;
	
	return hCard;
}

export function generateHTMLSpot(player: Player|Dealer, nbOfPlayer: number): HTMLElement {
	let hSpot = document.createElement('div');
	let hNameSpan = document.createElement('span');
	let hHand = document.createElement('div');
	
	let id = `player${nbOfPlayer}spot`;
	if (player instanceof Dealer) {
		id = 'dealerspot'
	}
	
	hSpot.setAttribute('class', 'spot');
	hSpot.setAttribute('id', id);
	
	hNameSpan.setAttribute('class', 'playerName');
	if (player instanceof Player) {
		hNameSpan.setAttribute('id',`player${nbOfPlayer}name`)
		hNameSpan.innerHTML = player._name;
	}
	else {
		hNameSpan.innerHTML = 'Dealer';
	}
	
	hSpot.appendChild(hNameSpan);
	hSpot.appendChild(hHand);
	hSpot.appendChild(generateHTMLHand(player.hand));
	
	return hSpot;
}

export function generateHTMLHand(hands: Card[][]) {
	let hHands = document.createElement('div');
	hHands.setAttribute('class',`hands`);
	let j = 1;
	for (const hand of hands) {
		let nthHand = document.createElement('div');
		nthHand.setAttribute('class',`hand${j}`);
		
		let hCard;
		let i=1;
		for (const card of hand) {
			hCard = generateHTMLCard(card, 1,j,i);
			hCard.style.left = `${(i-1)*10}px`;
			hCard.style.transform = `rotate(${(i-1) * 6}deg)`
			nthHand.appendChild(hCard);
			i++;
		}
		hHands.appendChild(nthHand);
		j++;
	}
	
	return hHands;
}

export function generateHTMLTable(table: Table) {
	reset(table);

	const hTable = document.querySelector('#table');
	let i = 1;
	for (const player of table.players) {
		let hSpot = generateHTMLSpot(player, i);
		hSpot.style.transform = `rotate(${(-90+(i)*180/(1+table.players.length))}deg) translateY(${800/2-65}px)`
		hTable?.appendChild(hSpot);
		i++;
	}
	hTable?.appendChild(generateHTMLSpot(table.dealer,1))
}

export function reset(table: Table) {
	for (let i=1; i<=table.players.length; i++) {
		document.querySelector(`#player${i}spot`)?.remove();
		document.querySelector(`#player${i}`)?.remove();
	}
	document.querySelector('#dealerspot')?.remove();
	//table.emptyHands();
}

export function addPlayer(table:Table) {
	let popup = document.getElementById('popup')!;
	popup.style.display = 'flex';
}

export function closePopup() {
	let popup = document.getElementById('popup')!;
	popup.style.display = 'none';
}

export function acceptAddPlayer(table: Table) {
	let nameInput	= document.querySelector('#new_player_name')!;
	let bankInput	= document.querySelector('#new_player_bankroll')!;
	let name		= nameInput.value;
	let bankroll	= bankInput.value;
	
	table.addPlayer(name, 'white');
	table.players[table.players.length - 1].deposit(parseInt(bankroll));
	refresh(table);
}

export function refresh(table: Table) {
	for (let i=1; i<=table.players.length; i++) {
		document.querySelector(`#player${i}spot`)?.remove();
		document.querySelector(`#player${i}`)?.remove();
	}
	document.querySelector('#dealerspot')?.remove();
	
	generateHTMLTable(table);
	generateHTMLPlayersInfos(table);
}

export function deal(table: Table) {
	table.newCardStack();
	table.shuffleCardStack();
	table.emptyHands();
	table.dealer.throwCards();
	for (let i=0; i<1; i++) {
		console.log('===  Game number', i, ' ===');
		table.dealer.deal();
		console.log()
		for (const player of table.players) {
			player.isInGame = true;
			player.showHand();
			player.bet(10);
			console.log();
		}
		table.dealer.showHand();
		console.log();
	}
	refresh(table);
}

export function play(table: Table) {
	for (const player of table.players) {
		if(player.isInGame) {
			player.play();
			console.log();
		}
	}
	table.dealer.dealCardTo(table.dealer);
	table.dealer.showHand();
	console.log();
	let bankScore = table.dealer.getHandValue();
	for (const player of table.players) {
		if (player.isInGame) {
			for (const hand of player.hand) {
				
				let playerScore = player.getHandValue(hand);
				//TODO CHECK WINNERS FUNCTION
				if (playerScore > 21 || playerScore < bankScore) {
					console.log(`${player.name} has lost...`);
					player.outcome = 'lost...';
					player.withdraw(player.currentBet);
					console.log();
				}
				else if (playerScore === bankScore) {
					console.log(`${player.name} is tie with bank`)
					player.outcome = 'tie'
				}
				else if (playerScore === 21) {
					console.log(`${player.name} got a 21!`);
					player.outcome ='21!';
					player.deposit(player.currentBet * 1.5);
					console.log();
				}
				else if (playerScore > bankScore) {
					console.log(`${player.name} has won!`);
					player.outcome = 'won!';
					player.deposit(player.currentBet);
					console.log();
				}
			}
		}
		else {
			player.outcome = 'quit'
		}
	}
	refresh(table);
}