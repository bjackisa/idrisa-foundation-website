"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Olympiad {
  id: string;
  name: string;
  year: number;
  enrollmentStart: string;
  enrollmentEnd: string;
}

interface MinorProfile {
  id: string;
  fullName: string;
}

// In a real app, this would be fetched from the user's session
const DUMMY_USER_ID = 'user_1';

export default function EnrollPage() {
  const [olympiads, setOlympiads] = useState<Olympiad[]>([]);
  const [minors, setMinors] = useState<MinorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOlympiad, setSelectedOlympiad] = useState<string | null>(null);
  const [enrollmentType, setEnrollmentType] = useState<'SELF' | 'MINOR'>('SELF');
  const [selectedMinor, setSelectedMinor] = useState<string | null>(null);

  useEffect(() => {
    const fetchOlympiads = async () => {
      try {
        const response = await fetch("/api/admin/olympiad?status=OPEN");
        if (response.ok) {
          const data = await response.json();
          setOlympiads(data);
        }
      } catch (err) {
        console.log("Fetch olympiads error:", err);
      }
    };

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

    Promise.all([fetchOlympiads(), fetchMinors()]).finally(() => setLoading(false));
  }, []);

  const handleEnroll = () => {
    if (!selectedOlympiad) return;

    let enrollUrl = `/participant/enroll/${selectedOlympiad}`;
    if (enrollmentType === 'SELF') {
      enrollUrl += `?type=SELF&userId=${DUMMY_USER_ID}`;
    } else if (selectedMinor) {
      enrollUrl += `?type=MINOR&minorId=${selectedMinor}`;
    } else {
      // Handle case where no minor is selected
      return;
    }
    // Use router to navigate to the enrollment page
    window.location.href = enrollUrl;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Enroll in an Olympiad</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-8">
            <Card>
              <CardHeader><CardTitle>1. Select an Olympiad</CardTitle></CardHeader>
              <CardContent>
                <RadioGroup onValueChange={setSelectedOlympiad}>
                  {olympiads.map(olympiad => (
                    <div key={olympiad.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={olympiad.id} id={olympiad.id} />
                      <Label htmlFor={olympiad.id} className="flex-grow">
                        <div className="p-4 border rounded-md hover:bg-muted cursor-pointer">
                          <h3 className="font-bold">{olympiad.name}</h3>
                          <p className="text-sm text-muted-foreground">Year: {olympiad.year}</p>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>2. Choose who to enroll</CardTitle></CardHeader>
              <CardContent>
                <RadioGroup defaultValue="SELF" onValueChange={(value: 'SELF' | 'MINOR') => setEnrollmentType(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="SELF" id="enroll-self" />
                    <Label htmlFor="enroll-self">Enroll Myself</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="MINOR" id="enroll-minor" />
                    <Label htmlFor="enroll-minor">Enroll a Minor</Label>
                  </div>
                </RadioGroup>

                {enrollmentType === 'MINOR' && (
                  <div className="mt-4 pl-6">
                    <h4 className="font-semibold mb-2">Select a Minor</h4>
                    <RadioGroup onValueChange={setSelectedMinor}>
                      {minors.map(minor => (
                         <div key={minor.id} className="flex items-center space-x-2">
                           <RadioGroupItem value={minor.id} id={`minor-${minor.id}`} />
                           <Label htmlFor={`minor-${minor.id}`}>{minor.fullName}</Label>
                         </div>
                      ))}
                    </RadioGroup>
                    <Link href="/participant/profile">
                      <Button variant="link" className="mt-2 text-sm p-0 h-auto">+ Add a new minor profile</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            <Button
              onClick={handleEnroll}
              disabled={!selectedOlympiad || (enrollmentType === 'MINOR' && !selectedMinor)}
              className="w-full"
            >
              Proceed to Subject Selection
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
