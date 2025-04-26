import mongoose from 'mongoose';

const authOrderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true
    },
    clientId: {
        type: String,
        required: true
    }
}, { timestamps: true });

export const Order = mongoose.model('AuthOrder', authOrderSchema);
