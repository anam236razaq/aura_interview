import axios from "axios";
import {createContext, useCallback, useContext, useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/Constants";

export const ProfileContext = createContext();

export const useProfileData = () => {
  return useContext(ProfileContext);
};


export const ProfileProvider = ({children}) => {
  const [profileData, setProfileData] = useState(() => {
    // Initialize from local storage if available
    const storedData = localStorage.getItem('profileData');
      if (storedData) {
      try {
        return JSON.parse(storedData); 
      } catch {
        return null; 
      }
    }
    return null; 
  });

  const fetchUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken'); // ✅ Get auth token
      if (!token) {
        setProfileData(null);
        return;
      }
  
      const response = await axios.get(API_BASE_URL + '/profile', {
        headers: {
          "Content-Type": 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
  
      const fetchedData = response.data;
      setProfileData(fetchedData);
      localStorage.setItem('profileData', JSON.stringify(fetchedData));
      
    } catch (error) {
      console.log(error);
      setProfileData(null); 
    }
  }, []);
  

        useEffect(()=> {
          fetchUserData();
        }, [fetchUserData]);

    return(
    <ProfileContext.Provider
        value={{
        profileData,
        setProfileData,
        fetchUserData}}>
        {children}
    </ProfileContext.Provider>
    );
}
