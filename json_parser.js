/* wrting a json parser to verify it the given input is in valid json format */

// var jsonParse = (function(){

'use strict'

const valueParser = factoryParser([parseNull, parseBoolean, parseNumber, parseString, parseArray, parseObject])

function factoryParser (args) {
  return function parser (input) {
    if (parseSpace(input)) {
      input = parseSpace(input)[1]
    }
    for (let x in args) {
      if (args[x](input)) {
        return args[x](input)[0]
      }
    }
  }
}

console.log(valueParser('    123'))

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
  let reg = /^\"(.*)\"/, parseOut = input.match(reg)
  if (parseOut) {
    return [input.slice(0, parseOut[0].length)].concat(input.slice(parseOut[1].length + 2))
  } else { return null }
}

function parseNumber (input) {
  let reg = /^(\-?\d+(\.\d+)?([eE][+-]?\d+)?)/, parseOut = input.match(reg)// console.log(parseOut[0])
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
  } else { return null }
}

function arrayHelper (input) {    // validates insides of an array excluding []
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

// console.log(parseArray('[123]'))
// console.log(objectHelper('\"123\": "abc", \"12\": \"1\"'))
// console.log(parseObject('\"a\"-12.3e '))
// console.log(valueParser('truea'))
// console.log(valueParser('false'))
// console.log(valueParser('null'))
// console.log(parseSpace('null'))
