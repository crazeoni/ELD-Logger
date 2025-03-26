from django.shortcuts import render

# Create your views here.
import requests
from rest_framework import viewsets
from .models import Trip
from .serializers import TripSerializer
from django.http import JsonResponse, HttpResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
#from reportlab.platypus import Image
from reportlab.lib.utils import ImageReader
import os
from django.conf import settings
import datetime
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


# Constants
ORS_API_KEY = "5b3ce3597851110001cf624830984b62eb2349049713a228ff9ba00d"  # Replace with your actual key
ORS_GEOCODE_URL = "https://api.openrouteservice.org/geocode/search"
ORS_ROUTE_URL = "https://api.openrouteservice.org/v2/directions/driving-car"

FUEL_STOP_INTERVAL = 1000  # Fuel every 1000 miles
REST_STOP_INTERVAL = 8  # Rest every 8 hours
MILES_PER_HOUR = 50  # Average truck speed
LOG_GRID_START_X = 100  # Starting X position for log graph
LOG_GRID_START_Y = 450  # Adjusted Y position to fit the grid
LOG_GRID_WIDTH = 400  # Total width of the log grid
HOURS_IN_A_DAY = 24  # Log sheet represents 24 hours
PIXELS_PER_HOUR = LOG_GRID_WIDTH / HOURS_IN_A_DAY  # Scale for HOS grid

def get_trip_logs(request, trip_id):  # ✅ Accepts trip_id directly from URL
	"""Fetch dynamically generated trip logs based on trip distance and HOS rules."""
	
	try:
		trip = Trip.objects.get(id=trip_id)
	except Trip.DoesNotExist:
		return JsonResponse({"error": f"Trip with ID {trip_id} not found."}, status=404)

	# ✅ Fetch trip distance dynamically
	trip_distance = get_route_distance(trip.pickup_location, trip.dropoff_location)
	if trip_distance is None:
		return JsonResponse({"error": "Error fetching route data"}, status=500)

	# ✅ Calculate trip timing
	MILES_PER_HOUR = 50  
	REST_STOP_INTERVAL = 8  
	FUEL_STOP_INTERVAL = 1000  

	total_drive_time = trip_distance / MILES_PER_HOUR  
	total_hours = total_drive_time  
	fuel_stops = int(trip_distance // FUEL_STOP_INTERVAL)
	rest_stops = int(total_drive_time // REST_STOP_INTERVAL)

	# ✅ Generate log entries
	log_entries = []
	current_time = 0  

	while current_time < total_hours:
		if current_time % REST_STOP_INTERVAL == 0 and current_time > 0:
			log_entries.append({"start_hour": current_time, "end_hour": current_time + 2, "status": "Sleeper"})
			current_time += 2  

		log_entries.append({"start_hour": current_time, "end_hour": current_time + 4, "status": "Driving"})
		current_time += 4  

		log_entries.append({"start_hour": current_time, "end_hour": current_time + 2, "status": "On Duty"})
		current_time += 2  

	log_entries = [entry for entry in log_entries if entry["start_hour"] < 24]
	

	return JsonResponse({
		"trip_logs": log_entries,
		"fuel_stops": fuel_stops,
		"rest_stops": rest_stops,
		"trip_distance": round(trip_distance, 2),
		"total_drive_hours": round(total_drive_time, 2),
	})



def get_route(request):
	"""API endpoint to fetch route details including distance & coordinates."""
	pickup = request.GET.get("pickup")
	dropoff = request.GET.get("dropoff")

	if not pickup or not dropoff:
		return JsonResponse({"error": "Missing pickup or dropoff"}, status=400)

	distance, route_geometry = get_route_distance(pickup, dropoff)  # ✅ Fetch both distance & route

	if distance is None or route_geometry is None:
		return JsonResponse({"error": "No route found"}, status=404)

	# ✅ Ensure the response includes `route` as a list of coordinates
	route_coords = [[lon, lat] for lon, lat in route_geometry]  # ✅ Correct coordinate order

	return JsonResponse({
		"route": route_coords,  # ✅ Now returns actual route coordinates
		"distance": distance,
		"stops": []  # Placeholder for now
	})


# ✅ Function to get coordinates from OpenRouteService
def get_coordinates(location):
	"""Convert location name to latitude/longitude using OpenRouteService."""
	try:
		params = {"api_key": ORS_API_KEY, "text": location, "size": 1}
		response = requests.get(ORS_GEOCODE_URL, params=params)
		data = response.json()
		
		#print(f"🔍 Geocode Response for {location}: {data}")  # ✅ Log response

		if "features" in data and len(data["features"]) > 0:
			lon, lat = data["features"][0]["geometry"]["coordinates"]
			return lat, lon
		else:
			print(f"❌ Geocoding failed for {location}: No results found")
			return None
	except Exception as e:
		print(f"⚠️ Error geocoding location {location}: {e}")
		return None


def get_route_distance(pickup, dropoff):
	"""Fetch distance between pickup and dropoff using OpenRouteService."""
	try:
		pickup_coords = get_coordinates(pickup)
		dropoff_coords = get_coordinates(dropoff)

		if not pickup_coords or not dropoff_coords:
			print("❌ One or both locations failed to geocode.")
			return None  

		params = {
			"api_key": ORS_API_KEY,
			"start": f"{pickup_coords[1]},{pickup_coords[0]}",  # ORS expects lon,lat
			"end": f"{dropoff_coords[1]},{dropoff_coords[0]}"
		}

		response = requests.get(ORS_ROUTE_URL, params=params)
		data = response.json()
		
		#print(f"🔍 ORS Route API Response for {data}")  # ✅ Debugging

		# ✅ Fix: Extract distance correctly
		if "features" in data and len(data["features"]) > 0:
			route_data = data["features"][0]["properties"]
			if "segments" in route_data and len(route_data["segments"]) > 0:
				distance_km = route_data["segments"][0]["distance"] / 1000  # Convert meters to km
				distance_miles = distance_km * 0.621371  # Convert km to miles
				return round(distance_miles, 2)  # ✅ Ensure returning a single float, not a tuple

		print(f"❌ Error: No valid distance found for {pickup} to {dropoff}")
		return None
	except Exception as e:
		print(f"⚠️ Error fetching route: {e}")
		return None


def home(request):
	return JsonResponse({"message": "Welcome to ELD Logger API"})


class TripViewSet(viewsets.ModelViewSet):
	queryset = Trip.objects.all()
	serializer_class = TripSerializer


