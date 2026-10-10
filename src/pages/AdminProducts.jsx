import React, { useState } from 'react';
import { adminFetchAllProducts, adminUpdateProduct, adminDeleteProduct } from '@/lib/store';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from './AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Plus, Search, Edit2, Trash2, Package, Eye, EyeOff, Archive, RotateCcw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: adminFetchAllProducts,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }) => adminUpdateProduct(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-products'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminDeleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setDeleteTarget(null);
    },
  });

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const togglePublish = (product) => {
    updateMutation.mutate({
      id: product.id,
      updates: { ...product, is_published: !product.is_published },
    });
  };

  const toggleArchive = (product) => {
    updateMutation.mutate({
      id: product.id,
      updates: { ...product, is_archived: !product.is_archived, is_published: product.is_archived ? true : product.is_published },
    });
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-[#8B6F47]">Products</h1>
            <p className="text-gray-500 mt-1">{products.length} total products</p>
          </div>
          <Button
            onClick={() => navigate(createPageUrl('AdminProductEdit'))}
            className="bg-[#D97757] hover:bg-[#C55E3F] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 border-2 border-gray-200 focus:border-[#D97757]"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-2 border-gray-200">
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 text-[#D97757]/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">
              {search ? 'Try a different search.' : 'Get started by adding your first product.'}
            </p>
            {!search && (
              <Button
                onClick={() => navigate(createPageUrl('AdminProductEdit'))}
                className="bg-[#D97757] hover:bg-[#C55E3F] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-gray-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((product) => {
                const mainImage = product.images?.[0];
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-[#FFF8F0] to-[#FFE8D6] flex-shrink-0">
                        {mainImage ? (
                          <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-6 h-6 text-[#D97757]/30" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">{product.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-[#D97757] text-[#D97757] capitalize">
                        {(product.category || '').replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-[#D97757]">
                      {product.sale_price ? (
                        <div>
                          <span className="line-through text-gray-400 text-sm mr-1">₹{product.price}</span>
                          ₹{product.sale_price}
                        </div>
                      ) : (
                        `₹${product.price}`
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {product.in_stock ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">In Stock</Badge>
                      ) : (
                        <Badge className="bg-gray-200 text-gray-600 hover:bg-gray-200">Out</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        {product.is_archived ? (
                          <Badge className="bg-gray-300 text-gray-700 hover:bg-gray-300">Archived</Badge>
                        ) : product.is_published ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Published</Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Draft</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => togglePublish(product)}
                          title={product.is_published ? 'Unpublish' : 'Publish'}
                          disabled={product.is_archived || updateMutation.isPending}
                          className="h-8 w-8 text-gray-500 hover:text-[#D97757]"
                        >
                          {product.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleArchive(product)}
                          title={product.is_archived ? 'Restore' : 'Archive'}
                          disabled={updateMutation.isPending}
                          className="h-8 w-8 text-gray-500 hover:text-[#D97757]"
                        >
                          {product.is_archived ? <RotateCcw className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          className="h-8 w-8 text-gray-500 hover:text-[#D97757]"
                        >
                          <Link to={`${createPageUrl('AdminProductEdit')}?id=${product.id}`}>
                            <Edit2 className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTarget(product)}
                          className="h-8 w-8 text-gray-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600 py-4">
            Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone,
            and all variant data for this product will also be removed.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteMutation.mutate(deleteTarget.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
