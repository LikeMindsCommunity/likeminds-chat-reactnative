let RNVideoPlayer;

try {
  // Using .default is important here because the original syntax 
  // `import VideoPlayer from ...` is a default import.
  RNVideoPlayer = require("react-native-media-console").default;
} catch (err) {
  // This will be logged if the package is not found in node_modules.
  console.log("react-native-media-console is not installed");
}

export default RNVideoPlayer;