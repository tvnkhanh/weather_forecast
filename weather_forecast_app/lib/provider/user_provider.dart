import 'package:flutter/material.dart';
import 'package:weather_forecast_app/models/user.dart';

class UserProvider extends ChangeNotifier {
  User? _user;

  User get user => _user!;

  bool get isAuthenticated => _user != null;

  void setUser(String userJson) {
    _user = User.fromJson(userJson);
    notifyListeners();
  }

  void clearUser() {
    _user = null;
    notifyListeners();
  }
}
