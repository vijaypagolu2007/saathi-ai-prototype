
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ResourcesPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline">Self-Help Resources</h1>
      <p className="text-lg text-muted-foreground">
        Explore these exercises and practices to build resilience and improve
        your well-being.
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">
            Cognitive Behavioral Therapy (CBT) Exercises
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is Thought Challenging?</AccordionTrigger>
              <AccordionContent>
                Thought challenging is a technique to identify and question
                negative or irrational thoughts. When you notice a distressing
                thought, ask yourself: Is this thought 100% true? What's a more
                balanced perspective? This helps reduce the power of negative
                thinking patterns.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>The 3 C's Technique</AccordionTrigger>
              <AccordionContent>
                When you're feeling down, try the 3 C's:
                <br />1. <strong>Catch</strong> the negative thought.
                <br />2. <strong>Check</strong> the thought for facts vs.
                feelings.
                <br />3. <strong>Change</strong> the thought to a more
                realistic or helpful one.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Activity Scheduling</AccordionTrigger>
              <AccordionContent>
                When feeling low or unmotivated, it can be helpful to schedule
                positive activities into your day, no matter how small. This
                could be a 10-minute walk, listening to a favorite song, or
                calling a friend. It helps break the cycle of inactivity and
                low mood.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">
            Mindfulness Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>5-4-3-2-1 Grounding</AccordionTrigger>
              <AccordionContent>
                When feeling overwhelmed, bring yourself to the present moment.
                Acknowledge:
                <br />- <strong>5</strong> things you can see.
                <br />- <strong>4</strong> things you can touch.
                <br />- <strong>3</strong> things you can hear.
                <br />- <strong>2</strong> things you can smell.
                <br />- <strong>1</strong> thing you can taste.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Mindful Breathing</AccordionTrigger>
              <AccordionContent>
                Sit comfortably and close your eyes. Focus on your breath,
                noticing the sensation of air entering and leaving your body. If
                your mind wanders, gently guide your attention back to your
                breath. Do this for just 2-3 minutes to start.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Body Scan Meditation</AccordionTrigger>
              <AccordionContent>
                Lie down comfortably and bring your attention to your toes.
                Notice any sensations without judgment. Slowly move your
                attention up through your feet, legs, torso, arms, and head.
                This practice helps cultivate awareness and release physical
                tension.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
