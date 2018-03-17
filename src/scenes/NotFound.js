import React from 'react';
import {FontIcon} from "material-ui";

const NotFound = (props) => (
  <div style={{width: "100%", height: "100%"}} className="container">
    <div className="row justify-content-between align-items-center" style={{width: "100%", height: "100%", fontSize: "32px"}}>
      <div className="col text-center">
        <FontIcon style={{fontSize: "96px"}} className="material-icons center-block">sentiment_very_dissatisfied</FontIcon>
        {
          props.messageComponent ? props.messageComponent :
            <p>{props.message || "Page Not Found!"}</p>
        }
      </div>
    </div>
  </div>
);

export default NotFound;
