import { useEffect, useState } from "react";

export const useGetLocaleUser = () => {
  const [location, setLocation] = useState<null | {
    ip: string;
    city: string;
    region: string;
    country: string;
  }>(null);

  useEffect(() => {
    fetch("/api/get-location")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setLocation(data);
        }
      });
  }, []);

  return location;
};
