function getAQIforZipcode(zipcode) {
  const API_KEY = "f530d82e051f70b8678adc31245d778d";

  const ENDPOINT = `https://api.openweathermap.org/geo/1.0/zip?zip=${zipcode}&appid=${API_KEY}`;

  return fetch(ENDPOINT)
    .then((response) => response.json())

    .then((data) => {
      console.log(data);
      console.log(`lat:${data.lat}, lon:${data.lon}`);
      try {
        return getAirQualityFromLatLon(data.lat, data.lon);
      } catch (error) {
        return -1;
        console.error(error);
      }
    })
    .catch((error) => console.error("the first API fetch didnt work:", error));
}

function getAirQualityFromLatLon(lat, lon) {
  const API_KEY = "f530d82e051f70b8678adc31245d778d";

  const ENDPOINT = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

  return fetch(ENDPOINT)
    .then((response) => response.json())
    .then((data) => {
      const NO2 = data.list[0].components.no2;
      //nitrous dioxide
      const PM10 = data.list[0].components.pm10;
      //particle matter
      const O3 = data.list[0].components.o3;
      //ozone
      const PM25 = data.list[0].components.pm2_5;

      let obj = {
        lat: lat,
        lon: lon,
        no2: NO2,
        pm10: PM10,
        o3: O3,
        pm2_5: PM25,
        sum: NO2 + PM10 + O3 + PM25, //calculating the Air Quality Index by summing various elements
      };
      return obj;
    })
    .catch((error) => console.error(error));
}

function setupLabelRolloverMessages() {
  const NO2_MESSAGE =
    "Nitrogen Dioxide (NO2) is one of a group of highly reactive gases known as oxides of nitrogen or nitrogen oxides.";
  const O3_MESSAGE =
    "Elevated exposures to Ozone can affect sensitive vegetation and ecosystems, including forests, parks, wildlife refuges and wilderness areas.";
  const PM10_MESSAGE =
    "PM10 is any particulate matter in the air with a diameter of 10 micrometers or less, including smoke, dust, soot, salts, acids, and metals.";
  const PM25MESSAGE =
    "I'm PM25, look at my younger brother PM10 for a description of what I am.";

  setEventListenerOnLabel("no2_label", NO2_MESSAGE);
  setEventListenerOnLabel("03_label", O3_MESSAGE);
  setEventListenerOnLabel("pm10_label", PM10_MESSAGE);
  setEventListenerOnLabel("pm25_label", PM25MESSAGE);
}

function setEventListenerOnLabel(elementID, message) {
  // example argument: ('no2_label, NO2_MESSAGE)

  try {
    let el = document.getElementById(elementID);
    el.addEventListener("mouseover", (e) => {
      el.style.color = "purple";
      el.style.cursor = "pointer";
      setMessage(message);
    });
    el.addEventListener("mouseout", (e) => {
      el.style.color = "black";
      el.style.cursor = "default";
      setMessage(message);
    });
  } catch (error) {
    console.log(error);
  }
}

function updateAqiLabel(color, value) {
  try {
    let element = document.getElementById("aqiLabel");

    element.className = "";
    element.classList.add("ui", "big", "label", color);

    document.getElementById("air-quality-index").innerText = `${Math.round(
      value
    )}`;
  } catch (error) {
    console.error(error);
  }
}

function setMessage(message) {
  document.getElementById("message").innerHTML = message;
}

document.addEventListener("DOMContentLoaded", () => {
  const inputForm = document.querySelector("form");

  setupLabelRolloverMessages();
  inputForm.addEventListener("submit", (event) => {
    event.preventDefault();
    // let incrementDiv = document.getElementById("incrementDiv");
    // console.log(incrementDiv);
    // debugger;
    // incrementDiv.innerText = parseInt(incrementDiv) ++;

    const zipcode = document.getElementById("zipcode").value;
    // event.target.reset();
    document.getElementById("zipcode").value = "";

    let isValidZip =
      /^(\d{5})?$/.test(zipcode) &&
      parseInt(zipcode) > 0 &&
      parseInt(zipcode) <= 99950;

    if (isValidZip) {
      getAQIforZipcode(zipcode).then(
        ({ sum, lat, lon, no2, o3, pm10, pm2_5 }) => {
          // const { sum, lat, lon, no2, o3, pm10, pm2_5 } = data;
          const airQualityIndex = sum;
          switch (true) {
            // test for good air quality
            case airQualityIndex > 0 && airQualityIndex <= 50:
              updateAqiLabel("green", airQualityIndex);
              break;
            // test for fair air quality
            case airQualityIndex > 50 && airQualityIndex <= 100:
              updateAqiLabel("olive", airQualityIndex);
              break;
            case airQualityIndex > 100 && airQualityIndex <= 150:
              updateAqiLabel("orange", airQualityIndex);
              break;
            case airQualityIndex > 150 && airQualityIndex <= 200:
              updateAqiLabel("yellow", airQualityIndex);
              break;
            case airQualityIndex > 200 && airQualityIndex <= 300:
              updateAqiLabel("violet", airQualityIndex);
              break;
            // test for bad air quality
            case airQualityIndex > 300:
              console.log(airQualityIndex);
              updateAqiLabel("red", airQualityIndex);
              break;
            default:
              // text = "invalid input";
              break;
          }

          //////////////////////////UPDATE UI/////////////////////////////////////
          document.getElementById("lat").innerText = `${lat}`;
          document.getElementById("lon").innerText = `${lon}`;

          const googleMapURL = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
          document.getElementById("map").setAttribute("href", googleMapURL);
          //fill in table
          document.getElementById("no2").innerText = no2;
          document.getElementById("o3").innerText = o3;
          document.getElementById("pm10").innerText = pm10;
          document.getElementById("pm25").innerText = pm2_5;
          //once i have all the data, display the table (hide it before since that's the default behavior)
          document.getElementById("table").hidden = false;
          //////////////////////////UPDATE UI/////////////////////////////////////
        }
      );
    } else {
      alert("Please enter valid Zip code.");
    }
  });
});
