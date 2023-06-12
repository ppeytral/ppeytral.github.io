import { Card } from "./Card.js";
import { Player } from "./player.js";
import { Table } from "./table.js";

//Test of table, card stack, card shuffle
let table = new Table(6);

table.newCardStack();
table.shuffleCardStack()
table.addPlayer('Patrice', 'blue');
table.addPlayer('Raphaelle', 'green')
table.addPlayer('Lea', 'yellow');

const patrice = table.players[0];
patrice.deposit(100);
const raphaelle = table.players[1];
raphaelle.deposit(100);

console.log();
table.showPlayers();
console.log();

table.playGame(35)
patrice.getBankroll();
raphaelle.getBankroll();
console.table(table.cardStack);
