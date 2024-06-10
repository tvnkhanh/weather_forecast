import 'package:flutter/material.dart';
import 'package:weather_forecast_app/models/user.dart';

class UserProvider extends ChangeNotifier {
  User _user = User(
    id: '',
    name: '',
    email: '',
    password: '',
    token: '',
  );

  User get user => _user;

  void setUser(String userJson) {
    _user = User.fromJson(userJson);
    notifyListeners();
  }

  void setUserFromModel(User user) {
    _user = user;
    notifyListeners();
  }

  void clearUser() {
    _user = User(
      id: '',
      name: '',
      email: '',
      password: '',
      token: '',
    );
    notifyListeners();
  }
}
