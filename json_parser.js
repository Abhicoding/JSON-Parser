/* wrting a json parser to verify it the given
input is in valid json format */

// Let's change something to test.

// var jsonParse = (function(){

'use strict'

 // function main() {
  // var r_temp = readLine();
// }

//  Test for null
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
      return parseOut
    } else {
      return null
    }
  }
}

//  Test for Boolean
function parseBoolean (input) {
  let x = input.split(''), parseOut
  if (x[0] == 't') {
    if (x.length < 4) {
      return null
    } else {
      parseOut = [x.slice(0, 4).join('')].concat(x.slice(5).join(''))
      if (parseOut[0] == 'true') {
        return parseOut
      }
    } return null
  } else if (x[0] == 'f') {
    if (x.length < 5) {
      return null
    } else {
      parseOut = [x.slice(0, 5).join('')].concat(x.slice(6).join(''))
      if (parseOut[0] == 'false') {
        return parseOut
      }
    } return null
  }
}

//  Test for String
function parseString (input) {
  let reg = /\"([^"]*)\"/
  let parseOut = input.match(reg)
  console.log(parseOut)
  if (parseOut == null || Number(parseOut.index) !== 0) {
    return null
  } else {
    return [parseOut[1], input.slice(parseOut[1].length + 2)]
  }
}

//  Test for Number
function parseNumber (input) {
  let reg = /\"?^(\-?\d+(\.\d+)?([eE][+-]?\d+)?)/
  let parseOut = input.match(reg)
  // console.log(parseOut);
  if (parseOut == null || parseOut[0] == undefined) {
    return null
  } else {
    return [parseOut[0], input.slice(parseOut[0].length)]
  }
}

//  Test for Array
function parseArray (input) {
  let reg = /\[(.*)\]/
  let parseOut = input.match(reg)
  // console.log(parseOut);
  if (parseOut == null || parseOut[0] == undefined) {
    return null
  } else {
    return [parseOut[1]].concat(input.slice(parseOut[0].length))
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
    return [parseOut[1], input.slice(parseOut[0].length)]
  }
}
//  Test for Object (JSON object)
//  Test for function
//  Test for date
//  Test for undefined
// console.log(parseString("\"efg\n\"abcd"));
let x = parseArray('[[123, "a", [\'a\']]]"-1.-E-1"')
console.log(x)
let y = parseArray(x[0])
console.log(y)
let z = parseNumber(y[0])
console.log(z)
// console.log(parseBoolean('trueeee'))
// }
