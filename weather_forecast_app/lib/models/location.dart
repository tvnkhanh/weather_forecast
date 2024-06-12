import 'dart:convert';

class Location {
  final String id;
  final String userId;
  final List<String> cities;

  Location({
    required this.id,
    required this.userId,
    required this.cities,
  });

  Map<String, dynamic> toMap() {
    return {
      '_id': id,
      'name': userId,
      'cities': cities,
    };
  }

  factory Location.fromMap(Map<String, dynamic> map) {
    return Location(
      id: map['_id'] ?? '',
      userId: map['name'] ?? '',
      cities: List<String>.from(map['cities'] ?? []),
    );
  }

  String toJson() => json.encode(toMap());

  factory Location.fromJson(String source) =>
      Location.fromMap(json.decode(source));

  Location copyWith({
    String? id,
    String? userId,
    List<String>? cities,
  }) {
    return Location(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      cities: cities ?? this.cities,
    );
  }
}
