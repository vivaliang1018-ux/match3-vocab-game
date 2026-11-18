import App from './App';
import { AuthProvider } from './auth/AuthProvider';
import { LocaleProvider } from './i18n';
import { CourseProvider } from './course';
import { MembershipProvider } from './membership/MembershipProvider';

export default function RuntimeApp() {
  return (
    <LocaleProvider>
      <CourseProvider>
        <AuthProvider>
          <MembershipProvider>
            <App />
          </MembershipProvider>
        </AuthProvider>
      </CourseProvider>
    </LocaleProvider>
  );
}
