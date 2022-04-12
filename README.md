#Phase One Flatiron Project#

The idea is to use the OpenWeather API with:

1. A Form which captures zipcode;

2. The form submits the zipcode to the OpenWeather API which returns corresponding latitude and longitude coordinates;

3. We submit another API call to OpenWeather API which takes the lat/lon coordinates and returns Air Quality measurements for that location;

4. Write a function that performs logic on the Air Quality measurements received: NO2,PM10,O3,PM25 (sums them) to calculate a final number which we are calling the AQI - Air Quality Index.

5. Based on the AQI result, render the button a corresponding color to indicate quality (red for bad, green for good etc.);

6. A link to Google Maps is shown and returns the correct location based on the return value of the latitude and longitude coordinates;
