export interface TransitRoute {
    id: string;
    name: string;
    color: string;
    path: { lat: number; lng: number }[];
}

export const JEEPNEY_ROUTES: TransitRoute[] = [
    {
        id: "route-ikot",
        name: "UP Ikot",
        color: "#FFD700",
        path: [
            { lat: 14.6549, lng: 121.0645 },
            { lat: 14.6560, lng: 121.0655 },
            { lat: 14.6570, lng: 121.0680 },
            { lat: 14.6565, lng: 121.0700 },
            { lat: 14.6545, lng: 121.0710 },
            { lat: 14.6530, lng: 121.0685 },
            { lat: 14.6549, lng: 121.0645 },
        ]
    }
];