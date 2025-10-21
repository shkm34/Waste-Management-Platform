

function DriverDashboard() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                    Driver Dashboard
                </h1>
                <div className="mb-6">
                    <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
                        Status: Available
                    </span>
                </div>
                <div className="grid gap-6 md:grid-cols-2 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-gray-600 text-sm mb-2">Active Assignments</h3>
                        <p className="text-3xl font-bold text-blue-600">0</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-gray-600 text-sm mb-2">Completed Today</h3>
                        <p className="text-3xl font-bold text-green-600">0</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        My Assignments
                    </h2>
                    <p className="text-gray-600">
                        Pickup assignments will be displayed here
                    </p>
                </div>
            </div>
        </div>
    )
}

export default DriverDashboard
