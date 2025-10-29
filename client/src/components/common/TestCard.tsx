// client/src/components/common/TestCard.tsx

import { formatCurrency, formatDate, WASTE_TYPE_LABELS } from '../../utils';
import { Garbage } from '@/types';

interface TestCardProps {
 garbage: Garbage[]
}

const TestCard = ({ garbage}: TestCardProps) => {
  return (
  <div className= "flex gap-3">
{ garbage.map((garbage) => (
  <div className="bg-white rounded-lg shadow-md p-6 max-w-sm">
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        {WASTE_TYPE_LABELS[garbage.wasteType]}
      </h3>
      <div className="space-y-2 text-gray-600">
        <p>Weight: <span className="font-semibold">{garbage.weight} kg</span></p>
        <p>Price: <span className="font-semibold">{formatCurrency(garbage.equivalentPrice)}</span></p>
        <p>Date: <span className="font-semibold">{formatDate(garbage.createdAt)}</span></p>
      </div>
      <div className="mt-4">
        <span className="inline-block bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
          {garbage.status}
        </span>
      </div>
    </div>
))}
    
  </div>
  );
};

export default TestCard;
