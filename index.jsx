require("./node_modules/bootstrap/dist/css/bootstrap.min.css");
require("./node_modules/font-awesome/css/font-awesome.min.css");
import Game from './app/tictactoe'
import React from 'react';
import ReactDOM from 'react-dom';
import './app/main.css';

var div = document.createElement('div');
document.body.appendChild(div);
ReactDOM.render(<Game/>, div);
