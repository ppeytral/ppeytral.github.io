export class Card {
	private _color: string;
	private _value: string;

	constructor(color: string, value: string) {
		this._color = color;
		this._value = value;
	}
	get value() {
		return this._value;
	}

	get color() {
		return this._color;
	}
	
	getCard(): string {
		let result = `\x1b[1;30;47m ${this._color}${this.value} \x1b[m`;
		if (this._color === '♥' || this._color === '♦') {
			result = `\x1b[1;31;47m ${this._color}${this.value} \x1b[m`;
		}

		return result;
	}
}
