'use strict';
const socket = io();

socket.on('init', data => console.log(data));
