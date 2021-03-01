import './App.css';
import { useState } from "react";
import {
  MenuItem,
  FormControl,
  Select
} from "@material-ui/core";

function App() {
  // State = how to write a variable in react
  const [countries, setCountries] = useState([
    'USA', 'UK', 'INDIA'
  ]);

  return (
    <div className="app">
      <div className="app__header">
        <h1>COVID-19 Tracker</h1>
        <FormControl className="app__dropdown">
          <Select variant="outlined" value="abc">
            {/* Loop through all the countries and show dropdown list of the options */}
            {
              countries.map((country) => (
                <MenuItem value={country}>{country}</MenuItem>
              ))
            }


            {/* <MenuItem value="worldwide">Worldwide</MenuItem>
            <MenuItem value="worldwide">Option 2</MenuItem>
            <MenuItem value="worldwide">Option 3</MenuItem>
            <MenuItem value="worldwide">YOOOOOOOOO</MenuItem> */}
          </Select>
        </FormControl>
      </div>
      


      {/* PROJECT STRUCTURE */}
      {/* Header */}
      {/* Title + Select input dropdown field */}

      {/* InfoBoxs */}
      {/* InfoBoxs */}
      {/* InfoBoxs */}

      {/* Table */}
      {/* Graph */}

      {/* Map */}
    </div>    
  );
}

export default App;
