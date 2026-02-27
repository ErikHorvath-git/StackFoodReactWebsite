import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { GoogleApi, getNormalizedLatLng } from '@/hooks/react-query/config/googleApi'
import {
    setFormattedAddress,
    setLocation,
    setZoneIds,
} from '@/redux/slices/addressData'
import { onErrorResponse } from '@/components/ErrorResponse'

const getPayload = (value) => value?.data ?? value ?? null
const getCachedLatLng = () => {
    if (typeof window === 'undefined') return null
    try {
        const cached = JSON.parse(localStorage.getItem('currentLatLng'))
        const lat = Number(cached?.lat)
        const lng = Number(cached?.lng)
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
        return { lat, lng }
    } catch {
        return null
    }
}

export const useGetLocation = (coords) => {
    const dispatch = useDispatch()
    const { global } = useSelector((state) => state.globalSettings)
    const { location } = useSelector((state) => state.addressData)
    const [isDisablePickButton, setDisablePickButton] = useState(false)
    const [locationEnabled, setLocationEnabled] = useState(false)
    const [searchKey, setSearchKey] = useState({ description: '' })
    const [enabled, setEnabled] = useState(false)
    const [placeDetailsEnabled, setPlaceDetailsEnabled] = useState(false)
    const [placeDescription, setPlaceDescription] = useState(undefined)
    const [zoneId, setZoneId] = useState(undefined)
    const [mounted, setMounted] = useState(true)
    const [predictions, setPredictions] = useState([])
    const [placeId, setPlaceId] = useState('')
    const [value, setValue] = useState()
    const [currentLocationValue, setCurrentLactionValue] = useState({
        description: '',
    })
    const { data: places, isLoading: isLoadingPlacesApi } = useQuery(
        ['places', searchKey.description],
        async () => GoogleApi.placeApiAutocomplete(searchKey.description),
        { enabled },
        {
            retry: 1,
        }
    )

    useEffect(() => {
        const cachedLocation = getCachedLatLng()
        if (cachedLocation) {
            dispatch(setLocation(cachedLocation))
            setLocationEnabled(true)
            return
        }
        if (global?.default_location) {
            dispatch(setLocation(global?.default_location))
            setLocationEnabled(true)
        }
    }, [dispatch, global?.default_location])

    const { data: zoneData } = useQuery(
        ['zoneId', location],
        async () => GoogleApi.getZoneId(location),
        {
            enabled: locationEnabled,
            retry: 0,
            onError: (error) => {
                console.log({ error })
                //onErrorResponse(error)
            }
        }
    )
    const { data: placeDetails } = useQuery(
        ['placeDetails', placeId],
        async () => GoogleApi.placeApiDetails(placeId),
        { enabled: placeDetailsEnabled },
        {
            retry: 1,
        }
    )

    useEffect(() => {
        if (placeDetails) {
            const normalizedLocation = getNormalizedLatLng(placeDetails)
            if (!normalizedLocation) return
            dispatch(
                setLocation(normalizedLocation)
            )
            setLocationEnabled(true)
        }
    }, [placeDetails])
    useEffect(() => {
        const placesPayload = getPayload(places)
        if (placesPayload) {
            const tempData = (placesPayload?.suggestions || []).map((item) => ({
                place_id: item.placePrediction.placeId,
                description: `${item?.placePrediction?.structuredFormat?.mainText?.text}, ${item?.placePrediction?.structuredFormat?.secondaryText?.text || ""}`
            }))
            setPredictions(tempData)
        } else {
            setPredictions([])
        }
    }, [places])


    useEffect(() => {
        const zonePayload = getPayload(zoneData)
        if (zonePayload?.zone_id) {
            setZoneId(zonePayload.zone_id)
            dispatch(setZoneIds(zonePayload.zone_id))
            setLocationEnabled(false)
            setMounted(false)
        } else {
            setZoneId(undefined)
            dispatch(setZoneIds(null))
        }
    }, [zoneData])

    const { isLoading: geoCodeLoading, data: geoCodeResults } = useQuery(
        ['geocode-api', location],
        async () => GoogleApi.geoCodeApi(location)
    )
    if (geoCodeResults) {
    }
    const setLocations = (value) => {
        dispatch(setLocation(value))
    }
    useEffect(() => {
        const geoPayload = getPayload(geoCodeResults)
        const formattedAddress = geoPayload?.results?.[0]?.formatted_address
        if (formattedAddress) {
            dispatch(
                setFormattedAddress(formattedAddress)
            )
        }
    }, [geoCodeResults])
    useEffect(() => {
        const geoPayload = getPayload(geoCodeResults)
        const formattedAddress = geoPayload?.results?.[0]?.formatted_address
        if (formattedAddress) {
            setCurrentLactionValue({
                description: formattedAddress,
            })
        } else {
            setCurrentLactionValue({
                description: '',
            })
        }
    }, [geoCodeResults])
    return {
        isDisablePickButton,
        setDisablePickButton,
        locationEnabled,
        setLocationEnabled,
        searchKey,
        setSearchKey,
        enabled,
        setEnabled,
        placeDetailsEnabled,
        setPlaceDetailsEnabled,
        placeDescription,
        setPlaceDescription,
        zoneId,
        setZoneId,
        mounted,
        setMounted,
        predictions,
        setPredictions,
        placeId,
        setPlaceId,
        value,
        setValue,
        setLocation,
        setLocations,
        isLoadingPlacesApi,
        geoCodeLoading,
        currentLocationValue,
        setCurrentLactionValue,

        // Other state variables and functions...
    }
}
