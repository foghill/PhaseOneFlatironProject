function getLatLonFromZipCode(zipcode) {
  const API_KEY = "f530d82e051f70b8678adc31245d778d";
  const ENDPOINT = `https://api.openweathermap.org/geo/1.0/zip?zip=${zipcode}&appid=${API_KEY}`;

  return fetch(ENDPOINT)
    .then((response) => response.json())
    .then((data) => {
      let airQuality = {};
      console.log(`lat:${data.lat}, lon:${data.lon}`);
      try {
        let airQuality = getAirQualityFromLatLon(data.lat, data.lon);
        // console.log ("getLatLonFromZipCode", JSON.stringify(airQuality));
        return airQuality;
      } catch (error) {
        console.error(error);
      }
    })
    .catch((error) => console.error(error));
}

function getAirQualityFromLatLon(lat, lon = -74.0054) {
  const API_KEY = "f530d82e051f70b8678adc31245d778d";
  const ENDPOINT = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  // fetch with endpoint
  return fetch(ENDPOINT)
    .then((response) => response.json())
    .then((data) => {
      //console.log(data);

      // create air quality variables as they are returned from the json object
      const NO2 = data.list[0].components.no2;
      const PM10 = data.list[0].components.pm10;
      const O3 = data.list[0].components.o3;
      const PM25 = data.list[0].components.pm2_5;

      //create object to be returned
      let obj = {
        lat: lat,
        lon: lon,
        no2: NO2,
        pm10: PM10,
        o3: O3,
        pm2_5: PM25,
        sum: NO2 + PM10 + O3 + PM25,
      };
      console.log("getAirQualityFromLatLon", JSON.stringify(obj));
      return obj;
    })
    .catch((error) => console.error(error));
}

//initialize DOM

const init = () => {
  const inputForm = document.querySelector("form");
  inputForm.addEventListener("submit", (event) => {
    //prevent form from refreshing page upon submit
    event.preventDefault();
    //validate that zipcode is in right format
    //must be 00001-99950
    let isValidZip =
      /^(\d{5})?$/.test(zipcode) &&
      parseInt(zipcode) > 0 &&
      parseInt(zipcode) <= 99950;
    if (isValidZip) {
      getLatLonFromZipCode(zipcode).then((data) => {
        const MINSUM = 130;
        if (data.sum <= MINSUM) {
          document.body.style.backgroundColor = "green";
        } else {
          document.body.style.backgroundColor = "red";
        }
      });
    } else {
      alert("please enter valid zip code");
    }
  });
};

document.addEventListener("DOMContentLoaded", init);

//geolocatiion API that takes in ZIP code and spits out lat and longitude

// http://api.openweathermap.org/geo/1.0/zip?zip={zip code},{country code}&appid={API key}

// http://api.openweathermap.org/geo/1.0/zip?zip={zip code},{country code}&appid=f530d82e051f70b8678adc31245d778d
