function getAQIforZipcode(zipcode) {
    // Create a function which fetches a response from the OpenWeather API to get longitude and latitude values from a zipcode input
    const API_KEY = "f530d82e051f70b8678adc31245d778d";
    //API requires an API key
    const ENDPOINT = `https://api.openweathermap.org/geo/1.0/zip?zip=${zipcode}&appid=${API_KEY}`;
    //the URL we have to construct to call the API

    // fetch from API and receive json object as a response

    return (
        fetch(ENDPOINT)
        //calling the API and when we have a response, return response.JSON
        .then((response) => response.json())
        //line 12 taking the response as a parameter as a function, returning response.json which is a function which provides a JSON version of that response
        .then((data) => {
            //line 13 is also a function. The data is the JSON that's being generated from the JSON function above
            console.log(`lat:${data.lat}, lon:${data.lon}`); //logging lat/lon to console for my own reference
            // do an error check & trigger callbackfunction and pass received lat and lon data as a parameter

            try {
                //call API function to get air quality from latitude and longitude. Saving that response as a variable
                return getAirQualityFromLatLon(data.lat, data.lon);
            } catch (error) {
                // an negative value means a error has occured in retrieving getAirQualityFromLatLon
                return -1;
                console.error(error);
            }
            // getAirQualityFromLatLon(data.lat, data.lon);
        })
        .catch((error) => console.error("the first API fetch didnt work:", error))
    );
}

function getAirQualityFromLatLon(lat, lon) {
    const API_KEY = "f530d82e051f70b8678adc31245d778d";
    //on line 37 constructing the API endpoint
    const ENDPOINT = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    //this is a different API which takes in the lat/lon return value from the getLatLonFromZipcode
    //constructing an object that gets passed to application

    return (
        fetch(ENDPOINT)
        //perform fetch/get, get the json respresentation of that response
        .then((response) => response.json())
        .then((data) => {
            // calling that response data, it's the same thing as response.json. By calling the response.json() function we are getting the json object
            //calling API that provides air quality measurements. parse the data and construct a return object

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
            // console.log("getAirQualityFromLatLon", JSON.stringify(obj));
            return obj;
        })
        .catch((error) => console.error(error))
    );
}

// This handler will be executed every time the cursor is moved over a different list item
// set an event listenter on every table header label

function setupLabelRolloverMessages() {
    const NO2_MESSAGE =
        "Nitrogen Dioxide (NO2) is one of a group of highly reactive gases known as oxides of nitrogen or nitrogen oxides.";
    const O3_MESSAGE =
        "Elevated exposures to Ozone can affect sensitive vegetation and ecosystems, including forests, parks, wildlife refuges and wilderness areas.";
    const PM10_MESSAGE =
        "PM10 is any particulate matter in the air with a diameter of 10 micrometers or less, including smoke, dust, soot, salts, acids, and metals.";
    const PM25MESSAGE =
        "I'm PM25, look at my younger brother PM10 for a description of what I am.";

    setEventListenerOnLabel("no2_label", NO2_MESSAGE); // mouseover table header function. Wanted to capture mouseover event on a label and when there is a mouseover, display a message. Takes ID of label as parameter, the second parameter is the message. Event Listener for a mouseover event
    setEventListenerOnLabel("03_label", O3_MESSAGE);
    setEventListenerOnLabel("pm10_label", PM10_MESSAGE);
    setEventListenerOnLabel("pm25_label", PM25MESSAGE);
}
//program gets started with the init function
//when DOMCONTENT event is loaded, all the init function (on line 147)

const init = () => {
    const inputForm = document.querySelector("form");

    setupLabelRolloverMessages(); //labels for the UI when mouseover event happens
    inputForm.addEventListener("submit", (event) => {
        event.preventDefault(); //when we click submit, it tries to post to server. We are preventing that default behavior because I am handling logic.
        //we capture the zipcode. on submit, run the function instead of submitting form.
        const zipcode = document.getElementById("zipcode").value; //getting the zipcode from the form HTML ELement
        // validate zipcode
        // 00001 – 99950
        let isValidZip =
            //Using RegEx expression logic below to test for five numbers betwen the range
            //isValidZip is a boolean. Is this a valid zipcode?
            /^(\d{5})?$/.test(zipcode) && //regExp has a method on it called test. takes string and tests it against RegExp. Returns a boolean value
            parseInt(zipcode) > 0 &&
            parseInt(zipcode) <= 99950;
        //if it's valid, then we are pulling the main function which is returning AQI data.

        if (isValidZip) {
            getAQIforZipcode(zipcode).then((data) => {
                const airQualityIndex = data.sum;
                switch (true) {
                    // test for good air quality
                    case airQualityIndex > 0 && airQualityIndex <= 50:
                        updateAqiLabel("green", airQualityIndex);
                        break;
                        // test for fair air quality
                    case airQualityIndex > 50 && airQualityIndex <= 100:
                        updateAqiLabel("blue", airQualityIndex);
                        break;
                    case airQualityIndex > 100 && airQualityIndex <= 150:
                        updateAqiLabel("purple", airQualityIndex);
                        break;
                    case airQualityIndex > 150 && airQualityIndex <= 200:
                        updateAqiLabel("yellow", airQualityIndex);
                        break;
                    case airQualityIndex > 200 && airQualityIndex <= 300:
                        updateAqiLabel("orange", airQualityIndex);
                        break;
                        // test for bad air quality
                    case airQualityIndex > 300:
                        updateAqiLabel("red", airQualityIndex);
                        break;
                    default:
                        text = "invalid input";
                        break;
                }
                // adding logic for lat and lon display
                //updating the UI with the data that I got back. Updating the DOM with data I got back

                //////////////////////////UPDATE UI/////////////////////////////////////
                document.getElementById("lat").innerText = `${data.lat}`;
                document.getElementById("lon").innerText = `${data.lon}`;
                //added google map URL
                const googleMapURL = `https://www.google.com/maps/search/?api=1&query=${data.lat},${data.lon}`;
                document.getElementById("map").setAttribute("href", googleMapURL);
                //fill in table
                document.getElementById("no2").innerText = data.no2;
                document.getElementById("o3").innerText = data.o3;
                document.getElementById("pm10").innerText = data.pm10;
                document.getElementById("pm25").innerText = data.pm2_5;
                //once i have all the data, display the table (hide it before since that's the default behavior)
                document.getElementById("table").hidden = false;
                //////////////////////////UPDATE UI/////////////////////////////////////
            });
        } else {
            alert("Please enter valid Zip code.");
        }
    });
};

//when DOMCONTENTLoaded is loaded, the initialization function gets called (on line 147)
document.addEventListener("DOMContentLoaded", init);

//when mousing over the label, a description is displayed
//finding element based on its id
function setEventListenerOnLabel(elementID, message) {
    // example argument: ('no2_label, NO2_MESSAGE)
    //passing a string as am ID below. Could be an error if ID doesn't match. Built try catch
    try {
        let el = document.getElementById(elementID);
        el.addEventListener("mouseover", function(event) {
            el.style.color = "purple"; // change label color to red on mouseover
            el.style.cursor = "pointer";
            setMessage(message);
        });
        el.addEventListener("mouseout", function(event) {
            el.style.color = "black";
            el.style.cursor = "default";
            setMessage(message);
        });
    } catch (error) {
        console.log(error);
    }
}

//added Event Listener on 'onclick' event
//this is for the Reset button. This gets called by the Reset button. It resets the text on the field when Reset is hit.
function resetForm() {
    document.getElementById("zipcode").value = "";
    location.reload();
}

function updateAqiLabel(color, value) {
    // set label color
    let element = document.getElementById("aqiLabel");
    element.classList.add(color);

    // label value
    element = document.getElementById("air-quality-index");
    element.innerText = `${Math.round(value)}`;
}

//given a message string, update the message container
//sets description when mouseover one of the labels
function setMessage(message) {
    // updates message, setting the property to the message
    document.getElementById("message").innerHTML = message;
}