// Build-time GitHub star counts, baked into the page so the browser never
// calls the GitHub API. The unauthenticated API rate-limits at 60 req/hr per
// IP, which is trivial to exhaust from a shared IP (offices/NAT) or dev
// reloads — and client-side caching only helps per-browser, not per-IP. By
// fetching once at build time the runtime makes zero API calls, so it can
// never be rate limited; the count refreshes on each deploy.

// repo per docs site, with a fallback shown if the build-time fetch fails
// (offline / rate-limited build machine). DoltLab has no public repo of its
// own, so it shows Dolt's stars; Doltgres shows its own.
// `fallback` is only used if the build-time fetch fails (offline / rate-limited
// build); keep it roughly current so the baked-in number stays sensible. A
// successful build overwrites it with the live count.
const SITES = {
  dolt: { repo: "dolthub/dolt", fallback: 22900 },
  doltlab: { repo: "dolthub/dolt", fallback: 22900 },
  doltgres: { repo: "dolthub/doltgresql", fallback: 1900 },
};

export function githubRepoForSite(siteName) {
  return (SITES[siteName] || SITES.dolt).repo;
}

// Memoized per build process: each repo is fetched at most once no matter how
// many pages render.
const cache = new Map();

async function fetchStars(repo, fallback) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: { Accept: "application/vnd.github+json" },
      signal: controller.signal,
    });
    if (!res.ok) return fallback;
    const data = await res.json();
    return typeof data.stargazers_count === "number"
      ? data.stargazers_count
      : fallback;
  } catch {
    return fallback; // offline, timeout, or rate-limited build — use fallback
  } finally {
    clearTimeout(timer);
  }
}

export function githubStarsForSite(siteName) {
  const { repo, fallback } = SITES[siteName] || SITES.dolt;
  if (!cache.has(repo)) cache.set(repo, fetchStars(repo, fallback));
  return cache.get(repo); // Promise<number>
}
