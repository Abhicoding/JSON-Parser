/* A json parser to verify if the given input is in valid json format */

const valueParser = factoryParser(parseNull, parseBoolean, parseNumber, parseString, parseArray, parseObject)

function factoryParser (...args) {
  return function (input) {
    for (let x of args) {
      if (x(input)) return x
    }
    return null
  }
}

function parseNull (input) {
  return input.startsWith('null') ? [null, input.substr(4)] : null
}

function parseBoolean (input) {
  if (input.substr(0, 4) === 'true') return [true, input.substr(4)]
  return input.startsWith('false') ? [false, input.substr(5)] : null
}

function parseString (input) {
  if (input[0] === '\"') {
    input = input.substr(1)
    let parseOut = ''
    while (input[0] !== '\"') {
      if (input == '') return null
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
  return parseOut ? [Number(parseOut[0]), input.slice(parseOut[0].length)] : null
}

function parseArray (input) {
  if (input[0] == '[') {
    let result = input.substr(1), parseOut = [], temp
    while (result[0] !== ']') {
      if (parseSpace(result) !== null) result = parseSpace(result)[1]
      if (valueParser(result) !== null) {
        [temp, result] = valueParser(result)(result)
        parseOut.push(temp)
      }
      if (parseSpace(result) !== null) result = parseSpace(result)[1]
      if (result[0] == ',') {
        result = result.substr(1)
        if (parseSpace(result) !== null) result = parseSpace(result)[1]
        if (valueParser(result) !== null) continue
        else return null
      }
    } return [parseOut].concat(result.substr(1))
  } return null
}

function parseSpace (input) {
  let reg = /(^[\s\t\n\r]+)/, parseOut = input.match(reg)
  return parseOut ? [parseOut[0], input.slice(parseOut[0].length)] : null
}

function parseObject (input) {
  if (input[0] == '{') {
    let result = input.substr(1), r1, r2, parseOut = {}
    while (result[0] !== '}') {
      if (parseSpace(result) !== null) result = parseSpace(result)[1]
      if (parseString(result) !== null) {
        [r1, result] = parseString(result)
        if (parseSpace(result) !== null) result = parseSpace(result)[1]
        if (result[0] == ':') {
          result = result.substr(1)
          if (parseSpace(result) !== null) result = parseSpace(result)[1]
          if(valueParser(result) !== null) {
            [r2, result] = valueParser(result)(result), parseOut[r1] = r2
          } else return null
          if (parseSpace(result) !== null) result = parseSpace(result)[1]
          if (result[0] == ',') result = result.substr(1)
          else continue
        } else return null
      } else return null
    } return [parseOut].concat(result.substr(1))
  } return null
}

const jsonParse = function (input) {
  if (valueParser(input) !== null) {
    var x = valueParser(input)(input)
    if (x[1] === '') return x[0]
    return x
  } return 'Error: Invalid JSON '
}

exports.parse = jsonParse



//console.log(parseObject('{"favorited" : false}'))
//console.log(parseString('"abc\\\"c"d"'))
//console.log(parseObject('{ "a" : }'))
// console.log(parseNumber('[ "a" ,, "b"]')) //null
// console.log(parseNumber('[ "a" 1 , "b"]'))
// console.log(parseArray('[ "a" , "b"]]'))
// console.log(parseArray('[ "a" ,]')) //null
// console.log(parseArray('[ "a" , ["b"]]'))
// console.log(parseArray('[[\"created_at\", \"Thu Jun 22 21:00:00 +0000 2017\"]]', 'parsearray'))

// function parseArray2 (input) {
//   if (input[0] !== '[') return null
//   var result = input.substr(1), parseOut = [], temp = ''
//   while (result[0] !== ']') {
//     if (parseSpace(result)) result = parseSpace(input)[1]
//     console.log(result, 'array2')
//     if (valueParser(result)){
//       [temp, result] = valueParser(result)(result)
//       parseOut.push(temp)
//       if (parseSpace(result)) result = parseSpace(input)[1]
//       if (result[0] === ',') {
//         result = input.substr(1)
//         continue
//       }
//       if (result[0] !== ']') return null
//       continue
//     } return null
//   } return [parseOut, result.substr(1)]
// }