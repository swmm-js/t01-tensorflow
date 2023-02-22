// DemoCode.js
import { useState, useEffect } from "react"
import { UniversalDropDown } from "./UniversalDropDown"
import './DemoCode.css'

export default function DemoCode({swmmData}) {
const [outText,  setOutText] = useState()
const [targetRG, setTargetRG] = useState()
const [IEP, setIEP] = useState(24)
const [MSV, setMSV] = useState(0.1)

useEffect(()=>{
  setOutText()
  let result = ''
  if(swmmData != null)
    result = processOut(swmmData)
  setOutText(result)
}, [swmmData, targetRG, IEP, MSV])

/**
 * Process the contents of a raingage .dat file
 * and detect storm patterns.
 * 
 * @param {swmmData} string text contents of a .dat file.
 * @returns {string} a formatted string that represents the storm events.
 */
function processOut(swmmData) {
  if(targetRG !== undefined && swmmData.contents[targetRG] !== undefined){
    // Detect storm patterns using swmmNode
    let outJSON =
      swmmData.findStormsPretty(swmmData.contents[targetRG], 1000*60*60*IEP, MSV)
    // Format the storm pattern JSON into readable output.
    let outString = 
      columnHeaders([['Event', 10], ['Start', 24], ['End', 24]])
      outJSON.forEach((v, i)=>{
        outString += intString(i, 10) +
                    stringString(v.begin, 24) + 
                    stringString(v.end, 24) + "\n"
      })

    return outString
  }
  else return ''
}

/**
 * Translate an int to a n-character string
 * padded with spaces.
 * @param {num} number input integer number.
 * @returns {string} a formatted string that represents the number.
 */
function intString(num, len = 16) {
  return num.toString().padEnd(len, ' ')
}

/**
 * Translate string to a n-character string
 * padded with spaces.
 * @param {str} number input string.
 * @returns {string} a formatted string.
 */
function stringString(str, len = 24) {
  return str.padEnd(len, ' ')
}

/**
 * Separate column headers and section contents with a 50-string set
 * of '-' characters and a newline
 * @param {columns} Array<Array<string, length>> represents the column name 
 * and the length of space given to the column
 * @returns {string} a string that represents the columns header.
 */
function columnHeaders(columns) {
  let len = 0;
  return columns.map(val=>{
    len = len + val[1]
    return stringString(val[0], val[1])
  }).join('') + '\n' +
  '-'.repeat(len) + '\n'
}

if(outText)
  return (
    <>
    {
      swmmData &&
      <UniversalDropDown IDs={Object.keys(swmmData.contents)} onChange={setTargetRG} />
    }
    
    <label>Inter-Event Period (hours): {IEP}
    <input  type = "range"
            min = "0"
            max = {72}
            step = {1}
            onChange={e=>setIEP(e.target.value)}
            value={IEP}
            style={{width: "100%"}}
    />
    </label>
    <label>Minimum Storm Volume: {MSV}
      <input  type = "range"
              min = "0"
              max = {2}
              step = {0.01}
              onChange={e=>setMSV(e.target.value)}
              value={MSV}
              style={{width: "100%"}}
      />
    </label>
    <pre style={{margin: '10px', overflow:'hidden'}}>
      {outText}
    </pre>
    </>
  )
else return (
  <>
  { swmmData &&
    <UniversalDropDown IDs={Object.keys(swmmData.contents)} onChange={setTargetRG} />
  }
  </>
)
}

