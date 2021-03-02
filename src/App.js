import './App.css';
import { useState, useEffect } from "react";
import { MenuItem, FormControl, Select, Card, CardContent } from "@material-ui/core";
import InfoBox from './InfoBox';
import Map from './Map';

function App() {
  // State = how to write a variable in react
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});

  // USEEFFECT = runs a piece of code based on a given condition
  // get worldwide data on initial page load and populate stat cards
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all?yesterday=true")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  // get list of countries and populate dropdown menu
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
          setCountries(countries);
      });
    };

    getCountriesData();
  }, []); // code would also run when countries changes (e.g., [countries])

  const onCountryChange = async (event) => {
    // country code of currently selected country in dropdown
    const countryCode = event.target.value;

    // url for fetching data for current country
    const url = 
      countryCode === 'worldwide' 
        ? "https://disease.sh/v3/covid-19/all?yesterday=true"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}?yesterday=true`;
    
    // get data for current country
    await fetch(url)
      .then((response) => response.json())
      .then(data => {
        // render country name on dropdown (visible when dropdown is not open) 
        setCountry(countryCode);
        // all of the data from the country response
        setCountryInfo(data);
        
      });
  };
  console.log(">>>> COUNTRY INFO: ", countryInfo);
  // ROOT COMPONENT
  return (
    <div className="app">
      <div className="app__left">
        {/* Header */}
        {/* Title + Select input dropdown field */}
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
            title="Coronavirus Cases"
            cases={countryInfo.todayCases} 
            total={countryInfo.cases}
          />
          <InfoBox
            title="Recovered"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
          />
          <InfoBox 
            title="Deaths" 
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          />        
        </div>
        
        {/* Map */}
        <Map />
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          {/* Table */}
          <h3>Worldwide new cases</h3>
          {/* Graph */}
        </CardContent>
      </Card>
    </div>    
  );
}

export default App;
