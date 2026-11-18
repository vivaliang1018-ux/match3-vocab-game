import Capacitor
import FirebaseAnalytics
import FirebaseCore

@objc(LingoMatchAnalyticsPlugin)
final class LingoMatchAnalyticsPlugin: CAPPlugin, CAPBridgedPlugin {
    let identifier = "LingoMatchAnalyticsPlugin"
    let jsName = "LingoMatchAnalytics"
    let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "logEvent", returnType: CAPPluginReturnPromise)
    ]
    private let allowedEvents: Set<String> = [
        "course_selected", "language_switched", "game_started",
        "set_completed", "quiz_completed", "review_started"
    ]

    @objc func logEvent(_ call: CAPPluginCall) {
        guard let name = call.getString("name"), allowedEvents.contains(name) else {
            call.reject("Unsupported core Analytics event")
            return
        }
        guard FirebaseApp.app() != nil else {
            call.reject("Firebase has not been configured")
            return
        }
        Analytics.logEvent(name, parameters: call.getObject("params") ?? [:])
        call.resolve()
    }
}
