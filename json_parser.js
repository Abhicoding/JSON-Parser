/* wrting a json parser to verify it the given
input is in valid json format*/ 

//Let's change something to test.

var jsonParse = (function(){
 
 )

	
//  Test for null
function parseNull(input){
	let x = input.split(''), parseOut;
	if (x[0] !== 'n'){
		return null;
	}else if(length.x < 4){
      return null;
    }else{
        parseOut = [x.slice(0, 4).join('')].concat(x.slice(5).join(''));
        //console.log(parseOut);
		if (parseOut[0] == 'null'){			
          return parseOut;
		}else{
			return null;
		}
	}
}

// 	Test for Boolean
function parseBoolean(input){
	let x = input.split(''), parseOut;
	if (x[0] == 't'){		
		if (x.length < 4){
			return null;
		}else{
			parseOut = [x.slice(0, 4).join('')].concat(x.slice(5).join(''));
			if (parseOut[0] == 'true'){
				return parseOut;
			}
		}return null;
	}else if (x[0] == 'f'){
		if (x.length < 5){
			return null;
		}else{
			parseOut = [x.slice(0, 5).join('')].concat(x.slice(6).join(''));
			if (parseOut[0] == 'false'){
				return parseOut;
			}
		}return null;
	}
}



//	Test for String 
// 	Test for Number

// 	Test for Object (JSON object)
// 	Test for Array

//	Test for function
//	Test for date
//	Test for undefined


}