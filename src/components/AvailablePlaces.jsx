import { useEffect, useState } from 'react';
import Places from './Places.jsx';
import ErrorPage from './Error.jsx';
import { sortPlacesByDistance } from '../loc.js';

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces,setAvailablePlaces] = useState([]);
  const [isLoading,setIsLoading]=useState(false);
  const [error,setError] = useState();
  
  
  useEffect(function(){
    async function fetchingPlaces() {
      try {
        setIsLoading(true);
        const res=await fetch("http://localhost:3000/places");
        if(!res.ok) throw new Error("an error occured while fetching places data. Try again") 
        const data=await res.json();
        navigator.geolocation.getCurrentPosition((position)=>{
          const curPos=sortPlacesByDistance(data.places,position.coords.latitude,position.coords.longitude);
          setAvailablePlaces(curPos);
          setIsLoading(false)
        })
        console.log(data);
      }
      catch(err) {
        console.log(err.message);
        setError("sorry not fetched");
      }
    } 

    fetchingPlaces();
  },[])

  if(error) {
    return <ErrorPage title="error occured" message={error} />
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isLoading}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
