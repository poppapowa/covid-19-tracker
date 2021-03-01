import './App.css';
import { useState, useEffect } from "react";
import {
  MenuItem,
  FormControl,
  Select
} from "@material-ui/core";
import InfoBox from './InfoBox';
import Map from './Map';

function App() {
  // State = how to write a variable in react
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');

  // USEEFFECT = runs a piece of code based on a given condition
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

  const onCountryChange = (event) => {
    const countryCode = event.target.value;
    console.log(countryCode);
    setCountry(countryCode);
  }

  // ROOT COMPONENT
  return (
    <div className="app">
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
        <InfoBox title="Coronavirus Cases" cases={123} total={2000} />
        <InfoBox title="Recovered" cases={1234} total={3000} />
        <InfoBox title="Deaths" cases={12345} total={4000} />        
      </div>
      

      

      {/* Table */}
      {/* Graph */}

      {/* Map */}
      <Map />
    </div>    
  );
}

export default App;
