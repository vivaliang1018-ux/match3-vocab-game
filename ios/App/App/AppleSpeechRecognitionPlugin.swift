import AVFoundation
import Capacitor
import Speech

@objc(AppleSpeechRecognitionPlugin)
final class AppleSpeechRecognitionPlugin: CAPPlugin, CAPBridgedPlugin {
    let identifier = "AppleSpeechRecognitionPlugin"
    let jsName = "AppleSpeechRecognition"
    let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "checkPermissions", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "requestPermissions", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "start", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "beginAnswer", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "updateVocabulary", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "playCountdownTone", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "stop", returnType: CAPPluginReturnPromise)
    ]

    private let recognizer = SFSpeechRecognizer(locale: Locale(identifier: "en-US"))
    private var audioEngine: AVAudioEngine?
    private var recognitionRequest: SFSpeechAudioBufferRecognitionRequest?
    private var recognitionTask: SFSpeechRecognitionTask?
    private var shouldContinue = false
    private var recognitionGeneration = 0
    private var cycleId = 0
    private var contextualWords: [String] = []
    private var lastAudioLevelEmitAt: TimeInterval = 0
    private var countdownAudioEngine: AVAudioEngine?
    private var countdownPlayer: AVAudioPlayerNode?

    deinit {
        stopRecognition(deactivateSession: true)
    }

    @objc override func checkPermissions(_ call: CAPPluginCall) {
        call.resolve(permissionPayload())
    }

    @objc override func requestPermissions(_ call: CAPPluginCall) {
        SFSpeechRecognizer.requestAuthorization { [weak self] _ in
            guard let self else { return }
            self.requestMicrophonePermission { _ in
                DispatchQueue.main.async {
                    call.resolve(self.permissionPayload())
                }
            }
        }
    }

    @objc func start(_ call: CAPPluginCall) {
        guard SFSpeechRecognizer.authorizationStatus() == .authorized else {
            call.reject("speech-permission-denied")
            return
        }
        guard AVAudioSession.sharedInstance().recordPermission == .granted else {
            call.reject("microphone-permission-denied")
            return
        }
        guard recognizer?.isAvailable == true else {
            call.reject("speech-recognizer-unavailable")
            return
        }
        guard recognizer?.supportsOnDeviceRecognition == true else {
            call.reject("on-device-speech-unavailable")
            return
        }

        DispatchQueue.main.async { [weak self] in
            guard let self else {
                call.reject("speech-recognizer-unavailable")
                return
            }
            self.contextualWords = self.sanitizeWords(call.getArray("words", String.self) ?? [])
            self.shouldContinue = true
            self.recognitionGeneration += 1
            do {
                try self.startAudioEngineIfNeeded()
                self.stopRecognitionTask()
                self.notifyListeners(
                    "speechState",
                    data: ["listening": true, "cycleId": self.cycleId]
                )
                call.resolve(["cycleId": self.cycleId])
            } catch {
                self.shouldContinue = false
                self.stopRecognition(deactivateSession: true)
                call.reject("speech-start-failed", error.localizedDescription, error)
            }
        }
    }

    @objc func beginAnswer(_ call: CAPPluginCall) {
        let words = sanitizeWords(call.getArray("words", String.self) ?? [])
        DispatchQueue.main.async { [weak self] in
            guard let self, self.shouldContinue else {
                call.reject("speech-not-started")
                return
            }
            self.contextualWords = words
            do {
                try self.startAudioEngineIfNeeded()
                let nextCycleId = try self.startRecognitionTask()
                call.resolve(["cycleId": nextCycleId])
            } catch {
                call.reject("speech-answer-start-failed", error.localizedDescription, error)
            }
        }
    }

    @objc func updateVocabulary(_ call: CAPPluginCall) {
        let words = sanitizeWords(call.getArray("words", String.self) ?? [])
        DispatchQueue.main.async { [weak self] in
            guard let self else {
                call.resolve()
                return
            }
            self.contextualWords = words
            // This is a non-disruptive hint only. A target change must never
            // stop the microphone or restart the audio engine mid-utterance.
            self.recognitionRequest?.contextualStrings = words
            call.resolve()
        }
    }

    @objc func playCountdownTone(_ call: CAPPluginCall) {
        let kind = call.getString("kind") == "start" ? "start" : "beep"
        DispatchQueue.main.async { [weak self] in
            guard let self else {
                call.reject("countdown-audio-unavailable")
                return
            }
            do {
                try self.playNativeCountdownTone(kind: kind)
                call.resolve()
            } catch {
                call.reject("countdown-audio-failed", error.localizedDescription, error)
            }
        }
    }

    @objc func stop(_ call: CAPPluginCall) {
        DispatchQueue.main.async { [weak self] in
            self?.shouldContinue = false
            self?.recognitionGeneration += 1
            self?.stopRecognition(deactivateSession: true)
            call.resolve()
        }
    }

    private func permissionPayload() -> [String: Any] {
        let speech: String
        switch SFSpeechRecognizer.authorizationStatus() {
        case .authorized:
            speech = "granted"
        case .denied, .restricted:
            speech = "denied"
        case .notDetermined:
            speech = "prompt"
        @unknown default:
            speech = "denied"
        }

        let microphone: String
        switch AVAudioSession.sharedInstance().recordPermission {
        case .granted:
            microphone = "granted"
        case .denied:
            microphone = "denied"
        case .undetermined:
            microphone = "prompt"
        @unknown default:
            microphone = "denied"
        }
        return [
            "speechRecognition": speech,
            "microphone": microphone,
            "onDeviceRecognitionSupported": recognizer?.supportsOnDeviceRecognition == true
        ]
    }

    private func requestMicrophonePermission(_ completion: @escaping (Bool) -> Void) {
        if #available(iOS 17.0, *) {
            AVAudioApplication.requestRecordPermission(completionHandler: completion)
        } else {
            AVAudioSession.sharedInstance().requestRecordPermission(completion)
        }
    }

    private func startAudioEngineIfNeeded() throws {
        if let audioEngine, audioEngine.isRunning {
            return
        }

        guard shouldContinue else { return }
        guard recognizer?.isAvailable == true else {
            throw NSError(
                domain: "MatchingoSpeech",
                code: 1,
                userInfo: [NSLocalizedDescriptionKey: "Speech recognizer is unavailable."]
            )
        }

        let session = AVAudioSession.sharedInstance()
        // Say & Blast needs to play countdown and impact sounds while the
        // microphone remains active. `.record` silences WebView playback.
        try session.setCategory(
            .playAndRecord,
            mode: .measurement,
            options: [.duckOthers, .defaultToSpeaker, .allowBluetoothHFP]
        )
        try session.setActive(true, options: .notifyOthersOnDeactivation)

        let engine = AVAudioEngine()
        let inputNode = engine.inputNode
        let format = inputNode.outputFormat(forBus: 0)
        guard format.sampleRate > 0, format.channelCount > 0 else {
            throw NSError(
                domain: "MatchingoSpeech",
                code: 2,
                userInfo: [NSLocalizedDescriptionKey: "Microphone input is unavailable."]
            )
        }
        inputNode.installTap(
            onBus: 0,
            bufferSize: 1024,
            format: format
        ) { [weak self] buffer, _ in
            self?.recognitionRequest?.append(buffer)
            self?.emitAudioLevel(buffer)
        }

        audioEngine = engine
        engine.prepare()
        try engine.start()
    }

    @discardableResult
    private func startRecognitionTask() throws -> Int {
        stopRecognitionTask()
        let generation = recognitionGeneration
        guard shouldContinue else { return cycleId }
        guard let recognizer, recognizer.isAvailable else {
            throw NSError(
                domain: "MatchingoSpeech",
                code: 3,
                userInfo: [NSLocalizedDescriptionKey: "Speech recognizer is unavailable."]
            )
        }
        guard recognizer.supportsOnDeviceRecognition else {
            throw NSError(
                domain: "MatchingoSpeech",
                code: 4,
                userInfo: [NSLocalizedDescriptionKey: "On-device speech recognition is unavailable."]
            )
        }

        let request = SFSpeechAudioBufferRecognitionRequest()
        request.shouldReportPartialResults = true
        request.taskHint = .search
        request.contextualStrings = contextualWords
        request.requiresOnDeviceRecognition = true

        recognitionRequest = request
        cycleId += 1
        let currentCycleId = cycleId

        recognitionTask = recognizer.recognitionTask(with: request) { [weak self] result, error in
            guard let self else { return }
            guard generation == self.recognitionGeneration else { return }
            if let result {
                let transcriptionSegments = result.bestTranscription.segments
                let segments: [[String: Any]] = transcriptionSegments.map {
                    [
                        "text": $0.substring,
                        "timestamp": $0.timestamp,
                        "duration": $0.duration,
                        "confidence": Double($0.confidence)
                    ]
                }
                let confidentSegments = transcriptionSegments.filter { $0.confidence > 0 }
                let confidence = confidentSegments.isEmpty
                    ? 0
                    : confidentSegments.reduce(0.0) { $0 + Double($1.confidence) }
                        / Double(confidentSegments.count)
                self.notifyListeners(
                    "speechResult",
                    data: [
                        "transcript": result.bestTranscription.formattedString,
                        "isFinal": result.isFinal,
                        "cycleId": currentCycleId,
                        "segments": segments,
                        "confidence": confidence
                    ]
                )
            }
            if result?.isFinal == true || error != nil {
                self.notifyListeners(
                    "speechState",
                    data: [
                        "listening": false,
                        "cycleId": currentCycleId
                    ]
                )
            }
        }
        notifyListeners(
            "speechState",
            data: ["listening": true, "cycleId": currentCycleId]
        )
        return currentCycleId
    }

    private func stopRecognitionTask() {
        recognitionGeneration += 1
        recognitionTask?.cancel()
        recognitionTask = nil
        recognitionRequest?.endAudio()
        recognitionRequest = nil
    }

    private func stopRecognition(deactivateSession: Bool) {
        stopRecognitionTask()
        if let engine = audioEngine {
            if engine.isRunning {
                engine.stop()
            }
            engine.inputNode.removeTap(onBus: 0)
        }
        audioEngine = nil
        if deactivateSession {
            try? AVAudioSession.sharedInstance().setActive(
                false,
                options: .notifyOthersOnDeactivation
            )
            notifyListeners("speechState", data: ["listening": false])
            notifyListeners("speechLevel", data: ["level": 0])
        }
    }

    private func playNativeCountdownTone(kind: String) throws {
        countdownPlayer?.stop()
        countdownAudioEngine?.stop()
        countdownPlayer = nil
        countdownAudioEngine = nil

        let session = AVAudioSession.sharedInstance()
        try session.setCategory(
            .playback,
            mode: .default,
            options: [.duckOthers]
        )
        try session.setActive(true, options: .notifyOthersOnDeactivation)

        let sampleRate = 44_100.0
        let duration = kind == "start" ? 0.24 : 0.14
        let frameCount = AVAudioFrameCount(sampleRate * duration)
        guard
            let format = AVAudioFormat(
                standardFormatWithSampleRate: sampleRate,
                channels: 1
            ),
            let buffer = AVAudioPCMBuffer(
                pcmFormat: format,
                frameCapacity: frameCount
            ),
            let samples = buffer.floatChannelData?[0]
        else {
            throw NSError(
                domain: "MatchingoCountdown",
                code: 1,
                userInfo: [NSLocalizedDescriptionKey: "Unable to create countdown audio."]
            )
        }

        buffer.frameLength = frameCount
        let baseFrequency = kind == "start" ? 1_040.0 : 720.0
        for frame in 0..<Int(frameCount) {
            let time = Double(frame) / sampleRate
            let progress = time / duration
            let attack = min(1, progress / 0.06)
            let release = min(1, (1 - progress) / 0.28)
            let envelope = Float(max(0, min(attack, release)))
            let fundamental = sin(2 * .pi * baseFrequency * time)
            let brightHarmonic = sin(2 * .pi * baseFrequency * 1.5 * time)
            let mix = kind == "start"
                ? fundamental * 0.72 + brightHarmonic * 0.28
                : fundamental
            samples[frame] = Float(mix) * envelope * 0.34
        }

        let engine = AVAudioEngine()
        let player = AVAudioPlayerNode()
        engine.attach(player)
        engine.connect(player, to: engine.mainMixerNode, format: format)
        engine.prepare()
        try engine.start()
        countdownAudioEngine = engine
        countdownPlayer = player
        player.scheduleBuffer(buffer, at: nil, options: []) { [weak self, weak engine, weak player] in
            DispatchQueue.main.async {
                player?.stop()
                engine?.stop()
                if self?.countdownAudioEngine === engine {
                    self?.countdownPlayer = nil
                    self?.countdownAudioEngine = nil
                }
            }
        }
        player.play()
    }

    private func emitAudioLevel(_ buffer: AVAudioPCMBuffer) {
        let now = ProcessInfo.processInfo.systemUptime
        guard now - lastAudioLevelEmitAt >= 0.08 else { return }
        lastAudioLevelEmitAt = now
        guard let samples = buffer.floatChannelData?[0] else { return }
        let frameCount = Int(buffer.frameLength)
        guard frameCount > 0 else { return }

        var squareSum: Float = 0
        let stride = max(1, frameCount / 256)
        var sampledCount = 0
        var index = 0
        while index < frameCount {
            let sample = samples[index]
            squareSum += sample * sample
            sampledCount += 1
            index += stride
        }
        guard sampledCount > 0 else { return }
        let rms = sqrt(squareSum / Float(sampledCount))
        let decibels = 20 * log10(max(rms, 0.000_01))
        let normalized = max(0, min(1, (decibels + 55) / 45))

        DispatchQueue.main.async { [weak self] in
            guard let self, self.shouldContinue else { return }
            self.notifyListeners(
                "speechLevel",
                data: ["level": Double(normalized)]
            )
        }
    }

    private func sanitizeWords(_ words: [String]) -> [String] {
        var seen = Set<String>()
        return words.compactMap { raw in
            let word = raw.trimmingCharacters(in: .whitespacesAndNewlines)
            guard !word.isEmpty else { return nil }
            let key = word.lowercased()
            guard seen.insert(key).inserted else { return nil }
            return word
        }.prefix(100).map { $0 }
    }
}
