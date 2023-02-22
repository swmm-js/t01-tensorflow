// SiteNavBar.js
import "./index.css"

// params: model or UImodel (main model control elements)
// UIparams: css styles for objects and controls.
// controlParams: parent data model. Mostly for non-model controls e.g.: charting, reporting.
// objName: tha name of the object to be updated in the controlModel object if this control is changed.
const SiteNavBar = () => {
  return(
    <div className="navbar">
      <a href="https://www.swmmReact.org" >swmmReact</a>
      <a href="https://www.swmmjs.org" >swmm-js</a>
    </div>
  )
};
 
export {SiteNavBar};