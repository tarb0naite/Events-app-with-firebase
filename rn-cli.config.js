const exclusionList = require('metro-config/src/defaults/exclusionList');

module.exports = {
  resolver: {
    blacklistRE: exclusionList([
      /node_modules\/react-native-gesture-handler\/.*/
    ])
  }
};
