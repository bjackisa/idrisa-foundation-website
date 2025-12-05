"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

interface Olympiad {
  id: string;
  name: string;
  year: number;
  enrollmentStart: string;
  enrollmentEnd: string;
  status: string;
}

export default function OlympiadsManagement() {
  const [olympiads, setOlympiads] = useState<Olympiad[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOlympiads = async () => {
    try {
      const response = await fetch("/api/admin/olympiad");
      if (response.ok) {
        const data = await response.json();
        setOlympiads(data);
      }
    } catch (err) {
      console.log("Fetch olympiads error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOlympiads();
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Manage Olympiads</h1>
          <Link href="/admin/olympiads/new">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              <PlusCircle className="mr-2 h-4 w-4" /> Create Olympiad
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading olympiads...</p>
          </div>
        ) : olympiads.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <p className="text-muted-foreground mb-4">No olympiads yet</p>
            <Link href="/admin/olympiads/new">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Olympiad
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {olympiads.map((olympiad) => (
              <Card key={olympiad.id}>
                <CardHeader>
                  <CardTitle>{olympiad.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Year:</strong> {olympiad.year}</p>
                    <p><strong>Enrollment:</strong> {formatDate(olympiad.enrollmentStart)} - {formatDate(olympiad.enrollmentEnd)}</p>
                    <p><strong>Status:</strong> <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      olympiad.status === 'OPEN' ? 'bg-green-100 text-green-800' :
                      olympiad.status === 'RUNNING' ? 'bg-blue-100 text-blue-800' :
                      olympiad.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>{olympiad.status}</span></p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link href={`/admin/olympiads/${olympiad.id}`}>
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
