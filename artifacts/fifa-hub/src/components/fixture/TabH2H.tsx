import React from "react";
import type { FixtureDetail } from "@workspace/api-client-react";

export function TabH2H({ fixture }: { fixture: FixtureDetail }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-2xl mx-auto">
      <div className="text-center py-12 border border-border rounded-xl bg-card">
        <p className="text-muted-foreground tracking-widest uppercase text-sm font-semibold">Head-to-head stats to be announced</p>
      </div>
    </div>
  );
}
