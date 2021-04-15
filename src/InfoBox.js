import React from 'react'
import { Card, CardContent, Typography } from "@material-ui/core";
import "./InfoBox.css";
function InfoBox({ title, cases, total, active, isRed, isGreen, isGrey, isPurple, ...props }) {
  return (
    <Card 
      onClick={props.onClick}
      className={`infoBox ${active && "infoBox--selected"} 
        ${isRed && "infoBox--red"}
        ${isGreen && "infoBox--green"}
        ${isGrey && "infoBox--grey"}
        ${isPurple && "infoBox--purple"}`}
    >
      <CardContent>
        <div>
          {/* Title */}
          <Typography className="infoBox__title" color="textSecondary">
            {title}
          </Typography>

          {/* Today's number of cases */}
          <h2 
            className={`infoBox__cases 
              ${isRed && "infoBox__cases--red"}
              ${isGreen && "infoBox__cases--green"}
              ${isGrey && "infoBox__cases--grey"}
              ${isPurple && "infoBox__cases--purple"}`}
          >
            {props.isloading ? <i className="fa fa-cog fa-spin fa-fw" /> : cases}
          </h2>

          {/* Total number of cases */}
          <Typography className="infoBox__total" color="textSecondary">
            {total} Total
          </Typography>
        </div>        
      </CardContent>
    </Card>
  )
}

export default InfoBox
