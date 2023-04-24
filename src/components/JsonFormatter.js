import React from 'react'

import JsonFormatter from 'react-json-formatter'

const JsonFormatterBuilder = ({jsonData}) => {

    console.log('test json dta...==>', jsonData)
  const sample = `{
   "string":"ABCDE",
   "number":1,
   "null":null,
   "boolean":true,
   "object":{
      "string":"ABCDE",
      "number":1,
      "null":null,
      "boolean":true
   },
   "array":[
      1,
      2,
      3,
      4,
      {
      "string":"ABCDE",
      "number":1,
      "null":null,
      "boolean":true,
         "array":[
      1,
      2,
      3,
      4,
      {
      "string":"ABCDE",
      "number":1,
      "null":null,
      "boolean":true
   }
   ]
   }
   ]
}
`

  const jsonStyle = {
    propertyStyle: { color: 'red' },
    stringStyle: { color: 'green' },
    numberStyle: { color: 'darkorange' }
  }

  return <JsonFormatter json={sample} tabWith={4} jsonStyle={jsonStyle} />
}

export default JsonFormatterBuilder