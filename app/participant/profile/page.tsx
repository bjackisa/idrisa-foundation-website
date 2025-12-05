"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MinorProfileModal } from '@/components/modals/minor-profile-modal';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  contactInfo: string;
}

interface MinorProfile {
  id?: string;
  fullName: string;
  dateOfBirth: string;
  schoolName: string;
}

// In a real app, this would be fetched from the user's session
const DUMMY_USER_ID = 'user_1';

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [minors, setMinors] = useState<MinorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMinor, setEditingMinor] = useState<MinorProfile | undefined>(undefined);

  const fetchMinors = async () => {
    try {
      const response = await fetch(`/api/participant/minor?userId=${DUMMY_USER_ID}`);
      if (response.ok) {
        const data = await response.json();
        setMinors(data);
      }
    } catch (error) {
      console.error('Failed to fetch minors', error);
    }
  };

  useEffect(() => {
    // Fetch user profile (dummy for now)
    setUser({ id: DUMMY_USER_ID, name: 'John Doe', email: 'john.doe@example.com', contactInfo: '123-456-7890' });

    fetchMinors();
    setLoading(false);
  }, []);

  const handleOpenModal = (minor?: MinorProfile) => {
    setEditingMinor(minor);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingMinor(undefined);
    setIsModalOpen(false);
  };

  const handleSubmitMinor = async (profile: MinorProfile) => {
    const url = profile.id
      ? `/api/participant/minor/${profile.id}`
      : '/api/participant/minor';
    const method = profile.id ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...profile, createdByUserId: DUMMY_USER_ID }),
      });

      if (response.ok) {
        await fetchMinors();
        handleCloseModal();
      } else {
        console.error('Failed to save minor profile');
      }
    } catch (error) {
      console.error('Failed to save minor profile', error);
    }
  };

  const handleDeleteMinor = async (minorId: string) => {
    if (!minorId) return;
    if (confirm('Are you sure you want to delete this profile?')) {
      try {
        const response = await fetch(`/api/participant/minor/${minorId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          await fetchMinors();
        } else {
          console.error('Failed to delete minor profile');
        }
      } catch (error) {
        console.error('Failed to delete minor profile', error);
      }
    }
  };


  if (loading) {
    return <div className="text-center py-12">Loading profile...</div>;
  }

  if (!user) {
    return <div className="text-center py-12 text-red-600">Failed to load profile</div>;
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold">Manage Profiles</h1>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-12">
          <div className="space-y-12">
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Name</h3>
                    <p className="text-muted-foreground">{user.name}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Contact Info</h3>
                    <p className="text-muted-foreground">{user.contactInfo}</p>
                  </div>
                  <Button>Edit Profile</Button>
                </div>
              </CardContent>
            </Card>

            <Separator />

            <Card>
              <CardHeader>
                <CardTitle>Minor Profiles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {minors.length > 0 ? (
                    minors.map((minor) => (
                      <div key={minor.id} className="border border-border rounded-lg p-4 flex justify-between items-center">
                        <div>
                          <h4 className="font-bold">{minor.fullName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(minor.dateOfBirth).toLocaleDateString()} - {minor.schoolName}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleOpenModal(minor)}>Edit</Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteMinor(minor.id!)}>Delete</Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">You haven't added any minor profiles yet.</p>
                  )}
                  <Button onClick={() => handleOpenModal()}>Add Minor Profile</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      <MinorProfileModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitMinor}
        initialData={editingMinor}
      />
    </>
  );
}
