import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { 
  Search, 
  Contact,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Trash2,
  Building2,
  ArrowRight
} from 'lucide-react';
import { contactService } from '../lib/services.js';

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConvertDialog, setShowConvertDialog] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });

  // Conversion form state
  const [conversionData, setConversionData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'PENDING',
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
    fetchContacts();
  }, [pagination.page, pagination.size]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await contactService.getContacts(pagination.page, pagination.size);
      setContacts(response.content || []);
      setPagination(prev => ({
        ...prev,
        totalElements: response.totalElements || 0,
        totalPages: response.totalPages || 0
      }));
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await contactService.deleteContact(contactId);
        fetchContacts();
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    }
  };

  const handleConvertToDealer = async () => {
    try {
      if (selectedContact) {
        await contactService.convertContactToDealer(selectedContact.id, conversionData);
        setShowConvertDialog(false);
        setSelectedContact(null);
        setConversionData({
          name: '',
          email: '',
          phone: '',
          status: 'PENDING',
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
        fetchContacts();
      }
    } catch (error) {
      console.error('Error converting contact to dealer:', error);
    }
  };

  const openConvertDialog = (contact) => {
    setSelectedContact(contact);
    setConversionData({
      name: contact.businessName,
      email: contact.businessEmail,
      phone: contact.phoneNumber,
      status: 'PENDING',
      accessCount: 0,
      address: contact.address || {
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

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.businessEmail.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground">
            Manage converted leads and prepare them for dealer conversion
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Contact className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contacts.length}</div>
            <p className="text-xs text-muted-foreground">
              Converted from leads
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ready for Conversion</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contacts.length}</div>
            <p className="text-xs text-muted-foreground">
              Can become dealers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contacts.filter(contact => {
                const contactDate = new Date(contact.createdAt);
                const now = new Date();
                return contactDate.getMonth() === now.getMonth() && 
                       contactDate.getFullYear() === now.getFullYear();
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              New contacts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search contacts by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contacts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Contacts ({filteredContacts.length})</CardTitle>
          <CardDescription>
            Converted leads ready for dealer conversion
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
                  <TableHead>Business Information</TableHead>
                  <TableHead>Contact Details</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium flex items-center">
                          <Contact className="mr-2 h-4 w-4 text-muted-foreground" />
                          {contact.businessName}
                        </div>
                        {contact.notes && (
                          <div className="text-sm text-muted-foreground mt-1">
                            {contact.notes.substring(0, 50)}
                            {contact.notes.length > 50 && '...'}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="mr-1 h-3 w-3" />
                          {contact.businessEmail}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="mr-1 h-3 w-3" />
                          {contact.phoneNumber}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {contact.address ? (
                        <div className="flex items-center text-sm">
                          <MapPin className="mr-1 h-3 w-3" />
                          {contact.address.city}, {contact.address.province}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">No address</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-3 w-3" />
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openConvertDialog(contact)}
                        >
                          <Building2 className="mr-1 h-3 w-3" />
                          Convert to Dealer
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteContact(contact.id)}
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
          
          {!loading && filteredContacts.length === 0 && (
            <div className="text-center py-8">
              <Contact className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No contacts found</p>
              <p className="text-sm text-muted-foreground">
                {searchTerm 
                  ? 'Try adjusting your search criteria'
                  : 'Contacts will appear here when leads are converted'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Convert to Dealer Dialog */}
      <Dialog open={showConvertDialog} onOpenChange={setShowConvertDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Convert Contact to Dealer</DialogTitle>
            <DialogDescription>
              Convert {selectedContact?.businessName} to a dealer partner
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Alert>
              <Building2 className="h-4 w-4" />
              <AlertDescription>
                This will create a new dealer account with access to the TreadX platform. 
                Make sure all information is accurate before proceeding.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="convertDealerName">Dealer Name *</Label>
                <Input
                  id="convertDealerName"
                  value={conversionData.name}
                  onChange={(e) => setConversionData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="convertDealerEmail">Email Address *</Label>
                <Input
                  id="convertDealerEmail"
                  type="email"
                  value={conversionData.email}
                  onChange={(e) => setConversionData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="convertDealerPhone">Phone Number *</Label>
                <Input
                  id="convertDealerPhone"
                  value={conversionData.phone}
                  onChange={(e) => setConversionData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="convertAccessCount">Initial Access Count</Label>
                <Input
                  id="convertAccessCount"
                  type="number"
                  value={conversionData.accessCount}
                  onChange={(e) => setConversionData(prev => ({ ...prev, accessCount: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Address Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="convertStreetNumber">Street Number</Label>
                  <Input
                    id="convertStreetNumber"
                    value={conversionData.address.streetNumber}
                    onChange={(e) => setConversionData(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, streetNumber: e.target.value }
                    }))}
                    placeholder="123"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="convertStreetName">Street Name</Label>
                  <Input
                    id="convertStreetName"
                    value={conversionData.address.streetName}
                    onChange={(e) => setConversionData(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, streetName: e.target.value }
                    }))}
                    placeholder="Main Street"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="convertCity">City</Label>
                  <Input
                    id="convertCity"
                    value={conversionData.address.city}
                    onChange={(e) => setConversionData(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, city: e.target.value }
                    }))}
                    placeholder="Toronto"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="convertProvince">Province</Label>
                  <Input
                    id="convertProvince"
                    value={conversionData.address.province}
                    onChange={(e) => setConversionData(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, province: e.target.value }
                    }))}
                    placeholder="Ontario"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="convertPostalCode">Postal Code</Label>
                  <Input
                    id="convertPostalCode"
                    value={conversionData.address.postalCode}
                    onChange={(e) => setConversionData(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, postalCode: e.target.value }
                    }))}
                    placeholder="M5V 3A8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="convertSpecialInstructions">Special Instructions</Label>
                <Textarea
                  id="convertSpecialInstructions"
                  value={conversionData.address.specialInstructions}
                  onChange={(e) => setConversionData(prev => ({ 
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
            <Button variant="outline" onClick={() => setShowConvertDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConvertToDealer}>
              <ArrowRight className="mr-2 h-4 w-4" />
              Convert to Dealer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactsPage;

