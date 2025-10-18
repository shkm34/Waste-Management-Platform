// client/src/App.tsx

import TestCard from './components/common/TestCard';
import { API_URL } from './utils';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-blue-600 mb-2">
          Waste Management Platform
        </h1>
        <p className="text-gray-600 mb-6">
          Frontend setup complete! API URL: {API_URL}
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <TestCard
            wasteType="ewaste"
            weight={5}
            price={50}
            date={new Date().toISOString()}
          />
          <TestCard
            wasteType="plastic"
            weight={3}
            price={15}
            date={new Date().toISOString()}
          />
          <TestCard
            wasteType="PET"
            weight={2}
            price={8}
            date={new Date().toISOString()}
          />
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">
            ✓ Setup Checklist
          </h2>
          <ul className="text-blue-800 space-y-1">
            <li>✓ TypeScript configured</li>
            <li>✓ Tailwind CSS working</li>
            <li>✓ Environment variables loaded</li>
            <li>✓ Types defined</li>
            <li>✓ Utilities created</li>
            <li>✓ Components rendering</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
