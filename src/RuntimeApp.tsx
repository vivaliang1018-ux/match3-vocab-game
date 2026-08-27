import App from './App';
import { AuthProvider } from './auth/AuthProvider';
import { LocaleProvider } from './i18n';

export default function RuntimeApp() {
  return (
    <LocaleProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </LocaleProvider>
  );
}
