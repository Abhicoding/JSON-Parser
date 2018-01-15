/* wrting a json parser to verify it the given input is in valid json format */

// Let's change something to test.

// var jsonParse = (function(){

'use strict'

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
    parseOut = [x.slice(0, 4).join('')].concat(x.slice(4).join(''))// console.log(parseOut);
    if (parseOut[0] == 'null') {
      return parseOut[1]
    } else {
      return null
    }
  }
}

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

function parseString (input) {
  let reg = /\"([^"]*)\"/
  let parseOut = input.match(reg)// console.log(parseOut)
  if (parseOut == null || Number(parseOut.index) !== 0) {
    return null
  } else {
    return String(input.slice(parseOut[1].length + 2))
  }
}

function parseNumber (input) {
  let reg = /\"?^(\-?\d+(\.\d+)?([eE][+-]?\d+)?)/
  let parseOut = input.match(reg)// console.log(parseOut[0])
  if (parseOut == null || parseOut[0] == undefined) {
    return null
  } else {
    return input.slice(parseOut[0].length)
  }
}

function parseArray (input) {
  let reg = /\[(.*)\]/
  let parseOut = input.match(reg)
  if (parseOut == null || parseOut[0] == undefined) {
    return null
  } else {
    if (arrayHelper(parseOut[1])) {
      return input.slice(parseOut[0].length)
    } else {
      return null
    }
  }
}

function parseSpace (input) {
  let reg = /(^\s+)/
  let parseOut = input.match(reg)
  if (parseOut == null || parseOut[0] == undefined) {
    return null
  } else if (parseOut[0] == '') {
    return null
  } else {
    return input.slice(parseOut[0].length)
  }
}

function parseComma (input) {
  let reg = /^\,/
  let parseOut = input.match(reg)// console.log(parseOut)
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
    if (x == '' && (commacount == 0 || commacount == undefined)) {
      return true
    } else if (value(x) != null && x != '') {
      x = value(x)
      objcount += 1
      commacount = 0
    } else if (parseSpace(x) != null && (objcount <= 1)) {
      x = parseSpace(x)// console.log('was in space')
    } else if (parseComma(x) && objcount == 1 && commacount == 0) {
      x = parseComma(x)
      commacount = 1
      objcount = 0
    } else {
      return null
    }
  }
}

console.log(value('[[1, 2, 3], 12abc'))
console.log(value('truea'))
console.log(value('false'))
console.log(value('null'))
console.log(parseSpace('null'))
