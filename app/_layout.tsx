import {Header, BottomMenu} from "./components/header";
import { Slot } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
      <>
        <Header />
        <Slot />
          <BottomMenu />
      </>
  );
}
