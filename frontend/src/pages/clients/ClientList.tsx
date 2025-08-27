import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2, Search, Filter, MoreHorizontal } from 'lucide-react';
import { useClients, useDeleteClient } from '../../hooks/useClients';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';

const ClientList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  
  const navigate = useNavigate();
  const { data: clientsData, isLoading: loading } = useClients(currentPage, 10);
  const deleteClientMutation = useDeleteClient();

  const clients = clientsData?.content || [];
  const totalPages = clientsData?.totalPages || 0;

  const handleDeleteClient = async (clientId: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      deleteClientMutation.mutate(clientId);
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && currentPage === 0) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <Card>
            <CardContent className="p-6 h-96" />
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600 mt-1">Manage your clients and their information</p>
        </div>
        <Button
          onClick={() => navigate('/dashboard/clients/create')}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Client</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>

            <div className="text-sm text-gray-600">
              {filteredClients.length} client{filteredClients.length !== 1 ? 's' : ''}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Outstanding</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {client.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {client.id}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">
                      {client.company || '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm text-gray-900">{client.email}</div>
                      <div className="text-sm text-gray-500">{client.phone || '-'}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-semibold text-gray-900">
                      {formatCurrency(client.outstandingAmount || 0)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {client.tags ? (
                      <div className="flex flex-wrap gap-1">
                        {client.tags.split(',').map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => navigate(`/dashboard/clients/${client.id}`)}
                        className="text-blue-600 hover:text-blue-700 p-1"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => navigate(`/dashboard/clients/${client.id}/edit`)}
                        className="text-green-600 hover:text-green-700 p-1"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteClient(client.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredClients.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
              <p className="text-gray-600 mb-6">Get started by adding your first client</p>
              <Button
                onClick={() => navigate('/dashboard/clients/create')}
              >
                Add Client
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Page {currentPage + 1} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientList; 