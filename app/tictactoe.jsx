'use strict';

import React from 'react';
const _ = require('lodash');
const classNames = require('classnames');
//import {Icon} from 'react-fa';

const definition = {
	'undefined': undefined,
	'true': 'X',
	'false': 'O'
};

const cellBordersClass = (cell) => {
	let classNames = [];
	const boardWidth = 3;
	const cellCount = 9;
	if (cell < boardWidth) classNames.push('up');
	if (cell >= cellCount - boardWidth) classNames.push('bottom');
	if ((cell + boardWidth) % boardWidth === 0) classNames.push('left'); //0 3 6
	if ((cell + 1) % boardWidth === 0) classNames.push('right'); // 2, 5, 8
	return classNames.join(' ');
};

const Game = React.createClass({
	getInitialState() {
		return {
			field: [
				undefined, undefined, undefined,
				undefined, undefined, undefined,
				undefined, undefined, undefined
			],
			playerSide: true,
			history: []
		}
	},
	winnerRow(field) {
		for(let i = 0; i <= 6; i += 3) {
			if(field[i] !== undefined && field[i] === field[i + 1] && field[i + 1] === field[i + 2]) {
				return [i, i + 1, i + 2];
			}
		}
		for(let i = 0; i <= 2; i++) {
			if(field[i] !== undefined && field[i] === field[i + 3] && field[i + 3] === field[i + 6]) {
				return [i, i + 3, i + 6];
			}
		}
		for(let i = 0, j = 4; i <= 2; i += 2, j -= 2) {
			if(field[i] !== undefined && field[i] == field[i + j] && field[i + j] === field[i + 2 * j]) {
				return [i, i + j, i + 2 * j];
			}
		}
	},
	hasWinner(field) {
		return !!this.winnerRow(field);
	},
	isEnd(field) {
		return field.filter((cell) => {
				return cell === undefined;
	}).length === 0;
	},
	aiTurn() {
		const { field, playerSide, history } = this.state;
		let choice;
		const score = (side, depth) => {
			return side === undefined ? 0 : side === playerSide ? 10 - depth : depth - 10
		};
		const availableTurns = (field) => field.reduce((acc, cell, i) => {
			if (cell === undefined) return acc.concat([i]);
	else return acc;
	}, []);
		//var drawBoard = b => '\n' + _.chunk(b, 3).map(line => '|' + line.map(point => point === true ? 'X' : point === false ? 'O' : ' ').join('|') + '|').join('\n') + '\n'
		//undefined;
		const minimax = (game, depth) => {
			if (this.hasWinner(game.board)) {
				return score(game.side, depth);
			}
			if (this.isEnd(game.board)) {
				return score (undefined, depth);
			}
			let scores = [];
			let moves = [];
			availableTurns(game.board).forEach((move) => {
				const possibleGame = {
					board: [...game.board.slice(0, move), game.side, ...game.board.slice(move + 1, game.board.length)],
			side: !game.side
		};
			scores.push(minimax(possibleGame, depth + 1));
			moves.push(move)
		});
			const winIndexMove = scores.indexOf((game.side !== playerSide ? _.max : _.min)(scores));
			choice = moves[winIndexMove];
			return scores[winIndexMove];
		};
		minimax({board: field, side: !playerSide}, 0);
		if (choice !== undefined) {
			setTimeout(() => this.setState({
				field: [...field.slice(0, choice), !playerSide, ...field.slice(choice + 1, field.length)],
			history: history.concat([choice])
		}), 1000)
		}
	},
	handleClick(cell) {
		if (this.state.field[_.last(this.state.history)] === this.state.playerSide) return;
		if (this.state.history.length === 0 && this.state.playerSide === false) return;
		return () => {
			const { field, history, playerSide } = this.state;
			if (field[cell] === undefined) {
				this.setState({
					field: [...field.slice(0, cell), playerSide, ...field.slice(cell + 1, field.length)],
				history: history.concat([cell])
			}, () => this.aiTurn())
			}
		}
	},
	handleStart() {
		const { field, playerSide, history } = this.state;
		const centerCell = 4;
		if ( history.length === 0 && playerSide === false) {
			this.setState({
				field: [...field.slice(0, centerCell), !playerSide, ...field.slice(centerCell + 1, field.length)],
				history: history.concat([centerCell])
			})
		}
	},
	handleSideClick(side) {
		this.setState({playerSide: side,
			field: [
				undefined, undefined, undefined,
				undefined, undefined, undefined,
				undefined, undefined, undefined
			],
			history: []
		}, () => {
			if (side === false) this.handleStart();
		})
	},
	render() {
		const { field, history, playerSide } = this.state;
		const winner = this.hasWinner(field) ? field[_.last(history)] : undefined;
		const winnerRow = this.winnerRow(field);
		const end = this.isEnd(field);
		return <div className='game'>
			<div className='table'>
				<div className='interface'>
					<i className='fa fa-android fa-4x' onClick={() => this.handleSideClick(false)} />
					<i className='fa fa-user fa-4x' onClick={() => this.handleSideClick(true)} />
				<span>Choose</span>
				<div className='config'>
					<div className={classNames({'xo': true, 'choosen-sign': playerSide})}
				onClick={() => this.handleSideClick(true)}>X</div>
					<div className={classNames({'xo': true, 'choosen-sign': !playerSide})}
					onClick={() => this.handleSideClick(false)}>O</div>
				</div>
			</div>
		<div className='cells-wrapper'>
			{field.map((cell, i) =>
				<div key={i}
						 className={classNames('cell', cellBordersClass(i), {
						   'winner': winner !== undefined && winnerRow.indexOf(i) !== -1
						 })}
						 onClick={winner !== undefined || end ? () => _ : this.handleClick(i)}>
					{definition[cell]}
				</div>
			)}
		</div>
			</div>
		</div>
	}
});

export default Game;
