1. Create User
Endpoint: POST /create

Payload:{
  "name": "aman",
  "email": "amanDeep@neuvays.com",
  "password": "12345678",
  "address": "NYC",
  "latitude": "87.7128",
  "longitude": "-74.0060",
  "status": "active"


Response:{
  "status_code": "200",
  "message": "User created successfully",
  "data": {
    "name": "aman",
    "email": "amanDeep@neuvays.com",
    "address": "NYC",
    "latitude": "87.7128",
    "longitude": "-74.0060",
    "status": "active",
    "register_at": "2025-05-16T20:10:02.108Z",
    "token": "JWT_TOKEN_HERE"
  }




 2. Toggle Status
Endpoint: POST /toggle-status

Headers:
Authorization: Bearer <JWT_TOKEN>

Response:{
  "status_code": 200,
  "message": "User statuses toggled successfully",
  "updated_count": 18
}





3. Get User Listing by Week Number
Endpoint: GET /getUserListing?week_number=01,2,3,4

Query Param: week_number=01,2,3,4

Response: {
  "status_code": "200",
  "message": "User list fetched successfully",
  "data": {
    "monday": [],
    "tuesday": [],
    "wednesday": [],
    "thursday": [
      { "name": "John", "email": "john@example.com" },
      { "name": "aman", "email": "amanDeep@neuvays.com" }
    ],
    "sunday": []
  }
}
4. Get Distance from User to Destination
Endpoint: GET /getDistance?Destination_Latitude=12.9716&Destination_Longitude=77.5946

Response:{
  "status_code": "200",
  "message": "Distance calculated successfully",
  "distance": "13367.98 km"
}
