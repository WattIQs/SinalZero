import { Outlet, createRootRoute } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import '../styles.css';

function SessionSkeleton() {
  return <main className="min-h-screen bg-background p-6"><div className="mx-auto max-w-7xl space-y-5"><div className="h-10 w-48 animate-pulse rounded-lg bg-card"/><div className="grid gap-4 md:grid-cols-3"><div className="h-28 animate-pulse rounded-xl bg-card"/><div className="h-28 animate-pulse rounded-xl bg-card"/><div className="h-28 animate-pulse rounded-xl bg-card"/></div><div className="h-[55vh] animate-pulse rounded-xl bg-card"/></div></main>;
}

export const Route = createRootRoute({
  component: () => <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24, ease: 'easeOut' }}><Outlet /></motion.div>,
  pendingComponent: SessionSkeleton,
});
