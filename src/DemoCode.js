// DemoCode.js
import { SwmmOut } from "@fileops/swmm-node"
import { useState, useEffect } from "react"

export default function DisplayOutAsText({swmmData}) {
const [outText, setOutText] = useState()

useEffect(()=>{
  let result = ''
  if(swmmData != null)
    result = processOut(swmmData)
  setOutText(result)
}, [swmmData])


// Process an array buffer. This is usually the 
// buffer contents of a .out file.
function processOut(swmmData) {
  // Create a swmmOut oubject from the contents of the .out file.

  // Process all sections of the .out file.
  let outString =
    stringOpeningRecords     (swmmData)
    + stringObjectIDs        (swmmData)
    + stringObjectProperties (swmmData)
    + stringReportingInterval(swmmData)
    + stringComputedResults  (swmmData)
    + stringClosingRecords   (swmmData)

    return outString
}

/**
 * Translate a float to a n-character, 3-decimal string
 * padded with spaces.
 * @param {num} number input float number.
 * @return {string} a string that represents the number.
 */
function floatString(num, len = 16) {
  return num.toFixed(3).toString().padEnd(len, ' ')
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
 * Separate subheaders and section contents with a 50-string set
 * of '-' characters and a newline
 * @param {title} string represents the subheader
 * @returns {string} a string that represents the number.
 */
function subHeader(title, num = 50) {
  return title + '\n' +
  '-'.repeat(num) + '\n'
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

/**
 * Create Object names section substring
 * @param {count} number count of object names
 * @param {funcs} Array<function> function array that retrieves the object value
 * @returns {string} A string representing the Object Names section.
 */
function objectNames(count, funcs){
  let str = ''
  for(let i = 0; i < count; i++){
    str += intString(i)
    funcs.forEach((f)=>{
      str += stringString(f(i,).toString(), 16)
    })
    str += '\n'
  } 

  return str + '\n'
}

/**
 * Create time-based subsection
 * @param {iCount} number count of object names
 * @param {vCount} number count of object variables
 * @param {nameFunc} function function to get an object name
 * @param {func} function function that retrieves the object value
 * @param {subheaders} Array<Array><string, int> array that describes the subheaders
 * @param {timePeriods} number count of time periods
 * @param {timeFunc} function function that translates time periods
 * @returns {string} a string representing a time-based subsection.
 */
function timeOuput(iCount, vCount, nameFunc, func, subheaders, timePeriods, timeFunc){
  let str = ''
  for(let i = 0; i < iCount; i++){
    str += columnHeaders([['index', 16], ['ID', 24]])
    str += intString(i) + stringString(nameFunc(i)) + '\n'
    str += columnHeaders(subheaders)
    for(let j = 1; j <= timePeriods; j++){
      str += stringString(timeFunc(j), 24)
      for(let k = 0; k < vCount; k++){
        str += floatString(func(i, k, j), 20)
      }
      str += '\n'
    }
    str += '\n'
  } 

  return str + '\n'
}

/**
 * Create time-based subsection
 * @param {vCount} number count of object variables
 * @param {func} function function that retrieves the object value
 * @param {subheaders} Array<Array><string, int> array that describes the subheaders
 * @param {timePeriods} number count of time periods
 * @param {timeFunc} function function that translates time periods
 * @returns {string} A string representing the System time-based subsection.
 */
function timeOuputSys(vCount, func, subheaders, timePeriods, timeFunc){
  let str = columnHeaders(subheaders)
  for(let j = 1; j <= timePeriods; j++){
    str += stringString(timeFunc(j), 24)
    for(let k = 0; k < vCount; k++){
      str += floatString(func(k, j), 20)
    }
    str += '\n'
  }

  return str + '\n'
}

/**
 * Separate section titles and section contents with a 50 or num string set
 * of '=' characters and a newline
 * @param {number} [num] (Optional) the count of '=' characters to write.
 * @return {string} a string that represents the number.
 */
function headerLine(num = 50) {
  return '='.repeat(num) + '\n'
}

/**
 * Break sections with 2 or num newline charaters
 * @param {number} [num] (Optional) the count of newline characters to make
 * @return {string} a string that represents the number.
 */
function sectionBreak(num = 2) {
  return '\n'.repeat(num)
}

/**
 * Creates a simple section string of the format:
 * value valueDescription \n
 * @param {val} string represents the value
 * @param {section} number the section number of the simple line
 * @param {content} number the content number of the simple line
 * @return {string} the formatted line string.
 */
function simpleLine(val, section, content) {
  return val + SwmmOut.sections[section].contents[content].name + '\n'
}

/**
 * Change the Opening Records of a swmm .out file to a string.
 * @param {outObj} SwmmOut object.
 * @return: {string} String representation of the opening records section of a swmm.out file.
 */
function stringOpeningRecords(outObj){
  let section = SwmmOut.sections[0].name + '\n'
    + headerLine()
    + simpleLine(intString(outObj.magic1()),        0, 0)
    + simpleLine(intString(outObj.version()),       0, 1)
    + simpleLine(intString(outObj.flowUnitCode()),  0, 2)
    + simpleLine(intString(outObj.subcatchmentCount()), 0, 3)
    + simpleLine(intString(outObj.nodeCount()),     0, 4)
    + simpleLine(intString(outObj.linkCount()),     0, 5)
    + simpleLine(intString(outObj.pollutantCount()),0, 6)
    + sectionBreak()

  return section;
}

/**
 * Change the Closing Records of a swmm .out file to a string.
 * @param {outObj} SwmmOut object.
 * @return: {string} String representation of the closing records section of a swmm.out file.
 */
function stringClosingRecords(outObj){
  let section = SwmmOut.sections[6].name + '\n'
    + headerLine()
    + simpleLine(intString(outObj.objectIDNames()),    6, 0)
    + simpleLine(intString(outObj.objectProperties()), 6, 1)
    + simpleLine(intString(outObj.computedResults()),  6, 2)
    + simpleLine(intString(outObj.reportingPeriods()), 6, 3)
    + simpleLine(intString(outObj.errorCode()),        6, 4)
    + simpleLine(intString(outObj.magic2()),           6, 5)
    + sectionBreak()

  return section;
}

/**
 * Change the Object IDs section of a swmm .out file to a string.
 * @param {outObj} SwmmOut object.
 * @return: {string} String representation of the cObject IDs section of a swmm.out file.
 */
function stringObjectIDs(outObj){
  let section = SwmmOut.sections[1].name + '\n'
    + headerLine()
    + subHeader('Subcatchments')
    + columnHeaders([['index', 16], ['ID', 24]])
    + objectNames(outObj.subcatchmentCount(), [outObj.subcatchmentName.bind(outObj)])
    
    + subHeader('Nodes')
    + columnHeaders([['index', 16], ['ID', 24]])
    + objectNames(outObj.nodeCount(),         [outObj.nodeName.bind(outObj)])
    
    + subHeader('Links')
    + columnHeaders([['index', 16], ['ID', 24]])
    + objectNames(outObj.linkCount(),         [outObj.linkName.bind(outObj)])

    + subHeader('Pollutants')
    + columnHeaders([['index', 16], ['ID', 24]])
    + objectNames(outObj.pollutantCount(),    [outObj.pollutantName.bind(outObj)])
    
    + subHeader('Pollutants Concentration Units')
    + columnHeaders([['index', 16], ['Units', 24]])
    + objectNames(outObj.pollutantCount(),    [outObj.pollutantConcentrationUnits.bind(outObj)])
    + sectionBreak()

  return section;
}

/**
 * Change the Object Properties section of a swmm .out file to a string.
 * @param {outObj} SwmmOut object.
 * @return: {string} String representation of the cObject Properties section of a swmm.out file.
 */
function stringObjectProperties(outObj){
  let section = SwmmOut.sections[2].name + '\n'
    + headerLine()
    + subHeader('Subcatchments')
    + columnHeaders([['index', 16], ['ID', 16], ['Area', 16]])
    + objectNames(
      outObj.subcatchmentCount(), 
      [outObj.subcatchmentName.bind(outObj),
      outObj.subcatchmentArea.bind(outObj)])
    
    + subHeader('Nodes')
    + columnHeaders([['index', 16], ['ID', 16], ['Type', 16], ['Invert Elev.', 16], ['Max. Depth', 16]])
    + objectNames(
      outObj.nodeCount(), 
      [outObj.nodeName.bind(outObj),
      outObj.nodeTypeString.bind(outObj),
      outObj.nodeInvertElevation.bind(outObj),
      outObj.nodeMaximumDepth.bind(outObj),
    ])

    + subHeader('Links')
    + columnHeaders([['index', 16], ['ID', 16], ['Type', 16], ['US Invert', 16], ['DS Invert', 16], ['Max Depth', 16], ['Length', 16]])
    + objectNames(
      outObj.linkCount(), 
      [outObj.linkName.bind(outObj),
      outObj.linkTypeString.bind(outObj),
      outObj.linkUpstreamInvertOffset.bind(outObj),
      outObj.linkDownstreamInvertOffset.bind(outObj),
      outObj.linkMaximumDepth.bind(outObj),
      outObj.linkLength.bind(outObj),
    ])
    + sectionBreak()

  return section;
}


/**
 * Change the Reporting Interval of a swmm .out file to a string.
 * @param {outObj} SwmmOut object.
 * @return: {string} String representation of the Reporting Interval section of a swmm.out file.
 */
function stringReportingInterval(outObj){
  let section = SwmmOut.sections[4].name + '\n'
    + headerLine()
    + simpleLine(stringString(outObj.swmmStepToDate(0)),     4, 0)
    + simpleLine(stringString(outObj.timeStep().toString()), 4, 1)
    + sectionBreak()

  return section;
}

/**
 * Change the Computed Results section of a swmm .out file to a string.
 * @param {outObj} SwmmOut object.
 * @return: {string} String representation of the Computed Results section of a swmm.out file.
 */
function stringComputedResults(outObj){
  let section = SwmmOut.sections[5].name + '\n'
    + headerLine()
    + stringSubcatchmentResults(outObj)
    + stringNodeResults(outObj)
    + stringLinkResults(outObj)
    + stringSystemResults(outObj)
    + sectionBreak()

  return section;
}

/**
 * Change the Subcatchment Computed Results section of a swmm .out file to a string.
 * @param {outObj} SwmmOut object.
 * @return: {string} String representation of the Subcatchment Computed Results section of a swmm.out file.
 */
function stringSubcatchmentResults(outObj){
  let subheaders = [['Date/Time', 24], ['Rainfall',     20], ['Snow Depth',    20],  
                    ['Evap loss', 20], ['Infil loss',   20], ['Runoff',        20], 
                    ['GW flow',   20], ['GW elevation', 20], ['Soil moisture', 20]]
  // Add pollutants
  for(let i = 0; i < outObj.pollutantCount(); i++){
    subheaders.push([outObj.pollutantName(i), 20])
  }
  let section = subHeader('Subcatchments')
    + timeOuput(
      outObj.subcatchmentCount(), 
      outObj.subcatchmentOutputCount(),
      outObj.subcatchmentName.bind(outObj),
      outObj.subcatchmentOutput.bind(outObj),
      subheaders,
      outObj.reportingPeriods(),
      outObj.swmmStepToDate.bind(outObj))
    
  return section;
}

/**
 * Change the Node Computed Results section of a swmm .out file to a string.
 * @param {outObj} SwmmOut object.
 * @return: {string} String representation of the Node Computed Results section of a swmm.out file.
 */
function stringNodeResults(outObj){
  let subheaders = [['Date/Time',     24], ['Depth',       20], ['Head',        20],
                    ['Volume',        20], ['Lat. Inflow', 20], ['Node Inflow', 20], 
                    ['Node overflow', 20]]
  // Add pollutants
  for(let i = 0; i < outObj.pollutantCount(); i++){
    subheaders.push([outObj.pollutantName(i), 20])
  }
  let section = subHeader('Nodes')
    + timeOuput(
      outObj.nodeCount(), 
      outObj.nodeOutputCount(),
      outObj.nodeName.bind(outObj),
      outObj.nodeOutput.bind(outObj),
      subheaders,
      outObj.reportingPeriods(),
      outObj.swmmStepToDate.bind(outObj))
    
  return section;
}

/**
 * Change the Link Computed Results section of a swmm .out file to a string.
 * @param {outObj} SwmmOut object.
 * @return: {string} String representation of the Link Computed Results section of a swmm.out file.
 */
function stringLinkResults(outObj){
  let subheaders = [['Date/Time', 24], ['Flow',   20], ['Depth',    20], 
                    ['Velocity',  20], ['Volume', 20], ['Capacity', 20]]
  // Add pollutants
  for(let i = 0; i < outObj.pollutantCount(); i++){
    subheaders.push([outObj.pollutantName(i), 20])
  }
  let section = subHeader('Links')
    + timeOuput(
      outObj.linkCount(), 
      outObj.linkOutputCount(),
      outObj.linkName.bind(outObj),
      outObj.linkOutput.bind(outObj),
      subheaders,
      outObj.reportingPeriods(),
      outObj.swmmStepToDate.bind(outObj))
    
  return section;
}

/**
 * Change the System Computed Results section of a swmm .out file to a string.
 * @param {outObj} SwmmOut object.
 * @return: {string} String representation of the System Computed Results section of a swmm.out file.
 */
function stringSystemResults(outObj){
  let subheaders = [['Date/Time',  24], ['Temperature',  20], ['Rainfall', 20], 
                    ['Snow Depth', 20], ['Infiltration', 20], ['Runoff',   20], 
                    ['DWF',        20], ['GWF',          20], ['RDII',     20],
                    ['Ex. Inflow', 20], ['Inflow',       20], ['Flooding', 20], 
                    ['Outflow',    20], ['Storage',      20], ['Evap.',    20], 
                    ['PET',        20]]

  let section = subHeader('System')
    + timeOuputSys(
      outObj.systemOutputCount(),
      outObj.sysOutput.bind(outObj),
      subheaders,
      outObj.reportingPeriods(),
      outObj.swmmStepToDate.bind(outObj))
  
  return section;
}

if(outText)
  return (
    <>
    <pre style={{margin: '10px', overflow:'scroll'}}>
      {outText}
    </pre>
    </>
  )
else return (
  <></>
)
}
