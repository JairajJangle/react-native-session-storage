# react-native-session-storage
Session Storage like module for React Native for session-bound storage. 

This module is **NOT** an alternative for *Async Storage* which is meant for persistent storage. Instead, this module provides a "volatile" storage which gets cleared when the app is re-opened. 

## Installation

With npm:

```sh
npm install react-native-session-storage
```

With yarn:

```sh
yarn add react-native-session-storage
```

With Expo CLI:

```
expo install react-native-session-storage
```

## Usage

### Importing

```typescript
import SessionStorage from 'react-native-session-storage';
```

### Storing data

The value can be of `any` type.

```typescript
SessionStorage.setItem('@storage_key', value);
```

### Reading data

The return value is of the type of the value which was stored using `setItem(...)`

```typescript
const data = SessionStorage.getItem('@storage_key');
```

### Removing data

```typescript
SessionStorage.removeItem('@storage_key');
```

### Clearing all keys

```typescript
SessionStorage.clear();
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
