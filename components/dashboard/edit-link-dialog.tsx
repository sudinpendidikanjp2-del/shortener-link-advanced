'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Spinner } from '@/components/ui/spinner'
import type { Link } from '@/lib/types'

interface EditLinkDialogProps {
  link: Link | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditLinkDialog({ link, open, onOpenChange, onSuccess }: EditLinkDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [title, setTitle] = useState('')
  const [originalUrl, setOriginalUrl] = useState('')
  const [slug, setSlug] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [isProtected, setIsProtected] = useState(false)
  const [password, setPassword] = useState('')
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (link) {
      setTitle(link.title || '')
      setOriginalUrl(link.original_url)
      setSlug(link.slug)
      setExpiresAt(link.expires_at ? new Date(link.expires_at).toISOString().slice(0, 16) : '')
      setIsProtected(link.is_protected)
      setIsActive(link.is_active)
      setPassword('')
    }
  }, [link])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!link) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/links/${link.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title || null,
          original_url: originalUrl,
          slug,
          expires_at: expiresAt || null,
          is_protected: isProtected,
          password: isProtected && password ? password : undefined,
          is_active: isActive,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update link')
      }

      onSuccess()
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Link</DialogTitle>
          <DialogDescription>
            Update your shortened link settings
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title (optional)</Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My awesome link"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-url">Destination URL</Label>
              <Input
                id="edit-url"
                type="url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="https://example.com/very-long-url"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-slug">Short Link Slug</Label>
              <Input
                id="edit-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="my-link"
                pattern="^[a-zA-Z0-9_-]+$"
                title="Only letters, numbers, hyphens, and underscores"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-expires">Expiration Date (optional)</Label>
              <Input
                id="edit-expires"
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="edit-active">Link Active</Label>
              <Switch
                id="edit-active"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="edit-protected">Password Protected</Label>
              <Switch
                id="edit-protected"
                checked={isProtected}
                onCheckedChange={setIsProtected}
              />
            </div>

            {isProtected && (
              <div className="grid gap-2">
                <Label htmlFor="edit-password">
                  New Password {link?.is_protected && '(leave empty to keep current)'}
                </Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Spinner className="mr-2 h-4 w-4" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
