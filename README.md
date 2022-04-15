# Gather Air Quality from Zip Code

## Introduction

This is a simple one-page web app with a simple goal: to retrieve air quality measurements from any given U.S. zipcode

We will use the OpenWeather API, which is robust and free but does require an API Key.

### Project Description

Calling the OpenWeather API initially returns an object which contains:

1. Zip code
2. City Name
3. Latitude
4. Longitude
5. Country

For example, this is the object returned when a zipcode of _10014_ was typed in.

{zip: '10014', name: 'New York', lat: 40.7339, lon: -74.0054, country: 'US'}

As you may have noticed, there are no Air Quality Measurements in this object.

That is because the inital GET request is only useful to us by returning the latitude and longitude coordinates.

We are then using the data points of latitude and longitude to retrieve the Air Quality Measurements through a second API call.

This second API response returns a new object containing some useful information for us:

1. Coordinates from the specified location (latitude, longitude)
2. Сoncentration of NO2 (Nitrogen dioxide)
3. Сoncentration of O3 (Ozone)
4. Сoncentration of PM2.5 (Fine particles matter)
5. Сoncentration of PM10 (Coarse particulate matter)

These values are displayed in a table once the user submits the zip code.

We are then performing some simple logic on these measurements. We are summing them, and calling that number AQI (Air Quality index) which are referenced in a Key and can be interpreted in the following manner:

- 0 -50 Good

- 51-100 OK

- 101-150 Fair

- 151-200 Bad

- 201-300 Poor

- more than 300 Dangerous

We are also including a simple button to link out to Google Maps to view the coordinates.

A UI library called Semantic is used to help beautify the page: [Semantic UI](https://semantic-ui.com/)

![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/w/foghill/PhaseOneFlatironProject)
![GitHub repo size](https://img.shields.io/github/repo-size/foghill/PhaseOneFlatironProject)
