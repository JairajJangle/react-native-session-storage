# react-native-session-storage

Session Storage like module for React Native for session-bound storage.

[![npm version](https://img.shields.io/npm/v/react-native-session-storage)](https://badge.fury.io/js/react-native-session-storage) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-native-session-storage) [![License](https://img.shields.io/github/license/JairajJangle/react-native-session-storage)](https://github.com/JairajJangle/react-native-session-storage/blob/master/LICENSE) [![Workflow Status](https://github.com/JairajJangle/react-native-session-storage/actions/workflows/ci.yml/badge.svg)](https://github.com/JairajJangle/react-native-session-storage/actions/workflows/ci.yml) [![cov](https://raw.githubusercontent.com/JairajJangle/react-native-session-storage/gh-pages/badges/coverage.svg)](https://github.com/JairajJangle/react-native-session-storage/actions/workflows/ci.yml) ![Android](https://img.shields.io/badge/-Android-555555?logo=android&logoColor=3DDC84) ![iOS](https://img.shields.io/badge/-iOS-555555?logo=apple&logoColor=white) ![Web](https://img.shields.io/badge/-Web-555555?logo=google-chrome&logoColor=0096FF) [![GitHub issues](https://img.shields.io/github/issues/JairajJangle/react-native-session-storage)](https://github.com/JairajJangle/react-native-session-storage/issues?q=is%3Aopen+is%3Aissue) ![TS](https://img.shields.io/badge/TypeScript-strict_💪-blue)

This module is **NOT** an alternative for *Async Storage* which is meant for persistent storage. Instead, this module provides a "volatile" session-bound storage which gets cleared when the app is re-opened.

<img src=".github/assets/demo_app_ss.png" width="320" alt="Example App Screenshot">


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

```sh
expo install react-native-session-storage
```

## Usage

### Importing

```typescript
import SessionStorage from 'react-native-session-storage';
```

## API Reference

### Basic Operations

| Method       | Description                          | Parameters                | Return Type           |
| ------------ | ------------------------------------ | ------------------------- | --------------------- |
| `setItem`    | Store a key-value pair               | `key: string, value: any` | `void`                |
| `getItem`    | Get value by key                     | `key: string`             | `any or undefined`    |
| `removeItem` | Remove value by key                  | `key: string`             | `void`                |
| `clear`      | Clear all key-value pairs            | -                         | `void`                |
| `key`        | Get key name by index                | `n: number`               | `string or undefined` |
| `length`     | Get number of stored key-value pairs | -                         | `number`              |

### Advanced Operations

| Method        | Description                              | Parameters                                                   | Return Type                                           |
| ------------- | ---------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------- |
| `multiGet`    | Get multiple values by their keys        | `keys: string[]`                                             | `Record<string, any | undefined>`                     |
| `getAllItems` | Get all key-value pairs                  | -                                                            | `Record<string, any>`                                 |
| `multiSet`    | Store multiple key-value pairs           | `keyValuePairs: [string, any][] | Record<string, any>`       | `void`                                                |
| `mergeItem`   | Merge an object with existing value      | `key: string, value: Record<string, unknown>`                | `Record<string, unknown> | undefined`                 |
| `multiMerge`  | Merge multiple objects with their values | `keyValuePairs: [string, Record<string, unknown>][] | Record<string, Record<string, unknown>>` | `Record<string, Record<string, unknown> | undefined>` |
| `multiRemove` | Remove multiple values by their keys     | `keys: string[]`                                             | `void`                                                |
| `getAllKeys`  | Get all keys                             | -                                                            | `string[]`                                            |

## Examples

### Basic Usage

```typescript
// Storing data
SessionStorage.setItem('@storage_key', 'stored value');
SessionStorage.setItem('@user', { name: 'John', age: 30 });

// Reading data
const value = SessionStorage.getItem('@storage_key'); // 'stored value'
const user = SessionStorage.getItem('@user'); // { name: 'John', age: 30 }

// Removing data
SessionStorage.removeItem('@storage_key');

// Clearing all data
SessionStorage.clear();

// Get key by index
const firstKey = SessionStorage.key(0);

// Get storage size
const size = SessionStorage.length;
```

### Advanced Usage

```typescript
// Working with multiple items
SessionStorage.multiSet([
  ['@key1', 'value1'],
  ['@key2', 'value2'],
  ['@key3', { complex: 'object' }]
]);

// Getting multiple items
const values = SessionStorage.multiGet(['@key1', '@key2', '@key3']);
console.log(values); // { '@key1': 'value1', '@key2': 'value2', '@key3': { complex: 'object' } }

// Getting all items
const allData = SessionStorage.getAllItems();

// Merging objects
SessionStorage.setItem('@user', { name: 'John', age: 30 });
const merged = SessionStorage.mergeItem('@user', { age: 31, location: 'NYC' });
console.log(merged); // { name: 'John', age: 31, location: 'NYC' }

// Multiple merge operations
SessionStorage.multiMerge({
  '@user1': { role: 'admin' },
  '@user2': { status: 'active' }
});

// Getting all keys
const allKeys = SessionStorage.getAllKeys();

// Removing multiple items
SessionStorage.multiRemove(['@key1', '@key2']);
```

## TypeScript Support

The module is written in TypeScript and supports generics for better type safety:

```typescript
// Type-safe storage
interface User {
  name: string;
  age: number;
  email: string;
}

// Create a typed storage instance (not available in the default export)
import { Storage } from 'react-native-session-storage';
const UserStorage = new Storage<User>();

// Type-safe operations
UserStorage.setItem('@user1', { name: 'John', age: 30, email: 'john@example.com' });

// TypeScript will ensure you get the correct type back
const user: User | undefined = UserStorage.getItem('@user1');
```

## Applications

### API Response Caching

```typescript
import SessionStorage from 'react-native-session-storage';

const fetchData = async (endpoint) => {
  // Check if response is already cached
  const cachedResponse = SessionStorage.getItem(`@api_cache_${endpoint}`);
  
  if (cachedResponse) {
    console.log('Using cached response');
    return cachedResponse;
  }
  
  // Fetch new data
  try {
    const response = await fetch(`https://api.example.com/${endpoint}`);
    const data = await response.json();
    
    // Cache the response
    SessionStorage.setItem(`@api_cache_${endpoint}`, data);
    
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};
```

### Memoization Provider

```typescript
import SessionStorage from 'react-native-session-storage';

// Create a memoized function with SessionStorage as cache
const memoize = (fn) => {
  return (...args) => {
    const key = `@memo_${fn.name}_${JSON.stringify(args)}`;
    
    // Check if result is already cached
    const cachedResult = SessionStorage.getItem(key);
    
    if (cachedResult !== undefined) {
      return cachedResult;
    }
    
    // Calculate and cache result
    const result = fn(...args);
    SessionStorage.setItem(key, result);
    
    return result;
  };
};

// Example usage
const expensiveCalculation = (a, b) => {
  console.log('Performing expensive calculation');
  return a * b;
};

const memoizedCalculation = memoize(expensiveCalculation);

// First call will perform calculation
const result1 = memoizedCalculation(5, 10); // Logs: Performing expensive calculation

// Second call with same args will use cached result
const result2 = memoizedCalculation(5, 10); // No log, returns cached result

// Different args will perform calculation again
const result3 = memoizedCalculation(7, 8); // Logs: Performing expensive calculation
```

### Form State Persistence

```typescript
import SessionStorage from 'react-native-session-storage';
import { useState, useEffect } from 'react';

const useSessionForm = (formId, initialState = {}) => {
  // Get stored form state or use initial state
  const [formState, setFormState] = useState(() => {
    const stored = SessionStorage.getItem(`@form_${formId}`);
    return stored || initialState;
  });
  
  // Update storage when state changes
  useEffect(() => {
    SessionStorage.setItem(`@form_${formId}`, formState);
  }, [formId, formState]);
  
  // Clear form data
  const resetForm = () => {
    SessionStorage.removeItem(`@form_${formId}`);
    setFormState(initialState);
  };
  
  return [formState, setFormState, resetForm];
};

// Example usage in a component
function SignupForm() {
  const [formData, setFormData, resetForm] = useSessionForm('signup', {
    email: '',
    name: '',
    agreed: false
  });
  
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };
  
  // Form state persists during the app session
  // Users can navigate away and come back with data intact
  
  return (
    // Form UI implementation
  );
}
```

## Contributing

See the [contributing guide](https://claude.ai/chat/CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

## 🙏 Support the project

<p align="center" valign="center">
  <a href="https://liberapay.com/FutureJJ/donate">
    <img src="https://liberapay.com/assets/widgets/donate.svg" alt="LiberPay_Donation_Button" height="50" > 
  </a>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <a href=".github/assets/Jairaj_Jangle_Google_Pay_UPI_QR_Code.jpg">
    <img src=".github/assets/upi.png" alt="Paypal_Donation_Button" height="50" >
  </a>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://www.paypal.com/paypalme/jairajjangle001/usd">
    <img src=".github/assets/paypal_donate.png" alt="Paypal_Donation_Button" height="50" >
  </a>
</p>

------

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
