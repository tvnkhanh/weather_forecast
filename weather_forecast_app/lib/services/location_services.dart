import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:provider/provider.dart';
import 'package:weather_forecast_app/models/location.dart';
import 'package:weather_forecast_app/provider/user_provider.dart';
import 'package:weather_forecast_app/utils/error_handling.dart';
import 'package:weather_forecast_app/utils/show_snack_bar.dart';

class LocationServices {
  final String _baseUrl = dotenv.env['LOCATION_API_URL']!;

  Future<List<Location>> getAllLocations(
    String userId,
    BuildContext context,
  ) async {
    final userProvider = Provider.of<UserProvider>(context, listen: false);
    List<Location> locations = [];
    try {
      final res = await http.get(
        Uri.parse('$_baseUrl/api/locations/user/$userId'),
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'x-auth-token': userProvider.user.token,
        },
      );

      httpErrorHandler(
        response: res,
        context: context,
        onSuccess: () {
          final List<dynamic> jsonResponse = json.decode(res.body);
          locations =
              jsonResponse.map((data) => Location.fromMap(data)).toList();
        },
      );
    } catch (error) {
      showSnackBar(context, error.toString());
    }
    return locations;
  }

  void createLocation(
    BuildContext context,
    String userId,
    String city,
    bool isSavedLocation,
  ) async {
    final userProvider = Provider.of<UserProvider>(context, listen: false);
    try {
      http.Response res = await http.post(
        Uri.parse('$_baseUrl/api/create-location'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
          'x-auth-token': userProvider.user.token,
        },
        body: jsonEncode(<String, dynamic>{
          'userId': userId,
          'city': city,
        }),
      );

      httpErrorHandler(
        response: res,
        context: context,
        onSuccess: () {
          if (isSavedLocation) {
            showSnackBar(
              context,
              "City removed successfully",
            );
          } else {
            showSnackBar(
              context,
              "City added successfully",
            );
          }
        },
      );
    } catch (error) {
      showSnackBar(context, error.toString());
    }
  }
}
