import { SafeAreaProvider } from "react-native-safe-area-context";
import Home from "./Home";
import { JSX } from "react";

export default function App(): JSX.Element {
  return (
    <SafeAreaProvider>
      <Home />
    </SafeAreaProvider>
  );
}
