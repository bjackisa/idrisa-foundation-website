"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface OlympiadForm {
  name: string;
  year: number;
  enrollmentStart: string;
  enrollmentEnd: string;
  status: string;
}

export default function OlympiadFormPage() {
  const router = useRouter();
  const params = useParams();
  const olympiadId = params.olympiadId as string;
  const isNew = olympiadId === 'new';

  const [form, setForm] = useState<OlympiadForm>({
    name: '',
    year: new Date().getFullYear(),
    enrollmentStart: '',
    enrollmentEnd: '',
    status: 'DRAFT',
  });
  const [loading, setLoading] = useState(!isNew);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isNew) {
      const fetchOlympiad = async () => {
        try {
          const response = await fetch(`/api/admin/olympiad/${olympiadId}`);
          if (response.ok) {
            const data = await response.json();
            setForm({
              ...data,
              enrollmentStart: new Date(data.enrollmentStart).toISOString().split('T')[0],
              enrollmentEnd: new Date(data.enrollmentEnd).toISOString().split('T')[0],
            });
          }
        } catch (error) {
          console.error('Failed to fetch olympiad', error);
        } finally {
          setLoading(false);
        }
      };
      fetchOlympiad();
    }
  }, [olympiadId, isNew]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const url = isNew ? '/api/admin/olympiad' : `/api/admin/olympiad/${olympiadId}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...form, year: Number(form.year) }),
      });

      if (response.ok) {
        router.push('/admin/olympiads');
      } else {
        console.error('Failed to save olympiad');
      }
    } catch (error) {
      console.error('Failed to save olympiad', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">{isNew ? 'Create' : 'Edit'} Olympiad</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Olympiad Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="year">Year</Label>
                <Input id="year" name="year" type="number" value={form.year} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="enrollmentStart">Enrollment Start</Label>
                <Input id="enrollmentStart" name="enrollmentStart" type="date" value={form.enrollmentStart} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="enrollmentEnd">Enrollment End</Label>
                <Input id="enrollmentEnd" name="enrollmentEnd" type="date" value={form.enrollmentEnd} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select name="status" value={form.status} onValueChange={(value) => handleSelectChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="RUNNING">Running</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-4">
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save'}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push('/admin/olympiads')}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
