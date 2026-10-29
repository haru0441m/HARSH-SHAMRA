import React, { useState } from 'react';
import { PaymentMethod } from '../types';
import { CheckCircle2, ShieldCheck, QrCode, CreditCard, Building2, Smartphone, AlertCircle, Loader2 } from 'lucide-react';

interface RazorpayModalProps {
  amount: number;
  studentName: string;
  studentEmail: string;
  onSuccess: (paymentId: string, method: PaymentMethod) => void;
  onCancel: () => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  amount,
  studentName,
  studentEmail,
  onSuccess,
  onCancel,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'upi_qr' | 'gpay' | 'phonepe' | 'card' | 'netbanking'>('upi_qr');
  const [upiId, setUpiId] = useState('campus.student@oksbi');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 9012');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('781');
  const [selectedBank, setSelectedBank] = useState('State Bank of India');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = () => {
    setIsProcessing(true);
    // Simulate real gateway processing time
    setTimeout(() => {
      setIsProcessing(false);
      const generatedPayId = `pay_rzp_test_${Math.random().toString(36).substring(2, 9)}`;
      const mappedMethod: PaymentMethod =
        selectedMethod === 'card'
          ? 'card'
          : selectedMethod === 'netbanking'
          ? 'netbanking'
          : 'upi';
      onSuccess(generatedPayId, mappedMethod);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200 flex flex-col">
        {/* Gateway Header */}
        <div className="bg-emerald-950 text-white p-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Razorpay Standard Checkout (Sandbox Test Mode)</span>
            </div>
            <div className="text-xl font-bold font-mono tracking-tight text-white mt-1">
              ₹{amount.toFixed(2)}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-semibold block">Order For</span>
            <span className="text-xs font-semibold text-white truncate max-w-[140px] block">{studentName}</span>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center gap-2 text-[11px] text-amber-900">
          <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span>Demo Environment: Test credentials loaded. No real money will be deducted.</span>
        </div>

        {/* Payment Methods Tabs */}
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setSelectedMethod('upi_qr')}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                selectedMethod === 'upi_qr'
                  ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                  : 'border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <QrCode className="w-5 h-5 mx-auto mb-1 text-emerald-800" />
              <span className="text-[11px] block">UPI / QR</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('card')}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                selectedMethod === 'card'
                  ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                  : 'border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <CreditCard className="w-5 h-5 mx-auto mb-1 text-emerald-800" />
              <span className="text-[11px] block">Card</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('netbanking')}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                selectedMethod === 'netbanking'
                  ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                  : 'border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <Building2 className="w-5 h-5 mx-auto mb-1 text-emerald-800" />
              <span className="text-[11px] block">NetBanking</span>
            </button>
          </div>

          {/* Form details for selected method */}
          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
            {selectedMethod === 'upi_qr' && (
              <div className="space-y-3 text-center">
                <div className="w-36 h-36 mx-auto bg-white p-2 rounded-lg border border-stone-200 shadow-xs flex flex-col items-center justify-center">
                  <div className="grid grid-cols-6 gap-1 w-28 h-28 p-1">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-xs ${
                          (i % 2 === 0 && i % 3 === 0) || i < 6 || i > 30 || i % 7 === 0
                            ? 'bg-stone-900'
                            : 'bg-stone-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-[11px] text-stone-600 font-medium">
                  Scan with any UPI App: GPay, PhonePe, Paytm, CRED
                </div>
                <div className="text-xs font-mono font-bold text-emerald-900 bg-white px-2 py-1 rounded border border-stone-200 inline-block">
                  campusbite@icici
                </div>
              </div>
            )}

            {selectedMethod === 'card' && (
              <div className="space-y-2.5 text-left text-xs">
                <div>
                  <label className="text-[10px] uppercase font-bold text-stone-500">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 bg-white border border-stone-300 rounded-lg font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-stone-500">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 bg-white border border-stone-300 rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-stone-500">CVV</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 bg-white border border-stone-300 rounded-lg font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === 'netbanking' && (
              <div className="space-y-2 text-left text-xs">
                <label className="text-[10px] uppercase font-bold text-stone-500">Select Bank</label>
                <select
                  value={selectedBank}
                  onChange={e => setSelectedBank(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-white border border-stone-300 rounded-lg font-medium text-stone-800"
                >
                  <option>State Bank of India</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Punjab National Bank</option>
                  <option>Canara Bank</option>
                </select>
                <p className="text-[11px] text-stone-500">
                  You will be redirected to your campus netbanking portal in test simulation.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-200/60 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handlePay}
            disabled={isProcessing}
            className="flex-1 py-2.5 px-4 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authorizing Payment...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Simulate Pay ₹{amount.toFixed(2)}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
