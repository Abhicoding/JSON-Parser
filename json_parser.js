/* wrting a json parser to verify it the given input is in valid json format */

const valueParser = factoryParser([parseNull, parseBoolean, parseNumber, parseString, parseArray, parseObject])

function factoryParser (args) {
  return function parser (input) {
    for (let x of args) {
      if (x(input)) {
        return x
      }
    } return null
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
// console.log(parseString('"abc""def"'))

function parseNumber (input) {
  let reg = /^(\-?\d+(\.\d+)?([eE][+-]?\d+)?)/, parseOut = input.match(reg)
  if (parseOut) {
    return [Number(parseOut[0])].concat(input.slice(parseOut[0].length))
  } else { return parseOut }
}

function parseArray (input) {
  let result = input, parseOut = []
  if (result[0] !== '[') {
    return null
  }
  result = result.substr(1)
  while (result[0] !== ']') {
    if (result[0] == ' ') {
      result = parseSpace(result)[1]
    } else {
      try {
        result = valueParser(result)(result)
        parseOut.push(result[0])
        result = result[1]
        if (result[0] == ' ') {
          result = parseSpace(result)[1]
        }
        if (result[0] == ',') {
          result = parseComma(result)[1]
          if (result[0] == ' ') {
            result = parseSpace(result)[1]
          }
          if (valueParser(result) !== null) {
            continue
          } else { return null }
        }
      } catch (TypeError) { return null }
    }
  } return [parseOut].concat(result.substr(1))
}

function parseSpace (input) {
  let reg = /(^\s+)/, parseOut = input.match(reg)
  if (parseOut) {
    return [input.slice(0, parseOut[0].length)].concat(input.slice(parseOut[0].length))
  } else { null }
}

function parseComma (input) {  // don't really need this
  let reg = /^\,/, parseOut = input.match(reg)
  if (parseOut) {
    return [input.slice(0, parseOut[0].length)].concat(input.slice(parseOut[0].length))
  } else { return null }
}

function parseColon (input) { // don't really need this
  let reg = /^\:/, parseOut = input.match(reg)
  if (parseOut) {
    return [input.slice(0, parseOut[0].length)].concat(input.slice(parseOut[0].length))
  } else { return null }
}

function parseObject (input) {
  let result = input, r1, r2, parseOut = {}
  if (input[0] !== '{') {
    return null
  }
  result = result.substr(1)
  while (result[0] !== '}') {
    if (result[0] == ' ') {
      result = parseSpace(result)[1]
    } else {
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
          // try {
          result = valueParser(result)(result), r2 = result[0]
          result = result[1], parseOut[r1] = r2
          // } catch (TypeError) { return null }
          if (result[0] == ' ') {
            result = parseSpace(result)[1]
          }
          if (result[0] == ',') {
            result = parseComma(result)[1]
            if (result[0] == ' ') {
              result = parseSpace(result)[1]
            }
            if (result[0] == ']') {
              return null
            }
            if (result[0] !== '"') { return null }
          } else { continue }
        } else { return null }
      } catch (TypeError) { return null }
    }
  } return [parseOut].concat(result.substr(1))
}

console.log(parseObject('{"": 1}abcd'))

const jsonParse = function (input) {
  let x
  if (valueParser(input) !== null) {
    x = valueParser(input)(input)
    if (x[1] === '') {
      return x[0]
    } else {
      console.log("Error: couldn't parse completely due to invalid JSON :")
      return x
    }
  } console.log('Error: Invalid JSON ')
  return x
}

console.log(jsonParse('[1,2]]'))
/*
console.log(parseObject('{ "a" : }'))
console.log(parseArray('[ "a" ,, "b"]'))
console.log(parseArray('[ "a" 1 , "b"]'))
console.log(parseArray('[ "a" , "b"]]'))
console.log(parseArray('[ "a" ,]'))
console.log(parseArray('[ "a" , ["b"]]'))
console.log(parseArray('[ ]')) */
