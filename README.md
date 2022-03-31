# PhaseOneFlatironProject

The idea is to use the OpenWeather API with:

1) a Form which captures zipcode;

2) sends the zipcode to the OpenWeather API to get latitude and longitude numbers;

3) uses the latitude and longitude numbers to then get the Air Quality Index numbers;

4)Perform some logic on the Air Pollution numbers received: NO2,PM10,O3,PM25 (adds them as a sum);

5)based on the sum of the numbers, render the page a certain color (red for bad, green for good);