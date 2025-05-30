import mongoose from 'mongoose';

const OrderProductSchema = new mongoose.Schema(
    {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductDetail', required: true },
        unitId: { type: String, required: true },
        productStatus: {
            type: String,
            enum: ['available', 'rented'],
            required: true,
        },
        customerStatus: {
            type: String,
            enum: [
                'waiting for landlord confirmation',
                'waiting for payment',
                'in delivery',
                'needs to be returned',
                'canceled',
            ],
        },
        landlordStatus: {
            type: String,
            enum: [
                'waiting for customer payment',
                'in delivery',
                'needs to be delivered',
                'canceled',
            ],
        },
    },
    {
        collection: 'orderProduct',
    },
);

export default mongoose.model('OrderProduct', OrderProductSchema);