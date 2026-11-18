import Foundation
import Speech
print("authorization=\(SFSpeechRecognizer.authorizationStatus().rawValue)")
for locale in ["en-US", "es-ES", "ja-JP", "ko-KR"] {
    if let recognizer = SFSpeechRecognizer(locale: Locale(identifier: locale)) {
        print("\(locale) available=\(recognizer.isAvailable) onDevice=\(recognizer.supportsOnDeviceRecognition)")
    }
}
