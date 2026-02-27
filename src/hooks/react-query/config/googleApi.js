import MainApi from '../../../api/MainApi'

const toFiniteNumber = (value) => {
    const num = Number(value)
    return Number.isFinite(num) ? num : null
}

export const getNormalizedLatLng = (response) => {
    const location =
        response?.data?.location ||
        response?.data?.result?.geometry?.location ||
        response?.result?.geometry?.location ||
        response?.location

    const lat = toFiniteNumber(location?.lat ?? location?.latitude)
    const lng = toFiniteNumber(location?.lng ?? location?.longitude)

    if (lat === null || lng === null) {
        return null
    }

    return { lat, lng }
}

export const GoogleApi = {
    placeApiAutocomplete: (search) => {
        if (search && search !== '') {
            return MainApi.get(
                `/api/v1/config/place-api-autocomplete?search_text=${search}`
            )
        }
    },
    placeApiDetails: (placeId) => {
        return MainApi.get(
            `/api/v1/config/place-api-details?placeid=${placeId}`
        )
    },
    getZoneId: (location) => {
        if (
            !Number.isFinite(Number(location?.lat)) ||
            !Number.isFinite(Number(location?.lng))
        ) {
            return null
        }

        return MainApi.get(
            `/api/v1/config/get-zone-id?lat=${location?.lat}&lng=${location?.lng}`
        )
    },
    distanceApi: (origin, destination) => {
        return MainApi.get(
            `/api/v1/config/distance-api?origin_lat=${origin.latitude
            }&origin_lng=${origin.longitude}&destination_lat=${destination.lat ? destination?.lat : destination?.latitude
            }&destination_lng=${destination.lng ? destination?.lng : destination?.longitude
            }`
        )
    },
    geoCodeApi: (location) => {
        return MainApi.get(
            `/api/v1/config/geocode-api?lat=${location?.lat}&lng=${location?.lng}`
        )
    },
}
