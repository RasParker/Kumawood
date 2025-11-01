import { useState } from 'react';
import { Bookmark, Bell, History as HistoryIcon, Heart, Trash2, X } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Series } from '@shared/schema';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface MyListScreenProps {
  onNavigateToPlayer: (seriesId: string, episodeNumber: number) => void;
}

export default function MyListScreen({ onNavigateToPlayer }: MyListScreenProps) {
  const userId = 'demo-user-id';
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('following');
  const [editMode, setEditMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: followingSeries = [], isLoading: isLoadingFollowing } = useQuery<Series[]>({
    queryKey: ['/api/user-following', userId],
    enabled: !!userId,
  });

  const { data: watchHistory = [], isLoading: isLoadingHistory } = useQuery<Array<{ series: Series; episode: any; lastWatchedTimestamp: number }>>({
    queryKey: ['/api/watch-history', userId],
    enabled: !!userId,
  });

  const { data: reminderSeries = [], isLoading: isLoadingReminders } = useQuery<Series[]>({
    queryKey: ['/api/user-reminders', userId],
    enabled: !!userId,
  });

  const { data: popularSeries = [] } = useQuery<Series[]>({
    queryKey: ['/api/series/popular'],
  });

  const trendingSeries = popularSeries.slice(0, 5);

  const bulkDeleteFollowingMutation = useMutation({
    mutationFn: async (seriesIds: string[]) => {
      await apiRequest('POST', '/api/user-following/bulk-delete', { userId, seriesIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user-following', userId] });
      toast({ title: 'Deleted successfully' });
      setEditMode(false);
      setSelectedItems(new Set());
    },
    onError: () => {
      toast({ title: 'Failed to delete', variant: 'destructive' });
    },
  });

  const bulkDeleteRemindersMutation = useMutation({
    mutationFn: async (seriesIds: string[]) => {
      await apiRequest('POST', '/api/user-reminders/bulk-delete', { userId, seriesIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user-reminders', userId] });
      toast({ title: 'Deleted successfully' });
      setEditMode(false);
      setSelectedItems(new Set());
    },
    onError: () => {
      toast({ title: 'Failed to delete', variant: 'destructive' });
    },
  });

  const bulkDeleteHistoryMutation = useMutation({
    mutationFn: async (seriesIds: string[]) => {
      await apiRequest('POST', '/api/watch-history/bulk-delete', { userId, seriesIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/watch-history', userId] });
      toast({ title: 'Deleted successfully' });
      setEditMode(false);
      setSelectedItems(new Set());
    },
    onError: () => {
      toast({ title: 'Failed to delete', variant: 'destructive' });
    },
  });

  const handleToggleItem = (seriesId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(seriesId)) {
      newSelected.delete(seriesId);
    } else {
      newSelected.add(seriesId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    let allItems: string[] = [];
    if (activeTab === 'following') {
      allItems = followingSeries.map(s => s.id);
    } else if (activeTab === 'history') {
      allItems = watchHistory.map(h => h.series.id);
    } else if (activeTab === 'reminders') {
      allItems = reminderSeries.map(s => s.id);
    }
    setSelectedItems(new Set(allItems));
  };

  const handleDelete = () => {
    if (selectedItems.size === 0) return;
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    const seriesIds = Array.from(selectedItems);
    if (activeTab === 'following') {
      bulkDeleteFollowingMutation.mutate(seriesIds);
    } else if (activeTab === 'reminders') {
      bulkDeleteRemindersMutation.mutate(seriesIds);
    } else if (activeTab === 'history') {
      bulkDeleteHistoryMutation.mutate(seriesIds);
    }
    setShowDeleteDialog(false);
  };

  const renderSeriesCard = (series: Series, episode?: any, progress?: number) => {
    const isSelected = selectedItems.has(series.id);
    const totalEpisodes = 120;
    const currentEpisode = episode?.episodeNumber || 1;
    const progressPercent = progress || Math.round((currentEpisode / totalEpisodes) * 100);

    return (
      <div
        key={series.id}
        onClick={() => !editMode && onNavigateToPlayer(series.id, currentEpisode)}
        className="flex gap-3 p-3 bg-card rounded-lg hover-elevate active-elevate-2 cursor-pointer"
        data-testid={`item-series-${series.id}`}
      >
        {editMode && (
          <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => handleToggleItem(series.id)}
              data-testid={`checkbox-${series.id}`}
            />
          </div>
        )}
        <div className="flex-shrink-0 w-20 h-28 bg-muted rounded-md overflow-hidden">
          <img
            src={series.posterUrl}
            alt={series.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground line-clamp-2">
              {series.title}
            </h3>
            {activeTab !== 'reminders' && (
              <p className="text-xs text-muted-foreground mt-1">
                Episode {currentEpisode} of {totalEpisodes}
              </p>
            )}
            {activeTab === 'reminders' && (
              <p className="text-xs text-muted-foreground mt-1">
                Coming {series.releaseDate ? new Date(series.releaseDate).toLocaleDateString() : 'Soon'}
              </p>
            )}
          </div>
          {activeTab !== 'reminders' && (
            <div className="space-y-2">
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {progressPercent}% complete
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderEmptyState = (icon: any, title: string, description: string) => {
    const Icon = icon;
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Icon className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
      </div>
    );
  };

  const currentItems = activeTab === 'following' ? followingSeries.length : 
                       activeTab === 'history' ? watchHistory.length : 
                       reminderSeries.length;

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden pb-20">
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-foreground">My List</h1>
          {currentItems > 0 && (
            <div className="flex items-center gap-2">
              {editMode ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSelectAll}
                    data-testid="button-select-all"
                  >
                    Select All
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    disabled={selectedItems.size === 0}
                    data-testid="button-delete"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete ({selectedItems.size})
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditMode(false);
                      setSelectedItems(new Set());
                    }}
                    data-testid="button-cancel-edit"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditMode(true)}
                  data-testid="button-edit"
                >
                  Edit
                </Button>
              )}
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setEditMode(false); setSelectedItems(new Set()); }}>
          <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent px-4">
            <TabsTrigger value="following" data-testid="tab-following">
              <Heart className="h-4 w-4 mr-2" />
              Following
            </TabsTrigger>
            <TabsTrigger value="history" data-testid="tab-history">
              <HistoryIcon className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger value="reminders" data-testid="tab-reminders">
              <Bell className="h-4 w-4 mr-2" />
              Reminder Set
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Tabs value={activeTab}>
          <TabsContent value="following" className="m-0">
            {isLoadingFollowing ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 p-3 animate-pulse">
                    <div className="w-20 h-28 bg-muted rounded-md" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : followingSeries.length > 0 ? (
              <div className="space-y-6">
                <div className="p-4 space-y-3">
                  {followingSeries.map((series) => renderSeriesCard(series))}
                </div>
                {trendingSeries.length > 0 && (
                  <div className="px-4 pb-4">
                    <h3 className="text-lg font-bold text-foreground mb-3">Most Trending</h3>
                    <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                      {trendingSeries.map((series) => (
                        <div
                          key={series.id}
                          onClick={() => onNavigateToPlayer(series.id, 1)}
                          className="flex-shrink-0 w-32 cursor-pointer"
                          data-testid={`trending-${series.id}`}
                        >
                          <div className="aspect-[2/3] bg-muted rounded-lg overflow-hidden mb-2">
                            <img
                              src={series.posterUrl}
                              alt={series.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <h4 className="text-xs font-bold text-foreground line-clamp-2">
                            {series.title}
                          </h4>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              renderEmptyState(Heart, 'No series followed', 'Follow series to see them here')
            )}
          </TabsContent>

          <TabsContent value="history" className="m-0">
            {isLoadingHistory ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 p-3 animate-pulse">
                    <div className="w-20 h-28 bg-muted rounded-md" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : watchHistory.length > 0 ? (
              <div className="p-4 space-y-3">
                {watchHistory.map((item) => renderSeriesCard(item.series, item.episode))}
              </div>
            ) : (
              renderEmptyState(HistoryIcon, 'No watch history', 'Videos you watch will appear here')
            )}
          </TabsContent>

          <TabsContent value="reminders" className="m-0">
            {isLoadingReminders ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 p-3 animate-pulse">
                    <div className="w-20 h-28 bg-muted rounded-md" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : reminderSeries.length > 0 ? (
              <div className="p-4 space-y-3">
                {reminderSeries.map((series) => renderSeriesCard(series))}
              </div>
            ) : (
              renderEmptyState(Bell, 'No reminders set', 'Set reminders for upcoming series to be notified')
            )}
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedItems.size} item(s)?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Are you sure you want to delete the selected items?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} data-testid="button-confirm-delete">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
