import './App.css';
import { useState, useEffect } from "react";
import { MenuItem, FormControl, Select, Card, CardContent } from "@material-ui/core";
import InfoBox from './InfoBox';
import "./InfoBox.css";
import Map from './Map';
import Table from './Table';
import LineGraph from './LineGraph';
import { sortData, prettyPrintStat } from "./util";
import "leaflet/dist/leaflet.css";
function App() {
  // State = how to write a variable in react
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [vaccineInfo, setVaccineInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -40.4796});
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [mapVaccines, setMapVaccines] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [isLoading, setLoading] = useState(false);


  // USEEFFECT = runs a piece of code based on a given condition
  // get worldwide cases, recovered, and deaths data on initial page load for info boxes
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all?yesterday=true")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  // get worldwide vaccine data on initial page load for info boxes
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/vaccine/coverage?lastdays=all")
      .then((response) => response.json())
      .then((data) => {
        let vaccineTotals = [];
        for (var key of Object.keys(data)) {
          vaccineTotals.push(data[key]);
        }

        let lastIdx = vaccineTotals.length - 1;
        const vacInfo = {
          today: vaccineTotals[lastIdx] - vaccineTotals[lastIdx - 2],
          total: vaccineTotals[lastIdx]
        }
        setVaccineInfo(vacInfo);
      });
  }, []);

  // get data for populating dropdown menu and table.
  // also gets non-vaccine Map data
  useEffect(() => {
    // async -> send a request, wait for it, do something
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => (
          {
            name: country.country, // United Kingdom, United States, France
            value: country.countryInfo.iso2 // UK, USA, FR
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
          setMapCountries(data);
      });
    };

    getCountriesData();
  }, []); // code would also run when countries changes (e.g., [countries])

  // gets vaccine Map data
  useEffect(() => {
    const getVaccineData = async () => {
      await fetch("https://disease.sh/v3/covid-19/vaccine/coverage/countries?lastdays=all")
        .then((response) => response.json())
        .then((data) => {
          setMapVaccines(data);
        });
    };
    getVaccineData();
  }, []);

  // triggers when user selects a new country in dropdown menu
  const onCountryChange = async (event) => {
    // sets flag to wait until data is loaded
    setLoading(true);

    // country code of currently selected country in dropdown
    const countryCode = event.target.value;

    // url for fetching data for current country
    const url = 
      countryCode === 'worldwide' 
        ? "https://disease.sh/v3/covid-19/all?yesterday=true"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}?yesterday=true`;
    
    // getting vaccination data to display in info boxes
    const vacUrl =
      countryCode === 'worldwide'
        ? "https://disease.sh/v3/covid-19/vaccine/coverage?lastdays=all"
        : `https://disease.sh/v3/covid-19/vaccine/coverage/countries/${countryCode}?lastdays=all`;

    // updating vaccineInfo for info boxes when country is changed
    await fetch(vacUrl)
      .then((response) => response.json())
      .then((data) => {
        let timeline = data;
        
        if (countryCode !== "worldwide") {
          timeline = data.timeline;
        }

        let vaccineTotals = [];
        for (var key of Object.keys(timeline)) {
          vaccineTotals.push(timeline[key]);
        }

        let lastIdx = vaccineTotals.length - 1;
        const vacInfo = {
          today: vaccineTotals[lastIdx] - vaccineTotals[lastIdx - 2],
          total: vaccineTotals[lastIdx]
        }
        
        setVaccineInfo(vacInfo);
      });

    // get data for current country
    await fetch(url)
      .then((response) => response.json())
      .then(data => {
        // render country name on dropdown (visible when dropdown is not open) 
        setCountry(countryCode);

        // all of the data from the country response
        setCountryInfo(data);

        // data is finished loading
        setLoading(false)
        
        // adjust location and zoom on map depending on which country is selected
        countryCode === "worldwide"
          ? setMapCenter([34.80746, -40.4796])
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };
  
  // ROOT COMPONENT
  return (
    <div className="app">
      <div className="app__left">
        {/* Header (title + dropdown menu) */}
        <div className="app__header">
          <h1>COVID-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" onChange={onCountryChange} value={country}>
              {/* Loop through all the countries and show dropdown list of the options */}
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>
        
        {/* Statistics */}
        <div className="app__stats">
          <InfoBox 
            title="COVID-19 Cases"
            cases={prettyPrintStat(countryInfo.todayCases)} 
            total={prettyPrintStat(countryInfo.cases)}
            onClick={(e) => setCasesType("cases")}
            active={casesType === "cases"}
            isRed
            isloading={isLoading}
          />
          <InfoBox
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
            onClick={(e) => setCasesType("recovered")}
            active={casesType === "recovered"}
            isloading={isLoading}
          />
          <InfoBox 
            title="Deaths" 
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
            onClick={(e) => setCasesType("deaths")}
            active={casesType === "deaths"}
            isRed
            isloading={isLoading}
          />
          <InfoBox 
            title="Vaccinations"
            cases={prettyPrintStat(vaccineInfo.today)}
            total={prettyPrintStat(vaccineInfo.total)}
            onClick={(e) => setCasesType("vaccinations")}
            active={casesType === "vaccinations"}
            isloading={isLoading}
          />        
        </div>
        
        {/* Map */}
        <Map
          countries={mapCountries}
          vaccines={mapVaccines}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          {/* Table */}
          <Table countries={tableData} />
          <h3 className="app__graphTitle">Worldwide daily {casesType}</h3>
          {/* Graph */}
          <LineGraph className="app__graph" casesType={casesType}/>
        </CardContent>
      </Card>
    </div>    
  );
}

export default App;
