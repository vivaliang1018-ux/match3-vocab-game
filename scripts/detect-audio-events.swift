import Foundation
import SoundAnalysis

final class ResultsObserver: NSObject, SNResultsObserving {
    private let file: String
    private let semaphore: DispatchSemaphore
    private let minimumConfidence: Double

    init(file: String, semaphore: DispatchSemaphore, minimumConfidence: Double) {
        self.file = file
        self.semaphore = semaphore
        self.minimumConfidence = minimumConfidence
    }

    func request(_ request: SNRequest, didProduce result: SNResult) {
        guard let result = result as? SNClassificationResult else { return }
        let matches = result.classifications
            .filter { Double($0.confidence) >= minimumConfidence }
            .prefix(8)

        for classification in matches {
            let row: [String: Any] = [
                "file": file,
                "start": result.timeRange.start.seconds,
                "duration": result.timeRange.duration.seconds,
                "label": classification.identifier,
                "confidence": classification.confidence,
            ]
            if let data = try? JSONSerialization.data(withJSONObject: row),
               let json = String(data: data, encoding: .utf8) {
                print(json)
            }
        }
    }

    func request(_ request: SNRequest, didFailWithError error: Error) {
        fputs("\(file): \(error)\n", stderr)
        semaphore.signal()
    }

    func requestDidComplete(_ request: SNRequest) {
        semaphore.signal()
    }
}

let arguments = Array(CommandLine.arguments.dropFirst())
guard !arguments.isEmpty else {
    fputs("Usage: swift scripts/detect-audio-events.swift <audio-file> [...]\n", stderr)
    exit(2)
}

let request = try SNClassifySoundRequest(classifierIdentifier: .version1)
for path in arguments {
    let semaphore = DispatchSemaphore(value: 0)
    let observer = ResultsObserver(file: path, semaphore: semaphore, minimumConfidence: 0.05)
    let analyzer = try SNAudioFileAnalyzer(url: URL(fileURLWithPath: path))
    try analyzer.add(request, withObserver: observer)
    analyzer.analyze()
    semaphore.wait()
}
