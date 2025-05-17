// Helper to normalize quotes in JSON strings (fixes iOS smart quotes)
const normalizeJSONString = (str: string): string => {
  // Replace curly quotes with straight quotes
  return str
    .replace(/[\u2018\u2019]/g, "'") // Replace single curly quotes
    .replace(/[\u201C\u201D]/g, '"'); // Replace double curly quotes
};

// Helper to safely parse JSON with iOS smart quotes
export const safeJSONParse = (str: string): any => {
  try {
    // Normalize quotes before parsing
    const normalizedStr = normalizeJSONString(str);
    return JSON.parse(normalizedStr);
  } catch (e: any) {
    throw new Error("Invalid JSON format: " + e.message);
  }
};
