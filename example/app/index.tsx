import * as React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import SessionStorage from "react-native-session-storage";
import { useState, useCallback, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { safeJSONParse } from "./helper";
import { StatusBar } from "expo-status-bar";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import styles from "./styles";

interface StorageItem {
  key: string;
  value: any;
}

export default function App(): React.JSX.Element {
  const initialOutput = Object.freeze({
    message: "Results will appear here...",
    success: true,
  });

  const [inputKey, setInputKey] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [output, setOutput] = useState<{ message: string; success: boolean; }>(
    initialOutput
  );
  const [allItems, setAllItems] = useState<StorageItem[]>([]);

  const { top } = useSafeAreaInsets();

  // Load items on first render
  useEffect(() => {
    refreshItems();
  }, []);

  // Helper to refresh displayed items
  const refreshItems = useCallback(() => {
    const items = SessionStorage.getAllItems();
    setAllItems(
      Object.entries(items).map(([key, value]) => ({
        key,
        value: JSON.stringify(value, null, 2),
      }))
    );
  }, []);

  // Helper to display results
  const displayResult = (message: string, success = true) => {
    setOutput({ message, success });
    setTimeout(() => setOutput(initialOutput), 3000); // Clear after 3 seconds
  };

  // Basic Operations
  const handleSetItem = useCallback(() => {
    try {
      if (!inputKey.trim()) {
        displayResult("Error: Key cannot be empty", false);
        return;
      }

      let value: any = inputValue;
      try {
        // Only parse if it looks like JSON
        if (
          inputValue.trim().startsWith("{") ||
          inputValue.trim().startsWith("[")
        ) {
          value = safeJSONParse(inputValue);
        }
      } catch (e) {
        console.error(e);
        // If parsing fails, use the raw string
      }

      SessionStorage.setItem(inputKey, value);
      displayResult(`Stored ${inputKey}: ${JSON.stringify(value)}`);
      refreshItems();
    } catch (e: any) {
      displayResult(`Error: ${e.message}`, false);
    }
  }, [inputKey, inputValue]);

  const handleGetItem = useCallback(() => {
    try {
      if (!inputKey.trim()) {
        displayResult("Error: Key cannot be empty", false);
        return;
      }

      const value = SessionStorage.getItem(inputKey);
      displayResult(`Retrieved ${inputKey}: ${JSON.stringify(value, null, 2)}`);
    } catch (e: any) {
      displayResult(`Error: ${e.message}`, false);
    }
  }, [inputKey]);

  const handleRemoveItem = useCallback(() => {
    try {
      if (!inputKey.trim()) {
        displayResult("Error: Key cannot be empty", false);
        return;
      }

      SessionStorage.removeItem(inputKey);
      displayResult(`Removed ${inputKey}`);
      refreshItems();
    } catch (e: any) {
      displayResult(`Error: ${e.message}`, false);
    }
  }, [inputKey]);

  const handleClear = useCallback(() => {
    try {
      SessionStorage.clear();
      displayResult("Cleared all items");
      refreshItems();
    } catch (e: any) {
      displayResult(`Error: ${e.message}`, false);
    }
  }, []);

  const handleGetKey = useCallback(() => {
    try {
      // For getKey, we use the inputValue as the index number
      const indexStr = inputValue.trim();
      if (!indexStr) {
        displayResult("Error: Index cannot be empty", false);
        return;
      }

      const index = parseInt(indexStr, 10);
      if (isNaN(index)) {
        displayResult("Error: Index must be a number", false);
        return;
      }

      const key = SessionStorage.key(index);
      displayResult(`Key at index ${index}: ${key || "undefined"}`);
    } catch (e: any) {
      displayResult(`Error: ${e.message}`, false);
    }
  }, [inputValue]);

  const handleGetLength = useCallback(() => {
    try {
      const length = SessionStorage.length;
      displayResult(`Storage length: ${length}`);
    } catch (e: any) {
      displayResult(`Error: ${e.message}`, false);
    }
  }, []);

  // Enhanced Operations
  const handleMultiGet = useCallback(() => {
    try {
      if (!inputKey.trim()) {
        displayResult("Error: Keys cannot be empty", false);
        return;
      }

      const keys = inputKey.split(",").map((k) => k.trim());
      const values = SessionStorage.multiGet(keys);
      displayResult(`MultiGet: ${JSON.stringify(values, null, 2)}`);
    } catch (e: any) {
      displayResult(`Error: ${e.message}`, false);
    }
  }, [inputKey]);

  const handleGetAllItems = useCallback(() => {
    try {
      const items = SessionStorage.getAllItems();
      displayResult(`All items: ${JSON.stringify(items, null, 2)}`);
      refreshItems();
    } catch (e: any) {
      displayResult(`Error: ${e.message}`, false);
    }
  }, []);

  const handleMultiSet = useCallback(() => {
    try {
      if (!inputValue.trim()) {
        displayResult("Error: Value cannot be empty", false);
        return;
      }

      // Validate if value is proper JSON
      let pairs: any;
      try {
        pairs = safeJSONParse(inputValue);
      } catch (e) {
        console.error(e);
        displayResult(
          "Error: Value must be valid JSON (array or object)",
          false
        );
        return;
      }

      // Validate if it's either an array of key-value pairs or an object
      if (!Array.isArray(pairs) && typeof pairs !== "object") {
        displayResult(
          "Error: Value must be an array of pairs or an object",
          false
        );
        return;
      }

      SessionStorage.multiSet(pairs);
      displayResult(`MultiSet: ${JSON.stringify(pairs, null, 2)}`);
      refreshItems();
    } catch (e: any) {
      displayResult(`Error: ${e.message}`, false);
    }
  }, [inputValue]);

  const handleMergeItem = useCallback(() => {
    try {
      if (!inputKey.trim()) {
        displayResult("Error: Key cannot be empty", false);
        return;
      }

      if (!inputValue.trim()) {
        displayResult("Error: Value cannot be empty", false);
        return;
      }

      let value: any;
      try {
        value = safeJSONParse(inputValue);
      } catch (e) {
        console.error(e);
        displayResult("Error: Value must be valid JSON object", false);
        return;
      }

      if (typeof value !== "object" || Array.isArray(value)) {
        displayResult("Error: Value must be a JSON object for merging", false);
        return;
      }

      const merged = SessionStorage.mergeItem(inputKey, value);
      if (merged === undefined) {
        displayResult(
          `Could not merge with ${inputKey} (not an object)`,
          false
        );
      } else {
        displayResult(`Merged ${inputKey}: ${JSON.stringify(merged, null, 2)}`);
      }
      refreshItems();
    } catch (e: any) {
      displayResult(`Error: ${e.message}`, false);
    }
  }, [inputKey, inputValue]);

  const handleMultiMerge = useCallback(() => {
    try {
      if (!inputValue.trim()) {
        displayResult("Error: Value cannot be empty", false);
        return;
      }

      let pairs: any;
      try {
        pairs = safeJSONParse(inputValue);
      } catch (e) {
        console.error(e);
        displayResult(
          "Error: Value must be valid JSON (array or object)",
          false
        );
        return;
      }

      const results = SessionStorage.multiMerge(pairs);
      displayResult(`MultiMerge: ${JSON.stringify(results, null, 2)}`);
      refreshItems();
    } catch (e: any) {
      displayResult(`Error: ${e.message}`, false);
    }
  }, [inputValue]);

  const handleMultiRemove = useCallback(() => {
    try {
      // For multiRemove, we expect keys in the inputValue
      if (!inputValue.trim()) {
        displayResult("Error: Keys cannot be empty", false);
        return;
      }

      const keys = inputValue.split(",").map((k) => k.trim());
      SessionStorage.multiRemove(keys);
      displayResult(`Removed keys: ${keys.join(", ")}`);
      refreshItems();
    } catch (e: any) {
      displayResult(`Error: ${e.message}`, false);
    }
  }, [inputValue]);

  const handleGetAllKeys = useCallback(() => {
    try {
      const keys = SessionStorage.getAllKeys();
      displayResult(`All keys: ${keys.join(", ")}`);
    } catch (e: any) {
      displayResult(`Error: ${e.message}`, false);
    }
  }, []);

  return (
    <View
      style={{
        ...styles.parent,
        marginTop: -top,
      }}
    >
      <StatusBar translucent backgroundColor="#3d527f" style="light" />
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
          <Text style={styles.header}>SessionStorage Demo</Text>

          <LinearGradient
            colors={["#4c669f", "#3b5998", "#192f6a"]}
            style={styles.container}
          >
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Input</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter key (or comma-separated keys for multiGet)"
                  placeholderTextColor="#888"
                  defaultValue={inputKey}
                  onChangeText={setInputKey}
                  maxLength={100}
                  keyboardType="ascii-capable"
                />
                <TextInput
                  style={[styles.input, styles.inputValue]}
                  placeholder="Enter value (string, JSON object, or comma-separated keys for multiRemove)"
                  placeholderTextColor="#888"
                  defaultValue={inputValue}
                  onChangeText={setInputValue}
                  multiline
                  maxLength={1000}
                  keyboardType="ascii-capable"
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Basic Operations</Text>
                <View style={styles.buttonRow}>
                  <OperationButton
                    title="Set Item"
                    icon="save"
                    onPress={handleSetItem}
                  />
                  <OperationButton
                    title="Get Item"
                    icon="search"
                    onPress={handleGetItem}
                  />
                  <OperationButton
                    title="Remove Item"
                    icon="trash"
                    onPress={handleRemoveItem}
                  />
                </View>
                <View style={styles.buttonRow}>
                  <OperationButton
                    title="Clear"
                    icon="close-circle"
                    onPress={handleClear}
                  />
                  <OperationButton
                    title="Get Key"
                    icon="key"
                    onPress={handleGetKey}
                  />
                  <OperationButton
                    title="Length"
                    icon="list"
                    onPress={handleGetLength}
                  />
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Enhanced Operations</Text>
                <View style={styles.buttonRow}>
                  <OperationButton
                    title="Multi Get"
                    icon="download"
                    onPress={handleMultiGet}
                  />
                  <OperationButton
                    title="Get All Items"
                    icon="archive"
                    onPress={handleGetAllItems}
                  />
                  <OperationButton
                    title="Multi Set"
                    icon="cloud-upload"
                    onPress={handleMultiSet}
                  />
                </View>
                <View style={styles.buttonRow}>
                  <OperationButton
                    title="Merge Item"
                    icon="git-merge"
                    onPress={handleMergeItem}
                  />
                  <OperationButton
                    title="Multi Merge"
                    icon="git-network"
                    fam="Ionicons"
                    onPress={handleMultiMerge}
                  />
                  <OperationButton
                    title="Multi Remove"
                    icon="trash-bin"
                    onPress={handleMultiRemove}
                  />
                </View>
                <OperationButton
                  title="Get All Keys"
                  icon="key-outline"
                  onPress={handleGetAllKeys}
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Output</Text>
                <Text
                  style={[
                    styles.output,
                    output?.success ? styles.success : styles.error,
                  ]}
                >
                  {output?.message || "Results will appear here..."}
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Stored Items ({allItems.length})
                </Text>
                {allItems.length === 0 ? (
                  <Text style={styles.emptyText}>No items stored yet.</Text>
                ) : (
                  allItems.map((item, index) => (
                    <View key={index} style={styles.itemCard}>
                      <Text style={styles.itemKey}>Key: {item.key}</Text>
                      <Text style={styles.itemValue}>Value: {item.value}</Text>
                    </View>
                  ))
                )}
              </View>
            </ScrollView>
          </LinearGradient>
        </SafeAreaView>
      </SafeAreaProvider>
    </View>
  );
}

interface OperationButtonProps {
  title: string;
  icon: string;
  onPress: () => void;
  fam?: "Ionicons" | "Entypo";
}

const OperationButton: React.FC<OperationButtonProps> = ({
  title,
  icon,
  onPress,
  fam = "Ionicons",
}) => (
  <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.7}>
    {fam === "Ionicons" ? (
      <Ionicons name={icon as any} size={20} color="#fff" />
    ) : (
      <Entypo name={icon as any} size={20} color="#fff" />
    )}
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);