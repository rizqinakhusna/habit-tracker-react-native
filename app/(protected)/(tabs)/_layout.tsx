import { Tabs } from "expo-router";
import React from "react";

const TabScreenLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
    </Tabs>
  );
};

export default TabScreenLayout;
