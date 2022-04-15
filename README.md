#Gather Air Quality from Zip Code#

Project Description:

This is a simple one-page web app with a simple goal: to retrieve air quality measurements from any given U.S. zipcode

We will use the OpenWeather API, which is robust and free but does require an API Key.

Calling the OpenWeather API initially returns an object which contains:

zip: Zip code
name: City Name
latitude
longitude
country

For example, this is the object returned when a zipcode of '10014' was typed in.

{zip: '10014', name: 'New York', lat: 40.7339, lon: -74.0054, country: 'US'}

As you may have noticed, there are no Air Quality Measurements in this object.

That is because the inital GET request is only useful to us by returning the latitude and longitude coordinates.

We are then using the data points of latitude and longitude to retrieve the Air Quality Measurements through a second API call.

This second API response returns a new object containing some useful information for us:

Coordinates from the specified location (latitude, longitude)

Сoncentration of NO2 (Nitrogen dioxide), μg/m3
Сoncentration of O3 (Ozone), μg/m3
Сoncentration of PM2.5 (Fine particles matter), μg/m3
Сoncentration of PM10 (Coarse particulate matter), μg/m3

These values are displayed in a table once the user submits the zip code.

We are then performing some simple logic on these measurements. We are summing them, and attributing a final measurement we call AQI (Air Quality index) to those lat/lon coordinates, which can be iinterpreted in the following manner:

0 -50 Good (color:green)
51-100 OK (color:olive)
101-150 Fair (color:orange)
151-200 Bad (color:yellow)
201-300 Poor (color:purple)

> 300 Dangerous (color:red)

The AQI button populates a certain color for easy visual reference.

We are also including a simple button to link out to Google Maps to view the coordinates.

A UI library called Semantic UI is used to help beautify the page:

https://semantic-ui.com/
