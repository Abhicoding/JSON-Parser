/* wrting a json parser to verify it the given input is in valid json format */

const valueParser = factoryParser([parseNull, parseBoolean, parseNumber, parseString, parseArray, parseObject])

function factoryParser (args) {
  return function (input) {
    for (let x of args) {
      if (x(input)) {
        return x
      }
    }
     return null
  }
}

function parseNull (input) {
  if (input.substr(0, 4) === 'null') {
    return [null, input.substr(4)]
  }
  return null
}

function parseBoolean (input) {
  if (input.substr(0, 4) === 'true') {
    return [true, input.substr(4)]
  } else if (input.substr(0, 5) === 'false') {
    return [false, input.substr(5)]
  }
  return null
}

function parseString (input) {
  if (input[0] == '\"') {
    input = input.substr(1)
    let parseOut = ''
    while (input[0] !== '\"') {
      if (input == '') {
        return null
      }
      if (input[0] == '\\'){
        parseOut += input.substr(0, 2)
        input = input.substr(2)
      }
      parseOut += input[0]
      input = input.substr(1)
    }
    return [parseOut, input.substr(1)]
  }
  return null
}

function parseNumber (input) {
  let reg = /^(\-?\d+(\.\d+)?([eE][+-]?\d+)?)/, parseOut = input.match(reg)
  if (parseOut) {
    return [Number(parseOut[0]), input.slice(parseOut[0].length)]
  }
  return null
}

function parseArray (input) {
  if (input[0] == '[') {
    let result = input, parseOut = []
    result = result.substr(1)
    while (result[0] !== ']') {
      if (parseSpace(result) !== null) {
        result = parseSpace(result)[1]
      } else {
        if (valueParser(result) !== null){
          result = valueParser(result)(result)
          parseOut.push(result[0])
          result = result[1]
        }else{
          return null
        }
        if (parseSpace(result) !== null) {
          result = parseSpace(result)[1]
        }
        if (result[0] == ',') {
          result = parseComma(result)[1]
          if (parseSpace(result) !== null) {
            result = parseSpace(result)[1]
          }
          if (valueParser(result) !== null) {
            continue
          } else { return null }
        }
      }
    } return [parseOut].concat(result.substr(1))
  } return null
}

function parseSpace (input) {
  let reg = /(^[\s\t\n\r]+)/, parseOut = input.match(reg)
  if (parseOut) {
    return [parseOut[0], input.slice(parseOut[0].length)]
  }
  return null
}

function parseComma (input) {  // don't really need this
  let reg = /^\,/, parseOut = input.match(reg)
  if (parseOut) {
    return [parseOut[0], input.slice(parseOut[0].length)]
  }
  return null
}

function parseColon (input) { // don't really need this
  let reg = /^\:/, parseOut = input.match(reg)
  if (parseOut) {
    return [parseOut[0], input.slice(parseOut[0].length)]
  }
  return null
}

function parseObject (input) {
  if (input[0] == '{') {
    let result = input, r1, r2, parseOut = {}
    result = result.substr(1)
    while (result[0] !== '}') {
      if (parseSpace(result) !== null) {
        result = parseSpace(result)[1]
      } else {
        if (parseString(result) !== null){
          result = parseString(result), r1 = result[0]
          result = result[1], commacount = 0
          if (parseSpace(result) !== null) {
            result = parseSpace(result)[1]
          }
          if (result[0] == ':') {
            result = parseColon(result)[1]
            if (parseSpace(result) !== null) {
              result = parseSpace(result)[1]
            }
            if(valueParser(result) !== null){
              result = valueParser(result)(result), r2 = result[0]
              result = result[1], parseOut[r1] = r2
            }else{
              return null
            }
            if (parseSpace(result) !== null) {
              result = parseSpace(result)[1]
            }
            if (result[0] == ',') {
              result = parseComma(result)[1]
              if (parseSpace(result) !== null) {
                result = parseSpace(result)[1]
              }
              if (result[0] == ']') {
                return null
              }
              if (result[0] !== '"') { return null }
            } else { continue }
          } else { return null }
        } else { return null }
      }
    } return [parseOut].concat(result.substr(1))
  } return null
}

const jsonParse = function (input) {
  let x
  if(parseSpace(input) !== null){
    input = parseSpace(input)[1]
  }
  if (valueParser(input) !== null) {
    x = valueParser(input)(input)
    if(parseSpace(x[1]) !== null){
      let y = parseSpace(x[1])
      x = [x[0], y[1]]
    }
    if (x[1] === '') {
      return x[0]
    } else {
      console.log("Error: couldn't parse completely due to invalid JSON :")
      return x
    }
  } return 'Error: Invalid JSON '
}

exports.parse = jsonParse



//console.log(parseObject('{"favorited" : false}'))
//console.log(parseString('"abc\\\"c"d"'))
//console.log(parseObject('{ "a" : }'))
/*
console.log(parseArray('[ "a" ,, "b"]'))
console.log(parseArray('[ "a" 1 , "b"]'))
console.log(parseArray('[ "a" , "b"]]'))
console.log(parseArray('[ "a" ,]'))
console.log(parseArray('[ "a" , ["b"]]'))
console.log(parseArray('[["created_at", "Thu Jun 22 21:00:00 +0000 2017"]]'))*/