node startScript.js --host=$(ipconfig getifaddr en0) --port=$1
react-native start --port=$1 --reset-cache
