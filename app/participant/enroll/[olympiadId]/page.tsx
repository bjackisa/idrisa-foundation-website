"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Olympiad {
  id: string;
  name: string;
}

const SUBJECTS_BY_LEVEL: Record<string, string[]> = {
  Primary: ["Math", "Science", "ICT"],
  "O’Level": ["Math", "Biology", "Chemistry", "Physics", "ICT", "Agriculture"],
  "A’Level": ["Math", "Biology", "Chemistry", "Physics", "ICT", "Agriculture"],
};

export default function SubjectSelectionPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const olympiadId = params.olympiadId as string;
  const enrollmentType = searchParams.get('type');
  const userId = searchParams.get('userId');
  const minorId = searchParams.get('minorId');

  const [olympiad, setOlympiad] = useState<Olympiad | null>(null);
  const [educationLevel, setEducationLevel] = useState<string>('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (olympiadId) {
      const fetchOlympiad = async () => {
        try {
          const response = await fetch(`/api/admin/olympiad/${olympiadId}`);
          if (response.ok) {
            setOlympiad(await response.json());
          }
        } catch (error) {
          console.error("Failed to fetch olympiad", error);
        } finally {
          setLoading(false);
        }
      };
      fetchOlympiad();
    }
  }, [olympiadId]);

  const handleSubjectToggle = (subject: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/participant/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantType: enrollmentType,
          editionId: olympiadId,
          userId: enrollmentType === 'SELF' ? userId : null,
          minorProfileId: enrollmentType === 'MINOR' ? minorId : null,
          enrolledByUserId: userId, // Assuming the logged in user is the one enrolling
          educationLevel,
          subjects: selectedSubjects, // You might need to adjust your backend to accept subjects
        }),
      });
      if (response.ok) {
        router.push('/participant/dashboard');
      } else {
        console.error('Enrollment failed');
      }
    } catch (error) {
      console.error('Enrollment failed', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!olympiad) return <p>Olympiad not found.</p>;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Subject Selection for {olympiad.name}</h1>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-12">
        <Card>
          <CardHeader><CardTitle>Select Education Level and Subjects</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Education Level</Label>
              <Select onValueChange={setEducationLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Primary">Primary</SelectItem>
                  <SelectItem value="O’Level">O’Level</SelectItem>
                  <SelectItem value="A’Level">A’Level</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {educationLevel && (
              <div>
                <Label>Subjects</Label>
                <div className="space-y-2">
                  {(SUBJECTS_BY_LEVEL[educationLevel] || []).map(subject => (
                    <div key={subject} className="flex items-center space-x-2">
                      <Checkbox
                        id={subject}
                        checked={selectedSubjects.includes(subject)}
                        onCheckedChange={() => handleSubjectToggle(subject)}
                      />
                      <Label htmlFor={subject}>{subject}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <Button onClick={handleSubmit} disabled={!educationLevel || selectedSubjects.length === 0 || submitting}>
              {submitting ? 'Enrolling...' : 'Complete Enrollment'}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
