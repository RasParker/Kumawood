import { Gift, Calendar, Target, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RewardsScreenProps {
  onNavigateToPointsHistory: () => void;
}

export default function RewardsScreen({ onNavigateToPointsHistory }: RewardsScreenProps) {
  const dailyTasks = [
    { id: 1, title: 'Watch 3 episodes', reward: 10, completed: false },
    { id: 2, title: 'Sign in daily', reward: 5, completed: true },
    { id: 3, title: 'Share a series', reward: 15, completed: false },
  ];

  const achievements = [
    { id: 1, title: 'First Watch', description: 'Watch your first episode', reward: 50, unlocked: true },
    { id: 2, title: 'Marathon Viewer', description: 'Watch 10 episodes in a day', reward: 100, unlocked: false },
    { id: 3, title: 'Loyal Fan', description: 'Watch 7 days in a row', reward: 200, unlocked: false },
  ];

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 p-4 bg-background border-b border-border">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Rewards</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={onNavigateToPointsHistory}
            data-testid="link-points-history"
            className="hover-elevate active-elevate-2"
          >
            History
          </Button>
        </div>
      </div>

      {/* Points Balance */}
      <div className="p-4">
        <div className="p-6 bg-gradient-to-r from-primary to-accent rounded-lg text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="h-6 w-6 text-primary-foreground" />
            <span className="text-3xl font-bold text-primary-foreground">0</span>
          </div>
          <p className="text-sm text-primary-foreground/90">Total Points</p>
        </div>
      </div>

      {/* Daily Tasks */}
      <div className="px-4 pb-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Daily Tasks</h2>
        </div>
        <div className="space-y-3">
          {dailyTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-4 bg-card rounded-lg border border-border"
              data-testid={`task-${task.id}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  task.completed ? 'bg-primary border-primary' : 'border-border'
                }`}>
                  {task.completed && <div className="w-2 h-2 bg-primary-foreground rounded-full" />}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{task.title}</h3>
                  <p className="text-xs text-muted-foreground">+{task.reward} points</p>
                </div>
              </div>
              {!task.completed && (
                <Button
                  size="sm"
                  variant="outline"
                  data-testid={`button-claim-${task.id}`}
                  className="rounded-full hover-elevate active-elevate-2"
                >
                  Claim
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="px-4 pb-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Achievements</h2>
        </div>
        <div className="space-y-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border ${
                achievement.unlocked
                  ? 'bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30'
                  : 'bg-card border-border'
              }`}
              data-testid={`achievement-${achievement.id}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    {achievement.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    {achievement.description}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-primary">
                    <Gift className="h-3 w-3" />
                    <span>+{achievement.reward} points</span>
                  </div>
                </div>
                {achievement.unlocked && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}