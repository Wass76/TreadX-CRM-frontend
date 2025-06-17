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
  MoreHorizontal, 
  Edit, 
  Trash2, 
  UserPlus,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ArrowUpDown
} from 'lucide-react';
import { leadService } from '../lib/services.js';
import { LEAD_STATUS, LEAD_SOURCE } from '../lib/config.js';

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showConvertDialog, setShowConvertDialog] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });

  // Form state for creating new lead
  const [newLead, setNewLead] = useState({
    businessName: '',
    businessEmail: '',
    phoneNumber: '',
    source: '',
    status: LEAD_STATUS.NEW,
    notes: '',
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

  // Conversion form state
  const [conversionData, setConversionData] = useState({
    businessName: '',
    businessEmail: '',
    phoneNumber: '',
    notes: '',
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
    fetchLeads();
  }, [pagination.page, pagination.size]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await leadService.getLeads(pagination.page, pagination.size);
      setLeads(response.content || []);
      setPagination(prev => ({
        ...prev,
        totalElements: response.totalElements || 0,
        totalPages: response.totalPages || 0
      }));
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLead = async () => {
    try {
      await leadService.createLead(newLead);
      setShowCreateDialog(false);
      setNewLead({
        businessName: '',
        businessEmail: '',
        phoneNumber: '',
        source: '',
        status: LEAD_STATUS.NEW,
        notes: '',
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
      fetchLeads();
    } catch (error) {
      console.error('Error creating lead:', error);
    }
  };

  const handleUpdateLeadStatus = async (leadId, newStatus) => {
    try {
      const lead = leads.find(l => l.id === leadId);
      if (lead) {
        await leadService.updateLead(leadId, { ...lead, status: newStatus });
        fetchLeads();
      }
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  const handleConvertToContact = async () => {
    try {
      if (selectedLead) {
        await leadService.convertLeadToContact(selectedLead.id, conversionData);
        setShowConvertDialog(false);
        setSelectedLead(null);
        setConversionData({
          businessName: '',
          businessEmail: '',
          phoneNumber: '',
          notes: '',
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
        fetchLeads();
      }
    } catch (error) {
      console.error('Error converting lead to contact:', error);
    }
  };

  const handleDeleteLead = async (leadId) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await leadService.deleteLead(leadId);
        fetchLeads();
      } catch (error) {
        console.error('Error deleting lead:', error);
      }
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'NEW':
        return 'default';
      case 'CONTACTED':
        return 'secondary';
      case 'QUALIFIED':
        return 'outline';
      case 'CONVERTED':
        return 'default';
      case 'CLOSED':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.businessEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openConvertDialog = (lead) => {
    setSelectedLead(lead);
    setConversionData({
      businessName: lead.businessName,
      businessEmail: lead.businessEmail,
      phoneNumber: lead.phoneNumber,
      notes: lead.notes || '',
      address: lead.address || {
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
    setShowConvertDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground">
            Manage your sales prospects and track their progress
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Lead</DialogTitle>
              <DialogDescription>
                Add a new prospect to your sales pipeline
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={newLead.businessName}
                    onChange={(e) => setNewLead(prev => ({ ...prev, businessName: e.target.value }))}
                    placeholder="Enter business name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessEmail">Business Email *</Label>
                  <Input
                    id="businessEmail"
                    type="email"
                    value={newLead.businessEmail}
                    onChange={(e) => setNewLead(prev => ({ ...prev, businessEmail: e.target.value }))}
                    placeholder="Enter email address"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    value={newLead.phoneNumber}
                    onChange={(e) => setNewLead(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source">Lead Source</Label>
                  <Select value={newLead.source} onValueChange={(value) => setNewLead(prev => ({ ...prev, source: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(LEAD_SOURCE).map(source => (
                        <SelectItem key={source} value={source}>
                          {source.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Address Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Address Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="streetNumber">Street Number</Label>
                    <Input
                      id="streetNumber"
                      value={newLead.address.streetNumber}
                      onChange={(e) => setNewLead(prev => ({ 
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
                      value={newLead.address.streetName}
                      onChange={(e) => setNewLead(prev => ({ 
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
                      value={newLead.address.city}
                      onChange={(e) => setNewLead(prev => ({ 
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
                      value={newLead.address.province}
                      onChange={(e) => setNewLead(prev => ({ 
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
                      value={newLead.address.postalCode}
                      onChange={(e) => setNewLead(prev => ({ 
                        ...prev, 
                        address: { ...prev.address, postalCode: e.target.value }
                      }))}
                      placeholder="M5V 3A8"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newLead.notes}
                  onChange={(e) => setNewLead(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes about this lead..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateLead}>Create Lead</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search leads by name or email..."
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
                {Object.values(LEAD_STATUS).map(status => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>Leads ({filteredLeads.length})</CardTitle>
          <CardDescription>
            Track and manage your sales prospects
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
                  <TableHead>Business Name</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{lead.businessName}</div>
                        {lead.address && (
                          <div className="text-sm text-muted-foreground flex items-center">
                            <MapPin className="mr-1 h-3 w-3" />
                            {lead.address.city}, {lead.address.province}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="mr-1 h-3 w-3" />
                          {lead.businessEmail}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="mr-1 h-3 w-3" />
                          {lead.phoneNumber}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {lead.source?.replace('_', ' ') || 'Unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={lead.status} 
                        onValueChange={(value) => handleUpdateLeadStatus(lead.id, value)}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue>
                            <Badge variant={getStatusBadgeVariant(lead.status)}>
                              {lead.status}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(LEAD_STATUS).map(status => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-3 w-3" />
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openConvertDialog(lead)}
                          disabled={lead.status === 'CONVERTED'}
                        >
                          <UserPlus className="mr-1 h-3 w-3" />
                          Convert
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteLead(lead.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
          {!loading && filteredLeads.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No leads found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Convert to Contact Dialog */}
      <Dialog open={showConvertDialog} onOpenChange={setShowConvertDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Convert Lead to Contact</DialogTitle>
            <DialogDescription>
              Convert {selectedLead?.businessName} to a contact
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Alert>
              <AlertDescription>
                This will convert the lead to a contact. You can later convert the contact to a dealer if needed.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="convertBusinessName">Business Name *</Label>
                <Input
                  id="convertBusinessName"
                  value={conversionData.businessName}
                  onChange={(e) => setConversionData(prev => ({ ...prev, businessName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="convertBusinessEmail">Business Email *</Label>
                <Input
                  id="convertBusinessEmail"
                  type="email"
                  value={conversionData.businessEmail}
                  onChange={(e) => setConversionData(prev => ({ ...prev, businessEmail: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="convertPhoneNumber">Phone Number *</Label>
              <Input
                id="convertPhoneNumber"
                value={conversionData.phoneNumber}
                onChange={(e) => setConversionData(prev => ({ ...prev, phoneNumber: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="convertNotes">Notes</Label>
              <Textarea
                id="convertNotes"
                value={conversionData.notes}
                onChange={(e) => setConversionData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes for the contact..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConvertDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConvertToContact}>Convert to Contact</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadsPage;

