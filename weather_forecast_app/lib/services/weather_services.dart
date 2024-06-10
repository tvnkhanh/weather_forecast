import 'dart:async';
import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;

class WeatherServices {
  final String _baseUrl = dotenv.env['WEATHER_API_URL']!;
  Timer? _debounceTimer;

  void debounce(
    Function(String) callback,
    String value, {
    Duration duration = const Duration(milliseconds: 300),
  }) {
    if (_debounceTimer != null) {
      _debounceTimer!.cancel();
    }
    _debounceTimer = Timer(duration, () => callback(value));
  }

  Future<Map<String, dynamic>> fetchWeatherData(String city) async {
    try {
      final response =
          await http.get(Uri.parse('$_baseUrl/fetch-weather?city=$city'));

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        throw Exception('Failed to load weather data');
      }
    } catch (e) {
      throw Exception('Error fetching weather data: $e');
    }
  }
}
