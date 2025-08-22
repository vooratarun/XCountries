import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [countries, setCountries] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await fetch(
          "https://xcountries-backend.azurewebsites.net/all"
        );
        if (!resp.ok) {
          console.error("Error fetching data:")
          throw new Error(`${resp.status} ${resp.statusText}`);
        }

        const data = await resp.json();
        setCountries(data);
      } catch (err) {
        console.error("Error fetching data:");
        console.error(err);     
      }
    };
    fetchData();
  }, []);

  console.log(countries);
  return (
    <div className="App">
      {countries.map((country) => {
        return (
          <div className="card">
            <img src={country.flag} alt={country.flag}></img>
            <h3>{country.name}</h3>
          </div>
        );
      })}
    </div>
  );
}

export default App;
