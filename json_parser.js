/* wrting a json parser to verify it the given
input is in valid json format */

// Let's change something to test.

// var jsonParse = (function(){

'use strict'

 // function main() {
  // var r_temp = readLine();
// }

//  Test for null
var value = function (input) {
  if (input[0] == ' ') {
    return null
  } else if (input[0] == 'n') {
    return parseNull(input)
  } else if (input[0] == 't' || input[0] == 'f') {
    return parseBoolean(input)
  } else if (input[0] == '\"') {
    return parseString(input)
  } else if ((input[0] == '-' && input[1] > 0) || input[0] > 0) {
    return parseNumber(input)
  } else if (input[0] == '[') {
    return parseArray(input)
  } else {
    return null
  }
}

function parseNull (input) {
  let x = input.split(''), parseOut
  if (x[0] !== 'n') {
    return null
  } else if (x.length < 4) {
    return null
  } else {
    parseOut = [x.slice(0, 4).join('')].concat(x.slice(4).join(''))
    // console.log(parseOut);
    if (parseOut[0] == 'null') {
      return parseOut[1]
    } else {
      return null
    }
  }
}

//  Test for Boolean
function parseBoolean (input) {
  let x = input, parseOut
  if (x[0] == 't') {
    if (x.length < 4) {
      return null
    } else {
      parseOut = x.slice(0, 4)
      if (parseOut == 'true') {
        return x.slice(4)
      }
    } return null
  } else if (x[0] == 'f') {
    if (x.length < 5) {
      return null
    } else {
      parseOut = x.slice(0, 5)
      if (parseOut == 'false') {
        return x.slice(5)
      }
    } return null
  }
}

//  Test for String
function parseString (input) {
  let reg = /\"([^"]*)\"/
  let parseOut = input.match(reg)
  // console.log(parseOut)
  if (parseOut == null || Number(parseOut.index) !== 0) {
    return null
  } else {
    return String(input.slice(parseOut[1].length + 2))
  }
}

//  Test for Number
function parseNumber (input) {
  let reg = /\"?^(\-?\d+(\.\d+)?([eE][+-]?\d+)?)/
  let parseOut = input.match(reg)
  // console.log(parseOut[0])
  if (parseOut == null || parseOut[0] == undefined) {
    return null
  } else {
    return input.slice(parseOut[0].length)
  }
}

//  Test for Array
function parseArray (input) {
  let reg = /\[(.*)\]/
  let parseOut = input.match(reg)
  if (parseOut == null || parseOut[0] == undefined) {
    return null
  } else {
    // console.log()
    /* if (parseOut[1][0] = '[') {
      return parseArray(parseOut[1])
    } else */if (arrayHelper(parseOut[1])) {
      return input.slice(parseOut[0].length)
    } else {
      return null
    }
  }
}

function parseSpace (input) {
  let reg = /(^\s*)/
  let parseOut = input.match(reg)
  if (parseOut == null || parseOut[0] == undefined) {
    return null
  } else if (parseOut[0] == '') {
    return null
  } else {
    return input.slice(parseOut[0].length)
  }
}

// console.log(parseString("\"efg\n\"abcd"));
// let x = parseArray('[]-1.-E-1"')
// console.log(parseNumber(parseArray(x[0])[0]))

function parseComma (input) {
  let reg = /^\,/
  let parseOut = input.match(reg)
  // console.log(parseOut)
  if (parseOut == null || parseOut[0] == undefined) {
    return null
  } else if (parseOut[0] == '') {
    return null
  } else {
    return input.slice(parseOut[0].length)
  }
}

function arrayHelper (input) {    // Takes insides of an array excluding []
  let x = input, commacount, objcount = 0, i = 0

  while (i == 0) {
    // console.log(x, x == '')
    // console.log(typeof (x), parseComma(x), parseSpace(x), objcount, commacount)
    if (x == '' && (commacount == 0 || commacount == undefined)) {
      return true
    } else if (value(x) != null && x != '') {
      x = value(x)
      // console.log('found a value')
      objcount += 1
      commacount = 0
    } else if (parseSpace(x) != null && (objcount <= 1)) {
      x = parseSpace(x)
      // console.log('was in space')
    } else if (parseComma(x) && objcount == 1 && commacount == 0) {
      x = parseComma(x)
      commacount = 1
      objcount = 0
    } else {
      return null
    }
  }
}

// if (parseArray(x[0][0])) {
  // console.log(parseArray(x[0][0]))
// console.log(parseNumber(parseArray(x[0][0])[0]))
// }
/* if (parseNumber(x[0])) {
  x = parseArray(x[1])
  console.log(x)
} */
// console.log(parseSpace(' ') == '')
console.log(value(''))
console.log(value('nul'))
console.log(value('nulL'))
console.log(value('anull'))
// console.log(arrayHelper('1'))
// console.log(value('1') != null)

// console.log('\"abc\"', 'strig experiment')
// console.log(arrayHelper(['"abcd", 1234', 'just some things']))
// }
