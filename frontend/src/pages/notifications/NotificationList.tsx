import React from 'react';
import { Bell, Mail, MessageSquare, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useNotifications, useMarkNotificationRead } from '../../hooks/useNotifications';
import { formatDate } from '../../lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

const NotificationList: React.FC = () => {
  const { data: notifications, isLoading } = useNotifications();
  const markReadMutation = useMarkNotificationRead();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'INVOICE_VIEWED':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'PAYMENT_RECEIVED':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'INVOICE_OVERDUE':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'EMAIL_SENT':
        return <Mail className="w-5 h-5 text-purple-600" />;
      case 'WHATSAPP_SENT':
        return <MessageSquare className="w-5 h-5 text-green-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'INVOICE_VIEWED':
        return 'bg-blue-50 border-blue-200';
      case 'PAYMENT_RECEIVED':
        return 'bg-green-50 border-green-200';
      case 'INVOICE_OVERDUE':
        return 'bg-red-50 border-red-200';
      case 'EMAIL_SENT':
        return 'bg-purple-50 border-purple-200';
      case 'WHATSAPP_SENT':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    markReadMutation.mutate(notificationId);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 h-20"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600 mt-1">Stay updated with your business activities</p>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          {notifications && notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${getNotificationColor(notification.type)} ${
                    !notification.read ? 'ring-2 ring-blue-200' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            {formatDate(notification.createdAt)}
                          </span>
                          {!notification.read && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      {notification.data && (
                        <div className="mt-2 text-xs text-gray-500">
                          {Object.entries(notification.data).map(([key, value]) => (
                            <div key={key}>
                              <span className="font-medium">{key}:</span> {String(value)}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-600">You're all caught up! New notifications will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationList; 