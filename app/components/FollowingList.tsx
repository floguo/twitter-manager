'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface Following {
  id: string;
  username: string;
  name: string;
  profileImageUrl: string;
}

function FollowingItemSkeleton() {
  return (
    <div className="flex items-center justify-between p-2">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </div>
      <Skeleton className="h-8 w-[80px]" />
    </div>
  );
}

export default function FollowingList() {
  const [following, setFollowing] = useState<Following[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [unfollowingIds, setUnfollowingIds] = useState<Set<string>>(new Set());
  const [userToUnfollow, setUserToUnfollow] = useState<Following | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchFollowing(1);
  }, []);

  async function fetchFollowing(pageNumber: number) {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/twitter/following?page=${pageNumber}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        console.error('Unexpected response format:', data);
        return;
      }
      
      if (data.length === 0) {
        setHasMore(false);
        return;
      }

      setFollowing(prev => pageNumber === 1 ? data : [...prev, ...data]);
      setPage(pageNumber);
    } catch (error) {
      console.error('Failed to fetch following:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUnfollow(user: Following) {
    try {
      setUnfollowingIds(prev => new Set(prev).add(user.id));
      
      const response = await fetch('/api/twitter/unfollow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to unfollow');
      }

      setFollowing(prev => prev.filter(u => u.id !== user.id));
    } catch (error) {
      console.error('Error unfollowing user:', error);
    } finally {
      setUnfollowingIds(prev => {
        const next = new Set(prev);
        next.delete(user.id);
        return next;
      });
      setDialogOpen(false);
      setUserToUnfollow(null);
    }
  }

  return (
    <>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Following</CardTitle>
          <CardDescription>People you follow on Twitter</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {following.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-2 hover:bg-accent rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={user.profileImageUrl} />
                    <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">@{user.username}</div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setUserToUnfollow(user);
                    setDialogOpen(true);
                  }}
                  disabled={unfollowingIds.has(user.id)}
                >
                  {unfollowingIds.has(user.id) ? 'Unfollowing...' : 'Unfollow'}
                </Button>
              </div>
            ))}
            
            {!isLoading && hasMore && (
              <Button 
                variant="outline" 
                onClick={() => fetchFollowing(page + 1)}
                className="mt-4"
              >
                Load More
              </Button>
            )}
            
            {isLoading && (
              <div className="flex flex-col gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <FollowingItemSkeleton key={i} />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Unfollow</DialogTitle>
            <DialogDescription>
              Are you sure you want to unfollow @{userToUnfollow?.username}? You will no longer see their Tweets in your home timeline.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => {
                setDialogOpen(false);
                setUserToUnfollow(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => userToUnfollow && handleUnfollow(userToUnfollow)}
              disabled={!userToUnfollow || unfollowingIds.has(userToUnfollow.id)}
            >
              {unfollowingIds.has(userToUnfollow?.id || '') ? 'Unfollowing...' : 'Unfollow'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 