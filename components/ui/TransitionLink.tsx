"use client";

import { usePageTransition } from "@/components/layout/TransitionProvider";
import Link from "next/link";
import { type ComponentProps, useCallback } from "react";

type TransitionLinkProps = ComponentProps<typeof Link>;

/**
 * A Next.js Link that triggers a cinematic page transition.
 * Use this for primary navigation links.
 */
export function TransitionLink(props: TransitionLinkProps) {
  const { initiate, stage } = usePageTransition();
  const { onClick, href, ...rest } = props;

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Allow Ctrl/Cmd + Click (new tab) to work naturally
      if (e.metaKey || e.ctrlKey) return;
      
      // Prevent default Next.js navigation
      e.preventDefault();

      // Trigger transition if not already running
      if (stage !== "idle") return;

      // Ensure href is a string for initiate (could be UrlObject)
      const target = typeof href === "string" ? href : href.toString();
      initiate(target);

      // Call original onClick if provided
      onClick?.(e);
    },
    [initiate, stage, href, onClick]
  );

  return <Link onClick={handleClick} href={href} {...rest} />;
}
