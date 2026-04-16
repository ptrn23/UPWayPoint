"use client";

import { useState, useCallback, useRef } from "react";

export interface Coordinate {
	latitude: number;
	longitude: number;
}

export interface RouteInfo {
	coordinates: Coordinate[];
	distanceMeters: number;
	durationSeconds: number;
	encodedPath: string;
}

interface UseNavigationRouteReturn {
	route: RouteInfo | null;
	error: string | null;
	isLoading: boolean;
	fetchRoute: (origin: Coordinate, destination: Coordinate) => Promise<void>;
	clearRoute: () => void;
}

// Standard polyline decoder algorithm used by Google
const decodePolyline = (encoded: string): Coordinate[] => {
	const poly: Coordinate[] = [];
	let index = 0,
		len = encoded.length;
	let lat = 0,
		lng = 0;

	while (index < len) {
		let b: number,
			shift = 0,
			result = 0;
		do {
			b = encoded.charCodeAt(index++) - 63;
			result |= (b & 0x1f) << shift;
			shift += 5;
		} while (b >= 0x20);
		const dlat = result & 1 ? ~(result >> 1) : result >> 1;
		lat += dlat;

		shift = 0;
		result = 0;
		do {
			b = encoded.charCodeAt(index++) - 63;
			result |= (b & 0x1f) << shift;
			shift += 5;
		} while (b >= 0x20);
		const dlng = result & 1 ? ~(result >> 1) : result >> 1;
		lng += dlng;

		poly.push({
			latitude: lat / 1e5,
			longitude: lng / 1e5,
		});
	}
	return poly;
};

export function useNavigationRoute(apiKey: string): UseNavigationRouteReturn {
	const [route, setRoute] = useState<RouteInfo | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	// Track the current request to prevent duplicate requests
	const currentRequestRef = useRef<{
		origin: Coordinate;
		destination: Coordinate;
		abortController: AbortController;
	} | null>(null);

	const fetchRoute = useCallback(
		async (origin: Coordinate, destination: Coordinate) => {
			if (!apiKey) {
				setError("Google Maps API key not configured");
				return;
			}

			// Check if we already have the same route cached
			if (
				currentRequestRef.current &&
				currentRequestRef.current.origin.latitude === origin.latitude &&
				currentRequestRef.current.origin.longitude === origin.longitude &&
				currentRequestRef.current.destination.latitude ===
					destination.latitude &&
				currentRequestRef.current.destination.longitude ===
					destination.longitude
			) {
				// Same request already in progress, don't make another
				return;
			}

			// Cancel any existing request
			if (currentRequestRef.current) {
				currentRequestRef.current.abortController.abort();
			}

			// Create new abort controller
			const abortController = new AbortController();
			currentRequestRef.current = {
				origin,
				destination,
				abortController,
			};

			setIsLoading(true);
			setError(null);

			try {
				const response = await fetch(
					"https://routes.googleapis.com/directions/v2:computeRoutes",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"X-Goog-Api-Key": apiKey,
							"X-Goog-FieldMask":
								"routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline",
						},
						body: JSON.stringify({
							origin: {
								location: {
									latLng: {
										latitude: origin.latitude,
										longitude: origin.longitude,
									},
								},
							},
							destination: {
								location: {
									latLng: {
										latitude: destination.latitude,
										longitude: destination.longitude,
									},
								},
							},
							travelMode: "WALK",
						}),
						signal: abortController.signal,
					},
				);

				if (!response.ok) {
					const errorText = await response.text();
					console.error("[Navigation] HTTP Error Response:", errorText);
					throw new Error(`HTTP error: ${response.status} - ${errorText}`);
				}

				const data = await response.json();

				if (data.routes && data.routes.length > 0) {
					const routeData = data.routes[0];

					// Decode the encoded polyline string into coordinates
					const decodedCoordinates = decodePolyline(
						routeData.polyline.encodedPolyline,
					);

					setRoute({
						coordinates: decodedCoordinates,
						distanceMeters: routeData.distanceMeters,
						durationSeconds: parseInt(routeData.duration.replace("s", ""), 10),
						encodedPath: routeData.polyline.encodedPolyline,
					});

					// Clear current request reference since we succeeded
					currentRequestRef.current = null;
				} else {
					setError("No route found");
					setRoute(null);
				}
			} catch (err) {
				// Ignore abort errors
				if (err instanceof Error && err.name === "AbortError") {
					return;
				}
				console.error("[Navigation] Error fetching route:", err);
				setError(err instanceof Error ? err.message : "Failed to fetch route");
				setRoute(null);
			} finally {
				setIsLoading(false);
			}
		},
		[apiKey],
	);

	const clearRoute = useCallback(() => {
		// Cancel any in-progress request
		if (currentRequestRef.current) {
			currentRequestRef.current.abortController.abort();
			currentRequestRef.current = null;
		}
		setRoute(null);
		setError(null);
		setIsLoading(false);
	}, []);

	return {
		route,
		error,
		isLoading,
		fetchRoute,
		clearRoute,
	};
}
