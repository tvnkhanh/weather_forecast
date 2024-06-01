import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:weather_forecast_app/constants/constants.dart';
import 'package:weather_forecast_app/widgets/weather_item.dart';

class DetailScreen extends StatefulWidget {
  final dailyForecastWeather;

  const DetailScreen({
    super.key,
    this.dailyForecastWeather,
  });

  @override
  State<DetailScreen> createState() => _DetailScreenState();
}

class _DetailScreenState extends State<DetailScreen> {
  final Constants _constants = Constants();

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    var weatherData = widget.dailyForecastWeather;

    Map getForecastWeather(int index) {
      int maxWindSpeed = weatherData[index]['day']['maxwind_kph'].toInt();
      int avgHumidity = weatherData[index]['day']['avghumidity'].toInt();
      int chanceOfRain =
          weatherData[index]['day']['daily_chance_of_rain'].toInt();

      var parsedDate = DateTime.parse(weatherData[index]['date']);
      var forecastDate = DateFormat('EEEE, d MMMM').format(parsedDate);

      String weatherName = weatherData[index]['day']['condition']['text'];
      String weatherIcon =
          '${weatherName.replaceAll(' ', '').toLowerCase()}.png';

      int minTemperature = weatherData[index]['day']['mintemp_c'].toInt();
      int maxTemperature = weatherData[index]['day']['maxtemp_c'].toInt();

      var forecastData = {
        'maxWindSpeed': maxWindSpeed,
        'avgHumidity': avgHumidity,
        'chanceOfRain': chanceOfRain,
        'forecastDate': forecastDate,
        'weatherName': weatherName,
        'weatherIcon': weatherIcon,
        'minTemperature': minTemperature,
        'maxTemperature': maxTemperature
      };

      return forecastData;
    }

    return Scaffold(
      backgroundColor: _constants.primaryColor,
      appBar: AppBar(
        title: const Text('Forecast'),
        centerTitle: true,
        backgroundColor: _constants.primaryColor,
        elevation: 0.0,
        actions: [
          Padding(
            padding: const EdgeInsets.only(
              right: 8,
            ),
            child: IconButton(
              onPressed: () {
                print('Setting pressed');
              },
              icon: const Icon(Icons.settings),
            ),
          ),
        ],
      ),
      body: Stack(
        alignment: Alignment.center,
        clipBehavior: Clip.none,
        children: [
          Positioned(
            bottom: 0,
            left: 0,
            child: Container(
              height: size.height * .85,
              width: size.width,
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.only(
                  topRight: Radius.circular(50),
                  topLeft: Radius.circular(50),
                ),
              ),
              child: SingleChildScrollView(
                child: Column(
                  children: [
                    // Weather card
                    Container(
                      height: 300,
                      width: size.width * .9,
                      margin: const EdgeInsets.only(top: 20),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.center,
                          colors: [
                            Color(0xffa9c1f5),
                            Color(0xff6696f5),
                          ],
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.blue.withOpacity(.1),
                            offset: const Offset(0, 25),
                            blurRadius: 3,
                            spreadRadius: -10,
                          ),
                        ],
                        borderRadius: BorderRadius.circular(15),
                      ),
                      child: Stack(
                        clipBehavior: Clip.none,
                        children: [
                          Positioned(
                            top: -20,
                            left: -120,
                            right: 20,
                            child: Image.asset(
                              'assets/' + getForecastWeather(0)['weatherIcon'],
                              width: 150,
                              height: 150,
                            ),
                          ),
                          Positioned(
                            top: 120,
                            left: 30,
                            child: Padding(
                              padding: const EdgeInsets.all(10),
                              child: Text(
                                getForecastWeather(0)['weatherName'],
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 20,
                                ),
                              ),
                            ),
                          ),
                          Positioned(
                            bottom: 20,
                            left: 20,
                            child: Container(
                              width: size.width * .8,
                              padding:
                                  const EdgeInsets.symmetric(horizontal: 20),
                              child: Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  WeatherItem(
                                    value:
                                        getForecastWeather(0)['maxWindSpeed'],
                                    unit: 'km/h',
                                    imageUrl: 'assets/windspeed.png',
                                  ),
                                  WeatherItem(
                                    value: getForecastWeather(0)['avgHumidity'],
                                    unit: '%',
                                    imageUrl: 'assets/windspeed.png',
                                  ),
                                  WeatherItem(
                                    value:
                                        getForecastWeather(0)['chanceOfRain'],
                                    unit: '%',
                                    imageUrl: 'assets/lightrain.png',
                                  ),
                                ],
                              ),
                            ),
                          ),
                          Positioned(
                            top: 20,
                            right: 20,
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  getForecastWeather(0)['maxTemperature']
                                      .toString(),
                                  style: TextStyle(
                                    fontSize: 80,
                                    fontWeight: FontWeight.bold,
                                    foreground: Paint()
                                      ..shader = _constants.shader,
                                  ),
                                ),
                                Text(
                                  'o',
                                  style: TextStyle(
                                    fontSize: 40,
                                    fontWeight: FontWeight.bold,
                                    foreground: Paint()
                                      ..shader = _constants.shader,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    // Forecast List
                    Container(
                      height: 400,
                      margin: const EdgeInsets.only(top: 20),
                      child: ListView.builder(
                        itemCount: widget.dailyForecastWeather.length,
                        physics: const BouncingScrollPhysics(),
                        itemBuilder: (context, index) {
                          return Card(
                            elevation: 3.0,
                            margin: const EdgeInsets.only(
                              bottom: 20.0,
                              left: 20.0,
                              right: 20.0,
                            ),
                            child: Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: Column(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceAround,
                                children: [
                                  Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    crossAxisAlignment:
                                        CrossAxisAlignment.center,
                                    children: [
                                      Text(
                                        getForecastWeather(
                                            index)['forecastDate'],
                                        style: const TextStyle(
                                          color: Color(0xff6696f5),
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                                      Row(
                                        children: [
                                          Row(
                                            children: [
                                              Text(
                                                getForecastWeather(
                                                        index)['minTemperature']
                                                    .toString(),
                                                style: TextStyle(
                                                  color: _constants.greyColor,
                                                  fontSize: 30,
                                                  fontWeight: FontWeight.w600,
                                                ),
                                              ),
                                              Text.rich(
                                                TextSpan(
                                                  children: [
                                                    WidgetSpan(
                                                      child:
                                                          Transform.translate(
                                                        offset:
                                                            const Offset(0, -8),
                                                        child: Text(
                                                          'o',
                                                          style: TextStyle(
                                                            color: _constants
                                                                .greyColor,
                                                            fontSize: 16,
                                                            fontWeight:
                                                                FontWeight.w600,
                                                          ),
                                                        ),
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                              ),
                                            ],
                                          ),
                                          const SizedBox(width: 10),
                                          Row(
                                            children: [
                                              Text(
                                                getForecastWeather(
                                                        index)['maxTemperature']
                                                    .toString(),
                                                style: TextStyle(
                                                  color: _constants.blackColor,
                                                  fontSize: 30,
                                                  fontWeight: FontWeight.w600,
                                                ),
                                              ),
                                              Text.rich(
                                                TextSpan(
                                                  children: [
                                                    WidgetSpan(
                                                      child:
                                                          Transform.translate(
                                                        offset:
                                                            const Offset(0, -8),
                                                        child: Text(
                                                          'o',
                                                          style: TextStyle(
                                                            color: _constants
                                                                .blackColor,
                                                            fontSize: 16,
                                                            fontWeight:
                                                                FontWeight.w600,
                                                          ),
                                                        ),
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                              ),
                                            ],
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 10),
                                  Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.center,
                                        children: [
                                          Image.asset(
                                            'assets/' +
                                                getForecastWeather(
                                                    index)['weatherIcon'],
                                            width: 30,
                                          ),
                                          const SizedBox(width: 5),
                                          Text(
                                            getForecastWeather(
                                                index)['weatherName'],
                                            style: const TextStyle(
                                              fontSize: 16,
                                              color: Colors.grey,
                                            ),
                                          ),
                                        ],
                                      ),
                                      Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.center,
                                        children: [
                                          Text(
                                            '${getForecastWeather(index)['chanceOfRain']}%',
                                            style: const TextStyle(
                                              fontSize: 16,
                                              color: Colors.grey,
                                            ),
                                          ),
                                          const SizedBox(width: 5),
                                          Image.asset(
                                            'assets/lightrain.png',
                                            width: 30,
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
