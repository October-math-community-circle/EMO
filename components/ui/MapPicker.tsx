"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";

interface MapPickerProps {
  value: string;
  onChange: (link: string) => void;
  disabled?: boolean;
}

export default function MapPicker({
  value,
  onChange,
  disabled,
}: MapPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    const encoded = encodeURIComponent(searchQuery.trim());
    const link = `https://www.google.com/maps/search/${encoded}`;
    onChange(link);
  };

  // Build the embed URL from the current value
  const embedSrc = value
    ? `https://maps.google.com/maps?q=${encodeURIComponent(value.replace(/^https:\/\/www\.google\.com\/maps\/search\//, "").replace(/^https:\/\/www\.google\.com\/maps\?q=/, ""))}&output=embed&z=14`
    : `https://maps.google.com/maps?q=Egypt&output=embed&z=5`;

  return (
    <div className="space-y-3">
      {/* Search input */}
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder='Search for a location, e.g. "Cairo University"'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={disabled}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSearch();
            }
          }}
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={disabled || !searchQuery.trim()}
          className="shrink-0 h-11 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none cursor-pointer transition-colors"
        >
          Search
        </button>
      </div>

      {/* Google Maps iframe */}
      <div
        className="w-full rounded-lg border border-input overflow-hidden"
        style={{ height: 280 }}
      >
        <iframe
          title="Google Maps location preview"
          src={embedSrc}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <p className="text-xs text-muted-foreground">
        📍 Search for a location above to set the competition venue
      </p>

      {/* Show saved link */}
      {value && (
        <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-md px-3 py-2">
          <svg
            className="w-4 h-4 text-primary shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary font-medium truncate hover:underline"
          >
            {value}
          </a>
        </div>
      )}
    </div>
  );
}
