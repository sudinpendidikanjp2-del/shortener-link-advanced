"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { Plus, RefreshCw, AlertCircle } from "lucide-react";
import { localInputToGMT } from "@/lib/utils";

export function CreateLinkDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [originalUrl, setOriginalUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [hasPassword, setHasPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [hasExpiration, setHasExpiration] = useState(false);
  const [expiresAt, setExpiresAt] = useState("");

  // Auto-generate slug when dialog opens
  useEffect(() => {
    if (open) {
      generateSlug();
    }
  }, [open]);

  const generateSlug = async () => {
    try {
      const res = await fetch("/api/links/generate-slug");
      const data = await res.json();
      if (data.slug) {
        setSlug(data.slug);
      }
    } catch {
      // Silently fail
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalUrl,
          slug: slug || undefined,
          password: hasPassword ? password : undefined,
          expiresAt: hasExpiration ? localInputToGMT(expiresAt) : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create link");
        setIsLoading(false);
        return;
      }

      // Reset form
      setOriginalUrl("");
      setSlug("");
      setHasPassword(false);
      setPassword("");
      setHasExpiration(false);
      setExpiresAt("");
      setOpen(false);

      // Refresh data
      router.refresh();
      window.location.reload();
    } catch {
      setError("Network error");
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Short Link</DialogTitle>
          <DialogDescription>
            Create a shortened URL with optional custom slug, password, and
            expiration.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <FieldGroup>
            <Field>
              <FieldLabel>Destination URL</FieldLabel>
              <Input
                type="url"
                placeholder="https://example.com/very-long-url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                required
              />
            </Field>

            <Field>
              <FieldLabel>Short Link Slug</FieldLabel>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="custom-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={generateSlug}
                  title="Generate random slug"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Leave empty to auto-generate. Only letters, numbers, hyphens,
                and underscores allowed.
              </p>
            </Field>

            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel className="mb-0">Password Protection</FieldLabel>
                <Switch
                  checked={hasPassword}
                  onCheckedChange={setHasPassword}
                />
              </div>
              {hasPassword && (
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2"
                  required={hasPassword}
                />
              )}
            </Field>

            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel className="mb-0">Expiration Date</FieldLabel>
                <Switch
                  checked={hasExpiration}
                  onCheckedChange={setHasExpiration}
                />
              </div>
              {hasExpiration && (
                <Input
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="mt-2"
                  required={hasExpiration}
                  min={new Date().toISOString().slice(0, 16)}
                />
              )}
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Link"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
