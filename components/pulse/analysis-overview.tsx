import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Sparkles, Calendar, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AnalysisOverviewProps {
  onBookClinic: () => void;
  onViewDetails: () => void;
}

export function AnalysisOverview({ onBookClinic, onViewDetails }: AnalysisOverviewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 pt-4">
          <div className="p-2 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AI Health Analysis</h1>
            <p className="text-sm text-muted-foreground">Based on your 14-day check-in pattern</p>
          </div>
        </div>

        {/* Analysis Summary Card */}
        <Card className="border-2 border-amber-500/20 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
          <CardHeader>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-1 flex-shrink-0" />
              <div>
                <CardTitle className="text-amber-900 dark:text-amber-100">Pattern Detected: Medical Attention Recommended</CardTitle>
                <CardDescription className="text-amber-800/80 dark:text-amber-200/80">
                  We&apos;ve identified concerning trends that warrant a checkup
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-white/50 dark:bg-black/20 border border-amber-200 dark:border-amber-800">
                <div className="text-xs text-muted-foreground mb-1">Duration</div>
                <div className="font-semibold">14 days</div>
              </div>
              <div className="p-3 rounded-lg bg-white/50 dark:bg-black/20 border border-amber-200 dark:border-amber-800">
                <div className="text-xs text-muted-foreground mb-1">Escalation</div>
                <div className="font-semibold">Last 7 days</div>
              </div>
            </div>

            {/* Analysis Summary */}
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-sm leading-relaxed text-foreground">
                Over the past <strong>14 days</strong>, we&apos;ve noticed a consistent and escalating pattern:
              </p>
              <ul className="text-sm space-y-1 my-3">
                <li><strong>Energy:</strong> Sustained decline from 4/5 → 2/5</li>
                <li><strong>Sleep:</strong> Progressive disruption from 7-8hrs → 4.5hrs</li>
                <li><strong>Symptoms:</strong> Recurring lower abdomen discomfort (Days 10, 12, 14, 15)</li>
                <li><strong>New symptom:</strong> Slight fever (37.8°C) appeared today</li>
                <li><strong>Appetite:</strong> Reduced significantly, skipping meals</li>
                <li><strong>Mood:</strong> Consistently low with social isolation</li>
              </ul>
              <p className="text-sm leading-relaxed text-foreground">
                On its own, each of these is easy to brush off. Together, and given your <strong>family history</strong> (hypertension, diabetes) 
                plus the fact that your <strong>last checkup was 14 months ago</strong>, this combination warrants medical attention.
              </p>
              <div className="mt-4 p-4 rounded-lg bg-white/70 dark:bg-black/30 border-l-4 border-amber-600">
                <p className="text-sm font-medium">
                  <AlertCircle className="h-4 w-4 inline mr-2" />
                  This isn&apos;t a diagnosis — but it&apos;s a signal worth checking. We <strong>strongly recommend a checkup</strong> within the next 2-3 days.
                </p>
              </div>
            </div>

            {/* Suggested Specialties */}
            <div className="pt-2">
              <div className="text-xs text-muted-foreground mb-2">Suggested Clinic Specialties:</div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">General Practice</Badge>
                <Badge variant="secondary">Women&apos;s Health</Badge>
                <Badge variant="secondary">Gastroenterology</Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 pt-6">
            <Button 
              onClick={onBookClinic}
              className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold"
              size="lg"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Book Clinic Visit
            </Button>
            <Button 
              onClick={onViewDetails}
              variant="outline"
              className="w-full h-12 border-2"
              size="lg"
            >
              <Activity className="mr-2 h-5 w-5" />
              See Detailed Analysis
            </Button>
          </CardFooter>
        </Card>

        {/* Info Note */}
        <div className="text-xs text-center text-muted-foreground px-4">
          This analysis is based on your self-reported data over 14 days. It is not a medical diagnosis. 
          Always consult with healthcare professionals for proper medical advice.
        </div>
      </div>
    </div>
  );
}
