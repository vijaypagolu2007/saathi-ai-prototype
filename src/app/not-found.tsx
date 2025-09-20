
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SaathiIcon } from "@/components/icons";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
            <TriangleAlert className="h-10 w-10 text-destructive" />
          </div>
          <CardTitle className="text-3xl font-headline">404 - Page Not Found</CardTitle>
          <CardDescription className="text-lg">
            Oops! The page you're looking for doesn't exist.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-muted-foreground">
            It might have been moved or deleted. Let's get you back on track.
          </p>
          <Button asChild>
            <Link href="/">
              Return to Chat
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
