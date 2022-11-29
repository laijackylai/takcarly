/**
 * @format
 */
import "moment";
// import "moment/locale/en-gb"
import "moment/locale/zh-hk"
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
