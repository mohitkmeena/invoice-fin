import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility function for combining class names with Tailwind CSS
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getStatusColor(status: string) {
  switch (status.toUpperCase()) {
    case 'PAID':
      return 'bg-green-100 text-green-800';
    case 'SENT':
      return 'bg-blue-100 text-blue-800';
    case 'VIEWED':
      return 'bg-purple-100 text-purple-800';
    case 'PENDING_CONFIRMATION':
      return 'bg-yellow-100 text-yellow-800';
    case 'OVERDUE':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}