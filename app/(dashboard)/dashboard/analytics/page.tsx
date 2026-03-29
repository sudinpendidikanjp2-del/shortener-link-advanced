'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MousePointerClick, Link2, TrendingUp, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Link as LinkType } from '@/lib/types'

export default function AnalyticsPage() {
  const [links, setLinks] = useState<LinkType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalLinks: 0,
    totalClicks: 0,
    avgClicksPerLink: 0,
  })

  useEffect(() => {
    fetch('/api/links?limit=100')
      .then((res) => res.json())
      .then((data) => {
        const allLinks = data.links || []
        setLinks(allLinks)

        const totalClicks = allLinks.reduce(
          (sum: number, link: LinkType) => sum + (link.click_count || 0),
          0
        )

        setStats({
          totalLinks: data.pagination?.totalCount || allLinks.length,
          totalClicks,
          avgClicksPerLink: allLinks.length > 0 ? Math.round(totalClicks / allLinks.length) : 0,
        })
        setIsLoading(false)
      })
  }, [])

  // Sort by clicks to get top performing links
  const topLinks = [...links].sort((a, b) => b.click_count - a.click_count).slice(0, 10)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">Loading analytics...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics Overview</h1>
        <p className="text-muted-foreground">View performance across all your links</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Links</CardTitle>
            <Link2 className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLinks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Clicks</CardTitle>
            <MousePointerClick className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClicks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Clicks/Link</CardTitle>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgClicksPerLink}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Links</CardTitle>
          <CardDescription>Your links with the most clicks</CardDescription>
        </CardHeader>
        <CardContent>
          {topLinks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No links yet. Create your first link to see analytics!
            </div>
          ) : (
            <div className="space-y-4">
              {topLinks.map((link, index) => {
                const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
                return (
                  <div
                    key={link.id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-mono text-sm">
                          {baseUrl}/{link.slug}
                        </p>
                        <p className="text-sm text-muted-foreground truncate max-w-[300px]">
                          {link.original_url}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold">{link.click_count}</p>
                        <p className="text-xs text-muted-foreground">clicks</p>
                      </div>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/links/${link.id}/analytics`}>
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
