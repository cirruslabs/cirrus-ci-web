import React from 'react';
import {Icon} from "material-ui";

const NotFound = (props) => (
  <div style={{width: "100%", height: "100%"}}>
    <div className="row justify-content-between align-items-center"
         style={{width: "100%", height: "100%", fontSize: "32px"}}>
      <div className="col text-center">
        <Icon style={{fontSize: "96px"}} className="center-block">sentiment_very_dissatisfied</Icon>
        {
          props.messageComponent ? props.messageComponent :
            <p>{props.message || "Page Not Found!"}</p>
        }
      </div>
    </div>
  </div>
);

export default NotFound;
