import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";

const casesTypeColors = {
  cases: {
    hex: "#CC1034",
    // rgb: "rgb(204,16,52)",
    // half_op: "rgba(204,16,52,0.5)",
    mulitiplier: 800,
  },

  recovered: {
    hex: "#7DD71D",
    // rgb: "rgb(125,215,29)",
    // half_op: "rgba(125,215,29,0.5)",
    mulitiplier: 1200,
  },

  deaths: {
    hex: "#C0C0C0",
    // rgb: "rgb(251,68,67)",
    // half_op: "rgba(251,68,67,0.5)",
    mulitiplier: 2000,
  },

  vaccinations: {
    hex: "#9809eb",
    mulitiplier: 400
  }
};

export const sortData = (data) => {
  const sortedData = [...data];
  return sortedData.sort((a, b) => a.cases > b.cases ? -1 : 1);

  // ALTERNATE WAY OF SORTING
  // sortedData.sort((a, b) => {
  //   if (a.cases > b.cases) {
  //     return -1;
  //   } else {
  //     return 1;
  //   }
  // })
  // return sortedData;
}

// Combines both sources of data into clean format for map rendering
export const combineMapData = (allCountries, vacCountries, casesType="cases") => {
  var vacMap = new Map();
  // iterate through countries that track vaccinations and generate their data
  for (var i = 0; i < vacCountries.length; i++) {
    // get today's number and total number of vaccinations for current country
    let vaccineTotals = [];
    var data = vacCountries[i].timeline; // time series data
    for (var key of Object.keys(data)) {
      vaccineTotals.push(data[key]);
    }
    let lastIdx = vaccineTotals.length - 1;
    const vacInfo = {
      today: vaccineTotals[lastIdx] - vaccineTotals[lastIdx - 2],
      total: vaccineTotals[lastIdx]
    }

    // add vaccinated country to map
    vacMap.set(vacCountries[i].country, vacInfo);
  }

  // set default values for countries that don't track vaccinations
  for (i = 0; i < allCountries.length; i++) {
    if(!vacMap.has(allCountries[i].country)) {
      vacMap.set(allCountries[i].country, {today: 0, total: 0});
    }
  }

  // generate and return clean map data
  var result = [];
  for (i = 0; i < allCountries.length; i++) {
    var currCountry = allCountries[i].country;
    var currRadius = 0;
    if(casesType === "vaccinations") {
      currRadius = Math.sqrt(vacMap.get(currCountry).total / 10) * casesTypeColors["vaccinations"].mulitiplier;
    } else {
      currRadius = Math.sqrt(allCountries[i][casesType] / 10) * casesTypeColors[casesType].mulitiplier;
    }

    var currData = {
      center: [allCountries[i].countryInfo.lat, allCountries[i].countryInfo.long],
      fillOpacity: 0.4,
      pathOptions: {
        color: casesTypeColors[casesType].hex,
        fillColor: casesTypeColors[casesType].hex,
      },
      radius: currRadius,
      flagUrl: allCountries[i].countryInfo.flag,
      countryName: allCountries[i].country,
      cases: allCountries[i].cases,
      recovered: allCountries[i].recovered,
      deaths: allCountries[i].deaths,
      vaccinations: vacMap.get(currCountry).total
    }
    result.push(currData);
  }
  return result;
}

// Render circles on map with interactive tooltips
export const renderDataOnMap = (data) =>
  data.map(country => (
    <Circle
      center={country.center}
      fillOpacity={country.fillOpacity}
      pathOptions={country.pathOptions}     
      radius={country.radius}
    >
      <Popup>
      <div className="info-container">
          <div
            className="info-flag"
            style={{ backgroundImage: `url(${country.flagUrl})` }}
          />
          <div className="info-name">{country.countryName}</div>
          <div className="info-confirmed">
            Cases: {numeral(country.cases).format("0,0")}
          </div>
          <div className="info-recovered">
            Recovered: {numeral(country.recovered).format("0,0")}
          </div>
          <div className="info-deaths">
            Deaths: {numeral(country.deaths).format("0,0")}
          </div>
          <div className="info-vaccinations">
            Vaccinations: {numeral(country.vaccinations).format("0,0")}
          </div>
        </div>
      </Popup>

    </Circle>
  ));

export const prettyPrintStat = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";