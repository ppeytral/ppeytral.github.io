import { acceptAddPlayer,addPlayer,closePopup,deal,generateHTMLPlayersInfos,generateHTMLTable,play,refresh } from "./functions.js";
import { Table } from "./table.js"


document.addEventListener('DOMContentLoaded', function() {
	
	const dealBtn		= document.querySelector('#dealBtn')!;
	const playBtn		= document.querySelector('#playBtn')!;
	const addPlayerBtn	= document.querySelector('#addPlayerBtn')!;
	const acceptBtn 	= document.querySelector('#acceptBtn')!;
	const closeBtn		= document.querySelector('#closeBtn')!;
	
	const table = new Table(6);
	
	table.addPlayer('Patrice', 'white');
	table.addPlayer('Karim', 'white');
	table.addPlayer('Paul', 'white');
	table.addPlayer('Alexis', 'white');
	
	generateHTMLTable(table);
	generateHTMLPlayersInfos(table);
	
	acceptBtn.addEventListener('click', 	function() {acceptAddPlayer(table)});
	addPlayerBtn.addEventListener('click', function() {addPlayer(table)});
	closeBtn.addEventListener('click', 	function() {closePopup()});
	dealBtn.addEventListener('click',		function() {deal(table)})
	playBtn.addEventListener('click',		function() {play(table)})
})
