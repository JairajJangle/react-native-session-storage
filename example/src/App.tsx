import * as React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button
} from 'react-native';
import SessionStorage from 'react-native-session-storage';

export default function App() {
  const [storedVal, updateStoredVal] = React.useState();
  const [inputText, setInputText] = React.useState<string>("");

  const setVal = React.useCallback(() => {
    SessionStorage.setItem("my_key", inputText);

    console.debug(SessionStorage.length);
  }, [inputText]);

  function getVal(): any {
    const val = SessionStorage.getItem("my_key");
    updateStoredVal(val);
  }

  return (
    <View style={styles.container}>
      <Text
        style={styles.title}>Input Value to Store</Text>
      <TextInput
        style={styles.textInput}
        onChangeText={setInputText} />

      <View style={styles.padding} />

      <Button
        color={"red"}
        title='Set'
        onPress={setVal} />

      <View style={styles.bigPadding} />

      <Button
        title='Get'
        onPress={getVal} />

      <View style={styles.padding} />

      <Text style={styles.title}>Stored Val:</Text>
      <Text style={styles.message}>{storedVal}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  title: {
    alignSelf: "flex-start",
    fontSize: 18
  },
  message: {
    alignSelf: "flex-start",
    fontSize: 16,
  },
  textInput: {
    backgroundColor: "white",
    width: "100%"
  },
  padding: {
    padding: 5,
  },
  bigPadding: {
    padding: 30,
  }
});
