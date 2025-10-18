// client/src/components/common/TestCard.tsx

import { formatCurrency, formatDate, WASTE_TYPE_LABELS } from '../../utils';
import type { WasteType } from '../../types';

interface TestCardProps {
  wasteType: WasteType;
  weight: number;
  price: number;
  date: string;
}

const TestCard = ({ wasteType, weight, price, date }: TestCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-sm">
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        {WASTE_TYPE_LABELS[wasteType]}
      </h3>
      <div className="space-y-2 text-gray-600">
        <p>Weight: <span className="font-semibold">{weight} kg</span></p>
        <p>Price: <span className="font-semibold">{formatCurrency(price)}</span></p>
        <p>Date: <span className="font-semibold">{formatDate(date)}</span></p>
      </div>
      <div className="mt-4">
        <span className="inline-block bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
          Available
        </span>
      </div>
    </div>
  );
};

export default TestCard;
