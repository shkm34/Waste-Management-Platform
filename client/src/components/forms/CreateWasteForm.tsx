import { CreateGarbageData, WasteType } from "@/types";
import { WASTE_TYPE_LABELS, WASTE_TYPES, PRICE_PER_KG } from "@/utils";
import { useState } from "react";
import SimpleDateInput from "@/utils/SampleDateInput";
import { createGarbage } from "@/services/garbageService";


function CreateWasteForm() {
    const [formData, setFormData] = useState({
        wasteType: '' as WasteType,
        weight: '',
        location: '',
        scheduledPickupDate: ''
    })
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const estimatedPrice = parseFloat(formData.weight) * PRICE_PER_KG[formData.wasteType];


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    }

    const handleDateChange = (selectedDate: string) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            scheduledPickupDate: selectedDate,
        }));
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const garbageDetails: CreateGarbageData = {
            wasteType: formData.wasteType,
            weight: parseFloat(formData.weight),
            location: {
                address: formData.location
            },
            scheduledPickupDate: formData.scheduledPickupDate
        }

        try {
            await createGarbage(garbageDetails)

            // reset form
            setFormData({
                wasteType: '' as WasteType,
                weight: '',
                location: '',
                scheduledPickupDate: '',
            });
        } catch(error: any){
            setError(error.response?.data?.error || 'Failed to create waste listing')
    } finally{
        setLoading(false)
    }
}

return (
            <div className="bg-white rounded-lg shadow-md p-6 w-[30%] m-auto mt-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Create Waste Pickup
                </h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                            Waste Type *
                        </label>
                        <select
                            id="wasteType"
                            name="wasteType"
                            value={formData.wasteType}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select waste type</option>
                            {Object.values(WASTE_TYPES).map((type) => (
                                <option key={type} value={type}>
                                    {WASTE_TYPE_LABELS[type]}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                            Weight (kg) *
                        </label>
                        <input
                            type="number"
                            id="weight"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            required
                            min="0.1"
                            step="0.1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter weight in kg"
                        />
                    </div>

                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                            Pickup Address *
                        </label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter pickup location"
                        />
                    </div>

                    <div>
                        <label htmlFor="scheduledPickupDate" className="block text-sm font-medium text-gray-700 mb-1">
                            Preferred Pickup Date *
                        </label>
                        <SimpleDateInput value={formData.scheduledPickupDate} onChange={handleDateChange} />
                    </div>

                    {estimatedPrice > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700 font-medium">Estimated Credit:</span>
                                <span className="text-2xl font-bold text-blue-600">
                                    ₹{estimatedPrice.toFixed(2)}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                                You'll receive this amount when the waste is delivered and accepted
                            </p>
                        </div>
                    )}

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition"
                        >
                            {loading ? 'Creating...' : 'Create Waste Listing'}
                        </button>
                        <button
                            type="button"
                            //onClick={onCancel}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    export default CreateWasteForm;