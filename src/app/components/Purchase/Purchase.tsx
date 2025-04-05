import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';
import { useQRCode } from 'next-qrcode';
import { Cancel, CheckCircle } from '@mui/icons-material';

const PurchaseDialog = ({ price, onClose, onComplete }: { price: number, onClose: () => void, onComplete: () => void }) => {
    const [timer, setTimer] = useState(60);
    const { Canvas } = useQRCode();

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setTimeout(() => {
                        onClose();
                    }, 0);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [onClose]);

    const handlePaymentComplete = () => {
        onComplete();
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <Dialog open={true} onClose={onClose} sx={{ '& .MuiDialog-paper': { backgroundColor: '#1c1c1c', color: '#FFF', borderRadius: '16px', maxWidth: '400px', boxShadow: 3 } }}>
            <DialogTitle sx={{ backgroundColor: '#FFBF60', color: '#1c1c1c', fontWeight: 'bold', padding: '16px 24px' }}>
                Complete Your Payment
            </DialogTitle>
            <DialogContent sx={{ padding: '24px' }}>
                <div className="flex flex-col items-center">
                    <Typography variant="h6" sx={{ color: '#FFBF60', fontWeight: 'bold', fontSize: '1.5rem' }}>
                        Amount to Pay: ${price.toFixed(2)}
                    </Typography>
                    <div className="my-6">
                        <Canvas
                            text={`payment:${price}`}
                            options={{
                                errorCorrectionLevel: 'M',
                                margin: 2,
                                scale: 4,
                                width: 200,
                                color: {
                                    dark: '#000000FF',
                                    light: '#f5f1ebFF',
                                },
                            }} />
                    </div>
                    <Typography variant="body1" sx={{ color: '#FFF' }} className="text-center">
                        Please scan the QR code to complete your payment.
                    </Typography>
                    <div className="mt-6 flex flex-col items-center">
                        <Typography variant="body2" className="text-center text-white font-semibold">
                            Time remaining:
                            <span className="text-2xl font-extrabold text-yellow-400 ml-2">
                                {timer}s
                            </span>
                        </Typography>
                    </div>
                    <div className="mt-8 text-white text-center">
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FFBF60' }}>
                            Transfer Information
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#FFF', marginTop: '8px' }}>
                            Please make a transfer to the following account to complete your payment:
                        </Typography>
                        <div className="mt-4 text-left">
                            <Typography variant="body2" sx={{ color: '#FFF' }}>
                                <strong>Bank Name:</strong> Blockbuster Bank
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#FFF' }}>
                                <strong>Account Number:</strong> 123-456-7890
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#FFF' }}>
                                <strong>Account Name:</strong> Blockbuster Movies Co., Ltd.
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#FFF' }}>
                                <strong>SWIFT Code:</strong> BBMOVTH123
                            </Typography>
                        </div>
                    </div>
                </div>
            </DialogContent>
            <DialogActions sx={{ backgroundColor: '#FFBF60', padding: '16px 24px', borderRadius: '0 0 16px 16px', display: 'flex', justifyContent: 'space-between' }}>
                <Button
                    onClick={handleCancel}
                    startIcon={<Cancel />}
                    sx={{
                        backgroundColor: '#d33',
                        color: '#FFF',
                        fontWeight: 'bold',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        '&:hover': {
                            backgroundColor: '#b22',
                        },
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handlePaymentComplete}
                    startIcon={<CheckCircle />}
                    sx={{
                        backgroundColor: '#4CAF50',
                        color: '#FFF',
                        fontWeight: 'bold',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        '&:hover': {
                            backgroundColor: '#45A049',
                        },
                    }}
                >
                    Complete Payment
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PurchaseDialog;
