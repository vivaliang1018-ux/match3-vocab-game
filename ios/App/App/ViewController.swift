import UIKit
import Capacitor

final class ViewController: CAPBridgeViewController {
    override func setScreenOrientationDefaults() {
        super.setScreenOrientationDefaults()

        // Capacitor reads only the shared orientation list. Honor the iPad-specific
        // Info.plist list here without changing the iPhone's portrait-only setting.
        guard UIDevice.current.userInterfaceIdiom == .pad,
              let names = Bundle.main.infoDictionary?["UISupportedInterfaceOrientations~ipad"] as? [String] else {
            return
        }

        let orientations: [String: UIInterfaceOrientation] = [
            "UIInterfaceOrientationPortrait": .portrait,
            "UIInterfaceOrientationPortraitUpsideDown": .portraitUpsideDown,
            "UIInterfaceOrientationLandscapeLeft": .landscapeLeft,
            "UIInterfaceOrientationLandscapeRight": .landscapeRight,
        ]
        let allowed = names.compactMap { orientations[$0]?.rawValue }
        if !allowed.isEmpty {
            supportedOrientations = allowed
        }
    }

    override func capacitorDidLoad() {
        bridge?.registerPluginInstance(LingoMatchAnalyticsPlugin())
        bridge?.registerPluginInstance(AppleSpeechRecognitionPlugin())
        bridge?.registerPluginInstance(LingoMatchStorePlugin())
        bridge?.registerPluginInstance(LingoMatchSettingsPlugin())
    }
}

// Settings must be opened natively: WKWebView navigation to app-settings:
// is not a reliable way to leave the app.
@objc(LingoMatchSettingsPlugin)
final class LingoMatchSettingsPlugin: CAPPlugin, CAPBridgedPlugin {
    let identifier = "LingoMatchSettingsPlugin"
    let jsName = "LingoMatchSettings"
    let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "openNotifications", returnType: CAPPluginReturnPromise)
    ]

    @objc func openNotifications(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            let address: String
            if #available(iOS 16.0, *) {
                address = UIApplication.openNotificationSettingsURLString
            } else {
                address = UIApplication.openSettingsURLString
            }
            guard let url = URL(string: address) else {
                call.reject("notification-settings-unavailable")
                return
            }
            UIApplication.shared.open(url, options: [:]) { opened in
                if opened { call.resolve() }
                else { call.reject("notification-settings-unavailable") }
            }
        }
    }
}
