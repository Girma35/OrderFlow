import { Check } from 'lucide-react';
import { OrderStatus } from '../../types/order';

interface StatusStepperProps {
  currentStatus: OrderStatus;
}

const steps: OrderStatus[] = ['Pending', 'Confirmed', 'Shipped'];

export function StatusStepper({ currentStatus }: StatusStepperProps) {
  const currentStepIndex = steps.indexOf(currentStatus);

  return (
    <div className="flex items-center justify-between max-w-2xl">
      {steps.map((step, index) => {
        const isComplete = index < currentStepIndex;
        const isCurrent = index === currentStepIndex;
        const isUpcoming = index > currentStepIndex;

        return (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  isComplete
                    ? 'bg-green-600 text-white'
                    : isCurrent
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {isComplete ? <Check className="w-5 h-5" /> : index + 1}
              </div>
              <span
                className={`mt-2 text-sm font-medium ${
                  isComplete || isCurrent ? 'text-gray-900' : 'text-gray-500'
                }`}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-4 transition-colors ${
                  isComplete ? 'bg-green-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
