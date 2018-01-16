/* wrting a json parser to verify it the given input is in valid json format */

// var jsonParse = (function(){

'use strict'

const valueParser = factoryParser([/* parseSpace, parseComma, parseColon, */ parseNull, parseBoolean, parseNumber, parseString, /* parseArray, */ parseObject])

function factoryParser (args) {
  return function parser (input) {
    for (let x in args) {
      if (args[x](input)) {
        return args[x]
      }
    }
  }
}

// console.log(valueParser('1') == parseNumber)

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
  let i = 0
  if (input[i] == '\"') {
    i++
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
  let reg = /^(\-?\d+(\.\d+)?([eE][+-]?\d+)?)/, parseOut = input.match(reg)// console.log(parseOut[0])
  if (parseOut) {
    return [parseOut[0]].concat(input.slice(parseOut[0].length))
  } else { return parseOut }
}

function parseArray (input) {
  let reg = /^\[(.*)\]/, regMatch = input.match(reg), result, commacount = 0, objcount = 0, parseOut = []
  if (regMatch) {
    result = regMatch[1]
    if (result == '') {
      return [parseOut].concat(input.slice(regMatch[0].length))
    } else {
      while (result != '') {
        if (result[0] == ' ') {
          result = parseSpace(result)[1]
        } else if (result[0] == ',' && commacount == 0 && objcount == 1) {
          result = parseComma(result)[1]
          commacount += 1, objcount = 0
        } else if (objcount == 0) {
          try {
            console.log(result)
            result = valueParser(result)(result)
            parseOut.push(result[0])
            result = result[1], commacount = 0, objcount += 1
          } catch (TypeError) { return null }
        }
      } return ([parseOut].concat(input.slice(regMatch[0].length)))
    }
  } else { return null }
}

console.log(parseArray('[ "a" , "b"]'))
console.log(parseString('"a" , "b"'))

// console.log(valueParser('{"123" : "a"}'))
/* function arrayHelper (input) {    // validates insides of an array excluding []
  let x = input, commacount, objcount = 0
  while (true) {
    if (x == '' && (commacount == 0 || commacount == undefined)) {
      return true
    } else if (valueParser(x)) {
      x = valueParser(x)[1], objcount += 1, commacount = 0
    } else if (parseSpace(x) && (objcount <= 1)) {
      x = parseSpace(x)[1]// console.log('was in space')
    } else if (parseComma(x) && objcount == 1 && commacount == 0) {
      x = parseComma(x)[1], commacount = 1, objcount = 0
    } else {
      return null
    }
  }
} */

function parseSpace (input) {
  let reg = /(^\s+)/, parseOut = input.match(reg)
  if (parseOut) {
    return [input.slice(0, parseOut[0].length)].concat(input.slice(parseOut[0].length))
  } else { null }
}

function parseComma (input) {
  /* if (input[0] == ' ') {
    input = parseSpace(input)[1]
  } */
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
  let reg = /\{(.*)\}/, parseOut = input.match(reg)
  if (parseOut) {
    if (objectHelper(parseOut[1])) {
      return [parseOut[0]].concat(input.slice(parseOut[0].length))
    }
  } else { return null }
}

function objectHelper (input) {
  let x = input, commacount = 0, coloncount = 0, keycount = 0, valuecount = 0
  while (true) {
    console.log(x, commacount, coloncount, keycount, valuecount)
    if (x === '' && ((keycount && coloncount && valuecount && !commacount) || (!keycount && !coloncount && !valuecount && !commacount))) {
      return true
    } else if (parseSpace(x)) {
      x = parseSpace(x)[1]
    } else if (parseString(x) && !keycount) {
      x = parseString(x)[1], keycount += 1, commacount = 0, coloncount = 0, valuecount = 0
    } else if (parseColon(x) && keycount && !valuecount && !coloncount && !commacount) {
      x = parseColon(x)[1], coloncount += 1
    } else if (valueParser(x) && keycount && coloncount) {
      x = valueParser(x)[1], valuecount += 1
    } else if (parseComma(x) && keycount && coloncount && valuecount) {
      x = parseComma(x)[1], commacount += 1, keycount = 0
    } else { return null }
  }
}
