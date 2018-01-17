/* wrting a json parser to verify it the given input is in valid json format */

// var jsonParse = (function(){

'use strict'

const valueParser = factoryParser([parseNull, parseBoolean, parseNumber, parseString, parseArray, parseObject])

function factoryParser (args) {
  return function parser (input) {
    for (let x of args) {
      if (x(input)) {
        return x
      }
    }
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
  let i = 1
  if (input[i - 1] == '\"') {
    while (input[i] !== '\"') {
      if (i == input.length) {
        return null
      }i++
    }
    return ([input.slice(1, i)].concat(input.slice(i + 1)))
  } else {
    return null
  }
}

function parseNumber (input) {
  let reg = /^(\-?\d+(\.\d+)?([eE][+-]?\d+)?)/, parseOut = input.match(reg)
  if (parseOut) {
    return [parseOut[0]].concat(input.slice(parseOut[0].length))
  } else { return parseOut }
}

function parseArray (input) {
  let result = input, commacount = 0, objcount = 0, parseOut = []
  if (result[0] !== '[') {
    return null
  } else {
    result = result.substr(1)
    while (result[0] !== ']') {
      if (result[0] == ' ') {
        result = parseSpace(result)[1]
      } else if (objcount == 0) {
        try {
          result = valueParser(result)(result)
          parseOut.push(result[0]), result = result[1], commacount = 0, objcount += 1
        } catch (TypeError) { return null }
      } else if (result[0] == ',' && commacount == 0 && objcount == 1) {
        result = parseComma(result)[1]
        commacount += 1, objcount = 0
        if (result[0] == ' ') {
          result = parseSpace(result)[1]
        }
        try {
          result = valueParser(result)(result)
          parseOut.push(result[0]), result = result[1], commacount = 0, objcount += 1
        } catch (TypeError) { return null }
      } else { return null }
    } return [parseOut].concat(result.substr(1))
  }
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
  } else { return null }
}

function parseColon (input) {
  let reg = /^\:/, parseOut = input.match(reg)
  if (parseOut) {
    return [input.slice(0, parseOut[0].length)].concat(input.slice(parseOut[0].length))
  } else { return null }
}

function parseObject (input) {
  let result = input, r1, r2, parseOut = {}, commacount = 1
  if (input[0] !== '{') {
    return null
  } else {
    result = result.substr(1)
    while (result[0] !== '}') {
      if (result[0] == ' ') {
        result = parseSpace(result)[1]
      } else if (commacount == 1) {
        try {
          result = parseString(result), r1 = result[0]
          result = result[1], commacount = 0
          if (result[0] == ' ') {
            result = parseSpace(result)[1]
          }
          if (result[0] == ':') {
            result = parseColon(result)[1]
            if (result[0] == ' ') {
              result = parseSpace(result)[1]
            }
            try {
              result = valueParser(result)(result), r2 = result[0]
              result = result[1], parseOut[r1] = r2
            } catch (TypeError) { return null }
            if (result[0] == ' ') {
              result = parseSpace(result)[1]
            }
            if (result[0] == ',') {
              result = parseComma(result)[1], commacount = 1
              if (result[0] == ' ') {
                result = parseSpace(result)[1]
              }
              if (result[0] !== '"') { return null }
            } else { continue }
          } else { return null }
        } catch (TypeError) { return null }
      } else { return null }
    } return [parseOut].concat(result.substr(1))
  }
}

/*
console.log(parseArray('[ "a" , "b"]'))
console.log(parseArray('[ "a" ,, "b"]'))
console.log(parseArray('[ "a" 1 , "b"]'))
console.log(parseArray('[ "a" , "b"]]'))
console.log(parseArray('[ "a" ,]'))
console.log(parseArray('[ "a" , ["b"]]'))
console.log(parseArray('[ ]'))
*/
