import React from 'react'
import { Card, CardContent, Typography } from "@material-ui/core";
import "./InfoBox.css";
function InfoBox({ title, cases, total, active, isRed, ...props }) {
  return (
    <Card 
      onClick={props.onClick}
      className={`infoBox ${active && "infoBox--selected"} ${isRed && "infoBox--red"}`}
    >
      <CardContent>
        {/* Title */}
        <Typography className="infoBox__title" color="textSecondary">
          {title}
        </Typography>

        {/* Today's number of cases */}
        <h2 
          className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}
        >
          {props.isloading ? <i className="fa fa-cog fa-spin fa-fw" /> : cases}
        </h2>

        {/* Total number of cases */}
        <Typography className="infoBox__total" color="textSecondary">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  )
}

export default InfoBox
