// DemoIntro.js
import "./index.css"
import { UIBackground } from './UIBackground'
import { SiteNavBar } from "./SiteNavBar"
import SyntaxHighlighter from 'react-syntax-highlighter'
import { nightOwl as codeStyle } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import DemoInterface from './DemoInterface';
/* eslint import/no-webpack-loader-syntax: off */
const useDidMount = require('!!raw-loader!./DemoCode.js')

const DemoIntro = () => {
  return(
<div >
<SiteNavBar />
  <div >
    <div style={UIBackground}><h1>TensorFlow.js: Basic Methods</h1>
      <p>This demo features swmmNode and swmmWasm model basic operations using TensorFlow. Click on the <strong>'Select .inp file'</strong> button to pick a <strong>.inp</strong> file to investigate. Keep in mind that web browsers can only handle so much memory, so if your <strong>.inp</strong> file is very large or requires a long time to run, you may want to use swmmWasm and swmmNode via node.js.
      </p>
      <p>
        The results are a simple demo of some of the uses of TensorFlow with EPA-SWMM files.  You can find swmmNode and swmmWasm compatible JavaScript below the translation, and you can always check out a copy of either swmmNode or swmmWasm for your own uses at the GitHub repo:
        </p>
        <p><a href='https://github.com/fileops/swmmNode'>https://github.com/fileops/swmmNode</a>
        </p> 
        <p>or from npm: </p>
        <p><a href='https://www.npmjs.com/package/@fileops/swmm-node'>https://www.npmjs.com/package/@fileops/swmm-node</a></p>
        <p>or just download this web page and study it:</p> 
        <p><a href='https://github.com/swmm-js/t01-tensorflow'>https://github.com/swmm-js/t01-tensorflow</a></p>
        <p>
        You can also contact me at <strong>issac@swmmReact.org</strong>. Thanks so much for taking the time to stop by.
        </p>

      <h2>Demo Controls</h2>
      <DemoInterface />

      <h2>Example swmmNode/swmmWasm/TensorFlow code</h2>
      <p>The following code window displays an example way to use swmmNode, swmmWasm, and TensorFlow run an EPA-SWMM model and analyze the results.</p>
      <SyntaxHighlighter language='javascript' style={codeStyle} showLineNumbers={true}>
        {useDidMount.default.toString()}
      </SyntaxHighlighter>
    </div>
  </div>
</div>)
}

export default DemoIntro;