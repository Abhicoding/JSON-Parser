/* wrting a json parser to verify it the given input is in valid json format */

// Let's change something to test.

// var jsonParse = (function(){

'use strict'

const valueParser = function (input) {
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
  if (input.slice(0, 4) === 'null') {
    return [input.slice(0, 4)].concat(input.slice(4))
  } else { return null }
}

function parseBoolean (input) {
  if (input.slice(0, 4) === 'true') {
    return [input.slice(0, 4)].concat(input.slice(4))
  } else if (input.slice(0, 5) === 'false') {
    return [input.slice(0, 5)].concat(input.slice(5))
  } else { return null }
}

function parseString (input) {
  let reg = /\"([^"]*)\"/, parseOut = input.match(reg)
  if (parseOut) {
    return [input.slice(0, parseOut[0].length)].concat(input.slice(parseOut[1].length + 2))
  } else { return null }
}

function parseNumber (input) {
  let reg = /\"?^(\-?\d+(\.\d+)?([eE][+-]?\d+)?)/, parseOut = input.match(reg)// console.log(parseOut[0])
  if (parseOut) {
    return [parseOut[0]].concat(input.slice(parseOut[0].length))
  } else { return parseOut }
}

function parseArray (input) {
  let reg = /\[(.*)\]/, parseOut = input.match(reg)
  if (parseOut) {
    if (arrayHelper(parseOut[1])) {
      return [input.slice(0, parseOut[0].length)].concat(input.slice(parseOut[0].length))
    }
  } else { return null }
}

function parseSpace (input) {
  let reg = /(^\s+)/, parseOut = input.match(reg)
  if (parseOut) {
    return [input.slice(0, parseOut[0].length)].concat(input.slice(parseOut[0].length))
  } else { null }
}

function parseComma (input) {
  let reg = /^\,/, parseOut = input.match(reg)
  if (parseOut) {
    return [input.slice(0, parseOut[0].length)].concat(input.slice(parseOut[0].length))
  }
}

function arrayHelper (input) {    // Takes insides of an array excluding []
  let x = input, commacount, objcount = 0

  while (true) {
    if (x == '' && (commacount == 0 || commacount == undefined)) {
      return true
    } else if (valueParser(x) != null && x != '') {
      x = valueParser(x)
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

console.log(parseComma(',,,,    \"rare\"0.23e-falsabc'))

// console.log(valueParser('truea'))
// console.log(valueParser('false'))
// console.log(valueParser('null'))
// console.log(parseSpace('null'))
