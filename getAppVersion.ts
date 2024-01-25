import { useQuery } from "@apollo/client";
import axios from "axios";
import { CHECKVERSIONALLOW } from "./graphql/CheckVersionAllow";
import { useEffect } from "react";

const getAppVersion = async () => {
  try {
    // Get the app version from the Play Store (Android)
    const playStoreResponse = await axios.get(
      "https://play.google.com/store/apps/details?id=com.goglobalschool.schoolmobile"
    );

    // Updated regular expression to match the Play Store version
    const buildNumberMatch = playStoreResponse.data.match(
      /\[\[\["(\d+\.\d+\.\d+)"\]\],\[\[\[(\d+)\]\],\[\[\[\d+,"[^"]*"\]\]\]\]\]/
    );

    const playStoreVersion = buildNumberMatch ? buildNumberMatch[1] : "";

    // Get the app version from the App Store (iOS)
    const appStoreResponse = await axios.get(
      "https://itunes.apple.com/lookup?id=1641628042"
    );

    const appStoreVersion =
      appStoreResponse.data.results && appStoreResponse.data.results[0]
        ? appStoreResponse.data.results[0].version
        : "";

    return { playStoreVersion, appStoreVersion };
  } catch (error) {
    console.error("Error fetching app version:", error);
    return {
      playStoreVersion: "",
      appStoreVersion: "",
    };
  }
};

export default getAppVersion;
