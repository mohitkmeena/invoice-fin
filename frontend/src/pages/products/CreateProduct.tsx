import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useCreateProduct } from '../../hooks/useProducts';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

const CreateProduct: React.FC = () => {
  const navigate = useNavigate();
  const createProductMutation = useCreateProduct();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    taxRate: '',
    category: '',
    unit: '',
    active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      taxRate: parseFloat(formData.taxRate),
    };

    createProductMutation.mutate(productData, {
      onSuccess: (product) => {
        navigate(`/dashboard/products/${product.id}`);
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/dashboard/products')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600 mt-1">Create a new product or service</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-2"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  type="text"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-2"
                  placeholder="e.g., Services, Products, Software"
                />
              </div>

              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  className="mt-2"
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="taxRate">Tax Rate (%) *</Label>
                <Input
                  id="taxRate"
                  name="taxRate"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.taxRate}
                  onChange={handleChange}
                  className="mt-2"
                  placeholder="18.00"
                />
              </div>

              <div>
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  name="unit"
                  type="text"
                  value={formData.unit}
                  onChange={handleChange}
                  className="mt-2"
                  placeholder="e.g., hour, piece, kg"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="active"
                  name="active"
                  checked={formData.active}
                  onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <Label htmlFor="active">Active</Label>
              </div>
            </div>

            <div className="mt-6">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2"
                placeholder="Enter product description..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dashboard/products')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createProductMutation.isPending}
            className="flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{createProductMutation.isPending ? 'Creating...' : 'Create Product'}</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct; 