import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const useUser = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userInfo = await AsyncStorage.getItem("userInfo");
        if (userInfo) {
          setUser(JSON.parse(userInfo));
        }
      } catch (error) {
        console.error("Failed to load user info:", error);
      }
    };

    fetchUser();
  }, []);
  return user;
};

export default useUser;
