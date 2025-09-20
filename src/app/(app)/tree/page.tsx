
"use client";

import { useEffect, useState } from "react";
import { ResilienceTree } from "@/components/resilience-tree";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf, LoaderCircle } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { getGrowthPoints, setGrowthPoints, getLastCheckIn, setLastCheckIn } from "@/lib/user-data";

export default function TreePage() {
  const { user } = useAuth();
  const [growthPoints, setGrowthPointsState] = useState(0);
  const [lastCheckIn, setLastCheckInState] = useState("");
  const [checkedInToday, setCheckedInToday] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        setIsLoading(true);
        const points = await getGrowthPoints(user.uid);
        const checkIn = await getLastCheckIn(user.uid);
        setGrowthPointsState(points);
        setLastCheckInState(checkIn);

        const today = new Date().toDateString();
        setCheckedInToday(checkIn === today);
        setIsLoading(false);
      }
    };
    loadUserData();
  }, [user]);

  const handleDailyCheckIn = async () => {
    if (!user) return;
    const today = new Date().toDateString();
    
    const newPoints = growthPoints + 1;
    await setGrowthPoints(user.uid, newPoints);
    setGrowthPointsState(newPoints);
    
    await setLastCheckIn(user.uid, today);
    setLastCheckInState(today);

    setCheckedInToday(true);
  };

  const getStageDescription = () => {
    if (growthPoints <= 5)
      return "Your resilience journey has just begun. Keep nurturing your tree!";
    if (growthPoints <= 15)
      return "Your tree is growing stronger. Consistent self-care makes a difference.";
    if (growthPoints <= 30)
      return "Look at that growth! Your tree is becoming a symbol of your strength.";
    return "Your resilience tree is flourishing! A testament to your dedication to your well-being.";
  };
  
  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-8 text-center">
      <h1 className="text-3xl font-headline">My Resilience Tree</h1>
      <p className="max-w-2xl text-lg text-muted-foreground">
        This tree represents your mental wellness journey. It grows as you
        engage with the app, symbolizing your increasing resilience.
      </p>

      <Card className="w-full max-w-3xl">
        <CardContent className="h-[450px] p-6">
          <ResilienceTree growthPoints={growthPoints} />
        </CardContent>
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <Leaf className="text-primary" /> Growth Points: {growthPoints}
          </CardTitle>
          <CardDescription>{getStageDescription()}</CardDescription>
        </CardHeader>
      </Card>

      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Daily Check-in</CardTitle>
          <CardDescription>
            Earn a growth point each day by checking in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleDailyCheckIn} disabled={checkedInToday}>
            {checkedInToday
              ? "You've checked in today!"
              : "Check-in for today (+1 point)"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
