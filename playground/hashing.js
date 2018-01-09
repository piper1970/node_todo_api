'use strict';
const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

// jwt.sign
// jwt.verify

let data = {
  id: 10
};
let token = jwt.sign(data, 'some secret');
console.log(`Token: ${token}`);

let decoded = jwt.verify(token, 'some secret');
console.log('Decoded', decoded);


//
// let message = 'I am a little teapot!';
//
// let hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);
//
// let data = {
//   id: 45
// };
//
// let token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'some secret goes here').toString()
// };
//
// let resultHash = SHA256(JSON.stringify(token.data) + 'some secret goes here').toString();
//
// if(resultHash === token.hash){
//   console.log('Data was not changed');
// }else{
//   console.log('Data was changed');
// }
