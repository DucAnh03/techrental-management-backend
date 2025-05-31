import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
    {
        customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UnitProduct' }],//unit products 
        totalPrice: { type: Number, required: true },
        status: {
            type: String,
            enum: ['completed', 'pending_payment', 'pending_confirmation', 'in_delivery', 'return_product', 'canceled', 'before_deadline'],
            default: 'pending_confirmation',
        },
        duration: { type: Number, required: true },
        deliveryDate: { type: Date },
    },
    {
        collection: 'orders',
        timestamps: true,
    },
);

export default mongoose.model('Order', OrderSchema);