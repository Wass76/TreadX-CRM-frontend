import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { 
  Plus, 
  Search, 
  Filter, 
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Trash2,
  Users
} from 'lucide-react';
import { dealerService } from '../lib/services.js';
import { DEALER_STATUS } from '../lib/config.js';

const DealersPage = () => {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });

  // Form state for creating new dealer
  const [newDealer, setNewDealer] = useState({
    name: '',
    email: '',
    phone: '',
    status: DEALER_STATUS.PENDING,
    accessCount: 0,
    address: {
      streetName: '',
      streetNumber: '',
      postalCode: '',
      unitNumber: '',
      city: '',
      province: '',
      country: 'Canada',
      specialInstructions: ''
    }
  });

  useEffect(() => {
    fetchDealers();
  }, [pagination.page, pagination.size]);

  const fetchDealers = async () => {
    try {
      setLoading(true);
      const response = await dealerService.getDealers(pagination.page, pagination.size);
      setDealers(response.content || []);
      setPagination(prev => ({
        ...prev,
        totalElements: response.totalElements || 0,
        totalPages: response.totalPages || 0
      }));
    } catch (error) {
      console.error('Error fetching dealers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDealer = async () => {
    try {
      await dealerService.createDealer(newDealer);
      setShowCreateDialog(false);
      setNewDealer({
        name: '',
        email: '',
        phone: '',
        status: DEALER_STATUS.PENDING,
        accessCount: 0,
        address: {
          streetName: '',
          streetNumber: '',
          postalCode: '',
          unitNumber: '',
          city: '',
          province: '',
          country: 'Canada',
          specialInstructions: ''
        }
      });
      fetchDealers();
    } catch (error) {
      console.error('Error creating dealer:', error);
    }
  };

  const handleDeleteDealer = async (dealerId) => {
    if (window.confirm('Are you sure you want to delete this dealer?')) {
      try {
        await dealerService.deleteDealer(dealerId);
        fetchDealers();
      } catch (error) {
        console.error('Error deleting dealer:', error);
      }
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'default';
      case 'INACTIVE':
        return 'secondary';
      case 'PENDING':
        return 'outline';
      case 'SUSPENDED':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-600';
      case 'INACTIVE':
        return 'text-gray-600';
      case 'PENDING':
        return 'text-yellow-600';
      case 'SUSPENDED':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const filteredDealers = dealers.filter(dealer => {
    const matchesSearch = dealer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dealer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || dealer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dealers</h1>
          <p className="text-muted-foreground">
            Manage your tire dealer partners and track their performance
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Dealer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Dealer</DialogTitle>
              <DialogDescription>
                Register a new tire dealer partner
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dealerName">Dealer Name *</Label>
                  <Input
                    id="dealerName"
                    value={newDealer.name}
                    onChange={(e) => setNewDealer(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter dealer name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dealerEmail">Email Address *</Label>
                  <Input
                    id="dealerEmail"
                    type="email"
                    value={newDealer.email}
                    onChange={(e) => setNewDealer(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dealerPhone">Phone Number *</Label>
                  <Input
                    id="dealerPhone"
                    value={newDealer.phone}
                    onChange={(e) => setNewDealer(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dealerStatus">Status</Label>
                  <Select value={newDealer.status} onValueChange={(value) => setNewDealer(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(DEALER_STATUS).map(status => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accessCount">Access Count</Label>
                <Input
                  id="accessCount"
                  type="number"
                  value={newDealer.accessCount}
                  onChange={(e) => setNewDealer(prev => ({ ...prev, accessCount: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>

              {/* Address Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Address Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="streetNumber">Street Number</Label>
                    <Input
                      id="streetNumber"
                      value={newDealer.address.streetNumber}
                      onChange={(e) => setNewDealer(prev => ({ 
                        ...prev, 
                        address: { ...prev.address, streetNumber: e.target.value }
                      }))}
                      placeholder="123"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="streetName">Street Name</Label>
                    <Input
                      id="streetName"
                      value={newDealer.address.streetName}
                      onChange={(e) => setNewDealer(prev => ({ 
                        ...prev, 
                        address: { ...prev.address, streetName: e.target.value }
                      }))}
                      placeholder="Main Street"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={newDealer.address.city}
                      onChange={(e) => setNewDealer(prev => ({ 
                        ...prev, 
                        address: { ...prev.address, city: e.target.value }
                      }))}
                      placeholder="Toronto"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="province">Province</Label>
                    <Input
                      id="province"
                      value={newDealer.address.province}
                      onChange={(e) => setNewDealer(prev => ({ 
                        ...prev, 
                        address: { ...prev.address, province: e.target.value }
                      }))}
                      placeholder="Ontario"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={newDealer.address.postalCode}
                      onChange={(e) => setNewDealer(prev => ({ 
                        ...prev, 
                        address: { ...prev.address, postalCode: e.target.value }
                      }))}
                      placeholder="M5V 3A8"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialInstructions">Special Instructions</Label>
                  <Textarea
                    id="specialInstructions"
                    value={newDealer.address.specialInstructions}
                    onChange={(e) => setNewDealer(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, specialInstructions: e.target.value }
                    }))}
                    placeholder="Delivery instructions, access codes, etc."
                    rows={2}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateDealer}>Create Dealer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Dealers</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dealers.length}</div>
            <p className="text-xs text-muted-foreground">
              Registered partners
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Dealers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dealers.filter(d => d.status === 'ACTIVE').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dealers.filter(d => d.status === 'PENDING').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Access Count</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dealers.reduce((sum, dealer) => sum + (dealer.accessCount || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Combined access
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search dealers by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {Object.values(DEALER_STATUS).map(status => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Dealers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Dealers ({filteredDealers.length})</CardTitle>
          <CardDescription>
            Manage your tire dealer partnerships
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
                  <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
                  <div className="h-4 bg-muted rounded w-1/6 animate-pulse" />
                  <div className="h-4 bg-muted rounded w-1/6 animate-pulse" />
                  <div className="h-4 bg-muted rounded w-1/6 animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dealer Information</TableHead>
                  <TableHead>Contact Details</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Access Count</TableHead>
                  <TableHead>Dealer ID</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDealers.map((dealer) => (
                  <TableRow key={dealer.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium flex items-center">
                          <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                          {dealer.name}
                        </div>
                        {dealer.address && (
                          <div className="text-sm text-muted-foreground flex items-center mt-1">
                            <MapPin className="mr-1 h-3 w-3" />
                            {dealer.address.city}, {dealer.address.province}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="mr-1 h-3 w-3" />
                          {dealer.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="mr-1 h-3 w-3" />
                          {dealer.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(dealer.status)}>
                        {dealer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="text-lg font-semibold">{dealer.accessCount || 0}</div>
                        <div className="text-xs text-muted-foreground">accesses</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono text-sm bg-muted px-2 py-1 rounded">
                        {dealer.dealerUniqueId || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteDealer(dealer.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
          {!loading && filteredDealers.length === 0 && (
            <div className="text-center py-8">
              <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No dealers found</p>
              <p className="text-sm text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by adding your first dealer partner'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DealersPage;

