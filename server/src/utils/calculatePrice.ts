import { pricePerKg } from './priceTable'
import { AppError } from '../middleware/errorMiddleware';
export const calculatePrice = (wasteType: string, weight: number) => {

    const price = pricePerKg[wasteType];
    if (!price) {
        throw new AppError(400, 'Invalid waste type for pricing');
    }
    const equivalentPrice = Math.round(weight * price * 100) / 100;
    return equivalentPrice
}