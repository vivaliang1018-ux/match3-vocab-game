import Capacitor
import StoreKit

@objc(LingoMatchStorePlugin)
final class LingoMatchStorePlugin: CAPPlugin, CAPBridgedPlugin {
    let identifier = "LingoMatchStorePlugin"
    let jsName = "LingoMatchStore"
    let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "products", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "entitlements", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "purchase", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "restore", returnType: CAPPluginReturnPromise)
    ]

    private var updatesTask: Task<Void, Never>?

    override func load() {
        super.load()
        updatesTask = Task { [weak self] in
            for await update in Transaction.updates {
                guard let self else { return }
                guard case .verified(let transaction) = update else { continue }
                await transaction.finish()
                self.notifyListeners("entitlementsChanged", data: [:])
            }
        }
    }

    deinit { updatesTask?.cancel() }

    @objc func products(_ call: CAPPluginCall) {
        let ids = call.getArray("productIds", String.self) ?? []
        Task {
            do {
                let products = try await Product.products(for: ids)
                call.resolve(["products": products.map { product in
                    ["id": product.id, "displayPrice": product.displayPrice,
                     "displayName": product.displayName]
                }])
            } catch {
                call.reject("store-products-unavailable", error.localizedDescription, error)
            }
        }
    }

    @objc func entitlements(_ call: CAPPluginCall) {
        Task { call.resolve(["productIds": await currentProductIds()]) }
    }

    @objc func purchase(_ call: CAPPluginCall) {
        guard let id = call.getString("productId"), !id.isEmpty else {
            call.reject("missing-product-id")
            return
        }
        Task {
            do {
                guard let product = try await Product.products(for: [id]).first else {
                    call.reject("store-product-not-found")
                    return
                }
                switch try await product.purchase() {
                case .success(let result):
                    guard case .verified(let transaction) = result else {
                        call.reject("store-transaction-unverified")
                        return
                    }
                    await transaction.finish()
                    let ids = await currentProductIds()
                    notifyListeners("entitlementsChanged", data: [:])
                    call.resolve(["status": "purchased", "productIds": ids])
                case .pending:
                    call.resolve(["status": "pending", "productIds": await currentProductIds()])
                case .userCancelled:
                    call.resolve(["status": "cancelled", "productIds": await currentProductIds()])
                @unknown default:
                    call.reject("store-unknown-purchase-result")
                }
            } catch {
                call.reject("store-purchase-failed", error.localizedDescription, error)
            }
        }
    }

    @objc func restore(_ call: CAPPluginCall) {
        // Only called after an explicit Restore Purchases tap; sync may show an Apple ID prompt.
        Task {
            do {
                try await AppStore.sync()
                call.resolve(["productIds": await currentProductIds()])
                notifyListeners("entitlementsChanged", data: [:])
            } catch {
                call.reject("store-restore-failed", error.localizedDescription, error)
            }
        }
    }

    private func currentProductIds() async -> [String] {
        var ids: [String] = []
        for await result in Transaction.currentEntitlements {
            guard case .verified(let transaction) = result,
                  transaction.revocationDate == nil,
                  transaction.expirationDate.map({ $0 > Date() }) ?? true else { continue }
            ids.append(transaction.productID)
        }
        return ids
    }
}
