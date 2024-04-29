/**
 * @format
 */
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {RealmProvider} from '@realm/react';
import {LoginSchemaRO} from './sample/loginSchemaRO';

const WrappedApp = () => (
  <RealmProvider schema={[LoginSchemaRO]}>
    <App />
  </RealmProvider>
);

AppRegistry.registerComponent(appName, () => WrappedApp);
