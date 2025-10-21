

function DealerDashboard() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                    Dealer Dashboard
                </h1>
                <div className="grid gap-6 md:grid-cols-3 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-gray-600 text-sm mb-2">Incoming Deliveries</h3>
                        <p className="text-3xl font-bold text-blue-600">0</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-gray-600 text-sm mb-2">Total Received</h3>
                        <p className="text-3xl font-bold text-green-600">0 kg</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-gray-600 text-sm mb-2">Pending Acceptance</h3>
                        <p className="text-3xl font-bold text-orange-600">0</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Recent Deliveries
                    </h2>
                    <p className="text-gray-600">
                        Delivery history will be displayed here
                    </p>
                </div>
            </div>
        </div>
    )
}

export default DealerDashboard
