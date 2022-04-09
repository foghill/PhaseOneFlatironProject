function getLatLonFromZipCode(zipcode) {
  // connect to zipcode API to get longitude and latitude values for a zipcode input
  const API_KEY = "f530d82e051f70b8678adc31245d778d";
  const ENDPOINT = `https://api.openweathermap.org/geo/1.0/zip?zip=${zipcode}&appid=${API_KEY}`;

  // fetch from API and receive json object as a response

  return fetch(ENDPOINT)
    .then((response) => response.json())
    .then((data) => {
      let airQuality = {};
      console.log(`lat:${data.lat}, lon:${data.lon}`);
      // do an error check & trigger callbackfunction and pass received lat and lon data as a parameter

      try {
        let airQuality = getAirQualityFromLatLon(data.lat, data.lon);
        // console.log ("getLatLonFromZipCode", JSON.stringify(airQuality));
        return airQuality;
      } catch (error) {
        console.error(error);
      }
      // getAirQualityFromLatLon(data.lat, data.lon);
    })
    .catch((error) => console.error(error));
}

function getAirQualityFromLatLon(lat, lon = -74.0054) {
  const API_KEY = "f530d82e051f70b8678adc31245d778d";
  const ENDPOINT = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

  return fetch(ENDPOINT)
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);

      const NO2 = data.list[0].components.no2;
      const PM10 = data.list[0].components.pm10;
      const O3 = data.list[0].components.o3;
      const PM25 = data.list[0].components.pm2_5;

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

const init = () => {
  const inputForm = document.querySelector("form");

  const NO2_MESSAGE = "Hi, I'm No2";
  // const NO2_MESSAGE = "Hi, I'm No2";
  // const NO2_MESSAGE = "Hi, I'm No2";
  // const NO2_MESSAGE = "Hi, I'm No2";

  setEventListenerOnLabel("no2_label", NO2_MESSAGE); // mouseover table header
  // setEventListenerOnLabel("no2", NO2_MESSAGE);
  // setEventListenerOnLabel("no2", NO2_MESSAGE);
  // setEventListenerOnLabel("no2", NO2_MESSAGE);
  // setEventListenerOnLabel("no2", NO2_MESSAGE);

  inputForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const zipcode = document.getElementById("zipcode").value;
    // validate zipcode
    // 00001 – 99950
    let isValidZip =
      //RegEx expression logic below to test for five numbers betwen the range
      /^(\d{5})?$/.test(zipcode) &&
      parseInt(zipcode) > 0 &&
      parseInt(zipcode) <= 99950;
    if (isValidZip) {
      getLatLonFromZipCode(zipcode).then((data) => {
        switch (true) {
          case data.sum > 0 && data.sum <= 50:
            updateUI("green", data.sum);
            break;
          case data.sum > 50 && data.sum <= 100:
            updateUI("blue", data.sum);
            break;
          case data.sum > 100 && data.sum <= 150:
            updateUI("purple", data.sum);
            break;
          case data.sum > 150 && data.sum <= 200:
            updateUI("yellow", data.sum);
            break;
          case data.sum > 200 && data.sum <= 300:
            updateUI("orange", data.sum);
            break;
          case data.sum > 300:
            updateUI("red", data.sum);
            break;
          default:
            text = "invalid input";
            break;
        }
        // adding logic for lat and lon display
        const airQuality = data.sum;
        document.getElementById("lat").innerText = `Latitude = ${data.lat}`;
        document.getElementById("lon").innerText = `Longitude = ${data.lon}`;
        //added google map URL
        const googleMapURL = `https://www.google.com/maps/search/?api=1&query=${data.lat},${data.lon}`;
        document.getElementById("map").setAttribute("href", googleMapURL);
        //fill in table
        document.getElementById("no2").innerText = data.no2;
        document.getElementById("o3").innerText = data.o3;
        document.getElementById("pm10").innerText = data.pm10;
        document.getElementById("pm25").innerText = data.pm2_5;
        document.getElementById("table").hidden = false;
      });
    } else {
      alert("please enter valid zip code");
    }
  });
};

document.addEventListener("DOMContentLoaded", init);

// This handler will be executed every time the cursor
// is moved over a different list item

// get each table label and set an event listenter

const hideMessageContainer = () => {
  document.getElementById("messageContainer").hidden = true;
};

function setEventListenerOnLabel(elementID, message) {
  let el = document.getElementById(elementID);
  el.addEventListener(
    "mouseover",
    function (event) {
      setMessage(message);
    },
    false
  );
  el.addEventListener(
    "mouseout",
    function (event) {
      // hideMessageContainer();
    },
    false
  );
}

//added reset Event Listener on 'onclick'
function resetForm() {
  document.getElementById("zipcode").value = "";
}

function updateUI(color, value) {
  var element = document.getElementById("air-quality-index");
  element.classList.add(color);
  element.innerText = `AQI = ${value}`;
}

function setMessage(message) {
  // udpate message

  let messageContainer = document.getElementById("messageContainer");
  messageContainer.hidden = false; // unhiding message container
  // console.log("messageContainer", messageContainer);
  let msgDiv = document.getElementById("message");
  msgDiv.innerHTML = message;
}

//geolocatiion API that takes in ZIP code and spits out lat and longitude

// http://api.openweathermap.org/geo/1.0/zip?zip={zip code},{country code}&appid={API key}

// http://api.openweathermap.org/geo/1.0/zip?zip={zip code},{country code}&appid=f530d82e051f70b8678adc31245d778d

//working from replit.com

//mouseover event over the value of the table headers that triggers a function that displays descriptors
// mouse exit?
// create id's for tableheaders
